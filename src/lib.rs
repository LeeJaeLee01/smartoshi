pub mod domain;
pub mod models;
pub mod routes;
pub mod services;
pub mod store;

use std::sync::Arc;

use axum::Router;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

use crate::store::AppState;

pub fn build_app(state: Arc<AppState>) -> Router {
    Router::new()
        .merge(routes::market::router())
        .merge(routes::portfolio::router())
        .with_state(state)
        .layer(TraceLayer::new_for_http())
        // Outermost layer: allow all origins, methods, and headers (any domain).
        .layer(CorsLayer::permissive())
}
