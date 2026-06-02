use std::{net::SocketAddr, sync::Arc};

use smartoshi::{build_app, services::market::MarketService, store::AppState};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let market = MarketService::new_default();
    let state = Arc::new(AppState::new(market));
    let app = build_app(state);

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(3030);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind address");
    tracing::info!("smartoshi server listening on {}", addr);

    axum::serve(listener, app)
        .await
        .expect("server failed unexpectedly");
}
