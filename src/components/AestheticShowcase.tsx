"use client";

import { useState } from "react";
import { Sparkles, Layers, Box, Square, LayoutGrid, Droplets, Check, ArrowRight, UploadCloud } from "lucide-react";

type StyleKey = "glassmorphism" | "claymorphism" | "brutalism" | "minimalism" | "liquidglass";

interface StyleDefinition {
  name: string;
  badge: string;
  icon: any;
  description: string;
  cssPreviewClass: string;
  palette: string[];
  mockHeroTitle: string;
  mockHeroSubtitle: string;
  mockFeatures: string[];
}

const STYLES: Record<StyleKey, StyleDefinition> = {
  glassmorphism: {
    name: "Glassmorphism",
    badge: "Frosted Translucency",
    icon: Layers,
    description: "Multilayered frosted acrylic cards with specular gradient borders and ambient backlighting.",
    cssPreviewClass: "bg-white/[0.06] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
    palette: ["#ffffff20", "#38bdf8", "#818cf8", "#0f172a"],
    mockHeroTitle: "Elevate Through Frosted Clarity.",
    mockHeroSubtitle: "Dynamic translucent interfaces with sub-pixel refractive light.",
    mockFeatures: ["Specular Edge Gradients", "Multi-layer Backdrop Blurring", "Reactive Ambient Glows"],
  },
  claymorphism: {
    name: "Claymorphism",
    badge: "Soft 3D Tactile",
    icon: Box,
    description: "Rounded, friendly 3D visual language featuring inner and outer dual-drop shadows.",
    cssPreviewClass: "bg-[#1e1e2d] rounded-3xl shadow-[12px_12px_24px_#0e0e16,-8px_-8px_20px_#2e2e44] border-t border-white/10",
    palette: ["#1e1e2d", "#f43f5e", "#a855f7", "#38bdf8"],
    mockHeroTitle: "Tactile, Friendly, Physical.",
    mockHeroSubtitle: "Soft extruded shapes that feel tangible under the user's fingertips.",
    mockFeatures: ["Dual Shadow Extrusions", "High-Radius Curves", "Playful Soft Lighting"],
  },
  brutalism: {
    name: "Neo-Brutalism",
    badge: "High-Contrast Edge",
    icon: Square,
    description: "Stark black borders, high-contrast flat planes, monospace typography, and hard drop-shadows.",
    cssPreviewClass: "bg-[#fef08a] text-black border-2 border-black shadow-[5px_5px_0px_#000000]",
    palette: ["#fef08a", "#000000", "#ffffff", "#f43f5e"],
    mockHeroTitle: "UNAPOLOGETIC RAW POWER.",
    mockHeroSubtitle: "Zero fluff. Pure typographic impact and hard geometric weight.",
    mockFeatures: ["2px Solid Black Outlines", "Hard 90° Drop Shadows", "High-Energy Accent Tags"],
  },
  minimalism: {
    name: "Swiss Minimalism",
    badge: "Architectural Precision",
    icon: LayoutGrid,
    description: "Extreme negative space, strict mathematical grids, monochromatic rigor, and zero visual noise.",
    cssPreviewClass: "bg-black border border-white/10 text-white font-mono",
    palette: ["#000000", "#ffffff", "#71717a", "#27272a"],
    mockHeroTitle: "The Art of Less.",
    mockHeroSubtitle: "Eliminate the non-essential to let the core product message command total attention.",
    mockFeatures: ["Strict Asymmetric Grids", "Micro-Typography Scale", "Monochrome Palette"],
  },
  liquidglass: {
    name: "Liquid Glass Bento",
    badge: "Dark Luminous Bento",
    icon: Droplets,
    description: "Deep obsidian bento modules with liquid lighting trails and dynamic gradient accents.",
    cssPreviewClass: "bg-[#09090f]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    palette: ["#09090f", "#06b6d4", "#3b82f6", "#6366f1"],
    mockHeroTitle: "The Modern Silicon Standard.",
    mockHeroSubtitle: "Bento container systems engineered for high-converting SaaS workflows.",
    mockFeatures: ["Luminous Radial Trails", "Modular Bento Grids", "Dynamic Metric Badges"],
  },
};

