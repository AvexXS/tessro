"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTessro } from "@/lib/tessro-context";
import {
  Sparkles,
  ExternalLink,
  Download,
  ArrowRight,
  CheckCircle2,
  Layers,
  Terminal,
  Code2,
  Laptop,
  Smartphone,
  Tablet,
  AlertCircle,
} from "lucide-react";

export default function StudioPage() {
  const router = useRouter();
  const { addProject, isAuthenticated } = useTessro();

  const [prompt, setPrompt] = useState("Synthesize an interactive 3D Obsidian Sphere of website previews with smooth inertia and central glowing core");
  const [selectedModel, setSelectedModel] = useState("Gemini 3.7 Flash (3D Neural)");
  const [selectedArchetype, setSelectedArchetype] = useState("Obsidian 3D Sphere");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [completedProject, setCompletedProject] = useState<{
    id: string;
    title: string;
    domain: string;
    archetype: string;
    html_code: string;
    css_code: string;
    downloadFilename: string;
  } | null>(null);

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isExporting, setIsExporting] = useState(false);

  const GEN_STEPS = [
    "Awakening Adeline 3D Spatial Engine via Google Gemini 3.7 Flash...",
    "Synthesizing Three.js 0.160.0 WebGL geometry & Fibonacci orbit coordinates...",
    "Injecting GSAP 3.12.5 physics, specular PBR shaders & dynamic cursor lerp...",
    "Finalizing production bundle with 1TB Google Drive / Cloud CDN...",
  ];

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("anim");
      const timer = setTimeout(() => {
        document.documentElement.classList.remove("anim");
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenStep(0);

    const stepInterval = setInterval(() => {
      setGenStep((prev) => (prev < GEN_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const cleanTitle = prompt.length > 34 ? `${prompt.slice(0, 32)}...` : prompt;

      // Real server-side autonomous synthesis API call
      const res = await fetch("/api/adeline/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          archetype: selectedArchetype,
          title: cleanTitle,
        }),
      });

      clearInterval(stepInterval);

      if (res.ok) {
        const data = await res.json();
        const proj = data.project;
        const domainName = `${cleanTitle.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "nexus"}-${Math.floor(100 + Math.random() * 900)}.tessro.cloud`;

        const projectPayload = {
          id: proj.id,
          title: proj.title,
          domain: domainName,
          archetype: proj.archetype,
          html_code: proj.html_code,
          css_code: proj.css_code,
          downloadFilename: `tessro-${proj.id}.zip`,
        };

        addProject({
          title: proj.title,
          domain: domainName,
          archetype: proj.archetype,
          mode: "adeline_ai",
          status: "live",
          previewUrl: `/preview/${proj.id}`,
          zipExportUrl: `/api/adeline/export`,
          storageMb: 46.2,
        });

        setCompletedProject(projectPayload);
      } else {
        alert("Synthesis failed. Please try a different prompt.");
      }
    } catch (err: any) {
      alert(`Synthesis error: ${err.message}`);
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!completedProject) return;
    setIsExporting(true);

    try {
      const res = await fetch("/api/adeline/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: completedProject.title,
          html: completedProject.html_code,
          css: completedProject.css_code,
          prompt,
          archetype: completedProject.archetype,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = completedProject.downloadFilename;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert("Failed to export production ZIP package.");
      }
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fastshot-scope">
      <style jsx global>{`
        .fastshot-scope {
          --u: min(0.06410256vw, 0.12400794vh);
          --vu: 0.09920635vh;
          --inset-top: 41;
          --inset-bottom: 106;

          --brand-x: 225; --brand-y: 45; --mark: 34; --brand-gap: 12; --brand-fs: 18.49;
          --links-y: 50.5; --links-gap: 50; --links-fs: 21.69;
          --cta-x: 1195; --cta-y: 42; --cta-w: 140; --cta-h: 43; --cta-r: 12; --cta-fs: 15.70; --cta-dy: 2;

          --hero-gap: 51;
          --h1-y: 323; --h1-fs: 36.25; --display-ls: 0.0018em;
          --nav-ls: -0.0115em; --brand-ls: -0.0154em; --cta-ls: -0.0127em; --body-ls: 0.007em;
          --label-ls: normal; --model-ls: normal; --proof-ls: 0.0065em;

          --w-regular: 400; --w-display-wght: 410; --w-medium: 500; --w-semibold: 600;
          --w-display: var(--w-display-wght); --w-nav: 400; --w-brand: 500; --w-cta: 520;
          --w-body: var(--w-regular); --w-label: var(--w-medium);
          --w-model: var(--w-regular); --w-proof: 480;

          --card-x: 425; --card-y: 413; --card-w: 708; --card-h: 143; --card-r: 26;
          --ph-x: 452; --ph-y: 446; --ph-fs: 9.97;
          --chips-x: 444; --chips-y: 505; --chip-h: 30; --chip-r: 9; --chip-fs: 9.0; --chip-gap: 5.5;
          --son-fs: 10.4; --son-top: 15.5; --chev-gap: 6.2;
          --chev-x: 1013.5; --chev-y: 522.3;
          --att-x: 1043.2; --att-y: 515.1;
          --send-x: 1084; --send-y: 507; --send-d: 35;

          --by-y: 799; --by-fs: 14.01; --logo-y: 867; --logo-gap: 62;

          --e-primary: cubic-bezier(.16, 1, .3, 1);
          --e-soft: cubic-bezier(.22, 1, .36, 1);

          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: #0a0d12;
          color: #fff;
          font-family: Inter, -apple-system, sans-serif;
          overflow: hidden;
          user-select: none;
        }

        @supports (height: 100dvh) {
          .fastshot-scope {
            --u: min(0.06410256vw, 0.12400794dvh);
            --vu: 0.09920635dvh;
          }
        }

        @media (min-width: 1561px) {
          .fastshot-scope {
            --inset-top: 27;
            --inset-bottom: 74;
          }
        }

        .fs-stage-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .fs-frame {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          flex-direction: column;
          padding: calc(var(--inset-top) * var(--vu)) calc(225 * var(--u)) calc(var(--inset-bottom) * var(--vu));
        }

        /* Nav */
        .fs-nav {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: calc(43 * var(--vu));
        }
        .fs-brand {
          display: flex;
          align-items: center;
          gap: calc(var(--brand-gap) * var(--u));
          text-decoration: none;
          color: #ffffff;
        }
        .fs-mark {
          width: calc(var(--mark) * var(--u));
          height: calc(var(--mark) * var(--u));
        }
        .fs-brand-name {
          font-family: 'BubbledotICG-FinePos', 'Geist Pixel Circle', monospace;
          font-size: calc(var(--brand-fs) * var(--u));
          font-weight: 300;
          letter-spacing: 0.45em;
          color: #ffffff;
          line-height: 1;
        }
        .fs-links {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: calc(var(--links-gap) * var(--u));
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .fs-nav-link {
          font-size: calc(var(--links-fs) * var(--u));
          font-weight: var(--w-nav);
          letter-spacing: var(--nav-ls);
          color: rgba(255, 255, 255, 0.95);
          text-decoration: none;
          font-variation-settings: "opsz" 32;
        }
        .fs-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: calc(var(--cta-w) * var(--u));
          height: calc(var(--cta-h) * var(--u));
          border-radius: calc(var(--cta-r) * var(--u));
          background: #ffffff;
          color: #0b0f14;
          font-size: calc(var(--cta-fs) * var(--u));
          font-weight: var(--w-cta);
          letter-spacing: var(--cta-ls);
          text-decoration: none;
          box-shadow: 0 calc(2 * var(--u)) calc(12 * var(--u)) rgba(0, 0, 0, 0.28);
          cursor: pointer;
        }

        /* Hero */
        .fs-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: calc(var(--hero-gap) * var(--vu));
          min-height: 0;
        }
        .fs-h1 {
          font-family: 'BubbledotICG-FinePos', 'Geist Pixel Circle', monospace;
          font-size: calc(var(--h1-fs) * var(--u));
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-align: center;
          line-height: 1.1;
          margin: 0;
        }

        /* Composer Card */
        .fs-card {
          position: relative;
          width: calc(var(--card-w) * var(--u));
          height: calc(var(--card-h) * var(--u));
          background: rgba(18, 22, 28, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: calc(var(--card-r) * var(--u));
          backdrop-filter: blur(calc(32 * var(--u))) saturate(160%);
          box-shadow: 0 calc(18 * var(--u)) calc(48 * var(--u)) rgba(0, 0, 0, 0.45);
          box-sizing: border-box;
        }
        .fs-ph {
          position: absolute;
          top: calc(23 * var(--u));
          left: calc(27 * var(--u));
          right: calc(27 * var(--u));
          font-size: calc(var(--ph-fs) * var(--u));
          font-weight: var(--w-body);
          letter-spacing: var(--body-ls);
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-family: inherit;
        }
        .fs-tools {
          position: absolute;
          left: calc(19 * var(--u));
          right: calc(18 * var(--u));
          bottom: calc(17 * var(--u));
          height: calc(35 * var(--u));
        }
        .fs-chips {
          position: absolute;
          left: 0;
          bottom: calc(5 * var(--u));
          display: flex;
          align-items: center;
          gap: calc(var(--chip-gap) * var(--u));
        }
        .fs-chip {
          display: inline-flex;
          align-items: center;
          gap: calc(var(--ig, 3.5) * var(--u));
          padding-left: calc(var(--pl, 12) * var(--u));
          padding-right: calc(12 * var(--u));
          height: calc(var(--chip-h) * var(--u));
          border-radius: calc(var(--chip-r) * var(--u));
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.85);
          font-size: calc(var(--chip-fs) * var(--u));
          font-weight: var(--w-label);
          letter-spacing: var(--label-ls);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .fs-chip:hover {
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
        .fs-right {
          position: absolute;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          gap: calc(14 * var(--u));
        }
        .fs-model {
          display: inline-flex;
          align-items: center;
          gap: calc(var(--chev-gap) * var(--u));
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.85);
          font-size: calc(var(--son-fs) * var(--u));
          font-weight: var(--w-model);
          cursor: pointer;
        }
        .fs-attach {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(20 * var(--u));
          height: calc(20 * var(--u));
        }
        .fs-attach:hover {
          color: #fff;
        }
        .fs-send {
          width: calc(var(--send-d) * var(--u));
          height: calc(var(--send-d) * var(--u));
          border-radius: 50%;
          background: #ffffff;
          border: none;
          color: #0b0f14;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 calc(2 * var(--u)) calc(12 * var(--u)) rgba(255, 255, 255, 0.35);
          transition: transform 0.15s, background 0.15s;
        }
        .fs-send:hover {
          background: #e4e4e7;
          transform: scale(1.05);
        }

        /* Proof Footer */
        .fs-proof {
          flex: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: calc(52.3 * var(--vu));
        }
        .fs-proof-caption {
          font-size: calc(var(--by-fs) * var(--u));
          font-weight: var(--w-proof);
          letter-spacing: var(--proof-ls);
          color: rgba(255,255,255,.95);
          font-variation-settings: "opsz" 32;
          text-shadow: 0 calc(1 * var(--u)) calc(12 * var(--u)) rgba(0,0,0,.35);
          text-align: center;
        }
        .fs-logos {
          display: flex;
          align-items: center;
          gap: calc(var(--logo-gap) * var(--u));
          color: #ffffff;
          filter: drop-shadow(0 calc(1 * var(--u)) calc(10 * var(--u)) rgba(0,0,0,.30));
        }
      `}</style>

      {/* Background Dawn Video */}
      <video
        className="fs-stage-video"
        autoPlay
        muted
        loop
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_042318_1d4c2075-fc91-443b-a9a3-cbb87a6c98c1.mp4"
      />

      <div className="fs-frame">
        {/* Navigation */}
        <header className="fs-nav">
          <Link href="/" className="fs-brand">
            <svg className="fs-mark" viewBox="0 0 34 34" fill="none">
              <circle cx="17" cy="17" r="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <circle cx="17" cy="17" r="5" fill="#ffffff" />
            </svg>
            <span className="fs-brand-name">TESSRO</span>
          </Link>

          <nav>
            <ul className="fs-links">
              <li><Link href="/" className="fs-nav-link">Home</Link></li>
              <li><Link href="/dashboard" className="fs-nav-link">Dashboard</Link></li>
              <li><Link href="/dashboard/tickets" className="fs-nav-link">Tickets</Link></li>
              <li><Link href="/#pricing" className="fs-nav-link">Pricing</Link></li>
            </ul>
          </nav>

          <Link href="/dashboard" className="fs-cta">
            <span>Dashboard →</span>
          </Link>
        </header>

        {/* Hero */}
        <main className="fs-hero">
          <h1 className="fs-h1">Describe an app. We&apos;ll build it.</h1>

          {/* Interactive Composer Form */}
          <form className="fs-card" onSubmit={handleSynthesize}>
            <textarea
              className="fs-ph"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe an app, portfolio, or SaaS platform..."
              rows={2}
            />

            <div className="fs-tools">
              {/* 3D WebGL Chips */}
              <div className="fs-chips">
                <button
                  type="button"
                  onClick={() => {
                    setPrompt("Synthesize an interactive 3D Obsidian Sphere of website previews with smooth inertia and central glowing core");
                    setSelectedArchetype("Obsidian 3D Sphere");
                  }}
                  className="fs-chip"
                >
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>3D Obsidian Sphere</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPrompt("Architect a luxury 3D chrome metallic knot sculpture with specular highlights, PBR shaders, and pointer tracking");
                    setSelectedArchetype("Chrome Floating Monolith / Torus");
                  }}
                  className="fs-chip"
                >
                  <Layers className="w-3 h-3 text-indigo-300" />
                  <span>3D Chrome Torus</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPrompt("Create a deep obsidian space with 5,000 glowing quantum particles swirling into a mathematical vortex on mousemove");
                    setSelectedArchetype("Quantum Particle Vortex");
                  }}
                  className="fs-chip"
                >
                  <Terminal className="w-3 h-3 text-emerald-300" />
                  <span>5k Particle Vortex</span>
                </button>
              </div>

              {/* Right Cluster */}
              <div className="fs-right">
                <button
                  type="button"
                  onClick={() => {
                    const models = [
                      "Gemini 3.7 Flash (3D Neural)",
                      "Gemini 3.5 Flash",
                      "Adeline 3D Procedural Engine",
                    ];
                    const nextIdx = (models.indexOf(selectedModel) + 1) % models.length;
                    setSelectedModel(models[nextIdx]);
                  }}
                  className="fs-model"
                  title="Switch AI Engine"
                >
                  <span>{selectedModel}</span>
                  <svg viewBox="0 0 7 4" className="w-2 h-2">
                    <path d="M1 1l2.5 2.5L6 1" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="fs-attach"
                  aria-label="Attach file"
                  onClick={() => alert("Uploads link directly to your 1TB Google Cloud Storage CDN bucket.")}
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.5 8.5l-6.5 6.5a3.5 3.5 0 01-5-5l7-7a2.5 2.5 0 013.5 3.5l-7 7a1.5 1.5 0 01-2-2l6.5-6.5" />
                  </svg>
                </button>

                <button type="submit" className="fs-send" aria-label="Build it">
                  <svg viewBox="0 0 12 14" className="w-3 h-3 fill-current">
                    <path d="M6 1l5 5.5H7.5V13h-3V6.5H1L6 1z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </main>

        {/* Proof Footer */}
        <footer className="fs-proof">
          <div className="fs-proof-caption">Engineered on Google Cloud Storage CDN & Next.js 16</div>
          <div className="fs-logos">
            <span className="font-mono text-xs tracking-widest text-zinc-400">ADELINE NEURAL ARCHITECTURE • 15 MIN COMPILATION</span>
          </div>
        </footer>
      </div>

      {/* SYNTHESIS PROGRESS MODAL OVERLAY */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-[#09090d] border border-white/20 text-center space-y-6 shadow-2xl animate-[fadeIn_0.2s_ease]">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mx-auto relative">
              <span className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <Sparkles className="w-5 h-5 text-white absolute" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                Adeline Neural Pipeline // Step 0{genStep + 1} of 04
              </span>
              <h3 className="text-xl font-light text-white tracking-tight">
                Synthesizing Your Platform
              </h3>
              <p className="text-xs text-zinc-400 font-mono min-h-[36px] flex items-center justify-center px-4">
                {GEN_STEPS[genStep]}
              </p>
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-700 ease-out"
                style={{ width: `${((genStep + 1) / GEN_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED PRODUCTION PREVIEW SIMULATOR */}
      {completedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl">
          <div className="w-full max-w-5xl h-[88vh] rounded-3xl bg-[#09090d] border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.25s_ease]">
            {/* Window Chrome Header */}
            <div className="p-4 sm:px-6 border-b border-white/10 bg-black/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                  https://{completedProject.domain}
                </div>
              </div>

              {/* Viewport switchers */}
              <div className="hidden sm:flex items-center gap-1 bg-white/5 p-0.5 rounded-full border border-white/10">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-full transition ${previewDevice === "desktop" ? "bg-white text-black" : "text-zinc-400"}`}
                  title="Desktop 100% Viewport"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5 rounded-full transition ${previewDevice === "tablet" ? "bg-white text-black" : "text-zinc-400"}`}
                  title="Tablet 768px Viewport"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-full transition ${previewDevice === "mobile" ? "bg-white text-black" : "text-zinc-400"}`}
                  title="Mobile 390px Viewport"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setCompletedProject(null)}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-white text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Live Sandboxed Interactive Iframe Canvas */}
            <div className="flex-1 bg-neutral-950 overflow-hidden flex items-center justify-center p-2 sm:p-4">
              <div
                className={`transition-all duration-300 h-full w-full ${
                  previewDevice === "desktop"
                    ? "max-w-full"
                    : previewDevice === "tablet"
                    ? "max-w-[768px]"
                    : "max-w-[390px]"
                } rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black`}
              >
                <iframe
                  title="Adeline Synthesized Site Preview"
                  srcDoc={completedProject.html_code}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 sm:px-6 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SAVED TO DATABASE & CLIENT DASHBOARD</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadZip}
                  disabled={isExporting}
                  className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isExporting ? (
                    <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Download Production ZIP Package</span>
                </button>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-white font-semibold text-xs font-mono uppercase tracking-wider transition flex items-center gap-2"
                >
                  <span>Open In Dashboard →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
