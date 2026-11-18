"use client";

import { Check, Sparkles, Users, MessageSquare, ArrowRight, ShieldCheck, Clock, DownloadCloud } from "lucide-react";

export default function PricingPlans() {
  return (
    <section id="plans" className="py-24 border-t border-white/[0.08] relative">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-cyan-500/5 blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-mono tracking-widest uppercase mb-4">
            Transparent Pricing • No Subscriptions
          </div>
          <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Two Paths. One Obsession with Quality.
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Whether you desire meticulous human agency craftsmanship or lightning-fast AI synthesis, your digital presence is built to lead.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: Human Graphic & Web Designer */}
          <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col justify-between relative group hover:border-white/20 transition-all">
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-wider uppercase">
                  <Users className="w-3.5 h-3.5" />
                  Human Craftsmanship
                </div>
                <span className="text-xs font-mono text-zinc-500">TURNAROUND: 48H</span>
              </div>

              <h3 className="text-2xl font-light text-white tracking-tight">
                Dedicated Human Designer
              </h3>
              <p className="text-xs text-zinc-400 mt-2">
                A dedicated senior web & graphic designer assigned directly to your project through our private client ticket portal.
              </p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-light text-white tracking-tight">$49.99</span>
                <span className="text-xs font-mono text-zinc-500 uppercase">/ One-time project</span>
              </div>

              {/* Features List */}
              <div className="mt-8 space-y-3.5 border-t border-white/10 pt-6">
                {[
                  "Dedicated 1-on-1 human web & graphic designer",
                  "Direct ticket portal with live messaging & draft reviews",
                  "Admin-monitored quality guarantee & revision rounds",
                  "Custom responsive website layout (Mobile + Desktop)",
                  "Complete Figma design files included",
                  "Clean production code export (HTML, Tailwind, React)",
                  "Assets permanently hosted on Google Cloud Storage CDN",
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <button
                onClick={() => alert("Human Designer Ticket Checkout will open with Google OAuth.")}
                className="w-full py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Designer Ticket ($49.99)</span>
              </button>
              <div className="mt-2.5 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ticket verified & reviewed by Tessro Admin</span>
              </div>
            </div>

          </div>

          {/* Card 2: Tessro AI Website Builder */}
          <div className="p-8 sm:p-10 rounded-3xl border border-cyan-500/30 bg-[#09090f] shadow-[0_0_50px_rgba(6,182,212,0.12)] flex flex-col justify-between relative group hover:border-cyan-400 transition-all">
            
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-[10px] font-mono font-bold tracking-widest uppercase">
              POPULAR • INSTANT
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Adeline Neural Engine
                </div>
                <span className="text-xs font-mono text-cyan-400">SPEED: 60 SEC</span>
              </div>

              <h3 className="text-2xl font-light text-white tracking-tight">
                Adeline AI Website Builder
              </h3>
              <p className="text-xs text-zinc-400 mt-2">
                Adeline, Tessro's proprietary design intelligence, generates production-grade, responsive websites from prompts and visual archetypes.
              </p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-light text-white tracking-tight">$29.99</span>
                <span className="text-xs font-mono text-zinc-500 uppercase">/ One-time project</span>
              </div>

              {/* Features List */}
              <div className="mt-8 space-y-3.5 border-t border-white/10 pt-6">
                {[
                  "Choose visual archetypes: Glassmorphism, Clay, Brutalism, Minimal, Bento",
                  "Prompt-driven layout & copy synthesis tailored to your niche",
                  "Upload custom brand images & logos (GCS 1TB CDN storage)",
                  "Live sandboxed interactive in-browser preview with device switcher",
                  "One-click complete project download (ZIP containing HTML, CSS, React)",
                  "Regenerate sections and refine prompts at any time",
                  "Deploy for free on Vercel with single-click guide",
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <button
                onClick={() => alert("Adeline AI Builder Studio will open after Google OAuth Sign-in.")}
                className="w-full py-4 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-medium text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(56,189,248,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Adeline AI ($29.99)</span>
              </button>
              <div className="mt-2.5 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant access • Export source code immediately</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
