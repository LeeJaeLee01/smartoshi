use thiserror::Error;

use crate::{
    models::{
        order::{CreateOrderRequest, Order, OrderSide, OrderStatus},
        portfolio::Portfolio,
    },
    services::market::MarketError,
};

#[derive(Debug, Error)]
pub enum OrderError {
    #[error("quantity must be greater than 0")]
    InvalidQuantity,
    #[error("insufficient cash balance")]
    InsufficientCash,
    #[error("insufficient asset quantity")]
    InsufficientAsset,
    #[error("{0}")]
    Market(#[from] MarketError),
}

pub fn apply_market_order(
    request: &CreateOrderRequest,
    market_price: f64,
    portfolio: &mut Portfolio,
    order_id: String,
) -> Result<Order, OrderError> {
    if request.quantity <= 0.0 {
        return Err(OrderError::InvalidQuantity);
    }

    let notional = market_price * request.quantity;
    match request.side {
        OrderSide::Buy => {
            if portfolio.cash_balance < notional {
                return Err(OrderError::InsufficientCash);
            }
            portfolio.cash_balance -= notional;
            *portfolio.assets.entry(request.symbol.clone()).or_insert(0.0) += request.quantity;
        }
        OrderSide::Sell => {
            let current_qty = portfolio.assets.get(&request.symbol).copied().unwrap_or(0.0);
            if current_qty < request.quantity {
                return Err(OrderError::InsufficientAsset);
            }
            let new_qty = current_qty - request.quantity;
            if new_qty == 0.0 {
                portfolio.assets.remove(&request.symbol);
            } else {
                portfolio.assets.insert(request.symbol.clone(), new_qty);
            }
            portfolio.cash_balance += notional;
        }
    }

    Ok(Order {
        order_id,
        user_id: request.user_id.clone(),
        symbol: request.symbol.clone(),
        quantity: request.quantity,
        side: request.side.clone(),
        price: Some(market_price),
        status: OrderStatus::Executed,
        reason: None,
    })
}
