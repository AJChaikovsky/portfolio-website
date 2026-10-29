// Hero background: a soft, slowly flowing colour field (domain-warped noise in WebGL).
// A lightweight stand-in for HyperFrames' aurora / flowing-gradient shader blocks, which
// need WebGPU and a 1.4 MB library. Colours come from the --glow-* CSS variables, so it
// follows the light/dark theme. It leans toward the cursor and pauses when off screen.
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return; // no WebGL: the plain page background shows instead

  const vertSrc = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const fragSrc = `
    precision mediump float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec3 u_bg, u_c1, u_c2, u_c3;
    uniform float u_strength;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
      vec2 p = uv * aspect * 1.4;
      vec2 m = u_mouse * aspect * 1.4;
      float t = u_time * 0.04;

      // Pull the field gently toward the cursor
      vec2 toMouse = m - p;
      p += toMouse * 0.12 * exp(-dot(toMouse, toMouse) * 1.5);

      vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
      vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.5),
                    fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
      float f = fbm(p + 2.5 * r);

      vec3 col = mix(u_c1, u_c2, clamp(q.x * 1.4 - 0.2, 0.0, 1.0));
      col = mix(col, u_c3, clamp(r.y * r.y * 1.2, 0.0, 1.0));

      float k = smoothstep(0.3, 0.85, f) * u_strength;
      vec3 outc = mix(u_bg, col, k);

      // Fade into the page at the bottom and toward the left (behind the text)
      outc = mix(u_bg, outc, smoothstep(0.0, 0.5, uv.y));
      outc = mix(u_bg, outc, 0.45 + 0.55 * smoothstep(0.0, 0.7, uv.x));

      gl_FragColor = vec4(outc, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {};
  ["u_res", "u_time", "u_mouse", "u_bg", "u_c1", "u_c2", "u_c3", "u_strength"].forEach(
    (n) => (u[n] = gl.getUniformLocation(prog, n))
  );

  // Read theme colours from CSS
  function hexToRgb(hex) {
    hex = hex.trim().replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const n = parseInt(hex, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    gl.uniform3fv(u.u_bg, hexToRgb(cs.getPropertyValue("--bg")));
    gl.uniform3fv(u.u_c1, hexToRgb(cs.getPropertyValue("--glow-1")));
    gl.uniform3fv(u.u_c2, hexToRgb(cs.getPropertyValue("--glow-2")));
    gl.uniform3fv(u.u_c3, hexToRgb(cs.getPropertyValue("--glow-3")));
    gl.uniform1f(u.u_strength, parseFloat(cs.getPropertyValue("--glow-strength")) || 0.5);
  }
  readTheme();
  new MutationObserver(() => { readTheme(); draw(); }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readTheme(); draw(); });

  // Render at reduced resolution: the field is soft, so nobody can tell, and it's much cheaper
  const SCALE = 0.5;
  function resize() {
    const w = Math.max(1, Math.floor(canvas.clientWidth * SCALE));
    const h = Math.max(1, Math.floor(canvas.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(u.u_res, w, h);
  }

  // Mouse (smoothed), in 0..1 with y up
  const mouse = { x: 0.75, y: 0.55, tx: 0.75, ty: 0.55 };
  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width;
    mouse.ty = 1 - (e.clientY - r.top) / r.height;
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = performance.now();
  let time = 20; // start mid-flow so the first frame already looks settled

  function draw() {
    resize();
    gl.uniform1f(u.u_time, time);
    gl.uniform2f(u.u_mouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let visible = true;
  let rafId = null;
  function loop(now) {
    time = 20 + (now - start) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    draw();
    rafId = visible ? requestAnimationFrame(loop) : null;
  }

  window.addEventListener("resize", draw);

  if (reduceMotion) {
    draw(); // one still frame
    return;
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !rafId) rafId = requestAnimationFrame(loop);
  }).observe(canvas);
})();
