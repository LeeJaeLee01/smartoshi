# Smartoshi Mini Exchange Portfolio System

Rust backend coding assignment implementation for a simplified exchange portfolio system.

## Architecture

- Single Rust service exposing all required endpoints.
- `Market Service` endpoints provide mock symbols and prices.
- `Portfolio Service` endpoints handle portfolio lookup and market order execution.
- In-memory state is used for portfolios and orders (`RwLock<HashMap<...>>`) to keep scope focused on assignment requirements.

## Tech Stack

- `axum` for HTTP API
- `tokio` async runtime
- `serde` / `serde_json` for request/response models
- `thiserror` for domain/service errors
- `tracing` / `tracing-subscriber` for logging

## Project Structure

- `src/main.rs`: server bootstrap
- `src/lib.rs`: app router construction
- `src/routes/`: HTTP route handlers
- `src/domain/`: order business logic
- `src/services/`: market pricing service
- `src/store/`: in-memory application state
- `src/models/`: DTOs/entities
- `tests/`: integration scenarios

## API Endpoints

### Market Service
- `GET /symbols`
- `GET /prices`
- `GET /prices/{symbol}`

### Portfolio Service
- `GET /portfolio/{userId}`
- `POST /orders`
- `GET /orders/{orderId}`

## Order Logic

- BUY:
  1. Fetch symbol price
  2. Validate cash balance
  3. Deduct cash
  4. Add asset quantity
- SELL:
  1. Validate asset quantity
  2. Deduct asset quantity
  3. Add cash

No order book or matching engine is implemented, per spec.

## Run Locally

1. Install Rust toolchain with `rustup`.
2. Install C toolchain:
   - `sudo apt-get update`
   - `sudo apt-get install -y build-essential pkg-config libssl-dev`
3. Run:
   - `cargo run`

Server starts on `http://127.0.0.1:3030` (override with env `PORT`).

## Docker

```bash
docker compose up -d --build
```

- UI: http://YOUR_IP:8080 (nginx serve FE + proxy API sang backend)
- API trực tiếp: http://YOUR_IP:3030

Không cần ghi env trong Dockerfile — FE gọi cùng origin, nginx chuyển tiếp sang `backend:3030`.

Security Group: **22, 3030, 8080**.

EC2 1GB thiếu RAM khi build FE: thêm swap 2GB rồi build lại.

## Test Instructions

Run:

- `cargo test`

Covered scenarios:
- Successful BUY and SELL
- Insufficient balance
- Market service failure handling
- Correct portfolio updates after trades
- Fetch order by order ID after creation
