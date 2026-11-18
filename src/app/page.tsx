"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Sparkles, Users, ArrowRight, ShieldCheck, Download, Video, Image, ExternalLink, Terminal, UploadCloud, Check } from "lucide-react";
import AtlasNav from "@/components/AtlasNav";
import FaqSection from "@/components/FaqSection";
import CtaFooter from "@/components/CtaFooter";
import PricingSection from "@/components/PricingSection";
import BenefitsSection from "@/components/BenefitsSection";
import KaiRennSphereShowcase from "@/components/KaiRennSphereShowcase";

type StyleKey = "glassmorphism" | "claymorphism" | "brutalism" | "minimalism" | "liquidglass";

interface StyleDefinition {
  name: string;
  badge: string;
  description: string;
  cssPreviewClass: string;
  palette: string[];
  mockHeroTitle: string;
  mockHeroSubtitle: string;
}

const STYLES: Record<StyleKey, StyleDefinition> = {
  glassmorphism: {
    name: "Glassmorphism",
    badge: "Frosted Translucency",
    description: "Multilayered frosted acrylic cards with specular gradient borders and ambient backlighting.",
    cssPreviewClass: "bg-white/[0.06] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
    palette: ["#ffffff20", "#38bdf8", "#818cf8", "#0f172a"],
    mockHeroTitle: "Elevate Through Frosted Clarity.",
    mockHeroSubtitle: "Dynamic translucent interfaces with sub-pixel refractive light.",
  },
  claymorphism: {
    name: "Claymorphism",
    badge: "Soft 3D Tactile",
    description: "Rounded, friendly 3D visual language featuring inner and outer dual-drop shadows.",
    cssPreviewClass: "bg-[#181824] rounded-3xl shadow-[12px_12px_24px_#0a0a10,-8px_-8px_20px_#262638] border-t border-white/10",
    palette: ["#181824", "#f43f5e", "#a855f7", "#38bdf8"],
    mockHeroTitle: "Tactile, Friendly, Physical.",
    mockHeroSubtitle: "Soft extruded shapes that feel tangible under the user's fingertips.",
  },
  brutalism: {
    name: "Neo-Brutalism",
    badge: "High-Contrast Edge",
    description: "Stark black borders, high-contrast flat planes, monospace typography, and hard drop-shadows.",
    cssPreviewClass: "bg-[#fef08a] text-black border-2 border-black shadow-[5px_5px_0px_#000000]",
    palette: ["#fef08a", "#000000", "#ffffff", "#f43f5e"],
    mockHeroTitle: "UNAPOLOGETIC RAW POWER.",
    mockHeroSubtitle: "Zero fluff. Pure typographic impact and hard geometric weight.",
  },
  minimalism: {
    name: "Swiss Minimalism",
    badge: "Architectural Precision",
    description: "Extreme negative space, strict mathematical grids, monochromatic rigor, and zero visual noise.",
    cssPreviewClass: "bg-black border border-white/10 text-white font-mono",
    palette: ["#000000", "#ffffff", "#71717a", "#27272a"],
    mockHeroTitle: "The Art of Less.",
    mockHeroSubtitle: "Eliminate the non-essential to let the core product message command total attention.",
  },
  liquidglass: {
    name: "Liquid Glass Bento",
    badge: "Dark Luminous Bento",
    description: "Deep obsidian bento modules with liquid lighting trails and dynamic gradient accents.",
    cssPreviewClass: "bg-[#09090f]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    palette: ["#09090f", "#06b6d4", "#3b82f6", "#6366f1"],
    mockHeroTitle: "The Modern Silicon Standard.",
    mockHeroSubtitle: "Bento container systems engineered for high-converting SaaS workflows.",
  },
};

