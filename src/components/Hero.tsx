import { Sparkles, Users, ArrowUpRight, ShieldCheck, Zap, HardDrive } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">
            Tessro Architecture v1.0 • Hybrid Design Ecosystem
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white max-w-5xl leading-[1.08]">
          Bespoke websites. <br />
          <span className="font-serif italic text-zinc-400">Handcrafted</span> or{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent font-medium">
            Adeline-Built.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">
          The modern design house for startups. Hire dedicated human designers with live ticket iterations for <span className="text-white font-medium">$49.99</span>, or build tailored websites with Adeline AI in 60 seconds for <span className="text-white font-medium">$29.99</span>.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#plans"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-medium text-sm font-mono tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            <span>Choose Your Plan</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            href="#ai-builder"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/30 text-sm font-mono tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Explore AI Archetypes</span>
          </a>
        </div>

        {/* Feature Badges Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
          
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-left flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-cyan-400">
              <Users className="w-4 h-4" />
              <span className="text-xs font-mono font-medium tracking-wider text-zinc-200 uppercase">Human Studio</span>
            </div>
            <p className="text-xs text-zinc-400">Dedicated ticket portal with direct designer collaboration.</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-left flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono font-medium tracking-wider text-zinc-200 uppercase">Adeline AI</span>
            </div>
            <p className="text-xs text-zinc-400">Glassmorphism, Clay, Brutalism & Bento generation in seconds.</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-left flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <HardDrive className="w-4 h-4" />
              <span className="text-xs font-mono font-medium tracking-wider text-zinc-200 uppercase">1TB Cloud CDN</span>
            </div>
            <p className="text-xs text-zinc-400">Zero-cost global asset delivery via Google Cloud Storage.</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-left flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-amber-400">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-mono font-medium tracking-wider text-zinc-200 uppercase">$5 Micro Tools</span>
            </div>
            <p className="text-xs text-zinc-400">Add-on AI vector logos and ambient video generation.</p>
          </div>

        </div>

      </div>
    </section>
  );
}
