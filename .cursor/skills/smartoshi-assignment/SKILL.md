---
name: smartoshi-assignment
description: Execute the Mini Exchange Portfolio System assignment end-to-end in Rust. Use when the user mentions smartoshi spec, backend assignment, market service, portfolio service, order logic, tests, README, AI_USAGE, or docker compose.
disable-model-invocation: true
---

# Smartoshi Assignment

## Purpose
Use this skill to run the whole assignment workflow with one consistent standard: scope control, implementation order, test coverage, and submission readiness.

## Source of Truth
- `smartoshi.spec.md` is the primary requirements source.
- If any generated plan conflicts with the spec, follow the spec.

## End-to-End Workflow

Copy this checklist and keep it updated:

```md
Assignment Progress
- [x] 1) Confirm scope from spec
- [x] 2) Choose framework and persistence strategy
- [x] 3) Initialize repo structure and modules
- [x] 4) Define API contracts
- [x] 5) Create failing tests first (test files before code files)
- [x] 6) Implement Market Service to satisfy tests
- [x] 7) Implement Portfolio Service and order logic to satisfy tests
- [ ] 8) Expand and pass all required test scenarios
- [x] 9) Add docs and run instructions
- [ ] 10) Final submission check
```

## Step 1: Confirm Scope from Spec
- Required services:
  - Market Service
  - Portfolio Service
- Optional service:
  - Audit Service
- Mandatory AI usage documentation:
  - `AI_USAGE.md`

## Step 2: Choose Framework and Persistence Strategy
- Default framework recommendation:
  - `axum` for HTTP API
  - `tokio` runtime
  - `serde` / `serde_json` for payloads
  - `thiserror` (or `anyhow`) for error handling
  - `tracing` + `tracing-subscriber` for logs
- Default persistence recommendation for this assignment:
  - Start with in-memory store (`HashMap` + synchronization) for fastest delivery.
  - Optional upgrade path: `sqlx` + PostgreSQL if the user wants persistence realism.
- Default testing stack:
  - `cargo test`
  - integration tests under `tests/`
  - deterministic fixtures for prices and balances

## Step 3: Initialize Repo Structure and Modules
- Create a structure that separates domain logic from transport:
  - `src/main.rs` (server bootstrap)
  - `src/routes/` (HTTP handlers)
  - `src/domain/` (order and portfolio rules)
  - `src/services/` (market pricing and orchestration)
  - `src/store/` (in-memory or DB adapters)
  - `src/models/` (request/response and entities)
  - `tests/` (integration tests)
- Ensure module names match endpoint and business terms from the spec.
- Add minimal bootstrap scripts/config:
  - `.env.example` if env vars are used
  - `docker-compose.yml` placeholder early, then refine

## Step 4: Define API Contracts
- Market Service:
  - `GET /symbols`
  - `GET /prices`
  - `GET /prices/{symbol}`
- Portfolio Service:
  - `GET /portfolio/{userId}`
  - `POST /orders`
  - `GET /orders/{orderId}`
- Return explicit error responses for invalid input and business-rule failures.

## Step 5: Test-First Rule (Mandatory)
- Always create test files and failing test cases before writing implementation code.
- Start each feature with:
  1. Create or update test file
  2. Add one failing test for expected behavior
  3. Implement minimal code to make that test pass
  4. Refactor safely while keeping tests green
- Do not skip directly to production code unless the user explicitly asks to bypass test-first flow.

## Step 6: Implement Market Service
- Provide mock prices (random or static as allowed by spec).
- Ensure symbol lookup behavior is deterministic for tests.
- Keep implementation simple and stateless where possible.

## Step 7: Implement Portfolio Service
- Maintain per-user cash balance and asset holdings.
- Track created orders with retrievable order status/details.
- Validate request payloads before business logic execution.

## Step 8: Implement Order Logic (Market Orders Only)
- BUY flow:
  1. Fetch market price
  2. Check cash balance
  3. Deduct cash
  4. Add asset quantity
- SELL flow:
  1. Check asset quantity
  2. Deduct asset quantity
  3. Add cash
- Do not implement order book or matching engine.

## Step 9: Required Tests
- Successful BUY
- Successful SELL
- Insufficient balance
- Market service failure handling
- Correct portfolio updates after trades

## Step 10: Required Deliverables
- Rust source code
- `README.md` with setup and architecture
- `AI_USAGE.md`
- `docker-compose.yml` (or equivalent)
- Test instructions

## Step 11: Final Submission Check
- Confirm all required endpoints exist and are runnable.
- Confirm required tests pass locally.
- Confirm docs match actual commands and project structure.
- Confirm `AI_USAGE.md` includes:
  - Tools used
  - Key prompts
  - Tasks delegated to AI
  - Accepted vs modified outputs
  - At least one incorrect AI output and correction

## Guardrails
- Prefer simple, assignment-focused architecture over overengineering.
- Keep naming and error semantics consistent across services.
- Record assumptions explicitly in `README.md`.
- When uncertain, choose behavior that is easiest to test and explain.

