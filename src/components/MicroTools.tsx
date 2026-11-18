"use client";

import { Sparkles, Video, Image, Download, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default function MicroTools() {
  return (
    <section id="micro-tools" className="py-24 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono tracking-widest uppercase mb-3">
              <Zap className="w-3.5 h-3.5" />
              $5.00 Micro AI Studios
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              Essential Brand Assets. Five Dollars Flat.
            </h2>
            <p className="mt-3 text-zinc-400 text-sm max-w-xl">
              High-resolution vector logos and ambient video backgrounds tailored to your website. Generate what you need without agency overhead.
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-500">
            TRANSPARENT EXPORT • INSTANT DOWNLOAD
          </div>
        </div>

        {/* Micro-Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tool 1: AI Logo Designer ($5) */}
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/30 transition-all">
            
            <div className="absolute top-0 right-0 p-8 text-amber-500/10 group-hover:text-amber-500/20 transition">
              <Image className="w-36 h-36 -mr-10 -mt-10 pointer-events-none" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
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

              {/* Sample deliverables */}
              <div className="mt-6 space-y-2.5">
                {[
                  "Clean SVG vector code + High-res Transparent PNG (4000x4000)",
                  "Minimalist, Swiss, Geometric, and Luxury typography modes",
                  "Dark and light mode variations generated automatically",
                  "Stored on your Google Cloud Storage CDN with permanent links",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
              <button
                onClick={() => alert("AI Logo Generator Tool ($5) will trigger.")}
                className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Generate Logo ($5.00)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Tool 2: AI Video Designer ($5) */}
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all">
            
            <div className="absolute top-0 right-0 p-8 text-purple-500/10 group-hover:text-purple-500/20 transition">
              <Video className="w-36 h-36 -mr-10 -mt-10 pointer-events-none" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
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

              {/* Sample deliverables */}
              <div className="mt-6 space-y-2.5">
                {[
                  "16:9 4K / 1080p Web-Optimized MP4 video format",
                  "Seamless loop engineered specifically for website hero backgrounds",
                  "Audio-free, sub-5MB fast loading for 100/100 Core Web Vitals",
                  "Hosted directly on Google Cloud CDN with zero buffering",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
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
  );
}
