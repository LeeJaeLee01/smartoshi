use std::collections::HashMap;

use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct SymbolsResponse {
    pub symbols: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct PricesResponse {
    pub prices: HashMap<String, f64>,
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
}