const CLIENT_SITES = [
  {
    title: "Avexssft",
    category: "Software & Cloud Systems",
    url: "https://avexssft.vercel.app/",
    domain: "avexssft.vercel.app",
    badge: "FINTECH & SAAS",
    accent: "from-sky-500/20 to-blue-600/10",
    border: "hover:border-sky-400/50",
  },
  {
    title: "Reyonodes",
    category: "High-Performance Cloud Infrastructure",
    url: "https://development-1491.reyonodes.workers.dev/",
    domain: "reyonodes.workers.dev",
    badge: "EDGE WORKERS",
    accent: "from-purple-500/20 to-indigo-600/10",
    border: "hover:border-purple-400/50",
  },
  {
    title: "Hennessey Site",
    category: "Luxury Automotive & Performance",
    url: "https://hennessey-site.pages.dev/",
    domain: "hennessey-site.pages.dev",
    badge: "AUTOMOTIVE UI",
    accent: "from-amber-500/20 to-orange-600/10",
    border: "hover:border-amber-400/50",
  },
  {
    title: "Xerin Project",
    category: "Cybersecurity & Neural Protocols",
    url: "https://xerinproject.pages.dev/",
    domain: "xerinproject.pages.dev",
    badge: "NEURAL PROTOCOLS",
    accent: "from-emerald-500/20 to-teal-600/10",
    border: "hover:border-emerald-400/50",
  },
  {
    title: "Reyo Pro VPS",
    category: "Enterprise Virtual Private Servers",
    url: "https://reyoprovps.pages.dev/",
    domain: "reyoprovps.pages.dev",
    badge: "INFRASTRUCTURE",
    accent: "from-indigo-500/20 to-violet-600/10",
    border: "hover:border-indigo-400/50",
  },
  {
    title: "Hennessey Special Edition",
    category: "Hypercar Configurator & Editorial",
    url: "https://hennessey.pages.dev/",
    domain: "hennessey.pages.dev",
    badge: "LUXURY EDITORIAL",
    accent: "from-rose-500/20 to-pink-600/10",
    border: "hover:border-rose-400/50",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"Landing" | "Pricing" | "Adeline" | "Graphics">("Landing");
  const [activeArchetype, setActiveArchetype] = useState<StyleKey>("glassmorphism");
  const [demoPrompt, setDemoPrompt] = useState("A luxury fintech platform with dark glass cards & real-time analytics");

  // Website builder stats counter
  const [counts, setCounts] = useState({
    speed: 0,
    responsive: 0,
    delivery: 0,
    storage: 0,
  });

  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateCounters = () => {
      const stats = [
        { key: "speed", target: 15, decimals: 0, duration: 1400, delay: 400 },
        { key: "responsive", target: 100, decimals: 0, duration: 1500, delay: 500 },
        { key: "delivery", target: 72, decimals: 0, duration: 1600, delay: 600 },
        { key: "storage", target: 1, decimals: 0, duration: 1700, delay: 700 },
      ];

      stats.forEach((stat) => {
        setTimeout(() => {
          const startTime = performance.now();
          const frame = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / stat.duration, 1);
            const eased = easeOutCubic(progress);
            const currentVal = eased * stat.target;

            setCounts((prev) => ({
              ...prev,
              [stat.key]: parseFloat(currentVal.toFixed(stat.decimals)),
            }));

            if (progress < 1) {
              requestAnimationFrame(frame);
            } else {
              setCounts((prev) => ({
                ...prev,
                [stat.key]: stat.target,
              }));
            }
          };
          requestAnimationFrame(frame);
        }, stat.delay);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounters();
        }
      },
      { threshold: 0.25 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const currentArchetype = STYLES[activeArchetype];

  return (
    <div className="relative w-full min-h-screen bg-black select-none text-white overflow-x-hidden font-sans">
      
      {/* ATLAS TRANSLUCENT MINIMALIST HOVERING NAVBAR */}
      <AtlasNav />

      {/* SECTION 1: HERO VIEWPORT (Single-viewport full-bleed initial screen) */}
      <section id="landing" className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between">
        
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85 pointer-events-none"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full max-w-[1240px] mx-auto flex flex-col justify-between px-[clamp(14px,3vw,36px)] pt-[84px] pb-[clamp(16px,2.4vh,28px)]">
          
          {/* Top spacer for fixed navbar */}
          <div className="w-full h-2 shrink-0"></div>

          {/* HERO CENTER REGION */}
          <main className="w-full max-w-[950px] mx-auto text-center flex flex-col items-center justify-center my-auto py-2">
            
            <div className="inline-flex items-center mb-[clamp(14px,2.2vh,24px)] anim-reveal" style={{ animationDelay: "0.05s" }}>
              <div className="trust-avatar relative z-10 w-[clamp(34px,4.5vw,42px)] h-[clamp(34px,4.5vw,42px)] rounded-full bg-[#18181b]/80 backdrop-blur-md border border-white/30 p-[5px] flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#111] text-[clamp(11px,1.5vw,14px)]">
                  <i className="fa-brands fa-microsoft"></i>
                </div>
              </div>

              <div
                className="trust-avatar relative z-20 w-[clamp(34px,4.5vw,42px)] h-[clamp(34px,4.5vw,42px)] rounded-full bg-[#18181b]/80 backdrop-blur-md border border-white/30 p-[5px] flex items-center justify-center shadow-lg"
                style={{ marginLeft: "calc(clamp(34px,4.5vw,42px) * -0.42)" }}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#111] text-[clamp(11px,1.5vw,14px)]">
                  <i className="fa-brands fa-amazon"></i>
                </div>
              </div>

              <div
                className="trust-avatar relative z-30 w-[clamp(34px,4.5vw,42px)] h-[clamp(34px,4.5vw,42px)] rounded-full bg-[#18181b]/80 backdrop-blur-md border border-white/30 p-[5px] flex items-center justify-center shadow-lg"
                style={{ marginLeft: "calc(clamp(34px,4.5vw,42px) * -0.42)" }}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#111] text-[clamp(11px,1.5vw,14px)]">
                  <i className="fa-brands fa-google"></i>
                </div>
              </div>

              <div
                className="relative z-0 h-[clamp(34px,4.5vw,42px)] bg-black/40 backdrop-blur-xl border border-white/25 rounded-full flex items-center pr-4 font-medium text-[#c4c2c3] text-[clamp(11px,1.3vw,13.5px)] tracking-normal shadow-lg"
                style={{
                  marginLeft: "calc(clamp(34px,4.5vw,42px) * -0.42)",
                  paddingLeft: "calc(clamp(34px,4.5vw,42px) * 0.58)",
                }}
              >
                Trusted by 2,000+ Studios & Founders
              </div>
            </div>

            <h1
              className="text-white text-[clamp(30px,6.8vw,86px)] leading-[1.08] tracking-[-0.04em] whitespace-nowrap overflow-hidden my-1 font-normal"
              style={{
                fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace',
              }}
            >
              <span
                className="block opacity-0 animate-[headlineFade_0.85s_cubic-bezier(0.22,1,0.36,1)_forwards]"
                style={{ animationDelay: "0.12s" }}
              >
                Websites
              </span>
              <span
                className="block opacity-0 animate-[headlineFade_0.85s_cubic-bezier(0.22,1,0.36,1)_forwards]"
                style={{ animationDelay: "0.28s" }}
              >
                Crafted To Convert
              </span>
            </h1>

            <p
              className="mt-4 text-[#d4d4d8] opacity-90 font-light leading-[1.55] max-w-[540px] text-[clamp(15px,1.65vw,18px)] anim-reveal"
              style={{ animationDelay: "0.32s" }}
            >
              Bespoke websites handcrafted by dedicated human designers, or synthesized in 15 minutes with Adeline, our neural website builder.
            </p>

            <div className="mt-7 anim-pulse-cta" style={{ animationDelay: "0.42s" }}>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-[clamp(26px,3.2vw,34px)] py-[clamp(12px,1.7vh,14px)] rounded-full bg-white text-black font-semibold text-[clamp(13.5px,1.5vw,15px)] tracking-tight transition-all duration-300 hover:scale-[1.03] hover:-translate-y-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_0_24px_rgba(255,255,255,0.35),0_0_50px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                Build Your Website
              </a>
            </div>

          </main>

          {/* STATS FOOTER */}
          <footer
            ref={statsRef}
            className="w-full max-w-[940px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 py-2 shrink-0 border-t border-white/[0.08]"
          >
            <div className="flex flex-col items-center text-center anim-reveal" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-[clamp(20px,2.8vw,32px)]" style={{ fontFamily: '"BubbledotICG-FinePos", monospace' }}>&lt;</span>
                <span className="text-white font-medium text-[clamp(18px,2.2vw,26px)] tracking-[-0.025em] tabular-nums">
                  {counts.speed}
                  <span className="text-xs text-white/80 font-normal ml-0.5">min</span>
                </span>
              </div>
              <span className="text-[#8e8e8e] text-[clamp(11px,1.2vw,12.5px)] mt-0.5 font-sans">
                Adeline AI Build Speed
              </span>
            </div>

            <div className="flex flex-col items-center text-center anim-reveal" style={{ animationDelay: "0.58s" }}>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-[clamp(20px,2.8vw,32px)]" style={{ fontFamily: '"BubbledotICG-FinePos", monospace' }}>%</span>
                <span className="text-white font-medium text-[clamp(18px,2.2vw,26px)] tracking-[-0.025em] tabular-nums">
                  {counts.responsive}
                  <span className="text-xs text-white/80 font-normal ml-0.5">%</span>
                </span>
              </div>
              <span className="text-[#8e8e8e] text-[clamp(11px,1.2vw,12.5px)] mt-0.5 font-sans">
                Responsive Perfection
              </span>
            </div>

            <div className="flex flex-col items-center text-center anim-reveal" style={{ animationDelay: "0.66s" }}>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-[clamp(20px,2.8vw,32px)]" style={{ fontFamily: '"BubbledotICG-FinePos", monospace' }}>*</span>
                <span className="text-white font-medium text-[clamp(18px,2.2vw,26px)] tracking-[-0.025em] tabular-nums">
                  {counts.delivery}
                  <span className="text-xs text-white/80 font-normal ml-0.5">h</span>
                </span>
              </div>
              <span className="text-[#8e8e8e] text-[clamp(11px,1.2vw,12.5px)] mt-0.5 font-sans">
                Human Studio Delivery
              </span>
            </div>

            <div className="flex flex-col items-center text-center anim-reveal" style={{ animationDelay: "0.74s" }}>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-[clamp(20px,2.8vw,32px)]" style={{ fontFamily: '"BubbledotICG-FinePos", monospace' }}>#</span>
                <span className="text-white font-medium text-[clamp(18px,2.2vw,26px)] tracking-[-0.025em] tabular-nums">
                  {counts.storage}
                  <span className="text-xs text-white/80 font-normal ml-0.5">TB</span>
                </span>
              </div>
              <span className="text-[#8e8e8e] text-[clamp(11px,1.2vw,12.5px)] mt-0.5 font-sans">
                Free Image Storage CDN
              </span>
            </div>
          </footer>

        </div>

      </section>

      {/* SECTION 2: 3D FIBONACCI WEBGL CLIENT SHOWCASE (BUILT BY TESSRO / KR.ST) */}
      <section id="showcase" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black relative">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Interactive WebGL Sphere & Index
              </div>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight" style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}>
                Built By Tessro
              </h2>
              <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-2xl font-light">
                Spin the interactive 3D WebGL sphere to explore 20+ live client websites synthesized with Adeline AI and motion-designed by Tessro. Click any plane to zoom in, view overview telemetry, or switch to the full Project Index.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>24 CLIENT PLATFORMS · 60 FPS</span>
            </div>
          </div>

          {/* Interactive Three-View WebGL Sphere Experience */}
          <KaiRennSphereShowcase />

        </div>
      </section>

      {/* SECTION 3: ADELINE ARCHETYPE LAB */}
      <section id="adeline" className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[350px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-indigo-500/10 blur-[140px] pointer-events-none rounded-full"></div>

        <div className="max-w-[1240px] mx-auto relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Adeline AI Synthesis Lab
              </div>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight" style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}>
                Visual Archetypes
              </h2>
              <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-xl font-light">
                Adeline does not generate generic web templates. It is trained on pristine architectural design systems. Select an archetype to preview its design language.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ENGINE: ADELINE NEURAL CORE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-10">
            {(Object.keys(STYLES) as StyleKey[]).map((key) => {
              const item = STYLES[key];
              const isSelected = activeArchetype === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveArchetype(key)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                    isSelected
                      ? "border-cyan-400 bg-white/[0.08] shadow-[0_0_25px_rgba(56,189,248,0.22)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">SYS.0{Object.keys(STYLES).indexOf(key) + 1}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${isSelected ? "text-white" : "text-zinc-300"}`}>
                      {item.name}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                      {item.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 p-7 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl flex flex-col justify-between gap-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Prompt Synthesis
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">15 MIN GENERATION</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Website Purpose & Niche
                  </label>
                  <textarea
                    value={demoPrompt}
                    onChange={(e) => setDemoPrompt(e.target.value)}
                    rows={3}
                    className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-white text-xs font-sans focus:outline-none focus:border-cyan-400 resize-none transition"
                    placeholder="Enter what your website is for..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Brand Images & Logo</span>
                    <span className="text-[10px] text-emerald-400 font-mono">1TB GCS CDN</span>
                  </label>
                  <div className="border border-dashed border-white/20 hover:border-cyan-400/60 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-white/[0.01] transition">
                    <UploadCloud className="w-5 h-5 text-zinc-400" />
                    <span className="text-xs text-zinc-300">Drag & drop logo or moodboard</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Synced to Free Storage CDN</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="font-mono text-zinc-400 text-[11px]">Archetype DNA:</span>
                  <div className="flex items-center gap-1.5">
                    {currentArchetype.palette.map((color, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/auth?redirect=/studio"
                className="w-full py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 text-center shadow-lg cursor-pointer"
              >
                <span>Synthesize In {currentArchetype.name} ($29.99)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#07070a] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>PREVIEW: {currentArchetype.name.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                  <span>DESKTOP</span>
                  <span>TABLET</span>
                  <span>MOBILE</span>
                </div>
              </div>

              <div className={`p-8 transition-all duration-500 my-auto ${currentArchetype.cssPreviewClass}`}>
                <div className="text-[10px] font-mono tracking-widest uppercase opacity-70 mb-2">
                  {currentArchetype.badge} // LIVE COMPONENT
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                  {currentArchetype.mockHeroTitle}
                </h4>
                <p className="text-xs sm:text-sm opacity-80 max-w-lg mb-6 leading-relaxed">
                  {currentArchetype.mockHeroSubtitle} Tailored to: "{demoPrompt.slice(0, 55)}..."
                </p>

                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-full bg-white text-black font-medium text-xs font-mono">
                    Explore Interface
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full border border-white/20 text-white font-mono text-xs">
                    View Live Code
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-4 border-t border-white/10 mt-6">
                <span>EXPORT: FULL RESPONSIVE ZIP (HTML5 + TAILWIND + REACT)</span>
                <span>ZERO OPERATING LOCK-IN</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: KEY BENEFITS */}
      <BenefitsSection />

      {/* SECTION 4: PRICING PLANS */}
      <PricingSection />

      {/* SECTION 5: $5.00 MICRO STUDIOS */}
      <section id="graphics" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black relative">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                $5.00 Micro AI Studios
              </div>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight" style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}>
                Logo & Video Add-Ons
              </h2>
              <p className="mt-3 text-zinc-400 text-sm max-w-xl font-light">
                High-resolution vector logos and ambient video backgrounds tailored to your website. Five dollars flat with instant transparent export.
              </p>
            </div>

            <div className="text-xs font-mono text-zinc-500">
              VECTOR SVG • 16:9 4K VIDEO LOOPS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-9 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl flex flex-col justify-between relative group hover:border-amber-500/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5" />
                    AI Vector Brandmark
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs font-semibold">
                    $5.00
                  </span>
                </div>

                <h3 className="text-2xl font-light text-white tracking-tight">
                  AI Logo Designer
                </h3>
                <p className="text-xs text-zinc-400 mt-2 max-w-md">
                  Generate clean, bespoke brandmarks, monograms, and geometric emblems tailored to your company's aesthetic.
                </p>

                <div className="mt-6 space-y-2.5">
                  {[
                    "Clean SVG vector code + High-res Transparent PNG (4000x4000)",
                    "Minimalist, Swiss, Geometric, and Luxury typography modes",
                    "Dark and light mode variations generated automatically",
                    "Stored on your Google Cloud Storage CDN with permanent links",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => alert("AI Logo Generator Tool ($5) will trigger.")}
                  className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Generate Logo ($5.00)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-9 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl flex flex-col justify-between relative group hover:border-purple-500/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    Cinematic Hero Loops
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs font-semibold">
                    $5.00
                  </span>
                </div>

                <h3 className="text-2xl font-light text-white tracking-tight">
                  AI Video Designer
                </h3>
                <p className="text-xs text-zinc-400 mt-2 max-w-md">
                  Create seamless 16:9 ambient motion videos, logo reveals, and website hero video backdrops that captivate visitors.
                </p>

                <div className="mt-6 space-y-2.5">
                  {[
                    "16:9 4K / 1080p Web-Optimized MP4 video format",
                    "Seamless loop engineered specifically for website hero backgrounds",
                    "Audio-free, sub-5MB fast loading for 100/100 Core Web Vitals",
                    "Hosted directly on Google Cloud CDN with zero buffering",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => alert("AI Video Generator Tool ($5) will trigger.")}
                  className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Generate Video ($5.00)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <FaqSection />

      {/* VEXOR-STYLE SIGNUP CTA & FOOTER (ADAPTED FOR TESSRO) */}
      <CtaFooter />

    </div>
  );
}
