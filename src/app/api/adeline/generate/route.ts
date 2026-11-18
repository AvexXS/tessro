import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

/**
 * Adeline — Elite Autonomous 3D WebGL Website Architecture Engine
 * Powered by Google Gemini (gemini-3.7-flash) with dynamic Three.js & GSAP synthesis.
 */
export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    const { prompt, archetype = "Obsidian 3D Sphere", title, modelTier = "gemini-3.1-flash-lite" } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required for synthesis" }, { status: 400 });
    }

    const userId = session?.id || "usr_client_01";
    const projectTitle = title || prompt.slice(0, 36).trim();

    let html = "";
    let css = "";
    let aiEngineUsed = "algorithmic_3d_fallback";

    // 1. Live Google Gemini 3.7 Flash Neural Generation
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemPrompt = `You are Adeline, the world-class autonomous 3D WebGL and spatial website architecture AI at Tessro digital studio ($29.99 flat autonomous builder).
Your mission is to generate a breathtaking, ultra-premium, production-ready, fully responsive single-page website with REAL INTERACTIVE THREE.JS 3D WEBGL GRAPHICS matching the luxury aesthetic of Tessro and Kai Renn.

CRITICAL DESIGN & ENGINEERING SPECIFICATIONS:
1. Visual Aesthetic:
   - Deep Obsidian Dark Mode: background color #0c0c0d (canvas clearColor 0x0c0c0d).
   - Monochromatic precision with luminous accents (silver, cyan, amber, or gold highlights).
   - Fonts: Load Google Fonts 'Newsreader' (italics, serif) and 'Geist' or 'Inter' (sans).
   - Frosted Glass: rgba(28,28,30,0.65), 1px border rgba(255,255,255,0.08), backdrop-filter blur(16px).
   - Typography: Hero headlines with oversized serif italics and tight tracking sans uppercase labels.

2. Mandatory 3D WebGL Interactive Architecture (Three.js):
   - Include Three.js: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
   - Include GSAP: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
   - Include Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
   - In a <canvas id="webgl-canvas"></canvas> fixed in the background (or hero container):
     * Set up Scene, PerspectiveCamera, and WebGLRenderer with antialias: true, alpha: true.
     * Implement an interactive 3D scene fitting the archetype '${archetype}':
       - If 'Obsidian 3D Sphere': 40+ interactive floating cards/cubes arranged in a Fibonacci spiral sphere orbiting a central glowing pulsating core. Mouse pointer smoothly rotates and tilts the sphere with inertia.
       - If 'Chrome Floating Monolith / Torus': A metallic reflective TorusKnot or organic metallic sculpture (MeshStandardMaterial with metalness: 0.95, roughness: 0.15) floating, revolving, and reacting to mouse cursor coordinates.
       - If 'Quantum Particle Vortex': 5,000+ glowing particles (PointsMaterial with additive blending) moving in mathematical wave equations, swirling toward cursor on mousemove.
       - If 'Refractive 3D Glass Bento': 3D glass tiles floating in perspective with dynamic point lights following the cursor.
     * Full requestAnimationFrame render loop with smooth mouse damping (lerp).
     * Responsive window resize listener updating camera aspect ratio and renderer size.

3. DOM UI Structure (Overlaying the 3D Canvas):
   - Floating frosted dock navbar fixed at the bottom or top with brand wordmark, tab navigation, and action buttons.
   - Hero section with editorial serif headline, live badge, and dual CTA buttons.
   - Interactive Bento Grid showcase with telemetry metrics, hover depth, and glass cards.
   - Live interactive component (e.g. 3D view toggle, tabbed preview, or live metrics counter).
   - High-end footer with copyright and system telemetry.

4. Output Format:
   - Output MUST be valid, standalone HTML5 starting with <!DOCTYPE html> and closing with </html>.
   - Do NOT wrap in markdown codeblocks (no \`\`\`html or \`\`\`). Return ONLY the raw HTML string.
   - Ensure all JavaScript runs after DOMContentLoaded without any syntax errors.`;

        const modelsToTry = Array.from(new Set([modelTier, "gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-3.7-flash", "gemini-3.8-flash"]));
        let lastError = null;

        for (const candidateModel of modelsToTry) {
          try {
            const response = await ai.models.generateContent({
              model: candidateModel,
              contents: `Synthesize a luxury 3D WebGL website for: "${prompt}". Archetype: "${archetype}". Title: "${projectTitle}". Incorporate real Three.js 3D canvas and GSAP animations.`,
              config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
              },
            });

            const rawText = response.text?.trim() || "";
            const cleanedHtml = rawText
              .replace(/^```html\s*/i, "")
              .replace(/^```\s*/i, "")
              .replace(/```$/i, "")
              .trim();

            if (cleanedHtml.includes("<html") && cleanedHtml.includes("three")) {
              html = cleanedHtml;
              css = "/* Built autonomously by Adeline via Neural 3D Three.js Synthesis */";
              aiEngineUsed = `Gemini Neural 3D Engine (${candidateModel})`;
              break;
            }
          } catch (modelErr) {
            lastError = modelErr;
            console.warn(`[Adeline 3D] Failed on ${candidateModel}, trying next...`, modelErr);
          }
        }

        if (!html && lastError) {
          console.error("[Adeline 3D] All Gemini model attempts failed, engaging 3D procedural master synthesizer:", lastError);
        }
      } catch (geminiInitErr) {
        console.warn("[Adeline 3D] Gemini initialization failed:", geminiInitErr);
      }
    }

    // 2. High-Fidelity 3D Procedural Synthesizer (Zero-latency fallback matching Tessro quality)
    if (!html) {
      html = generate3DProceduralSite(archetype, prompt, projectTitle);
      css = "/* Built autonomously by Adeline 3D Procedural Engine */";
      aiEngineUsed = "Adeline 3D Procedural WebGL Engine";
    }

    const project = await db.projects.create({
      user_id: userId,
      title: projectTitle,
      archetype,
      prompt: prompt.trim(),
      html_code: html,
      css_code: css,
      status: "completed",
      preview_url: `/preview/${Date.now()}`,
    });

    await db.logs.log(
      "ADELINE_3D_SYNTHESIS",
      `Synthesized 3D project ${project.id} [${aiEngineUsed}] archetype '${archetype}'`,
      userId
    );

    return NextResponse.json({
      success: true,
      project,
      aiEngineUsed,
    });
  } catch (error: any) {
    console.error("[Adeline 3D Synthesis Error]:", error);
    return NextResponse.json({ error: error?.message || "Synthesis failed" }, { status: 500 });
  }
}

/**
 * Generates an ultra-luxurious, production-grade 3D WebGL website with Three.js & GSAP
 */
function generate3DProceduralSite(archetype: string, prompt: string, title: string): string {
  const isSphere = archetype.toLowerCase().includes("sphere");
  const isParticles = archetype.toLowerCase().includes("particle");

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Synthesized by Adeline</title>
  <!-- Three.js & GSAP -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Newsreader & Geist -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0c0c0d;
      --ink: #ededeb;
      --mute: #8a8a88;
      --line: rgba(255, 255, 255, 0.08);
      --glass: rgba(22, 22, 24, 0.65);
    }
    body {
      background-color: var(--bg);
      color: var(--ink);
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow-x: hidden;
    }
    .font-serif-italic {
      font-family: 'Newsreader', serif;
      font-style: italic;
    }
    .glass-panel {
      background: var(--glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--line);
    }
    .glass-dock {
      background: rgba(28, 28, 30, 0.75);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }
    #webgl-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: auto;
    }
    .content-layer {
      position: relative;
      z-index: 10;
      pointer-events: none;
    }
    .interactive {
      pointer-events: auto;
    }
  </style>
</head>
<body class="min-h-screen selection:bg-white selection:text-black">

  <!-- Interactive 3D WebGL Canvas -->
  <canvas id="webgl-canvas"></canvas>

  <!-- Content Layer -->
  <div class="content-layer min-h-screen flex flex-col justify-between p-6 md:p-12">
    
    <!-- Top Bar -->
    <header class="w-full max-w-7xl mx-auto flex items-center justify-between interactive">
      <div class="flex items-center gap-3">
        <span class="font-mono text-xs uppercase tracking-[0.3em] font-semibold text-white">TESSRO // ADELINE</span>
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-[10px] font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline-block">Spatial 3D Engine</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-[11px] font-mono text-neutral-400 px-3 py-1 rounded-full border border-white/10 bg-black/40">
          60 FPS · WebGL 2.0
        </div>
        <button onclick="resetCamera()" class="text-xs font-mono px-3 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors font-medium">
          Center Scene
        </button>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="w-full max-w-5xl mx-auto my-auto text-center py-20 pointer-events-none">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 interactive">
        <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
        <span class="text-xs font-mono uppercase tracking-widest text-neutral-300">${archetype}</span>
      </div>

      <h1 class="text-5xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 font-serif-italic font-normal">
        ${title}
      </h1>

      <p class="max-w-2xl mx-auto text-sm md:text-base text-neutral-400 font-light leading-relaxed mb-10">
        ${prompt}. Sculpted with autonomous spatial geometry, specular lighting dispersion, and responsive WebGL interaction.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-4 interactive">
        <button class="px-6 py-3 rounded-full bg-white text-black text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-200 transition-all shadow-lg hover:scale-105">
          Explore Architecture
        </button>
        <button onclick="toggleWireframe()" class="px-6 py-3 rounded-full border border-white/15 bg-black/40 backdrop-blur-lg text-white text-xs font-mono uppercase tracking-wider hover:bg-white/10 transition-all">
          Toggle Wireframe
        </button>
      </div>
    </main>

    <!-- Telemetry Cards Grid -->
    <section class="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 interactive">
      <div class="glass-panel p-6 rounded-2xl hover:border-white/20 transition-all group">
        <div class="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Spatial Geometry</div>
        <div class="text-xl font-medium text-white mb-1">Algorithmic Fibonacci</div>
        <p class="text-xs text-neutral-400 font-light leading-relaxed">Multi-threaded vertex displacement calculating 3D orbit trajectories in real time.</p>
      </div>

      <div class="glass-panel p-6 rounded-2xl hover:border-white/20 transition-all group">
        <div class="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Photonic Shaders</div>
        <div class="text-xl font-medium text-white mb-1">Specular Dispersion</div>
        <p class="text-xs text-neutral-400 font-light leading-relaxed">Dynamic PBR materials reacting to simulated laboratory environmental lighting.</p>
      </div>

      <div class="glass-panel p-6 rounded-2xl hover:border-white/20 transition-all group">
        <div class="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Sub-Pixel Fluidity</div>
        <div class="text-xl font-medium text-white mb-1">Inertial Damping</div>
        <p class="text-xs text-neutral-400 font-light leading-relaxed">Smooth lerp quaternion interpolation eliminating frame jitter on 120Hz displays.</p>
      </div>
    </section>

    <!-- Floating Dock Navbar (Tessro / Kai Renn Style) -->
    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 glass-dock px-3 py-2 rounded-2xl flex items-center gap-2 z-50 interactive">
      <span class="text-xs font-mono font-semibold tracking-wider px-3 py-1 text-white border-r border-white/10">KR.ST</span>
      <button onclick="setMode('rotate')" class="text-xs font-mono px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors">Orbit</button>
      <button onclick="setMode('pulse')" class="text-xs font-mono px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors">Pulse</button>
      <button onclick="setMode('scatter')" class="text-xs font-mono px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors">Disperse</button>
      <div class="w-1 h-1 rounded-full bg-cyan-400"></div>
    </nav>

  </div>

  <!-- Three.js 3D WebGL Implementation -->
  <script>
    let scene, camera, renderer, mainGroup;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let elements = [];
    let isWireframe = false;

    function initWebGL() {
      const canvas = document.getElementById('webgl-canvas');
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0c0c0d, 0.025);

      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 24;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x0c0c0d, 1);

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight1.position.set(10, 20, 15);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.5);
      dirLight2.position.set(-15, -10, -10);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xffffff, 2, 40);
      pointLight.position.set(0, 0, 5);
      scene.add(pointLight);

      mainGroup = new THREE.Group();
      scene.add(mainGroup);

      ${
        isParticles
          ? `// Particle Geometry
        const count = 4000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 35;
          positions[i + 1] = (Math.random() - 0.5) * 35;
          positions[i + 2] = (Math.random() - 0.5) * 35;

          colors[i] = 0.8 + Math.random() * 0.2;
          colors[i + 1] = 0.9 + Math.random() * 0.1;
          colors[i + 2] = 1.0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const pMaterial = new THREE.PointsMaterial({
          size: 0.12,
          vertexColors: true,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, pMaterial);
        mainGroup.add(particles);
        elements.push(particles);`
          : isSphere
          ? `// Fibonacci Obsidian Sphere Geometry
        const cardCount = 42;
        const radius = 10;
        const phi = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < cardCount; i++) {
          const y = 1 - (i / (cardCount - 1)) * 2;
          const r = Math.sqrt(1 - y * y);
          const theta = phi * i;

          const x = Math.cos(theta) * r;
          const z = Math.sin(theta) * r;

          const geom = new THREE.BoxGeometry(2.4, 1.4, 0.08);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x18181b,
            metalness: 0.85,
            roughness: 0.2,
            wireframe: false
          });

          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(x * radius, y * radius, z * radius);
          mesh.lookAt(0, 0, 0);
          mesh.userData = { originalPos: mesh.position.clone(), speed: 0.002 + Math.random() * 0.004 };

          mainGroup.add(mesh);
          elements.push(mesh);
        }

        // Central Pulsing Nucleus
        const coreGeom = new THREE.IcosahedronGeometry(2.8, 4);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x09090b,
          metalness: 0.95,
          roughness: 0.1,
          wireframe: true
        });
        const core = new THREE.Mesh(coreGeom, coreMat);
        mainGroup.add(core);
        elements.push(core);`
          : `// Metallic Chrome Torus Knot
        const geom = new THREE.TorusKnotGeometry(5, 1.4, 140, 24, 2, 3);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xededeb,
          metalness: 0.95,
          roughness: 0.15,
          wireframe: false
        });
        const mesh = new THREE.Mesh(geom, mat);
        mainGroup.add(mesh);
        elements.push(mesh);

        // Orbiting Ring
        const ringGeom = new THREE.TorusGeometry(8.5, 0.08, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 3;
        mainGroup.add(ring);
        elements.push(ring);`
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onResize);

      animate();
    }

    function onMouseMove(e) {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function toggleWireframe() {
      isWireframe = !isWireframe;
      elements.forEach(el => {
        if (el.material) el.material.wireframe = isWireframe;
      });
    }

    function resetCamera() {
      gsap.to(camera.position, { x: 0, y: 0, z: 24, duration: 1.2, ease: "power3.out" });
      gsap.to(mainGroup.rotation, { x: 0, y: 0, duration: 1.2, ease: "power3.out" });
    }

    function setMode(mode) {
      if (mode === 'rotate') {
        gsap.to(mainGroup.rotation, { y: mainGroup.rotation.y + Math.PI * 2, duration: 2, ease: "expo.out" });
      } else if (mode === 'pulse') {
        gsap.to(mainGroup.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.inOut" });
      } else if (mode === 'scatter') {
        elements.forEach(el => {
          gsap.to(el.position, {
            x: "+=" + (Math.random() - 0.5) * 5,
            y: "+=" + (Math.random() - 0.5) * 5,
            duration: 1,
            yoyo: true,
            repeat: 1
          });
        });
      }
    }

    function animate() {
      requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      mainGroup.rotation.y += 0.003;
      mainGroup.rotation.x = mouse.y * 0.4;
      mainGroup.rotation.y += mouse.x * 0.02;

      renderer.render(scene, camera);
    }

    document.addEventListener('DOMContentLoaded', initWebGL);
  </script>
</body>
</html>`;
}
