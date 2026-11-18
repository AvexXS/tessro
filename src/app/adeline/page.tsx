"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function AdelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject external fonts if not present
    if (!document.getElementById("adeline-fonts")) {
      const link = document.createElement("link");
      link.id = "adeline-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap";
      document.head.appendChild(link);
    }

    const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

    const SHOTS = [
      {
        id: "hf_20260922_194349_26ffdbfd-ac5e-49e9-a07d-c06d3f7cb4cb",
        title: "Avexssft Cloud Core",
        domain: "avexssft.vercel.app",
        url: "https://avexssft.vercel.app/",
        where: "London · FinTech & Cloud Architecture (Glassmorphism)",
        note: "Translucent frosted analytics platform with multi-layered specular highlights and sub-pixel telemetry. Built by Adeline in 12 minutes.",
        archetype: "Glassmorphism",
        accent: "#38bdf8",
      },
      {
        id: "hf_20260922_194350_5546ea3d-6336-42c7-a59f-06165c5802be",
        title: "Reyonodes Edge Workers",
        domain: "development-1491.reyonodes.workers.dev",
        url: "https://development-1491.reyonodes.workers.dev/",
        where: "Frankfurt · High-Density Edge Workers (Liquid Glass)",
        note: "Deep obsidian modular bento grid engineered for high-concurrency neural compute monitoring and API orchestration.",
        archetype: "Liquid Glass Bento",
        accent: "#818cf8",
      },
      {
        id: "hf_20260922_194349_b4533691-cb49-41d4-b56c-51f0fdcbe250",
        title: "Hennessey Spec Hypercar",
        domain: "hennessey-site.pages.dev",
        url: "https://hennessey-site.pages.dev/",
        where: "Geneva · Hypercar Configurator UI (Swiss Minimalism)",
        note: "Extreme mathematical grid rigor with monochrome typography, high-contrast negative space, and micro-interactions.",
        archetype: "Swiss Minimalism",
        accent: "#f59e0b",
      },
      {
        id: "hf_20260922_194349_e588abd3-1bfa-4918-894f-05632cc51ccc",
        title: "Xerin Neural Protocol",
        domain: "xerinproject.pages.dev",
        url: "https://xerinproject.pages.dev/",
        where: "Zurich · Quantum Neural Defense (Neo-Brutalism)",
        note: "Stark 2px black geometric borders, flat neon planes, raw typography, and hard drop-shadow component hierarchies.",
        archetype: "Neo-Brutalism",
        accent: "#10b981",
      },
      {
        id: "hf_20260922_194416_47e18c62-253a-42e1-97a9-9e5f6a6b8d59",
        title: "Reyo Pro VPS Terminal",
        domain: "reyoprovps.pages.dev",
        url: "https://reyoprovps.pages.dev/",
        where: "Singapore · Cloud Terminal Infrastructure (Tall Card)",
        note: "Full-bleed cloud virtualization console with live SSH browser session windows and dedicated cluster provisioning.",
        archetype: "Developer Console",
        tall: true,
        accent: "#6366f1",
      },
      {
        id: "hf_20260922_194416_30e307a9-1265-45c3-a1a0-5c6fa5bb9f8d",
        title: "Hennessey Special Edition",
        domain: "hennessey.pages.dev",
        url: "https://hennessey.pages.dev/",
        where: "Los Angeles · Luxury Automotive Editorial",
        note: "High-definition customizer interface engineered for real-time aerodynamic selection and paint finishes.",
        archetype: "Luxury Editorial",
        accent: "#f43f5e",
      },
      {
        id: "hf_20260922_194350_28d92c80-de66-41cb-911e-b3b44aebe1f5",
        title: "Vespera Neural Cloud",
        domain: "vespera.neural.cloud",
        where: "San Francisco · AI Platform Architecture",
        note: "Deep obsidian modular bento grid engineered for high-concurrency neural compute monitoring and API orchestration.",
        archetype: "Liquid Glass Bento",
        accent: "#06b6d4",
      },
      {
        id: "hf_20260922_194349_04e89718-4214-4aff-bac5-490462bbfe2f",
        title: "Chronos Swiss Horology",
        domain: "chronos.geneva.luxury",
        where: "Geneva · Swiss Watchmaking Specimen",
        note: "Radical elimination of the non-essential. Every layout block exists purely to elevate the client's creative work.",
        archetype: "Swiss Minimalism",
        accent: "#ffffff",
      },
      {
        id: "hf_20260922_194417_2c031e22-2fad-4c81-a544-83cd6bba1c33",
        title: "Helion Dispatch Core",
        domain: "helion-dispatch.com",
        where: "Stockholm · Autonomous Logistics Terminal",
        note: "High-contrast dark terminal interface with integrated maps, live vehicle telemetry, and predictive routing.",
        archetype: "Terminal UI",
        accent: "#f97316",
      },
      {
        id: "hf_20260922_194349_a39c3226-7848-4b15-b840-98ad8aec467b",
        title: "Scythe Cybernetics OS",
        domain: "scythe-systems.io",
        where: "Austin · Autonomous Hardware OS (Claymorphism)",
        note: "Tactile soft 3D extruded controls with dual-shadow depth rendering for physical hardware calibration.",
        archetype: "Claymorphism",
        accent: "#ec4899",
      },
      {
        id: "hf_20260922_194417_555e4d90-f35f-4a1a-8c75-def1e8b71988",
        title: "Orion Spatial OS",
        domain: "orionspatial.design",
        where: "Toronto · WebGL 3D Canvas Architecture",
        note: "Infinite canvas workspace with interactive 3D scene viewports and procedural asset rendering.",
        archetype: "WebGL 3D",
        accent: "#38bdf8",
      },
      {
        id: "hf_20260922_194417_e525a243-03c8-454b-83b4-60f541baf70a",
        title: "Lattice Component Matrix",
        domain: "lattice-tokens.dev",
        where: "Amsterdam · Enterprise Design Tokens",
        note: "Cross-platform design token engine generating synchronized Tailwind, Figma, and React component code.",
        archetype: "Design Systems",
        accent: "#10b981",
      },
      {
        id: "hf_20260922_194349_ec830e6f-b8e6-4569-8540-ee7f33902c53",
        title: "Monolith Protocol",
        domain: "monolith.security",
        where: "Berlin · Decentralized Security Ledger",
        note: "High-density server analytics platform tracking microsecond request distributions across edge clusters.",
        archetype: "Neo-Brutalism",
        accent: "#facc15",
      },
      {
        id: "hf_20260922_194417_35a9af5f-bd07-45a7-bb73-08b47d19d530",
        title: "Kanso Spatial Studio",
        domain: "kanso-studio.jp",
        where: "Kyoto · Japanese Spatial UI (Minimalism)",
        note: "Real-time threat interception visualization with dark neon status rings and automated anomaly isolation.",
        archetype: "Swiss Minimalism",
        accent: "#e2e8f0",
      },
      {
        id: "hf_20260922_194417_ff5cb9f8-8eed-4bfb-bb08-11256da92eae",
        title: "Strata Mining Analytics",
        domain: "strata-geospatial.au",
        where: "Sydney · Global Geospatial Mapping",
        note: "Layered geological data visualization powered by sub-pixel GPU shading and dynamic topology heatmaps.",
        archetype: "GPU Shaders",
        accent: "#14b8a6",
      },
      {
        id: "hf_20260922_194418_1d9bff4a-4971-4944-9e49-d72e755ceeb0",
        title: "Aura Audio Engine",
        domain: "aura-synth.audio",
        where: "Oslo · WebAudio DSP Synthesizer",
        note: "In-browser sound design workspace featuring interactive wave oscillators, spectrum analyzers, and MIDI mapping.",
        archetype: "WebAudio DSP",
        accent: "#a855f7",
      },
      {
        id: "hf_20260922_194349_75e53821-0807-4ebc-992d-34bae0ec2ce6",
        title: "Bole Craft Roasters",
        domain: "bolecraft.coffee",
        where: "Portland · Editorial Direct-to-Consumer",
        note: "Sophisticated typography-led e-commerce experience with interactive origin stories and subscription billing.",
        archetype: "Editorial DTC",
        accent: "#fb923c",
      },
      {
        id: "hf_20260922_194417_5a227847-3796-4438-805d-7e66e9538205",
        title: "Caelix Vector Foundry",
        domain: "caelix-type.fr",
        where: "Paris · Variable Typography Studio",
        note: "Bespoke digital typeface showcase with live optical weight sliders, ligature explorers, and specimen exports.",
        archetype: "Variable Typography",
        accent: "#f43f5e",
      },
      {
        id: "hf_20260922_194350_b49aa67e-0401-4029-af4f-f6ac3ee83398",
        title: "Tessera Modular CMS",
        domain: "tesseracms.cloud",
        where: "Chicago · Headless Content Architecture",
        note: "Block-based publishing suite delivering instantaneous preview updates to multi-tenant edge storefronts.",
        archetype: "Headless CMS",
        accent: "#0284c7",
      },
      {
        id: "hf_20260922_194349_89b82779-3a46-4c55-b7c5-f4a0fd955874",
        title: "Novara Biotech Lab",
        domain: "novara-genomics.org",
        where: "Boston · Genomic Sequencing Portal",
        note: "Dense scientific data table layouts optimized for instantaneous molecular queries and protein sequence comparisons.",
        archetype: "Scientific UI",
        accent: "#059669",
      },
      {
        id: "hf_20260922_194417_a455843c-d8db-461c-8ef6-74a325d2472c",
        title: "Adeline Neural Core",
        domain: "tessro.com/adeline",
        where: "Silicon Valley · Autonomous Web Synthesizer",
        note: "Tessro's proprietary design intelligence: parsing prompts, asset moodboards, and design tokens into production code in 15 minutes.",
        archetype: "Neural Engine",
        accent: "#06b6d4",
      },
    ];

    const $ = (id: string) => document.getElementById(id);
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    let R = 320;
    let cw = 150;
    let ch = 100;
    let spin = 0;
    let tilt = -4;
    let camZ = 0;
    let dragX = 0;
    let dragY = 0;
    let velX = 0;
    let velY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let focusedIndex = -1;
    let animFrame = 0;

    const N = SHOTS.length;
    const GA = Math.PI * (3 - Math.sqrt(5));

    const cardElements: HTMLElement[] = [];
    const cardVectors: { x: number; y: number; z: number; lat: number; lon: number }[] = [];

    // Precalculate Fibonacci distribution
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GA;
      const x = Math.cos(theta) * rad;
      const z = Math.sin(theta) * rad;
      const lat = (Math.asin(y) * 180) / Math.PI;
      const lon = (Math.atan2(x, z) * 180) / Math.PI;
      cardVectors.push({ x, y, z, lat, lon });
    }

    // Build Cards in DOM (Synthesized Web Interfaces, not raw photography)
    const orb = $("orb");
    const gridRows = $("gridRows");

    if (orb && orb.children.length === 0) {
      SHOTS.forEach((shot, i) => {
        const card = document.createElement("div");
        card.className = `adeline-card ${shot.tall ? "tall" : ""}`;
        card.setAttribute("data-idx", String(i));

        const fig = document.createElement("figure");
        fig.className = "site-card-fig";
        fig.innerHTML = `
          <div class="sc-browser-bar">
            <div class="sc-dots">
              <span class="sc-dot r"></span>
              <span class="sc-dot y"></span>
              <span class="sc-dot g"></span>
            </div>
            <span class="sc-url">${shot.domain}</span>
          </div>
          <div class="sc-body" style="background: radial-gradient(circle at 50% 0%, ${shot.accent}30, #0a0b10 80%);">
            <div class="sc-header">
              <span class="sc-brand">${shot.title.split(" ")[0]}</span>
              <div class="sc-nav-links"><span></span><span></span><span></span></div>
            </div>
            <div class="sc-hero-content">
              <span class="sc-tag" style="color: ${shot.accent}; border-color: ${shot.accent}50;">${shot.archetype}</span>
              <div class="sc-title">${shot.title}</div>
            </div>
            <div class="sc-bento-grid">
              <div class="sc-bento-card">
                <span class="sc-stat-num">15m</span>
                <span class="sc-stat-lbl">SYNTHESIS</span>
              </div>
              <div class="sc-bento-card">
                <span class="sc-stat-num">100%</span>
                <span class="sc-stat-lbl">RESPONSIVE</span>
              </div>
            </div>
          </div>
          <div class="adeline-card-badge">
            <strong>${shot.title}</strong>
          </div>
        `;
        card.appendChild(fig);
        orb.appendChild(card);
        cardElements.push(card);

        // Grid View Figure
        if (gridRows) {
          const gFig = document.createElement("figure");
          gFig.className = "adeline-grid-item";
          gFig.setAttribute("data-idx", String(i));
          gFig.innerHTML = `
            <div class="sc-browser-bar">
              <div class="sc-dots">
                <span class="sc-dot r"></span>
                <span class="sc-dot y"></span>
                <span class="sc-dot g"></span>
              </div>
              <span class="sc-url">${shot.domain}</span>
            </div>
            <div class="sc-grid-preview" style="background: radial-gradient(circle at 50% 0%, ${shot.accent}25, #08090d 85%);">
              <div class="p-4 flex flex-col justify-between h-full">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold tracking-wider text-white">${shot.title.split(" ")[0]}</span>
                  <span class="text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/20 text-white/70">${shot.archetype}</span>
                </div>
                <div class="my-auto py-3">
                  <div class="text-base font-serif font-medium text-white mb-1">${shot.title}</div>
                  <div class="text-[11px] text-zinc-400 line-clamp-2">${shot.note}</div>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-zinc-400">
                  <span>Adeline 15-min Synthesis</span>
                  <span class="text-cyan-400">Click to Inspect ↗</span>
                </div>
              </div>
            </div>
            <figcaption>
              <strong>${shot.title}</strong>
              <span>${shot.where}</span>
            </figcaption>
          `;
          gridRows.appendChild(gFig);
        }
      });
    }

    function layout() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const hr = w <= 380 ? 0.38 : w <= 640 ? 0.42 : 0.46;
      const wr = w <= 380 ? 0.48 : w <= 640 ? 0.52 : 0.58;
      const floor = w <= 380 ? 108 : w <= 640 ? 120 : 155;
      R = Math.max(floor, Math.min(480, h * hr, w * wr));

      const scale = w <= 380 ? 0.44 : w <= 640 ? 0.46 : 0.47;
      cw = Math.round(Math.max(72, R * scale));
      ch = Math.round(cw / 1.5);

      const persp = w <= 380 ? 620 : w <= 640 ? 760 : w <= 900 ? 920 : 1150;
      document.documentElement.style.setProperty("--persp", `${persp}px`);
      document.documentElement.style.setProperty("--cw", `${cw}px`);
      document.documentElement.style.setProperty("--ch", `${ch}px`);

      cardElements.forEach((card, i) => {
        const v = cardVectors[i];
        card.style.width = `${cw}px`;
        card.style.height = SHOTS[i].tall ? `${cw * 1.25}px` : `${ch}px`;
        card.style.marginLeft = `${-cw / 2}px`;
        card.style.marginTop = SHOTS[i].tall ? `${cw * -0.625}px` : `${-ch / 2}px`;
        card.style.transform = `translate3d(${v.x * R}px, ${-v.y * R}px, ${v.z * R}px) rotateY(${v.lon}deg) rotateX(${v.lat}deg)`;
      });
    }

    layout();
    window.addEventListener("resize", layout);

    // Camera Render Loop
    const world = $("world");
    const headline = $("headline");
    const headlineSpans = headline?.querySelectorAll(".inner span") || [];

    function tick() {
      if (!isDragging && focusedIndex === -1) {
        dragX += velX;
        dragY += velY;
        velX *= 0.94;
        velY *= 0.94;
        if (Math.abs(velX) < 0.002) velX = 0;
        if (Math.abs(velY) < 0.002) velY = 0;
      }

      dragY = clamp(dragY, -32 - tilt, 32 - tilt);

      const sx = tilt + dragY;
      const sy = spin + dragX;

      const p = clamp(window.scrollY / (window.innerHeight * 0.16), 0, 1);
      const camZTarget = p * Math.min(64, R * 0.12);
      camZ += (camZTarget - camZ) * 0.075;

      if (world) {
        world.style.transform = `translateZ(${camZ}px) rotateY(${sy}deg) rotateX(${sx}deg)`;
      }

      if (headline) {
        headline.style.transform = `rotateX(${-sx}deg) rotateY(${-sy}deg) translateZ(${R * 0.62}px)`;
        headline.style.opacity = String(Math.max(0, 1 - p * 0.55));
      }

      // Depth shading for 3D cards
      const radY = (sy * Math.PI) / 180;
      const radX = (sx * Math.PI) / 180;
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);

      cardElements.forEach((card, i) => {
        const v = cardVectors[i];
        // Rotate unit vector
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;
        const y2 = v.y * cosX - z1 * sinX;
        const zf = v.y * sinX + z1 * cosX;

        const base = 0.14 + 0.86 * Math.pow((zf + 1) / 2, 0.85);
        const shade = 1 - Math.min(1, p * 1.6);
        const dim = shade * (1 - base);
        card.style.setProperty("--d", String(dim));
        card.style.opacity = String(focusedIndex === i ? 0 : 1);
      });

      animFrame = requestAnimationFrame(tick);
    }

    tick();

    // Drag Interaction on Stage
    const stage = $("stage");
    let startX = 0;
    let startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (focusedIndex !== -1) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      stage?.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      velX = dx * 0.13;
      velY = -dy * 0.13;
      dragX += velX;
      dragY += velY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        stage?.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    stage?.addEventListener("pointerdown", onPointerDown);
    stage?.addEventListener("pointermove", onPointerMove);
    stage?.addEventListener("pointerup", onPointerUp);
    stage?.addEventListener("pointercancel", onPointerUp);

    // Lightbox / Card Click (Showcase with full browser window)
    const lit = $("lit");
    const litTitle = $("litTitle");
    const litWhere = $("litWhere");
    const litNote = $("litNote");
    const litDomain = $("litDomain");
    const litExternalLink = $("litExternalLink") as HTMLAnchorElement;
    const litMockViewport = $("litMockViewport");

    function openLightbox(idx: number) {
      if (idx < 0 || idx >= SHOTS.length) return;
      focusedIndex = idx;
      const shot = SHOTS[idx];
      if (litTitle) litTitle.textContent = shot.title;
      if (litWhere) litWhere.textContent = `${shot.where} · ${shot.archetype}`;
      if (litNote) litNote.textContent = shot.note;
      if (litDomain) litDomain.textContent = `https://${shot.domain}`;

      if (litExternalLink) {
        if (shot.url) {
          litExternalLink.style.display = "inline-flex";
          litExternalLink.href = shot.url;
        } else {
          litExternalLink.style.display = "none";
        }
      }

      if (litMockViewport) {
        litMockViewport.innerHTML = `
          <div class="lit-mock-site" style="background: radial-gradient(circle at 50% 0%, ${shot.accent}25, #08090d 85%);">
            <div class="lit-mock-header">
              <span class="lit-mock-logo">${shot.title.split(" ")[0]}</span>
              <div class="lit-mock-nav-links">
                <span>Overview</span>
                <span>Features</span>
                <span>Telemetry</span>
                <span>Pricing</span>
              </div>
              <span class="lit-mock-status" style="color:${shot.accent}; border-color:${shot.accent}50;">● Live Preview</span>
            </div>
            <div class="lit-mock-hero-box">
              <div class="lit-mock-badge" style="color:${shot.accent}; border-color:${shot.accent}40;">${shot.archetype}</div>
              <div class="lit-mock-h1">${shot.title}</div>
              <div class="lit-mock-sub">${shot.where}</div>
              <div class="lit-mock-cta-row">
                <span class="lit-btn-primary" style="background:${shot.accent}">Explore System</span>
                <span class="lit-btn-secondary">View Tokens</span>
              </div>
            </div>
            <div class="lit-mock-bento-grid">
              <div class="lit-bento-card">
                <span class="text-[10px] text-zinc-400 font-mono tracking-wider">SYNTHESIS TIME</span>
                <span class="text-base font-bold text-white font-mono">15 Minutes</span>
              </div>
              <div class="lit-bento-card">
                <span class="text-[10px] text-zinc-400 font-mono tracking-wider">NEURAL MODEL</span>
                <span class="text-base font-bold text-white font-mono">Adeline Core</span>
              </div>
              <div class="lit-bento-card">
                <span class="text-[10px] text-zinc-400 font-mono tracking-wider">ASSET STORAGE</span>
                <span class="text-base font-bold text-white font-mono">1TB Cloud CDN</span>
              </div>
            </div>
          </div>
        `;
      }
      document.body.classList.add("lit");
    }

    function closeLightbox() {
      focusedIndex = -1;
      document.body.classList.remove("lit");
    }

    $("closeLit")?.addEventListener("click", closeLightbox);
    $("litScrim")?.addEventListener("click", closeLightbox);

    cardElements.forEach((card, i) => {
      card.addEventListener("click", (e) => {
        // Only trigger click if movement was negligible
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist < 10) {
          openLightbox(i);
        }
      });
    });

    // Grid View Toggle
    $("gridBtn")?.addEventListener("click", () => {
      document.body.classList.toggle("gridview");
    });

    document.querySelectorAll(".adeline-grid-item").forEach((item) => {
      item.addEventListener("click", () => {
        const idx = Number(item.getAttribute("data-idx"));
        openLightbox(idx);
      });
    });

    // Fullscreen Menu Toggle
    const menuBtn = $("menuBtn");
    const closeMenuBtn = $("closeMenuBtn");
    menuBtn?.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
    closeMenuBtn?.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
    });

    // Splash Screen & Intro Video sequence
    const splash = $("splash");
    const intro = $("intro");
    const film = $("film") as HTMLVideoElement;
    const skipBtn = $("skip");

    const revealArchive = () => {
      intro?.classList.add("gone");
      document.body.classList.remove("locked");
      document.body.classList.add("revealed");
      setTimeout(() => {
        intro?.remove();
      }, 700);
    };

    skipBtn?.addEventListener("click", revealArchive);

    if (film) {
      film.playbackRate = 2;
      film.addEventListener("ended", revealArchive);
    }

    // Auto progress splash with exact Tessro wordmark
    const splashBar = $("splashBar");
    if (splashBar) {
      setTimeout(() => {
        splashBar.style.width = "100%";
      }, 50);
    }

    setTimeout(() => {
      splash?.classList.add("out");
      setTimeout(() => splash?.remove(), 850);
      if (film) {
        film.play().catch(() => {});
      }
    }, 1250);

    // Escape listener
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (document.body.classList.contains("lit")) closeLightbox();
        else if (document.body.classList.contains("menu-open")) document.body.classList.remove("menu-open");
        else if (document.body.classList.contains("gridview")) document.body.classList.remove("gridview");
      }
    });

    return () => {
      window.removeEventListener("resize", layout);
      cancelAnimationFrame(animFrame);
      stage?.removeEventListener("pointerdown", onPointerDown);
      stage?.removeEventListener("pointermove", onPointerMove);
      stage?.removeEventListener("pointerup", onPointerUp);
      stage?.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="adeline-scope">
      <style jsx global>{`
        :root {
          --bg: #000;
          --ink: #f4f2ef;
          --dim: #8c8783;
          --line: rgba(244, 242, 239, 0.28);
          --pad: clamp(14px, 2.6vw, 34px);
          --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
          --hw: min(56vw, 640px);
          --persp: 1150px;
          --tap: 44px;
        }

        .adeline-scope {
          background-color: #000000;
          color: #f4f2ef;
          font-family: "Inter", -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* 3D Fibonacci Stage */
        #stage {
          position: fixed;
          inset: 0;
          z-index: 10;
          perspective: var(--persp);
          perspective-origin: 50% 50%;
          overflow: hidden;
          touch-action: none;
        }

        #world {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          will-change: transform;
        }

        #orb {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          opacity: 1;
        }

        /* Centered Headline with Button inside 3D Center */
        #headline {
          position: absolute;
          top: 0;
          left: 0;
          width: var(--hw);
          margin-left: calc(var(--hw) / -2);
          text-align: center;
          font-family: "Playfair Display", "Times New Roman", serif;
          font-weight: 400;
          font-size: clamp(24px, 3.6vw, 50px);
          line-height: 1.1;
          letter-spacing: -0.005em;
          color: #fff;
          text-shadow: 0 2px 34px rgba(0, 0, 0, 0.7);
          pointer-events: none;
          user-select: none;
        }

        #headline .inner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .adeline-start-btn {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 999px;
          background: #ffffff;
          color: #000000;
          font-family: "Inter", sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-decoration: none;
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.4), 0 0 50px rgba(56, 189, 248, 0.2);
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .adeline-start-btn:hover {
          transform: scale(1.05) translateY(-2px);
          background: #e4e4e7;
        }

        /* 3D Fibonacci Cards: Synthesized Web Interfaces */
        .adeline-card {
          position: absolute;
          top: 0;
          left: 0;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.4s ease;
        }
        .site-card-fig {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 6px;
          overflow: hidden;
          background: #0a0a0f;
          margin: 0;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
        }
        .sc-browser-bar {
          height: 16px;
          background: #14151d;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 6px;
          flex-shrink: 0;
        }
        .sc-dots {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .sc-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
        }
        .sc-dot.r { background: #ef4444; }
        .sc-dot.y { background: #eab308; }
        .sc-dot.g { background: #22c55e; }
        .sc-url {
          font-family: monospace;
          font-size: 7.5px;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sc-body {
          flex: 1;
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .sc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sc-brand {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 700;
          font-size: 8.5px;
          letter-spacing: 0.1em;
          color: #fff;
        }
        .sc-nav-links {
          display: flex;
          gap: 3px;
        }
        .sc-nav-links span {
          width: 8px;
          height: 2px;
          border-radius: 1px;
          background: rgba(255, 255, 255, 0.3);
        }
        .sc-hero-content {
          margin: auto 0;
        }
        .sc-tag {
          display: inline-block;
          font-size: 6.5px;
          font-family: monospace;
          font-weight: 600;
          text-transform: uppercase;
          padding: 1px 4px;
          border-radius: 3px;
          border: 1px solid;
          margin-bottom: 2px;
        }
        .sc-title {
          font-family: "Playfair Display", serif;
          font-size: 9.5px;
          line-height: 1.1;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sc-bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          padding-top: 4px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sc-bento-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          padding: 2px 4px;
          display: flex;
          flex-direction: column;
        }
        .sc-stat-num {
          font-size: 7.5px;
          font-family: monospace;
          font-weight: 700;
          color: #fff;
        }
        .sc-stat-lbl {
          font-size: 5px;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.45);
        }
        .site-card-fig::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, var(--d, 0));
          pointer-events: none;
        }
        .adeline-card-badge {
          display: none;
        }

        /* Radial Vignette */
        .adeline-vig {
          position: fixed;
          inset: 0;
          z-index: 12;
          pointer-events: none;
          background: radial-gradient(ellipse 88% 92% at 50% 50%, transparent 48%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.8) 100%);
        }

        /* Header Bar */
        .adeline-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: calc(var(--pad) * 0.8) var(--pad);
        }
        .adeline-brand {
          display: flex;
          align-items: baseline;
          gap: 8px;
          text-decoration: none;
          color: #ffffff;
        }
        .adeline-brand span.name {
          font-family: "Playfair Display", serif;
          font-size: clamp(20px, 2.2vw, 26px);
          letter-spacing: 0.02em;
        }
        .adeline-brand span.by {
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #38bdf8;
          text-transform: uppercase;
        }

        /* Menu Button */
        .adeline-nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .adeline-back-link {
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .adeline-back-link:hover {
          color: #fff;
        }

        /* Grid View Button */
        .adeline-grid-btn {
          position: fixed;
          left: var(--pad);
          bottom: var(--pad);
          z-index: 56;
          width: 44px;
          height: 44px;
          padding: 10px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: transform 0.2s, background 0.2s;
        }
        .adeline-grid-btn:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.2);
        }
        .adeline-grid-btn span {
          background: #ffffff;
          border-radius: 1px;
        }

        /* Scroll Cue */
        .adeline-cue {
          position: fixed;
          left: 50%;
          bottom: calc(var(--pad) + 8px);
          transform: translateX(-50%);
          z-index: 54;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          font-family: monospace;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(244, 242, 239, 0.5);
          pointer-events: none;
        }

        /* Flat Grid Overlay */
        #grid {
          position: fixed;
          inset: 0;
          z-index: 20;
          background: #000;
          overflow-y: auto;
          padding: calc(var(--pad) * 3) var(--pad) calc(var(--pad) * 4);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        body.gridview #grid {
          opacity: 1;
          pointer-events: auto;
        }
        body.gridview #stage {
          opacity: 0;
          pointer-events: none;
        }
        .adeline-grid-rows {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: clamp(14px, 2vw, 24px);
          max-width: 1680px;
          margin: 0 auto;
        }
        .adeline-grid-item {
          position: relative;
          aspect-ratio: 3/2;
          border-radius: 8px;
          overflow: hidden;
          background: #0b0b10;
          border: 1px solid rgba(255, 255, 255, 0.12);
          cursor: pointer;
          margin: 0;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .adeline-grid-item:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .sc-grid-preview {
          flex: 1;
          overflow: hidden;
        }
        .adeline-grid-item figcaption {
          position: absolute;
          inset: auto 0 0 0;
          padding: 24px 14px 12px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.95));
          display: flex;
          flex-direction: column;
          gap: 2px;
          pointer-events: none;
        }
        .adeline-grid-item figcaption strong {
          font-family: "Playfair Display", serif;
          font-size: 15px;
          color: #fff;
        }
        .adeline-grid-item figcaption span {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Browser Window Lightbox Modal */
        #lit {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: clamp(20px, 4vh, 48px) var(--pad);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        body.lit #lit {
          opacity: 1;
          pointer-events: auto;
        }
        .lit-scrim {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(20px);
        }
        .lit-plate {
          position: relative;
          z-index: 10;
          width: min(90vw, 980px);
          max-width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lit-shot-window {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #090a0f;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.1);
          display: flex;
          flex-direction: column;
        }
        .lit-browser-topbar {
          height: 38px;
          background: #12131a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
        }
        .lit-window-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .w-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        .w-dot.red { background: #ef4444; }
        .w-dot.yellow { background: #eab308; }
        .w-dot.green { background: #22c55e; }
        .lit-address-bar {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          padding: 4px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
        }
        .lit-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lit-visit-btn {
          font-family: monospace;
          font-size: 11px;
          color: #38bdf8;
          text-decoration: none;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 4px 10px;
          border-radius: 999px;
          transition: all 0.2s;
        }
        .lit-visit-btn:hover {
          background: rgba(56, 189, 248, 0.24);
        }
        .lit-close-btn {
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .lit-close-btn:hover {
          background: rgba(255, 255, 255, 0.18);
        }
        .lit-browser-content {
          position: relative;
          min-height: clamp(260px, 44vh, 460px);
          display: flex;
          flex-direction: column;
        }
        .lit-mock-site {
          flex: 1;
          padding: clamp(20px, 3.5vw, 36px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .lit-mock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .lit-mock-logo {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 700;
          font-size: clamp(14px, 1.6vw, 18px);
          letter-spacing: 0.12em;
          color: #fff;
        }
        .lit-mock-nav-links {
          display: flex;
          gap: 16px;
          font-size: 11px;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.6);
        }
        .lit-mock-status {
          font-size: 10px;
          font-family: monospace;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid;
        }
        .lit-mock-hero-box {
          margin: clamp(16px, 3vh, 32px) 0;
        }
        .lit-mock-badge {
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .lit-mock-h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(22px, 3.2vw, 38px);
          color: #fff;
          margin-bottom: 6px;
        }
        .lit-mock-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 16px;
        }
        .lit-mock-cta-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lit-btn-primary {
          padding: 8px 18px;
          border-radius: 999px;
          color: #000;
          font-size: 11.5px;
          font-weight: 600;
        }
        .lit-btn-secondary {
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 11.5px;
        }
        .lit-mock-bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .lit-bento-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .lit-meta {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 24px;
          padding-top: 4px;
        }
        .lit-meta h2 {
          font-family: "Playfair Display", serif;
          font-size: clamp(20px, 2vw, 26px);
          margin-bottom: 4px;
        }
        .lit-meta .where {
          font-size: 12px;
          font-family: monospace;
          color: #38bdf8;
        }
        .lit-meta .note {
          font-size: 13.5px;
          line-height: 1.6;
          color: rgba(244, 242, 239, 0.85);
        }

        /* Splash Screen: 1-to-1 Match with Tessro Text Wordmark Image */
        #splash {
          position: fixed;
          inset: 0;
          z-index: 300;
          background: #000000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 1;
          transition: opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1);
        }
        #splash.out {
          opacity: 0;
          pointer-events: none;
        }
        .splash-wordmark {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: clamp(30px, 4.8vw, 54px);
          font-weight: 300;
          letter-spacing: 0.45em;
          color: #ffffff;
          animation: splashFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .splash-meta-left {
          position: absolute;
          bottom: clamp(24px, 4vh, 40px);
          left: clamp(24px, 4vw, 48px);
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.28em;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
        }
        .splash-meta-right {
          position: absolute;
          bottom: clamp(24px, 4vh, 40px);
          right: clamp(24px, 4vw, 48px);
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.28em;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
        }
        .splash-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.05);
        }
        .splash-progress-bar {
          height: 100%;
          width: 0%;
          background: #ffffff;
          transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes splashFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Intro Film */
        #intro {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: #000;
          display: grid;
          place-items: center;
          overflow: hidden;
          transition: opacity 0.5s linear;
        }
        #intro.gone {
          opacity: 0;
          pointer-events: none;
        }
        #film {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        #skip {
          position: absolute;
          right: var(--pad);
          bottom: var(--pad);
          font-size: 11px;
          font-family: monospace;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(244, 242, 239, 0.8);
          padding: 10px 20px;
          border: 1px solid rgba(254, 242, 239, 0.3);
          border-radius: 999px;
          backdrop-filter: blur(8px);
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .lit-meta {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>

      {/* 1. Splash Screen: Pure Text TESSRO Wordmark from Image */}
      <div id="splash">
        <div className="splash-center">
          <div className="splash-wordmark">T E S S R O</div>
        </div>
        <div className="splash-meta-left">TESSRO &bull; STUDIO</div>
        <div className="splash-meta-right">16:9 WORDMARK</div>
        <div className="splash-progress">
          <div id="splashBar" className="splash-progress-bar"></div>
        </div>
      </div>

      {/* 2. Intro Film with Skip */}
      <div id="intro">
        <video
          id="film"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260922_195107_ed3f055a-3a13-4a71-b743-e10310454246.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
        ></video>
        <button id="skip" aria-label="Skip intro video">
          SKIP INTRO →
        </button>
      </div>

      {/* 3. Header Bar with Adeline by Tessro Logo */}
      <header className="adeline-header">
        <Link href="/" className="adeline-brand">
          <span className="name">Adeline</span>
          <span className="by">BY TESSRO</span>
        </Link>

        <div className="adeline-nav-actions">
          <Link href="/" className="adeline-back-link">
            ← Back to Home
          </Link>
          <Link
            href="/auth"
            className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold font-mono tracking-wider hover:bg-zinc-200 transition"
          >
            START NOW
          </Link>
        </div>
      </header>

      {/* 4. Radial Vignette */}
      <div className="adeline-vig"></div>

      {/* 5. 3D Fibonacci Sphere Stage */}
      <div id="stage">
        <div id="world">
          <div id="orb"></div>

          {/* Centered Headline with "Start Now" Button in Middle */}
          <h1 id="headline">
            <span className="inner">
              <span className="text-sm font-mono tracking-[0.25em] text-cyan-400 uppercase">
                TESSRO NEURAL DESIGN ENGINE
              </span>
              <span>Architected By Adeline</span>
              <Link
                href="/auth"
                className="adeline-start-btn"
              >
                Start Now <span>→</span>
              </Link>
            </span>
          </h1>
        </div>
      </div>

      {/* 6. Scroll / Drag Rotate Cue */}
      <div className="adeline-cue">
        <span>DRAG TO ROTATE SPHERE • 21 NEURAL SITES</span>
      </div>

      {/* 7. Grid Toggle Button (Bottom-Left) */}
      <button id="gridBtn" className="adeline-grid-btn" title="Toggle 2D Grid View">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* 8. Flat Grid View Overlay */}
      <div id="grid">
        <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-white">Adeline Synthesis Archive</h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">21 Production Websites Generated in 15 Minutes</p>
          </div>
          <button
            onClick={() => document.body.classList.remove("gridview")}
            className="px-4 py-2 rounded-full border border-white/20 text-xs font-mono hover:bg-white/10"
          >
            ← 3D Sphere View
          </button>
        </div>
        <div id="gridRows" className="adeline-grid-rows"></div>
      </div>

      {/* 9. Lightbox Showcase (Full Browser Window) */}
      <div id="lit">
        <div id="litScrim" className="lit-scrim"></div>
        <div className="lit-plate">
          <div className="lit-shot-window">
            <div className="lit-browser-topbar">
              <div className="lit-window-dots">
                <span className="w-dot red"></span>
                <span className="w-dot yellow"></span>
                <span className="w-dot green"></span>
              </div>
              <div className="lit-address-bar">
                <span>🔒</span>
                <span id="litDomain">https://avexssft.vercel.app</span>
              </div>
              <div className="lit-top-actions">
                <a
                  id="litExternalLink"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lit-visit-btn"
                  style={{ display: "none" }}
                >
                  Live Site ↗
                </a>
                <button id="closeLit" className="lit-close-btn">
                  Close ✕
                </button>
              </div>
            </div>
            <div className="lit-browser-content">
              <div id="litMockViewport"></div>
            </div>
          </div>
          <div className="lit-meta">
            <div>
              <h2 id="litTitle">Website Title</h2>
              <div id="litWhere" className="where">
                Archetype / Category
              </div>
            </div>
            <p id="litNote" className="note">
              Description and notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
