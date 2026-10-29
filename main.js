// Lines typed into the hero terminal. Edit these to talk about yourself.
// Each entry is either a command ({ cmd }) or output ({ out, cls }); cls is "muted" or "accent".
const TERMINAL_LINES = [
  { cmd: "whoami" },
  { out: "AJ Chaikovsky: CS + Business @ USC, builder of things", cls: "accent" },
  { cmd: "cat focus.txt" },
  { out: "LLM systems, data pipelines, and full-stack apps people actually use.", cls: "muted" },
  { cmd: "ls projects/" },
  { out: "__PROJECTS__", cls: "muted" }, // replaced with your project names from projects.js
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof window.gsap !== "undefined";
const animate = hasGsap && !reduceMotion;
if (animate) document.documentElement.classList.add("anim");

const root = document.documentElement;
const grid = document.getElementById("project-grid");

/* ---------- Helpers ---------- */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// Wrap each word (or character) of an element in a span so it can be animated on its own
function splitText(node, mode) {
  const text = node.textContent;
  node.textContent = "";
  node.setAttribute("aria-label", text);
  const parts = mode === "chars" ? Array.from(text) : text.split(/(\s+)/);
  return parts
    .map((part) => {
      if (mode !== "chars" && /^\s+$/.test(part)) {
        node.appendChild(document.createTextNode(part));
        return null;
      }
      const span = el("span", mode === "chars" ? "char" : "word", part);
      span.setAttribute("aria-hidden", "true");
      node.appendChild(span);
      return span;
    })
    .filter(Boolean);
}

/* ---------- Project cards ---------- */
const GITHUB_ICON =
  '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
const HUES = ["rgba(37,99,235,0.18)", "rgba(30,64,175,0.2)", "rgba(14,116,144,0.16)", "rgba(59,130,246,0.14)"];

PROJECTS.forEach((project, i) => {
  const card = el("article", "project-card");

  const thumb = el("div", "project-thumb");
  if (project.image) {
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = `Screenshot of ${project.title}`;
    img.loading = "lazy";
    thumb.appendChild(img);
  } else {
    const ph = el("div", "thumb-placeholder");
    ph.style.setProperty("--hue", HUES[i % HUES.length]);
    ph.style.setProperty("--hx", `${20 + ((i * 37) % 60)}%`);
    ph.style.setProperty("--hy", `${25 + ((i * 53) % 50)}%`);
    thumb.appendChild(ph);
    thumb.appendChild(el("span", "thumb-title", project.title));
  }
  thumb.appendChild(el("span", "thumb-index", String(i + 1).padStart(2, "0")));
  card.appendChild(thumb);

  const body = el("div", "project-body");
  const titleRow = el("div", "project-title");
  titleRow.appendChild(el("h3", null, project.title));
  if (project.code) {
    const gh = el("a", "gh-link");
    gh.href = project.code;
    gh.target = "_blank";
    gh.rel = "noopener";
    gh.setAttribute("aria-label", `${project.title} on GitHub`);
    gh.title = "View on GitHub";
    gh.innerHTML = GITHUB_ICON;
    titleRow.appendChild(gh);
  }
  if (project.inProgress) titleRow.appendChild(el("span", "status-badge", "in progress"));
  body.appendChild(titleRow);
  if (project.subtitle) body.appendChild(el("p", "project-subtitle", project.subtitle));
  body.appendChild(el("p", null, project.description));

  if (project.tags && project.tags.length) {
    const tags = el("ul", "tag-list");
    project.tags.forEach((t) => tags.appendChild(el("li", null, t)));
    body.appendChild(tags);
  }

  const links = el("div", "project-links");
  if (project.demo) {
    const a = el("a", "link", "Live demo ↗");
    a.href = project.demo;
    a.target = "_blank";
    a.rel = "noopener";
    links.appendChild(a);
  } else {
    links.appendChild(el("span", "badge", "demo coming soon"));
  }
  body.appendChild(links);

  card.appendChild(body);
  grid.appendChild(card);
});

const cards = Array.from(grid.children);

/* ---------- Card hover: spotlight follows the cursor + slight 3D tilt ---------- */
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
cards.forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
    if (animate && finePointer) {
      gsap.to(card, {
        rotateY: (x / r.width - 0.5) * 5,
        rotateX: -(y / r.height - 0.5) * 5,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  });
  card.addEventListener("pointerleave", () => {
    if (animate) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
  });
});

