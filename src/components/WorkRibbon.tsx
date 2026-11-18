"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SiteWork {
  title: string;
  category: string;
  url: string;
  tag: string;
  accent: string;
  badge: string;
}

const SITES: SiteWork[] = [
  {
    title: "Avexssft",
    category: "Software & Cloud Systems",
    url: "https://avexssft.vercel.app/",
    tag: "avexssft.vercel.app",
    accent: "#38bdf8",
    badge: "FINTECH & SAAS",
  },
  {
    title: "Reyonodes",
    category: "High-Performance Cloud Infrastructure",
    url: "https://development-1491.reyonodes.workers.dev/",
    tag: "reyonodes.workers.dev",
    accent: "#a855f7",
    badge: "EDGE WORKERS",
  },
  {
    title: "Hennessey Site",
    category: "Luxury Automotive & Performance",
    url: "https://hennessey-site.pages.dev/",
    tag: "hennessey-site.pages.dev",
    accent: "#f59e0b",
    badge: "AUTOMOTIVE UI",
  },
  {
    title: "Xerin Project",
    category: "Cybersecurity & Neural Protocols",
    url: "https://xerinproject.pages.dev/",
    tag: "xerinproject.pages.dev",
    accent: "#10b981",
    badge: "NEURAL SYSTEMS",
  },
  {
    title: "Reyo Pro VPS",
    category: "Enterprise Virtual Private Servers",
    url: "https://reyoprovps.pages.dev/",
    tag: "reyoprovps.pages.dev",
    accent: "#6366f1",
    badge: "INFRASTRUCTURE",
  },
  {
    title: "Hennessey Special Edition",
    category: "Hypercar Configurator & Editorial",
    url: "https://hennessey.pages.dev/",
    tag: "hennessey.pages.dev",
    accent: "#f43f5e",
    badge: "LUXURY EDITORIAL",
  },
  {
    title: "Adeline Neural Sandbox",
    category: "Tessro Proprietary AI Studio",
    url: "https://tessro.design/",
    tag: "adeline.tessro.ai",
    accent: "#06b6d4",
    badge: "ADELINE AI",
  },
  {
    title: "Tessro Design System",
    category: "Component Tokens & Grid Standards",
    url: "https://tessro.design/",
    tag: "design.tessro.ai",
    accent: "#ffffff",
    badge: "DESIGN TOKENS",
  },
];

