# Smartoshi Frontend

React + TypeScript (Create React App) dashboard for the Mini Exchange backend assignment.

## Features

- **Backend API Explorer** — live calls to Market and Portfolio endpoints
- **Assignment Approach** — how the test was handled (spec → tasks → skills → implement)
- **Cursor Skills** — documents `smartoshi-prompt-starter` and `smartoshi-assignment`
- **AI Usage** — summary aligned with `../AI_USAGE.md`

UI follows design tokens from `DESIGN.md` (Apple-inspired: Action Blue, parchment surfaces, SF Pro stack).

## Prerequisites

- Node.js 18+
- Rust backend running on port 3000 (`cargo run` from repo root)

## Run

```bash
cd frontend
cp .env.example .env   # optional
PORT=3001 npm start    # use 3001 if backend is on 3000
```

Open http://localhost:3001 (or the port shown in the terminal).

## Build

```bash
npm run build
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://127.0.0.1:3000` | Rust API base URL |
| `PORT` | `3000` | CRA dev server port |

## CORS

If the browser blocks requests, configure CORS on the Rust backend or use the same host. For local dev, both services on `127.0.0.1` with explicit `REACT_APP_API_URL` usually works.
