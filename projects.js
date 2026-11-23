// The "Work" section is built from this list. To add a project, copy one entry and edit it.
//
// Fields:
//   title        (required) project name
//   hook         (required) one-line summary shown under the title
//   description  (required) 2–3 sentences: the problem, what you built, the result
//   status       (required) "Shipped", "In active use", or "In progress"
//   featured     true to show it as a large card at the top (keep this to 3–4 projects)
//   tags         list of technologies used
//   image        path to a screenshot, e.g. "images/my-project.png" (featured cards only)
//   code         GitHub URL (shown as a GitHub icon next to the title)
//   demo         live demo URL; demoLabel changes the link text (default "Live demo")
//   caseStudy    URL of a write-up about the project
//   note         short label shown where links would go, e.g. "Private client tool"
//   comingSoon   list of links that don't exist yet: "demo" and/or "code"
//
// All links open in a new tab.
const PROJECTS = [
  // ---------- Featured ----------
  {
    title: "mini-vLLM",
    hook: "An LLM inference engine, built from scratch",
    description:
      "I wanted to understand how engines like vLLM really work, so I hand-wrote every piece of serving logic for Qwen2.5: the transformer, a PagedAttention KV cache, a continuous-batching scheduler, and an OpenAI-compatible streaming server. It matches Hugging Face token for token. On a single 8 GB RTX 2080 Super it serves 112 tokens/s at 32 concurrent requests (6.1x one-at-a-time generation), and first tokens arrive in 0.29s where static batching makes everyone wait 10.3s.",
    status: "Shipped",
    featured: true,
    tags: ["Python", "PyTorch", "CUDA", "FastAPI"],
    code: "https://github.com/AJChaikovsky/mini-vllm",
  },
  {
    title: "CRE Leads",
    hook: "AI lead generation for a commercial real estate brokerage",
    description:
      "The client knew they wanted better leads but not what kind, so I built demos and iterated with them: property leads first, then new-business leads ranked by Claude Sonnet, then one tool that combines both. It pulls in 15 LA city datasets plus county property records and surfaces restaurants and shops likely to need a new storefront before anyone else finds them. Brokers use it every day, and the pipeline is safe to rerun and recovers from failures on its own.",
    status: "In active use",
    featured: true,
    tags: ["Python", "Next.js", "TypeScript", "PostgreSQL", "Claude API"],
    note: "Private client tool",
  },
  {
    title: "ChipBank",
    hook: "The bank for your home poker game",
    description:
      "Home games end with someone doing messy math on a napkin. ChipBank handles accounts, friends, and crews, runs each game with a timer, logs buy-ins, rebuys, and cash-outs live on every phone (players can leave and rejoin mid-game), then calculates the shortest list of who pays whom with a Venmo button for each. It never touches money: amounts are integer cents in an append-only ledger, every write is checked by a Postgres function, and the settlement math has property-based tests.",
    status: "Shipped",
    featured: true,
    tags: ["TypeScript", "React Native", "Expo", "Supabase", "PostgreSQL"],
    code: "https://github.com/AJChaikovsky/ChipBank",
    demo: "https://chipbank.expo.app",
    demoLabel: "Open the web app",
  },

  // ---------- More projects ----------
  {
    title: "OpenDrop",
    hook: "AirDrop for Mac, Windows, and Linux",
    description:
      "AirDrop only works between Apple devices. OpenDrop lets any computers on the same network find each other over mDNS, pair with a 6-digit code, and send files directly over a small versioned protocol I designed, checked with SHA-256 before they're saved. A Rust core powers a Tauri desktop app, a CLI, and an MCP server so AI assistants can fetch files from your other machines.",
    status: "Shipped",
    tags: ["Rust", "Tokio", "mDNS", "Tauri", "MCP"],
    code: "https://github.com/AJChaikovsky/OpenDrop",
    demo: "https://github.com/AJChaikovsky/OpenDrop/releases/latest",
    demoLabel: "Download",
  },
  {
    title: "Surf Alerts",
    hook: "An email when your surf spot is firing",
    description:
      "Pick a break, set the wave height, swell period, and wind you want, and a background worker emails you when the forecast matches. A database constraint claims each alert's surf day before sending, so overlapping worker runs can never send the same email twice. Accounts are locked down with CSRF protection, login lockout, and per-device session revocation, all covered by tests.",
    status: "Shipped",
    tags: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
    code: "https://github.com/AJChaikovsky/surf-alerts",
    demo: "https://surf-alerts.fly.dev",
  },
  {
    title: "Choices Counselor",
    hook: "Built at LA Hacks 2026 · bilingual school-choice agents",
    description:
      "A 3-person hackathon team built this Spanish/English multi-agent counselor that helps LAUSD families pick magnet programs, estimate admission points, and avoid costly application mistakes. The math runs in plain Python rules, not the LLM, over a 49-program dataset where every value cites its source. My part: most of the program dataset, the bus-route and school-facts agents, address-based distance checks, and a paid batch-report agent on the Fetch.ai testnet.",
    status: "Shipped",
    tags: ["Python", "Fetch.ai", "Multi-agent"],
    code: "https://github.com/AJChaikovsky/LA-Hacks-project",
  },
  {
    title: "SplitSmart",
    hook: "Group expense splitting for USC students · Android",
    description:
      "A 3-person team project: an Android app that splits group expenses equally, by exact amounts, or by percentage, tracks who owes whom, and records settlements and monthly summaries. My part: porting the app from Kotlin to Java, fixing layout and rotation bugs, polishing the visual design, and setting up the Espresso test suite with tests for every item on our demo checklist.",
    status: "Shipped",
    tags: ["Java", "Android", "Firebase", "Espresso"],
    code: "https://github.com/AJChaikovsky/SplitSmart",
  },
  {
    title: "crdt-notes",
    hook: "Offline-first collaborative notes, with the CRDT written from scratch",
    description:
      "Collaborative editors have to merge edits made offline without losing anyone's work. I'm building the list CRDT behind a notes app from scratch, with two algorithms (RGA and Fugue) and a property-based test harness that simulates replicas receiving operations in random orders and checks they always converge. The sync server and editor come next.",
    status: "In progress",
    tags: ["TypeScript", "CRDTs", "fast-check", "Vitest"],
    code: "https://github.com/AJChaikovsky/crdt-notes",
  },
  {
    title: "GameSense AI",
    hook: "A real-time AI coach that watches you play",
    description:
      "GameSense captures your screen, works out what's happening in the game, and shows short tips in a click-through overlay. It only watches and advises: it never sends inputs or reads game memory. I built an eval harness that scores vision models on labeled gameplay clips to find the fastest one that still gives good advice, starting with Counter-Strike 2 and Minecraft.",
    status: "In progress",
    tags: ["TypeScript", "Electron", "Python", "OpenCV"],
    code: "https://github.com/AJChaikovsky/gamesense-ai",
    comingSoon: ["demo"],
  },
];
