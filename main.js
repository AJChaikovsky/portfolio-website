// Builds the Work section from projects.js, types the hero terminal, and wires up the small
// bits of interaction.
// No libraries: everything here is plain DOM code.

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Helpers ---------- */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function externalLink(className, text, href) {
  const a = el("a", className, text);
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

const GITHUB_ICON =
  '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

const STATUS_CLASS = { Shipped: "shipped", "In active use": "active", "In progress": "progress" };

function statusNode(status) {
  return el("span", `status status-${STATUS_CLASS[status] || "progress"}`, status);
}

// Demo, case study, GitHub, and "coming soon" / note labels, in that order
function linksNode(project) {
  const links = el("div", "project-links");
  if (project.demo) links.appendChild(externalLink("link", `${project.demoLabel || "Live demo"} ↗`, project.demo));
  if (project.caseStudy) links.appendChild(externalLink("link", "Case study ↗", project.caseStudy));
  if (project.code) {
    const gh = externalLink("link link-gh", null, project.code);
    gh.innerHTML = `${GITHUB_ICON}<span>Code ↗</span>`;
    gh.setAttribute("aria-label", `${project.title} code on GitHub`);
    links.appendChild(gh);
  }
  (project.comingSoon || []).forEach((what) => links.appendChild(el("span", "pending", `${what[0].toUpperCase()}${what.slice(1)} coming soon`)));
  if (project.note) links.appendChild(el("span", "pending", project.note));
  return links;
}

function stackNode(project) {
  if (!project.tags || !project.tags.length) return null;
  const p = el("p", "stack");
  p.appendChild(el("span", "stack-label", "Built with "));
  p.appendChild(document.createTextNode(project.tags.join(", ")));
  return p;
}

/* ---------- Featured: wide panels with headline results ---------- */
function buildPanel(project) {
  const panel = el("article", "panel");
  if (project.image) {
    const img = document.createElement("img");
    img.className = "panel-image";
    img.src = project.image;
    img.alt = `Screenshot of ${project.title}`;
    img.loading = "lazy";
    panel.appendChild(img);
  }
  const text = el("div", "panel-text");

  const head = el("div", "panel-head");
  head.appendChild(el("h3", null, project.title));
  head.appendChild(statusNode(project.status));
  text.appendChild(head);
  text.appendChild(el("p", "hook", project.hook));
  text.appendChild(el("p", "description", project.description));
  const stack = stackNode(project);
  if (stack) text.appendChild(stack);
  text.appendChild(linksNode(project));
  panel.appendChild(text);

  if (project.metrics && project.metrics.length) {
    const readout = el("dl", "readout");
    project.metrics.forEach((m) => {
      const row = el("div", "metric");
      const dd = el("dd", "metric-value");
      const num = el("span", "metric-num", String(m.value));
      if (typeof m.value === "number") num.dataset.target = String(m.value);
      dd.appendChild(num);
      if (m.unit) dd.appendChild(el("span", "metric-unit", m.unit));
      // Label (dt) comes first for screen readers; CSS shows the number on top
      row.appendChild(el("dt", "metric-label", m.label));
      row.appendChild(dd);
      readout.appendChild(row);
    });
    panel.appendChild(readout);
  } else {
    panel.classList.add("panel-plain"); // no results column: the story uses the full width
  }
  return panel;
}

/* ---------- More projects: a ruled list ---------- */
function buildRow(project) {
  const li = el("li", "row");
  const head = el("div", "row-head");
  head.appendChild(el("h4", null, project.title));
  head.appendChild(statusNode(project.status));
  li.appendChild(head);

  const body = el("div", "row-body");
  body.appendChild(el("p", "hook", project.hook));
  body.appendChild(el("p", "description", project.description));
  const stack = stackNode(project);
  if (stack) body.appendChild(stack);
  body.appendChild(linksNode(project));
  li.appendChild(body);
  return li;
}

const featuredEl = document.getElementById("featured");
const moreList = document.getElementById("more-list");
PROJECTS.filter((p) => p.featured).forEach((p) => featuredEl.appendChild(buildPanel(p)));
const rest = PROJECTS.filter((p) => !p.featured);
rest.forEach((p) => moreList.appendChild(buildRow(p)));
if (!rest.length) document.getElementById("more").hidden = true;

/* ---------- Headline numbers count up when a panel scrolls into view ---------- */
function decimals(n) {
  const s = String(n);
  return s.includes(".") ? s.split(".")[1].length : 0;
}

function countUp(node) {
  const target = Number(node.dataset.target);
  const places = decimals(target);
  const duration = 1100;
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    node.textContent = (target * eased).toFixed(places);
    if (t < 1) requestAnimationFrame(frame);
    else node.textContent = String(target);
  }
  requestAnimationFrame(frame);
}

