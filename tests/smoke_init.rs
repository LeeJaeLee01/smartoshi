use std::sync::Arc;

use axum::{body::Body, http::{Request, StatusCode}};
use http_body_util::BodyExt;
use serde_json::{Value, json};
use smartoshi::{build_app, services::market::MarketService, store::AppState};
use tower::ServiceExt;

#[tokio::test]
async fn buy_order_updates_portfolio_successfully() {
    let state = Arc::new(AppState::with_seed_user(
        MarketService::new_default(),
        "u1",
        100_000.0,
    ));
    let app = build_app(state);

    let create_order = Request::builder()
        .method("POST")
        .uri("/orders")
        .header("content-type", "application/json")
        .body(Body::from(
            json!({
                "user_id": "u1",
                "symbol": "BTC",
                "quantity": 1.0,
                "side": "BUY"
            })
            .to_string(),
        ))
        .expect("failed to build request");

    let response = app.clone().oneshot(create_order).await.expect("request failed");
    assert_eq!(response.status(), StatusCode::CREATED);

    let portfolio_res = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/portfolio/u1")
                .body(Body::empty())
                .expect("failed to build request"),
        )
        .await
        .expect("request failed");
    assert_eq!(portfolio_res.status(), StatusCode::OK);

    let body = portfolio_res
        .into_body()
        .collect()
        .await
        .expect("failed to read body")
        .to_bytes();
    let payload: Value = serde_json::from_slice(&body).expect("invalid json");
    assert_eq!(payload["assets"]["BTC"], json!(1.0));
    assert_eq!(payload["cash_balance"], json!(35000.0));
}

#[tokio::test]
async fn sell_order_updates_portfolio_successfully() {
    let state = Arc::new(AppState::with_seed_user(
        MarketService::new_default(),
        "u2",
        100_000.0,
    ));
    {
        let mut portfolios = state.portfolios.write().expect("lock poisoned");
        let user = portfolios.get_mut("u2").expect("seed user missing");
        user.assets.insert("ETH".to_string(), 2.0);
    }
    let app = build_app(state);

    let create_order = Request::builder()
        .method("POST")
        .uri("/orders")
        .header("content-type", "application/json")
        .body(Body::from(
            json!({
                "user_id": "u2",
                "symbol": "ETH",
                "quantity": 1.0,
                "side": "SELL"
            })
            .to_string(),
        ))
        .expect("failed to build request");

    let response = app.clone().oneshot(create_order).await.expect("request failed");
    assert_eq!(response.status(), StatusCode::CREATED);

    let portfolio_res = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/portfolio/u2")
                .body(Body::empty())
                .expect("failed to build request"),
        )
        .await
        .expect("request failed");
    let body = portfolio_res
        .into_body()
        .collect()
        .await
        .expect("failed to read body")
        .to_bytes();
    let payload: Value = serde_json::from_slice(&body).expect("invalid json");
    assert_eq!(payload["assets"]["ETH"], json!(1.0));
    assert_eq!(payload["cash_balance"], json!(103500.0));
}

#[tokio::test]
async fn insufficient_balance_returns_error() {
    let state = Arc::new(AppState::with_seed_user(
        MarketService::new_default(),
        "u3",
        100.0,
    ));
    let app = build_app(state);
    let request = Request::builder()
        .method("POST")
        .uri("/orders")
        .header("content-type", "application/json")
        .body(Body::from(
            json!({
                "user_id": "u3",
                "symbol": "BTC",
                "quantity": 1.0,
                "side": "BUY"
            })
            .to_string(),
        ))
        .expect("failed to build request");

    let response = app.oneshot(request).await.expect("request failed");
    assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
}

#[tokio::test]
async fn market_failure_returns_service_unavailable() {
    let state = Arc::new(AppState::with_seed_user(
        MarketService::new_default(),
        "u4",
        100_000.0,
    ));
    let app = build_app(state);
    let request = Request::builder()
        .method("POST")
        .uri("/orders")
        .header("content-type", "application/json")
        .body(Body::from(
            json!({
                "user_id": "u4",
                "symbol": "FAIL",
                "quantity": 1.0,
                "side": "BUY"
            })
            .to_string(),
        ))
        .expect("failed to build request");

    let response = app.oneshot(request).await.expect("request failed");
    assert_eq!(response.status(), StatusCode::SERVICE_UNAVAILABLE);
}

#[tokio::test]
async fn order_can_be_fetched_after_creation() {
    let state = Arc::new(AppState::with_seed_user(
        MarketService::new_default(),
        "u5",
        100_000.0,
    ));
    let app = build_app(state);

    let create_order = Request::builder()
        .method("POST")
        .uri("/orders")
        .header("content-type", "application/json")
        .body(Body::from(
            json!({
                "user_id": "u5",
                "symbol": "SOL",
                "quantity": 2.0,
                "side": "BUY"
            })
            .to_string(),
        ))
        .expect("failed to build request");

    let response = app.clone().oneshot(create_order).await.expect("request failed");
    assert_eq!(response.status(), StatusCode::CREATED);
    let body = response
        .into_body()
        .collect()
        .await
        .expect("failed to read body")
        .to_bytes();
    let created: Value = serde_json::from_slice(&body).expect("invalid json");
    let order_id = created["order_id"]
        .as_str()
        .expect("missing order_id")
        .to_string();

    let get_order = Request::builder()
        .method("GET")
        .uri(format!("/orders/{order_id}"))
        .body(Body::empty())
        .expect("failed to build request");
    let get_response = app.oneshot(get_order).await.expect("request failed");
    assert_eq!(get_response.status(), StatusCode::OK);
}
