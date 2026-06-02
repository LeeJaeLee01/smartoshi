use std::sync::Arc;

use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
};
use uuid::Uuid;

use crate::{
    domain::{OrderError, apply_market_order},
    models::{
        api::ErrorResponse,
        order::{CreateOrderRequest, Order, OrderStatus},
        portfolio::Portfolio,
    },
    services::market::MarketError,
    store::AppState,
};

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/portfolio/{user_id}", get(get_portfolio))
        .route("/orders", post(create_order))
        .route("/orders/{order_id}", get(get_order))
}

async fn get_portfolio(
    State(state): State<Arc<AppState>>,
    Path(user_id): Path<String>,
) -> Result<Json<Portfolio>, (StatusCode, Json<ErrorResponse>)> {
    let mut portfolios = state
        .portfolios
        .write()
        .map_err(|_| internal_error("portfolio store poisoned"))?;

    let portfolio = portfolios
        .entry(user_id.clone())
        .or_insert_with(|| Portfolio::new(user_id, 100_000.0))
        .clone();
    Ok(Json(portfolio))
}

async fn create_order(
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateOrderRequest>,
) -> Result<(StatusCode, Json<Order>), (StatusCode, Json<ErrorResponse>)> {
    let price = state.market.price_for(&request.symbol).map_err(map_market_error)?;
    let order_id = Uuid::new_v4().to_string();

    let mut portfolios = state
        .portfolios
        .write()
        .map_err(|_| internal_error("portfolio store poisoned"))?;
    let portfolio = portfolios
        .entry(request.user_id.clone())
        .or_insert_with(|| Portfolio::new(request.user_id.clone(), 100_000.0));

    match apply_market_order(&request, price, portfolio, order_id.clone()) {
        Ok(executed_order) => {
            state
                .orders
                .write()
                .map_err(|_| internal_error("order store poisoned"))?
                .insert(order_id, executed_order.clone());
            Ok((StatusCode::CREATED, Json(executed_order)))
        }
        Err(err) => {
            let rejected = Order {
                order_id,
                user_id: request.user_id,
                symbol: request.symbol,
                quantity: request.quantity,
                side: request.side,
                price: Some(price),
                status: OrderStatus::Rejected,
                reason: Some(err.to_string()),
            };
            state
                .orders
                .write()
                .map_err(|_| internal_error("order store poisoned"))?
                .insert(rejected.order_id.clone(), rejected.clone());
            Err(map_order_error(err))
        }
    }
}

async fn get_order(
    State(state): State<Arc<AppState>>,
    Path(order_id): Path<String>,
) -> Result<Json<Order>, (StatusCode, Json<ErrorResponse>)> {
    let orders = state
        .orders
        .read()
        .map_err(|_| internal_error("order store poisoned"))?;
    let order = orders.get(&order_id).cloned().ok_or((
        StatusCode::NOT_FOUND,
        Json(ErrorResponse {
            error: "order not found".to_string(),
        }),
    ))?;
    Ok(Json(order))
}

fn map_market_error(error: MarketError) -> (StatusCode, Json<ErrorResponse>) {
    match error {
        MarketError::Unavailable => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(ErrorResponse {
                error: "market service unavailable".to_string(),
            }),
        ),
        MarketError::SymbolNotFound => (
            StatusCode::NOT_FOUND,
            Json(ErrorResponse {
                error: "symbol not found".to_string(),
            }),
        ),
    }
}

fn map_order_error(error: OrderError) -> (StatusCode, Json<ErrorResponse>) {
    match error {
        OrderError::InvalidQuantity => (
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: error.to_string(),
            }),
        ),
        OrderError::InsufficientCash | OrderError::InsufficientAsset => (
            StatusCode::UNPROCESSABLE_ENTITY,
            Json(ErrorResponse {
                error: error.to_string(),
            }),
        ),
        OrderError::Market(_) => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(ErrorResponse {
                error: error.to_string(),
            }),
        ),
    }
}

fn internal_error(message: &str) -> (StatusCode, Json<ErrorResponse>) {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(ErrorResponse {
            error: message.to_string(),
        }),
    )
}
