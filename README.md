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

## Docker (đơn giản)

Frontend **không build trong Docker** — chỉ copy thư mục `frontend/build` (tránh lỗi `npm` trên EC2).

### Cách 1 — một lệnh (khuyên dùng)

```bash
# EC2: đổi IP public của server
REACT_APP_API_URL=http://100.52.218.12:3030 ./scripts/docker-up.sh
```

### Cách 2 — từng bước

```bash
cd frontend
npm install
REACT_APP_API_URL=http://100.52.218.12:3030 npm run build   # đổi IP

cd ..
docker compose up -d --build
```

- UI: `http://YOUR_IP:8080`
- API: `http://YOUR_IP:3030`

Dừng: `docker compose down`

Mở Security Group: **8080**, **3030**, **22**.

## Test Instructions

Run:

- `cargo test`

Covered scenarios:
- Successful BUY and SELL
- Insufficient balance
- Market service failure handling
- Correct portfolio updates after trades
- Fetch order by order ID after creation
