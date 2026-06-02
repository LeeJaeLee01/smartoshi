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

## Run with Docker (Frontend + Backend)

Docker Compose runs both services: Rust API on port **3030** and React UI (Nginx) on port **8080**.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2 (`docker compose`)

### 1. Configure API URL for the frontend (important)

Create React App bakes `REACT_APP_API_URL` at **build time**. The value must be reachable from the **user's browser**, not from inside the container.

Edit `docker-compose.yml` under `frontend.build.args`:

```yaml
args:
  REACT_APP_API_URL: http://localhost:3030
```

Examples:

| Scenario | `REACT_APP_API_URL` |
|----------|---------------------|
| Same machine | `http://localhost:3030` |
| Remote server | `http://YOUR_SERVER_IP:3030` |
| Domain + TLS | `https://api.yourdomain.com` |

Do **not** use `http://backend:3030` — that hostname only works inside Docker, not in the browser.

### 2. Build and start

From the repository root:

```bash
docker compose build
docker compose up -d
```

Check status:

```bash
docker compose ps
docker compose logs -f
```

### 3. Access the app

| Service | URL |
|---------|-----|
| Frontend (UI) | http://localhost:8080 |
| Backend (API) | http://localhost:3030 |

Quick API check:

```bash
curl http://localhost:3030/symbols
curl http://localhost:3030/prices
```

Open the frontend → **Backend API Explorer** to call endpoints from the browser.

### 4. Stop and remove

```bash
docker compose down
```

Remove images as well:

```bash
docker compose down --rmi local
```

### 5. Rebuild after code changes

```bash
docker compose build --no-cache
docker compose up -d
```

Rebuild only one service:

```bash
docker compose build backend
docker compose build frontend
docker compose up -d
```

### Docker layout

| File | Purpose |
|------|---------|
| `Dockerfile` | Rust backend (multi-stage build) |
| `docker-compose.yml` | Orchestrates `backend` + `frontend` |
| `frontend/Dockerfile` | React build + Nginx static server |
| `frontend/nginx.conf` | SPA routing for React |

Backend listens on `0.0.0.0`; port is set via env `PORT` (default **3030** in Docker).

## Test Instructions

Run:

- `cargo test`

Covered scenarios:
- Successful BUY and SELL
- Insufficient balance
- Market service failure handling
- Correct portfolio updates after trades
- Fetch order by order ID after creation
