import { Server, ShieldAlert, Cpu, HardDrive, Layers, ArrowRight, CheckCircle } from "lucide-react";

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4">
            Under The Hood • Infrastructure
          </div>
          <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Engineered for Zero Overhead. Built to Scale.
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Tessro runs on a modern serverless edge architecture with a permanent multi-cloud storage cluster.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-mono text-sm text-cyan-400 font-bold mb-4">
                01
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Select Pipeline</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Choose between our <strong>$49.99 Human Designer Ticket</strong> (where our verified agency team executes custom Figma & code) or the <strong>$29.99 AI Builder</strong> for immediate 60-second generation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-500">
              OAUTH: GOOGLE 1-CLICK AUTH
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-mono text-sm text-indigo-400 font-bold mb-4">
                02
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Collaborate or Synthesize</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                In the Human Ticket portal, chat directly with your designer, review drafts, and request iterations. In the AI Builder, adjust your prompt, upload moodboards, and watch the site assemble.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-500">
              TICKETS: REAL-TIME WEBSOCKETS
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-mono text-sm text-emerald-400 font-bold mb-4">
                03
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Deploy & Export</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Receive your complete production-ready source code (HTML5, Tailwind, React, and Figma source). All images are permanently served from your Google Cloud Storage CDN.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-500">
              EXPORT: 1-CLICK ZIP & GITHUB
            </div>
          </div>

        </div>

        {/* Multi-Cloud Cluster Explainer Box */}
        <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#08080c] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3">
                <HardDrive className="w-4 h-4" />
                Cluster Storage Engine
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                1TB Google Cloud Storage + Multi-Cloud Clusters
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                All client media, generated websites, logos, and design drafts are backed by your 1TB Google Cloud Storage bucket acting as a global edge CDN. From the Tessro Admin Panel, you can attach secondary cloud storage clusters (AWS S3, Cloudflare R2, Backblaze) whenever capacity is reached.
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-white/10 bg-black/50">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Primary Node</div>
                  <div className="text-xs font-medium text-white mt-1">Google Cloud (1 TB)</div>
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-black/50">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Hosting Cost</div>
                  <div className="text-xs font-medium text-emerald-400 mt-1">$0.00 / month</div>
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-black/50">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">CDN Latency</div>
                  <div className="text-xs font-medium text-cyan-400 mt-1">&lt; 25ms Global</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl border border-white/10 bg-black/80 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-500 border-b border-white/10 pb-3 mb-3">
                <span className="text-zinc-400">ADMIN STORAGE CLUSTERS</span>
                <span className="text-emerald-400">HEALTH: 100%</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>[NODE 01] GCS-US-CENTRAL1</span>
                  <span className="text-cyan-400">ACTIVE (1TB)</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[8%]"></div>
                </div>
                <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                  <span>Used: 82.4 GB / 1,024 GB</span>
                  <span>Spillover: Ready</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>+ ATTACH NEW CLOUD CLUSTER</span>
                  <span className="text-zinc-300">&rarr;</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