/* ---------- Terminal typing ---------- */
function runTerminal() {
  const body = document.getElementById("terminal-body");
  const names = PROJECTS.map((p) => slug(p.title) + "/").join("  ");
  const lines = TERMINAL_LINES.map((l) => (l.out === "__PROJECTS__" ? { ...l, out: names } : l));
  const cursor = el("span", "cursor");

  if (reduceMotion) {
    lines.forEach((l) => body.appendChild(lineNode(l, true)));
    body.appendChild(cursor);
    return;
  }

  let i = 0;
  function next() {
    if (i >= lines.length) {
      body.appendChild(cursor);
      return;
    }
    const line = lines[i++];
    if (line.cmd) {
      const node = lineNode(line, false);
      const textSpan = node.querySelector(".typed");
      body.appendChild(node);
      node.appendChild(cursor);
      let c = 0;
      const tick = () => {
        textSpan.textContent = line.cmd.slice(0, ++c);
        if (c < line.cmd.length) setTimeout(tick, 45 + Math.random() * 50);
        else setTimeout(next, 350);
      };
      setTimeout(tick, 400);
    } else {
      body.appendChild(lineNode(line, true));
      setTimeout(next, 250);
    }
  }
  next();
}

function lineNode(line, full) {
  const div = el("div");
  if (line.cmd) {
    div.appendChild(el("span", "prompt", "$ "));
    div.appendChild(el("span", "typed", full ? line.cmd : ""));
  } else {
    div.appendChild(el("span", line.cls || "", line.out));
  }
  return div;
}

/* ---------- Rolling word (slot machine) ---------- */
function runRoller() {
  const roller = document.getElementById("roller");
  const words = roller.dataset.words.split(",").map((w) => w.trim()).filter(Boolean);
  if (words.length < 2 || !animate) return;
  const wordEl = roller.querySelector(".roller-word");
  let index = 0;

  // Fix the roller's width to the widest word so the sentence doesn't jump around
  function measure() {
    roller.style.width = "";
    let max = 0;
    words.forEach((w) => {
      wordEl.textContent = w;
      max = Math.max(max, wordEl.offsetWidth);
    });
    wordEl.textContent = words[index];
    roller.style.width = `${max}px`;
  }
  measure();
  window.addEventListener("resize", measure);

  function roll() {
    const target = (index + 1) % words.length;
    // Spin through a few quick in-between words, then land on the next one
    const spins = [];
    for (let k = 1; k <= 3; k++) spins.push(words[(index + k * 2) % words.length]);
    spins.push(words[target]);

    const tl = gsap.timeline({ onComplete: () => { index = target; gsap.delayedCall(2.6, roll); } });
    spins.forEach((w, k) => {
      const last = k === spins.length - 1;
      tl.to(wordEl, { yPercent: -100, filter: "blur(2px)", duration: 0.06, ease: "power1.in" })
        .add(() => { wordEl.textContent = w; })
        .fromTo(
          wordEl,
          { yPercent: 100 },
          last
            ? { yPercent: 0, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }
            : { yPercent: 0, duration: 0.06, ease: "none" }
        );
    });
  }
  gsap.delayedCall(2.4, roll);
}