if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".metric-num[data-target]").forEach(countUp);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".panel").forEach((panel) => {
    // Start from zero only for panels that haven't been seen yet
    panel.querySelectorAll(".metric-num[data-target]").forEach((n) => {
      n.textContent = (0).toFixed(decimals(Number(n.dataset.target)));
    });
    io.observe(panel);
  });
}

/* ---------- Hero terminal: types these lines out once on load ---------- */
// Each entry is a command ({ cmd }) or output ({ out, cls }); cls is "muted" or "accent".
const TERMINAL_LINES = [
  { cmd: "whoami" },
  { out: "AJ Chaikovsky: CS + Business @ USC", cls: "accent" },
  { cmd: "cat focus.txt" },
  { out: "LLM systems, data pipelines, and full-stack apps people actually use.", cls: "muted" },
  { cmd: "ls projects/" },
  { out: "__PROJECTS__", cls: "muted" }, // replaced with the project names from projects.js
];

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function terminalLine(line, full) {
  const div = el("div");
  if (line.cmd) {
    div.appendChild(el("span", "prompt", "$ "));
    div.appendChild(el("span", "typed", full ? line.cmd : ""));
  } else {
    div.appendChild(el("span", line.cls || "", line.out));
  }
  return div;
}

function runTerminal() {
  const body = document.getElementById("terminal-body");
  const names = PROJECTS.map((p) => slug(p.title) + "/").join("  ");
  const lines = TERMINAL_LINES.map((l) => (l.out === "__PROJECTS__" ? { ...l, out: names } : l));
  const cursor = el("span", "cursor");
  cursor.setAttribute("aria-hidden", "true");

  if (reduceMotion) {
    lines.forEach((l) => body.appendChild(terminalLine(l, true)));
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
      const node = terminalLine(line, false);
      const typed = node.querySelector(".typed");
      body.appendChild(node);
      node.appendChild(cursor);
      let c = 0;
      const tick = () => {
        typed.textContent = line.cmd.slice(0, ++c);
        if (c < line.cmd.length) setTimeout(tick, 45 + Math.random() * 50);
        else setTimeout(next, 350);
      };
      setTimeout(tick, 400);
    } else {
      body.appendChild(terminalLine(line, true));
      setTimeout(next, 250);
    }
  }
  next();
}

runTerminal();

/* ---------- Nav: mark the section in view ---------- */
const navLinks = Array.from(document.querySelectorAll("#nav-links a"));
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href")));
function updateNav() {
  const y = window.scrollY + window.innerHeight * 0.35;
  let current = null;
  sections.forEach((s, i) => {
    if (s.offsetTop <= y) current = navLinks[i];
  });
  navLinks.forEach((a) => {
    if (a === current) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

/* ---------- Copy email ---------- */
const copyBtn = document.getElementById("copy-email");
copyBtn.addEventListener("click", async () => {
  const email = copyBtn.dataset.email;
  const label = copyBtn.querySelector(".copy-label");
  try {
    await navigator.clipboard.writeText(email);
    label.textContent = "Copied to clipboard";
  } catch (e) {
    window.location.href = `mailto:${email}`;
    return;
  }
  setTimeout(() => (label.textContent = email), 1600);
});

/* ---------- Resume links: only shown once the resume PDF has been added ---------- */
fetch("anthony-chaikovsky-resume.pdf", { method: "HEAD" })
  .then((res) => {
    if (res.ok) document.querySelectorAll(".resume-link").forEach((a) => (a.hidden = false));
  })
  .catch(() => {});

/* ---------- Theme toggle: dark by default, remembers a switch to light ---------- */
document.getElementById("theme-toggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch (e) {}
});

document.getElementById("year").textContent = new Date().getFullYear();
