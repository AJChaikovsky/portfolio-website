// Add, remove, or edit projects here — the cards on the page are built from this list.
//
// Fields:
//   title        (required) project name
//   subtitle     short one-line label shown under the title (optional)
//   description  (required) one or two sentences
//   tags         list of technologies used
//   image        path to a screenshot, e.g. "images/my-project.png" (optional)
//   demo         live demo URL (optional; leave out to show "Demo coming soon")
//   code         GitHub URL (optional; shown as a GitHub icon next to the title)
//   inProgress   true to show a small "in progress" label next to the title (optional)
const PROJECTS = [
  {
    title: "mini-vLLM",
    subtitle: "An LLM inference engine, built from scratch",
    description:
      "I wrote a transformer for Qwen2.5 from the ground up (RMSNorm, rotary embeddings, grouped-query attention, SwiGLU) and it matches Hugging Face token for token. Then I made it fast: a PagedAttention KV cache and a continuous-batching scheduler hit 112 tokens/s on a single RTX 2080 Super. That's 6.1x the sequential baseline, with first tokens arriving in 0.29s instead of 10.3s.",
    tags: ["Python", "PyTorch", "CUDA", "FastAPI"],
    code: "https://github.com/AJChaikovsky/mini-vllm",
  },
  {
    title: "Beta Leads",
    subtitle: "AI lead generation for commercial real estate",
    description:
      "A real brokerage uses this every day. It pulls in 15 LA city datasets plus county property records, uses Claude to spot restaurants and shops that will need a new storefront soon, and puts them in front of brokers before anyone else finds them. The pipeline is safe to rerun and recovers from failures on its own, so it keeps working without anyone watching it.",
    tags: ["Python", "Next.js", "TypeScript", "PostgreSQL", "Claude API"],
  },
  {
    title: "Surf Alerts",
    subtitle: "Get an email when your spot is firing",
    description:
      "Set your conditions, pick your spots, and get an email when the forecast lines up. A PostgreSQL unique constraint claims each alert's surf day before anything is sent, so you never get the same email twice, even when worker runs overlap. Every user's data stays private, and I tested the ugly cases too: cross-user access, stolen CSRF tokens, and forecast APIs going down.",
    tags: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
    code: "https://github.com/AJChaikovsky/surf-alerts",
  },
  {
    title: "Choices Counselor",
    subtitle: "LA Hacks 2026 · multi-agent school counselor",
    description:
      "Built in one weekend with a 3-person team: a Spanish/English AI counselor that helps LAUSD families choose magnet programs, estimate their admission points, and avoid costly mistakes before the deadline. The math runs in plain Python rule engines, not the LLM, so families get answers they can trust. Every value in our 49-program dataset is backed by a source.",
    tags: ["Python", "Fetch.ai", "Multi-agent"],
    code: "https://github.com/AJChaikovsky/LA-Hacks-project",
  },
  {
    title: "USC Study Room Booking",
    subtitle: "Reserve a room, join a waitlist, find study partners",
    description:
      "A full-stack booking platform for USC study rooms with reservations, reviews, and study-partner matching by course. I built the backend, including an automatic first-come, first-served waitlist that gives a room to the next student the moment someone cancels.",
    tags: ["Java", "Spring Boot", "React", "MySQL"],
  },
  {
    title: "GameSense AI",
    subtitle: "A real-time AI coach that watches you play",
    description:
      "Imagine a coach watching over your shoulder while you play. GameSense AI captures your screen, figures out what's happening in the game, and shows short, useful tips in an overlay. It learns your habits over time, too. It only watches and advises: it never sends inputs or reads game memory. I'm testing vision models on labeled gameplay clips to find the fastest one that still gives good advice, starting with Counter-Strike 2, Minecraft, and a Souls-like.",
    tags: ["TypeScript", "Electron", "Python", "OpenCV"],
    code: "https://github.com/AJChaikovsky/gamesense-ai",
    inProgress: true,
  },
];
