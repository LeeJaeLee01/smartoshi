# AI_USAGE.md

## Project
Mini Exchange Portfolio System (Rust backend assignment)

## AI Tools Used
- Cursor IDE Agent (primary)
- Built-in coding tools in Cursor (file editing, code search, command execution)

## Key Prompts Used (Actual Workflow)
1. "Read `smartoshi.spec.md` and list all implementation requirements."
2. "Break down the assignment into clear implementation tasks and API boundaries."
3. "Create two project skills: `.cursor/skills/smartoshi-prompt-starter/SKILL.md` and `.cursor/skills/smartoshi-assignment/SKILL.md`."
4. "Implement the system by following the workflow and guardrails defined in the created skills."

## Skills Created and Applied
- `.cursor/skills/smartoshi-prompt-starter/SKILL.md`
  - Purpose: standardize the kickoff prompts and required output format.
- `.cursor/skills/smartoshi-assignment/SKILL.md`
  - Purpose: enforce end-to-end workflow (scope -> architecture -> test-first -> implementation -> deliverables).

## Tasks Delegated to AI
- Parse and structure requirements from `smartoshi.spec.md`
- Create implementation checklist and execution order
- Propose Rust stack and initial source layout
- Scaffold initial project structure and modules
- Generate route/service/domain/model/store skeleton
- Draft and refine `README.md`, `Dockerfile`, and `docker-compose.yml`
- Create and update this AI usage report

## Accepted vs Modified

### Accepted As-Is
- Service split and endpoint scope from spec:
  - Market: `GET /symbols`, `GET /prices`, `GET /prices/{symbol}`
  - Portfolio: `GET /portfolio/{userId}`, `POST /orders`, `GET /orders/{orderId}`
- Market-order-only business rule
- In-memory persistence strategy for assignment scope
- Required test scenario list from spec

### Modified by Developer
- Prompt phrasing and ordering to match preferred workflow
- Skill content and checklist details (including test-first sequencing)
- Documentation wording and output style for submission quality

## Example of Incorrect AI Output and Handling

### Incorrect Output
AI suggested implementing an order book and matching engine.

### Why Incorrect
Spec explicitly says no order book or matching engine is required.

### Handling
- Rejected that output.
- Enforced market-order-only flow:
  - BUY: fetch price -> validate cash -> deduct cash -> add asset
  - SELL: validate asset -> deduct asset -> add cash
- Added this as a hard guardrail in project skill/checklist.

## Human Review and Control
- Every AI-generated change was reviewed before keeping it.
- Conflicts with `smartoshi.spec.md` were corrected immediately.
- Scope was kept intentionally minimal to satisfy assignment constraints.

## Current Status
- Completed:
  - Requirements analysis
  - Task breakdown and API mapping
  - Two reusable project skills
  - Initial implementation scaffold and core service structure
  - Core docs scaffold (`README.md`, Docker artifacts, `AI_USAGE.md`)
- Pending final verification:
  - Full `cargo check` / `cargo test` run after local WSL C linker/toolchain setup (`build-essential`).