/* ---------- Magnetic buttons ---------- */
function magnetic() {
  if (!animate || !finePointer) return;
  document.querySelectorAll(".magnetic").forEach((btn) => {
    const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    btn.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ---------- Copy email ---------- */
const copyBtn = document.getElementById("copy-email");
copyBtn.addEventListener("click", async () => {
  const email = copyBtn.dataset.email;
  const label = copyBtn.querySelector(".copy-label");
  try {
    await navigator.clipboard.writeText(email);
    label.textContent = "Copied ✓";
  } catch (e) {
    window.location.href = `mailto:${email}`;
    return;
  }
  setTimeout(() => (label.textContent = email), 1600);
});

/* ---------- Nav: sliding pill under the section in view ---------- */
function navPill() {
  const links = Array.from(document.querySelectorAll("#nav-links a"));
  const pill = document.getElementById("nav-pill");
  let activeLink = null;

  function moveTo(link) {
    if (link === activeLink) return;
    activeLink = link;
    links.forEach((l) => l.classList.toggle("active", l === link));
    if (!link) {
      pill.style.opacity = "0";
      return;
    }
    const props = { x: link.offsetLeft, width: link.offsetWidth, opacity: 1 };
    if (animate) gsap.to(pill, { ...props, duration: 0.45, ease: "expo.out" });
    else Object.assign(pill.style, { transform: `translateX(${props.x}px)`, width: `${props.width}px`, opacity: 1 });
  }

  const sections = links.map((l) => document.querySelector(l.getAttribute("href")));
  function update() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach((s, i) => {
      if (s.offsetTop <= y) current = links[i];
    });
    moveTo(current);
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", () => { activeLink = null; update(); });
  update();
}

/* ---------- Entrance + scroll reveals ---------- */
function intro() {
  const name = document.getElementById("hero-name");
  const chars = splitText(name, "chars");
  if (!animate) return runTerminal();

  // Name: per letter, opacity 0.3 → 1 with a slight blur (HyperFrames motion.md "per letter for a name")
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.fromTo(".hero .eyebrow", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo(
      chars,
      { opacity: 0.15, filter: "blur(8px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.05, clearProps: "filter" },
      0.1
    )
    .fromTo(".tagline", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5, clearProps: "filter" }, "-=0.45")
    .fromTo(".hero-actions", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
    .fromTo(
      ".hero-terminal",
      { opacity: 0, y: 24, scale: 0.98, filter: "blur(6px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1, clearProps: "filter", onStart: runTerminal },
      0.35
    );
}

function scrollReveals() {
  if (!animate) return;

  // Section headings: word by word blur-in, no translate
  document.querySelectorAll(".split-words").forEach((h) => {
    const words = splitText(h, "words");
    gsap.set(words, { opacity: 0, filter: "blur(6px)" });
    onEnter(h, () =>
      gsap.to(words, { opacity: 1, filter: "blur(0px)", duration: 0.4, stagger: 0.07, ease: "power2.out", clearProps: "filter" })
    );
  });

  // Eyebrows outside the hero
  document.querySelectorAll(".section .eyebrow").forEach((e) =>
    onEnter(e, () => gsap.to(e, { opacity: 1, duration: 0.6, ease: "power2.out" }))
  );

  // Generic blocks: translateY(20px) + fade, long-tailed ease
  document.querySelectorAll(".reveal").forEach((e) => {
    gsap.set(e, { y: 20 });
    onEnter(e, () => gsap.to(e, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }));
  });

  // Project cards: staggered as the grid comes into view
  gsap.set(cards, { y: 24 });
  onEnter(grid, () =>
    gsap.to(cards, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 })
  );
}

function onEnter(target, fn) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fn();
          io.disconnect();
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  io.observe(target);
}

/* ---------- Resume links: only shown once resume.pdf has been added ---------- */
fetch("resume.pdf", { method: "HEAD" })
  .then((res) => {
    if (res.ok) document.querySelectorAll(".resume-link").forEach((a) => (a.hidden = false));
  })
  .catch(() => {});

/* ---------- Theme toggle (remembers the choice; defaults to the system setting) ---------- */
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch (e) {}

document.getElementById("theme-toggle").addEventListener("click", () => {
  const isDark =
    root.dataset.theme === "dark" ||
    (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.dataset.theme = isDark ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch (e) {}
});

/* ---------- Go ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
intro();
scrollReveals();
runRoller();
magnetic();
navPill();
