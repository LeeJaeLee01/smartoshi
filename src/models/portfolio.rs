use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Portfolio {
    pub user_id: String,
    pub cash_balance: f64,
    pub assets: HashMap<String, f64>,
}

impl Portfolio {
    pub fn new(user_id: String, cash_balance: f64) -> Self {
        Self {
            user_id,
            cash_balance,
            assets: HashMap::new(),
        }
    }
}
