// The "Work" section is built from this list. To add a project, copy one entry and edit it.
//
// Fields:
//   title        (required) project name
//   hook         (required) one-line summary shown under the title
//   description  (required) 2–3 sentences: the problem, what you built, the result
//   status       (required) "Shipped", "In active use", or "In progress"
//   featured     true to show it as a large card at the top (keep this to 3–4 projects)
//   tags         list of technologies used
//   image        path to a screenshot, e.g. "images/my-project.png" (shown 16:9, cropped from the top)
//   imageAlt     what the screenshot shows, for screen readers (defaults to "Screenshot of <title>")
//   metrics      featured only: 2–3 headline results shown large beside the description.
//                Each is { value, unit, label }. A numeric value counts up when it scrolls into
//                view; a text value ("Daily") is shown as is. Only use numbers you can back up.
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
      "I wanted to understand how engines like vLLM really work, so I hand-wrote every piece of serving logic for Qwen2.5: the transformer, a PagedAttention KV cache, a continuous-batching scheduler, and an OpenAI-compatible streaming server. It matches Hugging Face token for token, and I benchmarked it against Hugging Face on a single RTX 2080 Super.",
    status: "Shipped",
    featured: true,
    metrics: [
      { value: 112, unit: "tok/s", label: "served at 32 concurrent requests on one 8 GB GPU" },
      { value: 6.1, unit: "×", label: "the throughput of one-at-a-time generation" },
      { value: 0.29, unit: "s", label: "to first token, where static batching takes 10.3 s" },
    ],
    image: "images/mini-vllm-benchmarks.png",
    imageAlt: "Benchmark table: mini-vLLM against Hugging Face sequential and static batching at 1, 8 and 32 concurrent requests",
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
    metrics: [
      { value: 15, unit: "", label: "LA city datasets, plus county property records" },
      { value: 3, unit: "", label: "rounds of demos to find the right product" },
    ],
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
      "AirDrop-style file sharing between Mac, Windows, and Linux: devices find each other over mDNS, pair with a 6-digit code, and send files directly, checked with SHA-256. A Rust core runs the desktop app, a CLI, and an MCP server for AI assistants.",
    status: "Shipped",
    image: "images/opendrop.png",
    imageAlt: "OpenDrop's main window listing two nearby devices, finished transfers and history",
    tags: ["Rust", "Tokio", "mDNS", "Tauri", "MCP"],
    code: "https://github.com/AJChaikovsky/OpenDrop",
    demo: "https://github.com/AJChaikovsky/OpenDrop/releases/latest",
    demoLabel: "Download",
  },
  {
    title: "Surf Alerts",
    hook: "An email when your surf spot is firing",
    description:
      "Set the wave height, swell period, and wind you want at a SoCal break, and a background worker emails you when the forecast matches. A database constraint guarantees one email per alert per day, even when worker runs overlap.",
    status: "Shipped",
    image: "images/surf-alerts.jpg",
    imageAlt: "Surf Alerts landing page: \"Tell me when El Porto is firing\" beside the log-in form",
    tags: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
    code: "https://github.com/AJChaikovsky/surf-alerts",
    demo: "https://surf-alerts.fly.dev",
  },
  {
    title: "Choices Counselor",
    hook: "Bilingual school-choice agents, built at LA Hacks 2026",
    description:
      "A 3-person LA Hacks team built this Spanish/English multi-agent counselor that helps LAUSD families pick magnet programs and estimate admission points. The math runs in plain Python rules over a 49-program dataset where every value cites its source.",
    status: "Shipped",
    tags: ["Python", "Fetch.ai", "Multi-agent"],
    code: "https://github.com/AJChaikovsky/LA-Hacks-project",
  },
  {
    title: "SplitSmart",
    hook: "Group expense splitting for USC students, on Android",
    description:
      "A 3-person team's Android app for splitting group expenses equally, by exact amounts, or by percentage, with balances, settlements, and monthly summaries. Built in layers on Firebase and covered by JUnit and Espresso tests.",
    status: "Shipped",
    tags: ["Java", "Android", "Firebase", "Espresso"],
    code: "https://github.com/AJChaikovsky/SplitSmart",
  },
  {
    title: "crdt-notes",
    hook: "Offline-first collaborative notes, with the CRDT written from scratch",
    description:
      "The list CRDT behind an offline-first notes app, written from scratch with two algorithms (RGA and Fugue) and a property-based harness that checks replicas always converge. The sync server and editor come next.",
    status: "In progress",
    tags: ["TypeScript", "CRDTs", "fast-check", "Vitest"],
    code: "https://github.com/AJChaikovsky/crdt-notes",
  },
  {
    title: "GameSense AI",
    hook: "A real-time AI coach that watches you play",
    description:
      "Watches your game and shows short coaching tips in a click-through overlay, without ever sending inputs or reading game memory. An eval harness scores vision models on labeled gameplay clips to find the fastest one that still gives good advice.",
    status: "In progress",
    tags: ["TypeScript", "Electron", "Python", "OpenCV"],
    code: "https://github.com/AJChaikovsky/gamesense-ai",
    comingSoon: ["demo"],
  },
];