// Helper to generate crisp canvas texture for each website card
function createSiteCanvas(site: SiteWork): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 644;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 1. Dark Gradient Background
  const grad = ctx.createLinearGradient(0, 0, 1024, 644);
  grad.addColorStop(0, "#0c0d12");
  grad.addColorStop(0.5, "#08080a");
  grad.addColorStop(1, "#030305");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 644);

  // 2. Ambient Accent Glow
  const glow = ctx.createRadialGradient(800, 150, 20, 800, 150, 450);
  glow.addColorStop(0, site.accent + "33");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1024, 644);

  // 3. Grid lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 644);
    ctx.stroke();
  }
  for (let y = 0; y < 644; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 4. Browser Chrome Bar
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fillRect(36, 36, 952, 48);

  // Browser Dots
  ctx.fillStyle = "#ff5f56";
  ctx.beginPath();
  ctx.arc(60, 60, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffbd2e";
  ctx.beginPath();
  ctx.arc(80, 60, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#27c93f";
  ctx.beginPath();
  ctx.arc(100, 60, 6, 0, Math.PI * 2);
  ctx.fill();

  // URL Bar in Browser
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.beginPath();
  ctx.roundRect(130, 46, 700, 28, 6);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "500 13px 'Inter Tight', monospace";
  ctx.fillText("🔒 https://" + site.tag, 146, 65);

  // 5. Category Badge
  ctx.fillStyle = site.accent + "22";
  ctx.strokeStyle = site.accent + "66";
  ctx.beginPath();
  ctx.roundRect(50, 130, 190, 32, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = site.accent;
  ctx.font = "bold 11px monospace";
  ctx.fillText(site.badge, 68, 151);

  // 6. Main Site Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 46px 'Inter Tight', sans-serif";
  ctx.fillText(site.title, 50, 225);

  // 7. Subtitle / Description
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.font = "400 20px 'Inter Tight', sans-serif";
  ctx.fillText(site.category, 50, 265);

  // 8. Visual Bento Mockup Cards inside the canvas
  // Card 1
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.roundRect(50, 310, 440, 260, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "500 16px 'Inter Tight', sans-serif";
  ctx.fillText("LIVE METRICS & ARCHITECTURE", 74, 346);

  ctx.fillStyle = site.accent;
  ctx.font = "bold 38px 'Inter Tight', sans-serif";
  ctx.fillText("99.98%", 74, 400);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "13px 'Inter Tight', sans-serif";
  ctx.fillText("Global Production Delivery", 74, 426);

  // Mini Chart Bars
  for (let b = 0; b < 12; b++) {
    const barH = 30 + Math.sin(b * 0.8) * 25 + (b % 3) * 15;
    ctx.fillStyle = b === 9 ? site.accent : "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(74 + b * 28, 520 - barH, 18, barH);
  }

  // Card 2
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.roundRect(510, 310, 460, 260, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "500 16px 'Inter Tight', sans-serif";
  ctx.fillText("ENGINEERED BY TESSRO", 534, 346);

  // Feature pills
  const tags = ["Tailwind CSS", "Next.js Edge", "Vercel Hosted", "1TB Cloud CDN"];
  tags.forEach((tag, idx) => {
    const ty = 385 + idx * 42;
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.beginPath();
    ctx.roundRect(534, ty - 22, 380, 32, 8);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.fillText("✓", 546, ty);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "14px 'Inter Tight', sans-serif";
    ctx.fillText(tag, 570, ty);
  });

  // 9. Bottom CTA banner inside card
  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  ctx.beginPath();
  ctx.roundRect(50, 590, 920, 28, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "11px monospace";
  ctx.fillText("CLICK TO OPEN LIVE DEPLOYMENT  ↗", 400, 608);

  return canvas;
}

export default function WorkRibbon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const mix = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = (t: number) => t * t * (3 - 2 * t);
    const out = (t: number) => 1 - Math.pow(1 - t, 3);
    const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

    // Three.js setup
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const scene = new THREE.Scene();
    const FOV = 35;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    // Build the Ribbon Rail
    let path: THREE.CatmullRomCurve3;
    let PATH_L = 1;
    const SAMPLES = 1200;
    const pathP: THREE.Vector3[] = [];
    const pathT: THREE.Vector3[] = [];
    const PH0 = -1.5;
    const PH1 = Math.PI * 2 + 1.35;

    function buildPath() {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 160; i++) {
        const t = i / 160;
        const ph = mix(PH0, PH1, t);
        const cs = Math.cos(ph);
        const u = 2 * t - 1;
        const depth = cs > 0 ? 7.6 + 16.4 * Math.pow(cs, 0.9) : 7.6 + 2.2 * cs;
        const edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
        pts.push(
          new THREE.Vector3(
            edge * Math.sin(ph) * depth * 0.561,
            0.5 * Math.sign(u) * Math.pow(Math.abs(u), 1.4) * depth * 0.63,
            -depth
          )
        );
      }
      path = new THREE.CatmullRomCurve3(pts, false, "centripetal");
      path.arcLengthDivisions = 1500;
      PATH_L = path.getLength();
      pathP.length = 0;
      pathT.length = 0;
      for (let i = 0; i <= SAMPLES; i++) {
        const u = i / SAMPLES;
        pathP.push(path.getPointAt(u));
        pathT.push(path.getTangentAt(u));
      }
    }

    const op = new THREE.Vector3();
    const ot = new THREE.Vector3();
    const up = new THREE.Vector3();
    const Y = new THREE.Vector3(0, 1, 0);
    const vp = new THREE.Vector3();

    const at = (s: number, o_p: THREE.Vector3, o_t: THREE.Vector3) => {
      const f = clamp(s / PATH_L) * SAMPLES;
      const i = Math.min(SAMPLES - 1, Math.floor(f));
      const k = f - i;
      o_p.lerpVectors(pathP[i], pathP[i + 1], k);
      o_t.lerpVectors(pathT[i], pathT[i + 1], k).normalize();
    };

    // Card geometry & custom shader
    const CARD_W = 2.1;
    const CARD_H = 1.32;
    const GAP = 0.03;
    const STEP = CARD_W + GAP;
    const NX = 28;
    const NY = 3;

    const vs = `
      varying vec2 vUv;
      void main(){
        vUv=uv;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
      }
    `;

    const fs = `
      uniform sampler2D map;
      uniform vec2 cover;
      uniform float aspect,ready,radius;
      varying vec2 vUv;
      void main(){
        vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
        float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
        float px=fwidth(d),a=1.-smoothstep(-px,px,d);
        if(a<.01)discard;
        vec2 uv=vUv;
        if(!gl_FrontFacing)uv.x=1.-uv.x;
        vec3 c=texture2D(map,(uv-.5)*cover+.5).rgb;
        float edge=smoothstep(-.012-px,-.012,d);
        gl_FragColor=vec4(mix(c,vec3(1.),edge*.12),a);
      }
    `;

    const cards = SITES.map((site, i) => {
      const siteCanvas = createSiteCanvas(site);
      const tex = new THREE.CanvasTexture(siteCanvas);
      tex.colorSpace = THREE.NoColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;

      const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
      const mat = new THREE.ShaderMaterial({
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          map: { value: tex },
          cover: { value: new THREE.Vector2(1, 1) },
          aspect: { value: CARD_W / CARD_H },
          ready: { value: 1 },
          radius: { value: 0.018 },
        },
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);

      return {
        i,
        site,
        title: site.title,
        url: site.url,
        mesh,
        geo,
        rect: null as any,
      };
    });

    // Layout calculation
    const GZ = 8;
    let W = 1;
    let H = 1;
    let asp = 1;
    let cols = 3;
    let rows = 2;
    let tanH = 0.3153;

    function resize() {
      if (!canvas) return;
      W = window.innerWidth;
      H = window.innerHeight;
      asp = W / H;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H, false);
      camera.aspect = asp;
      camera.fov = asp < 16 / 9 ? (Math.atan(0.561 / asp) * 360) / Math.PI : FOV;
      camera.updateProjectionMatrix();
      tanH = Math.tan((camera.fov * Math.PI) / 360);
      cols = asp < 0.9 ? 2 : 3;
      rows = asp < 0.9 ? 3 : 2;
    }

    window.addEventListener("resize", resize);
    resize();
    buildPath();

    function grid(i: number) {
      const vh = 2 * GZ * tanH;
      const vw = vh * asp;
      const gw = vw * (cols === 3 ? 0.74 : 0.88);
      const gap = gw * 0.017;
      const cw = (gw - gap * (cols - 1)) / cols;
      const ch = cw / (CARD_W / CARD_H);
      const gh = ch * rows + gap * 1.6 * (rows - 1);
      const c = i % cols;
      const r = Math.floor(i / cols);
      return {
        x: -gw / 2 + cw / 2 + c * (cw + gap),
        y: gh / 2 - ch / 2 - r * (ch + gap * 1.6),
        w: cw,
        h: ch,
        vw,
        vh,
        c,
        r,
      };
    }

    // Scroll calculation relative to #track
    let target = 0;
    let p = 0;

    const readScroll = () => {
      const track = containerRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const totalDist = track.offsetHeight - window.innerHeight;
      const scrollPos = -rect.top;
      target = clamp(scrollPos / totalDist, 0, 1);
    };

    window.addEventListener("scroll", readScroll, { passive: true });
    readScroll();

    function poseRibbon(c: (typeof cards)[0], head: number) {
      const pos = c.geo.attributes.position;
      const centre = head - c.i * STEP;
      for (let iy = 0; iy <= NY; iy++) {
        for (let ix = 0; ix <= NX; ix++) {
          const k = iy * (NX + 1) + ix;
          const lu = ix / NX - 0.5;
          const lv = 0.5 - iy / NY;
          at(centre + lu * CARD_W, op, ot);
          up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
          vp.copy(op).addScaledVector(up, lv * CARD_H);
          pos.setXYZ(k, vp.x, vp.y, vp.z);
        }
      }
      pos.needsUpdate = true;
    }

    function poseGrid(c: (typeof cards)[0], q: number) {
      const g = grid(c.i);
      const pos = c.geo.attributes.position;
      const dx = (g.c - (cols - 1) / 2) * 1.2;
      const dy = g.r < rows / 2 ? 1 : -1;
      const ox = dx * g.vw * 0.62 * (1 - q);
      const oy = dy * g.vh * (g.c === 1 ? 0.95 : 0.34) * (1 - q);
      const tilt = (1 - q) * 0.22 * (g.c - 1 || 0.5) * dy;
      const cs = Math.cos(tilt);
      const sn = Math.sin(tilt);

      for (let iy = 0; iy <= NY; iy++) {
        for (let ix = 0; ix <= NX; ix++) {
          const k = iy * (NX + 1) + ix;
          const x = (ix / NX - 0.5) * g.w;
          const y = (0.5 - iy / NY) * g.h;
          pos.setXYZ(
            k,
            g.x + ox + x * cs - y * sn,
            g.y + oy + x * sn + y * cs,
            -GZ - (1 - q) * 0.6 * Math.sin((ix / NX) * Math.PI)
          );
        }
      }
      pos.needsUpdate = true;
      c.rect = g;
    }

    const RIB_A = 0.14;
    const RIB_B = 0.63;

    const l1 = document.getElementById("ribbon-l1");
    const l2 = document.getElementById("ribbon-l2");
    const cap = document.getElementById("ribbon-cap");
    const rule = document.getElementById("ribbon-rule");

    function render() {
      const pp = p;
      const rise = 1 - out(span(pp, 0, 0.12));
      const run = mix(-50, 76, span(pp, 0, 0.58));

      if (l1) l1.style.transform = `translate3d(${run}vw,${rise * 34}vh,0)`;
      if (l2) l2.style.transform = `translate3d(${-run}vw,${rise * 34}vh,0)`;

      const capA = 1 - span(pp, 0.52, 0.57);
      if (cap) {
        cap.style.opacity = String(capA);
        cap.style.transform = `translate(-50%,calc(-50% + ${rise * 34}vh))`;
      }

      if (rule) {
        rule.style.transform = `scaleX(${ease(span(pp, 0.72, 0.86))})`;
      }

      const pr = span(pp, RIB_A, RIB_B);
      const head = mix(0, PATH_L + cards.length * STEP, pr);

      for (const c of cards) {
        const s = head - c.i * STEP;
        const end = PATH_L - CARD_W;
        if (s < end) {
          c.mesh.visible = s > CARD_W;
          c.rect = null;
          if (c.mesh.visible) poseRibbon(c, head);
        } else if (c.i < cols * rows) {
          const st = mix(RIB_A, RIB_B, (end + c.i * STEP) / (PATH_L + cards.length * STEP));
          const q = out(span(pp, st, st + 0.13));
          c.mesh.visible = q > 0.001;
          if (c.mesh.visible) poseGrid(c, q);
        } else {
          c.mesh.visible = false;
          c.rect = null;
        }
      }

      renderer.render(scene, camera);
    }

    // Hover tooltip & Click handler
    const tooltip = hoverTooltipRef.current;
    let hoveredCard: (typeof cards)[0] | null = null;

    const handlePointerMove = (e: MouseEvent) => {
      let hit: (typeof cards)[0] | null = null;
      if (p > 0.86) {
        const nx = e.clientX / W - 0.5;
        const ny = 0.5 - e.clientY / H;
        for (const c of cards) {
          const g = c.rect;
          if (!g) continue;
          const x = nx * g.vw;
          const y = ny * g.vh;
          if (Math.abs(x - g.x) < g.w / 2 && Math.abs(y - g.y) < g.h / 2) {
            hit = c;
          }
        }
      }
      hoveredCard = hit;
      if (tooltip) {
        tooltip.style.opacity = hit ? "1" : "0";
        if (hit) {
          tooltip.textContent = `Open ${hit.title} ↗`;
          tooltip.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 16}px)`;
        }
      }
    };

    const handleClick = () => {
      if (hoveredCard && hoveredCard.url) {
        window.open(hoveredCard.url, "_blank");
      }
    };

    const stageEl = document.getElementById("ribbon-stage");
    if (stageEl) {
      stageEl.addEventListener("mousemove", handlePointerMove);
      stageEl.addEventListener("click", handleClick);
    }

    // Main animation loop
    let animId = 0;
    function loop() {
      p += (target - p) * 0.09;
      if (Math.abs(target - p) < 0.00005) p = target;
      render();
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readScroll);
      cancelAnimationFrame(animId);
      if (stageEl) {
        stageEl.removeEventListener("mousemove", handlePointerMove);
        stageEl.removeEventListener("click", handleClick);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} id="portfolio-track" className="relative w-full h-[650vh]">
      
      {/* Sticky Fullscreen 3D Viewport Stage */}
      <div
        id="ribbon-stage"
        className="sticky top-0 w-full h-[100vh] h-[100svh] overflow-hidden bg-[#0a0a0b] cursor-pointer"
      >
        {/* Sliding Dual Headline: BUILT BY / TESSRO */}
        <div aria-label="Built by Tessro" className="pointer-events-none">
          <div
            id="ribbon-l1"
            className="absolute left-0 right-0 font-normal text-[clamp(44px,7.5vw,140px)] leading-none tracking-[-0.055em] whitespace-nowrap text-center will-change-transform text-white top-[calc(50%-0.98em)]"
            style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}
            aria-hidden="true"
          >
            <span className="inline-block mr-[15vw]">BUILT BY</span>
          </div>

          <div
            id="ribbon-l2"
            className="absolute left-0 right-0 font-normal text-[clamp(44px,7.5vw,140px)] leading-none tracking-[-0.055em] whitespace-nowrap text-center will-change-transform text-white top-[calc(50%+0.03em)]"
            style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}
            aria-hidden="true"
          >
            <span className="inline-block ml-[15vw]">TESSRO</span>
          </div>
        </div>

        {/* Center Caption */}
        <div
          id="ribbon-cap"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18em] text-center text-[clamp(10px,0.85vw,13.5px)] font-medium leading-[1.35] tracking-[0.06em] uppercase text-zinc-300 pointer-events-none font-mono"
        >
          Selected live client websites synthesized by our studio & Adeline.
        </div>

        {/* Hairline Separator Between Settled Grid Rows */}
        <div
          id="ribbon-rule"
          className="absolute left-[3.5vw] right-[3.5vw] top-1/2 h-[1px] bg-white/[0.12] origin-left scale-x-0 pointer-events-none"
        ></div>

        {/* WebGL Canvas */}
        <canvas id="ribbon-gl" ref={canvasRef} className="absolute inset-0 w-full h-full block z-10"></canvas>

        {/* Bottom Context Info */}
        <div className="absolute left-8 right-8 bottom-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400 pointer-events-none z-20">
          <p className="max-w-md text-zinc-400">
            Scroll down to explore the spiral ribbon. When settled, click any card to visit the live platform.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-zinc-500">6 LIVE CLIENT DEPLOYMENTS</span>
            <span className="text-cyan-400 animate-pulse">SCROLL TO EXPAND ▾</span>
          </div>
        </div>

        {/* Cursor Floating Tooltip */}
        <div
          ref={hoverTooltipRef}
          className="fixed left-0 top-0 px-3 py-1.5 bg-white text-black font-mono text-xs font-semibold rounded-full pointer-events-none opacity-0 transition-opacity duration-150 z-50 shadow-2xl"
        ></div>

      </div>

    </div>
  );
}
