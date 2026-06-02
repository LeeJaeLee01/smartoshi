---
name: smartoshi-prompt-starter
description: Start a Smartoshi assignment session with a strict 3-prompt kickoff flow and structured outputs. Use when the user asks how to begin, requests starter prompts, or wants a consistent first-step workflow from smartoshi.spec.md.
disable-model-invocation: true
---

# Smartoshi Prompt Starter

## Goal
Use this skill at the start of a session to create the same high-quality baseline every time: scope clarity, API boundaries, and implementation foundation.

## Usage
- Run only at the beginning of implementation or when restarting planning.
- Execute prompts in order without skipping.
- Treat `smartoshi.spec.md` as the final source of truth.

## Kickoff Prompts (Verbatim)
1. "Read `smartoshi.spec.md` and list all implementation requirements."
2. "Break down this assignment into service boundaries and API endpoints."
3. "Propose the initial Rust project structure, recommended framework, and persistence strategy for this assignment."

## Expected Output Format
After running the 3 prompts, produce this structure:

1. `Requirements Summary`
- Must-have features
- Optional features
- Non-goals/constraints

2. `Service and API Map`
- Market service endpoints
- Portfolio service endpoints
- Optional audit events

3. `Implementation Foundation`
- Recommended Rust framework/runtime
- Persistence choice (default and upgrade path)
- Initial folder/module structure
- Test-first starting plan

## Guardrails
- Keep responses concise and implementation-oriented.
- Do not propose features outside the assignment scope.
- If anything conflicts with `smartoshi.spec.md`, follow the spec.