export default function AestheticShowcase() {
  const [activeStyle, setActiveStyle] = useState<StyleKey>("glassmorphism");
  const [promptText, setPromptText] = useState("A luxury cyber-security platform with real-time threat maps");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const current = STYLES[activeStyle];

  return (
    <section id="ai-builder" className="py-24 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Adeline AI Engine • $29.99 Full Website
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              Select Your Visual Archetype
            </h2>
            <p className="mt-3 text-zinc-400 text-sm max-w-xl">
              Adeline is Tessro's proprietary design intelligence, trained specifically on modern web architecture. Choose an aesthetic, upload your assets, and watch Adeline assemble your site.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ENGINE: ADELINE NEURAL CORE</span>
          </div>
        </div>

        {/* Style Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {(Object.keys(STYLES) as StyleKey[]).map((key) => {
            const item = STYLES[key];
            const IconComponent = item.icon;
            const isSelected = activeStyle === key;

            return (
              <button
                key={key}
                onClick={() => setActiveStyle(key)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                  isSelected
                    ? "border-cyan-400 bg-white/[0.08] shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                    : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <IconComponent className={`w-5 h-5 ${isSelected ? "text-cyan-400" : "text-zinc-400"}`} />
                  {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
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

        {/* Interactive Playground & Live Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Prompt & Config Inputs (Left) */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-col gap-6">
            <div>
              <h3 className="text-base font-medium text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Prompt & Asset Injection for Adeline
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Tell Adeline what the website is for and attach brand reference images.
              </p>
            </div>

            {/* Prompt Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Website Purpose & Audience
              </label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-black border border-white/15 text-white text-xs font-sans focus:outline-none focus:border-cyan-400 resize-none transition"
                placeholder="e.g. A boutique coffee roastery website with subscription pricing and dark aesthetic..."
              />
            </div>

            {/* Drag & Drop Asset Upload (Google Cloud Storage Destination) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Brand Assets / Logo</span>
                <span className="text-[10px] text-cyan-400 font-normal">GCS 1TB CLUSTER</span>
              </label>
              <label className="border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-black/40 transition">
                <UploadCloud className="w-6 h-6 text-zinc-400" />
                <span className="text-xs text-zinc-300 font-medium">
                  {uploadedFile ? `Asset Loaded: ${uploadedFile}` : "Upload logo or style moodboard"}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">PNG, SVG, JPG up to 25MB</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedFile(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>

            {/* Palette Preview */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="font-mono text-zinc-400">Archetype Palette:</span>
              <div className="flex items-center gap-1.5">
                {current.palette.map((color, i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            <a
              href="#plans"
              className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-medium text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
            >
              <span>Build In {current.name} ($29.99)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Live Mock Render (Right) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-2">
              <span>SANDBOX LIVE PREVIEW (16:9 CONTAINER)</span>
              <span className="text-cyan-400">STATUS: READY TO RENDER</span>
            </div>

            {/* Render Stage Container */}
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl border border-white/10 bg-[#07070a] p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-500 shadow-2xl">
              
              {/* Background preview effect based on archetype */}
              <div className="absolute inset-0 bg-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none"></div>

              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-white uppercase">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  {activeStyle === "brutalism" ? "TESSRO.RAW" : "TESSRO CLIENT PREVIEW"}
                </div>
                <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
                  <span>NAV</span>
                  <span>ABOUT</span>
                  <span>CONTACT</span>
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white text-[10px]">GET STARTED</span>
                </div>
              </div>

              {/* Dynamic Styled Hero Card */}
              <div className={`my-auto p-6 transition-all duration-500 relative z-10 ${current.cssPreviewClass}`}>
                <div className="text-[10px] font-mono tracking-widest uppercase opacity-70 mb-2">
                  {current.badge} // GENERATED PREVIEW
                </div>
                <h4 className="text-xl sm:text-3xl font-bold tracking-tight mb-2">
                  {current.mockHeroTitle}
                </h4>
                <p className="text-xs sm:text-sm opacity-80 max-w-lg mb-5">
                  {current.mockHeroSubtitle} Tailored for: "{promptText.slice(0, 50)}..."
                </p>

                {/* Feature Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {current.mockFeatures.map((feat, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-black/30 border border-white/10 text-[11px] font-mono flex items-center gap-1.5">
                      <span className="text-cyan-400 font-bold">#</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mockup Footer */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/10 relative z-10">
                <span>EXPORT FORMAT: HTML5 + TAILWIND + REACT</span>
                <span>RESPONSIVE ENGINE ACTIVE</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
