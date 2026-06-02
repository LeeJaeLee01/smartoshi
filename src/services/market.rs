use std::collections::HashMap;

use thiserror::Error;

#[derive(Debug, Error)]
pub enum MarketError {
    #[error("market service unavailable")]
    Unavailable,
    #[error("symbol not found")]
    SymbolNotFound,
}

#[derive(Debug, Clone)]
pub struct MarketService {
    prices: HashMap<String, f64>,
}

impl MarketService {
    pub fn new_default() -> Self {
        let prices = HashMap::from([
            ("BTC".to_string(), 65_000.0),
            ("ETH".to_string(), 3_500.0),
            ("SOL".to_string(), 150.0),
        ]);
        Self { prices }
    }

    pub fn symbols(&self) -> Vec<String> {
        let mut symbols: Vec<String> = self.prices.keys().cloned().collect();
        symbols.sort();
        symbols
    }

    pub fn all_prices(&self) -> HashMap<String, f64> {
        self.prices.clone()
    }

    pub fn price_for(&self, symbol: &str) -> Result<f64, MarketError> {
        if symbol == "FAIL" {
            return Err(MarketError::Unavailable);
        }
        self.prices
            .get(symbol)
            .copied()
            .ok_or(MarketError::SymbolNotFound)
    }
}
