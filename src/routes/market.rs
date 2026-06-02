use std::sync::Arc;

use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    routing::get,
};

use crate::{
    models::api::{ErrorResponse, PricesResponse, SymbolsResponse},
    services::market::MarketError,
    store::AppState,
};

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/symbols", get(get_symbols))
        .route("/prices", get(get_prices))
        .route("/prices/{symbol}", get(get_price_by_symbol))
}

async fn get_symbols(State(state): State<Arc<AppState>>) -> Json<SymbolsResponse> {
    Json(SymbolsResponse {
        symbols: state.market.symbols(),
    })
}

async fn get_prices(State(state): State<Arc<AppState>>) -> Json<PricesResponse> {
    Json(PricesResponse {
        prices: state.market.all_prices(),
    })
}

async fn get_price_by_symbol(
    State(state): State<Arc<AppState>>,
    Path(symbol): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<ErrorResponse>)> {
    match state.market.price_for(&symbol) {
        Ok(price) => Ok(Json(serde_json::json!({
            "symbol": symbol,
            "price": price
        }))),
        Err(MarketError::SymbolNotFound) => Err((
            StatusCode::NOT_FOUND,
            Json(ErrorResponse {
                error: "symbol not found".to_string(),
            }),
        )),
        Err(MarketError::Unavailable) => Err((
            StatusCode::SERVICE_UNAVAILABLE,
            Json(ErrorResponse {
                error: "market service unavailable".to_string(),
            }),
        )),
    }
}
