#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_URL="${REACT_APP_API_URL:-http://localhost:3030}"

echo "Building frontend (API URL: $API_URL)..."
cd "$ROOT/frontend"
npm install
REACT_APP_API_URL="$API_URL" npm run build

echo "Starting Docker..."
cd "$ROOT"
docker compose up -d --build

echo "Done."
echo "  Frontend: http://localhost:8080"
echo "  Backend:  http://localhost:3030"
