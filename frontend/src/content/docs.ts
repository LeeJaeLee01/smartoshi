export const assignmentWorkflow = [
  {
    step: 1,
    title: "Read spec",
    detail: "Parse smartoshi.spec.md for must-have services, endpoints, and constraints.",
    done: true,
  },
  {
    step: 2,
    title: "Break down tasks",
    detail: "Map Market Service, Portfolio Service, order logic, tests, and deliverables.",
    done: true,
  },
  {
    step: 3,
    title: "Create skills",
    detail:
      "Author smartoshi-prompt-starter and smartoshi-assignment under .cursor/skills/.",
    done: true,
  },
  {
    step: 4,
    title: "Implement via skills",
    detail:
      "Scaffold Rust (axum), in-memory store, API routes, domain logic, integration tests.",
    done: true,
  },
  {
    step: 5,
    title: "Verify & submit",
    detail: "cargo test, README, AI_USAGE.md, Docker Compose, final checklist.",
    done: false,
  },
];

export type SkillCard =
  | {
      name: string;
      path: string;
      purpose: string;
      prompts: string[];
    }
  | {
      name: string;
      path: string;
      purpose: string;
      highlights: string[];
    };

export const skillsInfo: SkillCard[] = [
  {
    name: "smartoshi-prompt-starter",
    path: ".cursor/skills/smartoshi-prompt-starter/SKILL.md",
    purpose:
      "Standardizes the first 3 kickoff prompts and expected output format before coding.",
    prompts: [
      "Read spec and list requirements",
      "Break down service boundaries and API endpoints",
      "Propose Rust structure, framework, and persistence strategy",
    ],
  },
  {
    name: "smartoshi-assignment",
    path: ".cursor/skills/smartoshi-assignment/SKILL.md",
    purpose:
      "End-to-end checklist: scope, stack, folder init, test-first, implementation, deliverables.",
    highlights: [
      "Market orders only (no order book)",
      "In-memory persistence by default",
      "Required test scenarios from spec",
      "Tick progress as steps complete",
    ],
  },
];

export const aiUsageSummary = {
  tools: ["Cursor IDE Agent", "Built-in file edit, search, and shell tools"],
  keyPrompts: [
    "Read smartoshi.spec.md and list all implementation requirements.",
    "Break down the assignment into clear implementation tasks and API boundaries.",
    "Create two project skills: prompt-starter and assignment.",
    "Implement the system by following the workflow defined in the created skills.",
  ],
  delegated: [
    "Requirements parsing and checklist",
    "Rust scaffold and module layout",
    "Route/service/domain/store skeleton",
    "README, Dockerfile, docker-compose, AI_USAGE drafts",
  ],
  accepted: [
    "Market + Portfolio endpoint scope",
    "Market-order-only BUY/SELL logic",
    "In-memory store for assignment scope",
    "Mandatory test scenarios from spec",
  ],
  modified: [
    "Prompt ordering to match spec → skills → implement flow",
    "Skill checklist and test-first guardrails",
    "Documentation tone for submission",
  ],
  incorrectAiExample: {
    wrong: "AI suggested order book and matching engine.",
    fix: "Rejected; enforced market-order flow per spec.",
  },
};

export const backendEndpoints = [
  {
    group: "Market Service",
    items: [
      { method: "GET", path: "/symbols", desc: "List tradable symbols" },
      { method: "GET", path: "/prices", desc: "All mock prices" },
      { method: "GET", path: "/prices/{symbol}", desc: "Price for one symbol" },
    ],
  },
  {
    group: "Portfolio Service",
    items: [
      { method: "GET", path: "/portfolio/{userId}", desc: "User cash and assets" },
      { method: "POST", path: "/orders", desc: "Create market order (BUY/SELL)" },
      { method: "GET", path: "/orders/{orderId}", desc: "Fetch order by ID" },
    ],
  },
];

export const orderLogic = {
  buy: [
    "Fetch market price",
    "Validate cash balance",
    "Deduct cash",
    "Add asset quantity",
  ],
  sell: [
    "Validate asset quantity",
    "Deduct asset",
    "Add cash",
  ],
  note: "No order book or matching engine (per assignment spec).",
};
