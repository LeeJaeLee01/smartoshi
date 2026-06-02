use std::{collections::HashMap, sync::RwLock};

use crate::{models::portfolio::Portfolio, services::market::MarketService};

pub struct AppState {
    pub market: MarketService,
    pub portfolios: RwLock<HashMap<String, Portfolio>>,
    pub orders: RwLock<HashMap<String, crate::models::order::Order>>,
}

impl AppState {
    pub fn new(market: MarketService) -> Self {
        Self {
            market,
            portfolios: RwLock::new(HashMap::new()),
            orders: RwLock::new(HashMap::new()),
        }
    }

    pub fn with_seed_user(market: MarketService, user_id: &str, cash_balance: f64) -> Self {
        let mut portfolios = HashMap::new();
        portfolios.insert(
            user_id.to_string(),
            Portfolio::new(user_id.to_string(), cash_balance),
        );
        Self {
            market,
            portfolios: RwLock::new(portfolios),
            orders: RwLock::new(HashMap::new()),
        }
    }
}
