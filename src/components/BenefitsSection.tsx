"use client";

import React, { useState } from "react";
import { Sparkles, Layers, Cpu } from "lucide-react";

interface BenefitsSectionProps {
  useOriginalCopy?: boolean;
}

export function BenefitsSection({ useOriginalCopy = false }: BenefitsSectionProps) {
  const [isTessroCopy, setIsTessroCopy] = useState(!useOriginalCopy);

  return (
    <section
      id="benefits"
      className="relative w-full bg-black text-white py-24 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 font-sans selection:bg-white/20 overflow-hidden"
    >
      <div className="w-full max-w-[1240px] mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            Architectural Superiority • Key Benefits
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight" style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}>
            Engineered For Pure Precision
          </h2>

          <p className="mt-3 text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Eliminating agency bloat with autonomous design intelligence and 1-on-1 human studio craft.
          </p>
        </div>

        {/* THREE-COLUMN CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Text Card (Left) */}
          <div className="relative h-[400px] sm:h-[460px] rounded-3xl bg-neutral-950/90 overflow-hidden p-7 sm:p-8 border border-white/10 group hover:border-white/25 transition-all flex flex-col justify-between shadow-xl">
            {/* Ambient Monochrome Glow */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-[300px] h-[360px] w-[360px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">SYS.01 // SYNTHESIS</span>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Cpu className="w-3.5 h-3.5 text-zinc-300" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-light text-white leading-snug tracking-tight">
                  Autonomous Synthesis <br />
                  and Layout Heuristics
                </h3>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-light">
                  Adeline neural pipelines continuously analyze visual balance, contrast ratios, and design tokens to synthesize production-ready interfaces without human latency or layout debt.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Video Card (Center) */}
          <div className="relative h-[400px] sm:h-[460px] rounded-3xl bg-neutral-950/90 overflow-hidden flex flex-col border border-white/10 group hover:border-white/25 transition-all shadow-xl">
            {/* Top video region (height: 72%) */}
            <div className="relative w-full overflow-hidden" style={{ height: "72%" }}>
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072701_f6a01abb-eb30-4559-9d6e-774362defbc3.mp4"
                className="w-full h-full object-cover block filter grayscale contrast-125 brightness-90"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Bottom fade overlay inside video wrapper */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-neutral-950" />
            </div>

            {/* Bottom text region */}
            <div className="flex-1 flex flex-col justify-center px-7 sm:px-8 pb-6">
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1">SYS.02 // DIRECTION</span>
              <h3 className="text-xl sm:text-2xl font-light text-white leading-tight tracking-tight text-left">
                Human Art Direction <br />
                and Sectoral Craft
              </h3>
            </div>
          </div>

          {/* Card 3: Text Card (Right) */}
          <div className="relative h-[400px] sm:h-[460px] rounded-3xl bg-neutral-950/90 overflow-hidden p-7 sm:p-8 border border-white/10 group hover:border-white/25 transition-all flex flex-col justify-between shadow-xl">
            {/* Ambient Monochrome Glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">SYS.03 // DECOUPLED</span>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-zinc-300" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-light text-white leading-snug tracking-tight">
                  Zero Lock-In <br />
                  and Decoupled Speed
                </h3>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-light">
                  Every synthesized site compiles to clean, self-contained HTML5, React 19, and Tailwind CSS source code. Deployed with free 1TB Google Cloud Storage CDN edge caching and zero vendor lock-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
