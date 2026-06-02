# Smartoshi Frontend

React + TypeScript (Create React App) dashboard for the Mini Exchange backend assignment.

## Features

- **Backend API Explorer** — live calls to Market and Portfolio endpoints
- **Assignment Approach** — how the test was handled (spec → tasks → skills → implement)
- **Cursor Skills** — documents `smartoshi-prompt-starter` and `smartoshi-assignment`
- **AI Usage** — summary aligned with `../AI_USAGE.md`

UI follows design tokens from `DESIGN.md` (Apple-inspired).

## Prerequisites

- Node.js 18+
- Rust backend on port **3030** (`cargo run` from repo root)

## Run locally

```bash
cd frontend
npm install
npm start
```

Default CRA port is 3000; backend uses 3030 — no conflict.

Set API URL in `.env`:

```env
REACT_APP_API_URL=http://127.0.0.1:3030
```

## Docker

From repo root:

```bash
docker compose up -d --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3030

Before deploy, set `REACT_APP_API_URL` build arg in `docker-compose.yml` to a URL the **browser** can reach (server IP/domain + port 3030).

## Build

```bash
npm run build
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://127.0.0.1:3030` | Rust API base URL |
| `PORT` | `3000` | CRA dev server port |
