# Portfolio

A simple static portfolio site: plain HTML, CSS and JavaScript, with no build step.

## Files

- `index.html`: page structure (hero, projects, about, contact)
- `projects.js`: **your project list**. Edit this to add projects.
- `main.js`: project cards, filters, animations, terminal text (`TERMINAL_LINES` at the top)
- `background.js`: the animated gradient behind the intro (WebGL)
- `styles.css`: all styling; colors are variables at the top

## Customize

1. Search `index.html` for "Your Name", "you@example.com" and "yourusername" and replace them.
2. Edit the projects in `projects.js`. When a demo is live, add `demo: "https://..."` and the
   "Demo coming soon" badge becomes a link.
3. For screenshots, make an `images/` folder and add `image: "images/name.png"` to a project.
4. To change the accent color, edit `--accent` in `styles.css`. The intro background colors are `--glow-1/2/3`.
5. The rotating words after "I build" are in `data-words="..."` in `index.html`.

Animations use [GSAP](https://gsap.com) from a CDN. If it can't load, or the visitor has
"reduce motion" turned on, the page still shows everything, just without animation.

## Credits

The visual style and motion timings follow the [HyperFrames](https://github.com/heygen-com/hyperframes)
design system (`DESIGN.md`) and motion guide (`skills/hyperframes/references/motion.md`), Apache-2.0.

## Preview locally

Open `index.html` in your browser, or run:

```bash
python3 -m http.server
```

Then go to http://localhost:8000.

## Deploy (free)

- **GitHub Pages:** push this folder to a repo, then go to Settings → Pages → deploy from the `main` branch.
- **Netlify / Vercel:** drag and drop the folder, or connect the repo.
