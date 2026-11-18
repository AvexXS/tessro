"use client";

import Link from "next/link";
import AtlasNav from "@/components/AtlasNav";
import CtaFooter from "@/components/CtaFooter";
import { ShieldCheck, FileText, Clock, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white/20">
      <AtlasNav />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-8 pt-36 pb-24 space-y-12">
        {/* Header Block */}
        <div className="space-y-4 pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>Legal Framework // Last Updated: November 2026</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight"
            style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}
          >
            Terms of Service
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Transparent, developer-first commercial agreements governing Tessro Digital Design Studio, the Adeline Autonomous Website Builder, and our 1TB cloud delivery infrastructure.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-zinc-300 font-light">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">01 /</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p>
              By accessing, commissioning work from, or utilizing the web applications provided by Tessro (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), including the Tessro Studio Client Hub, the Adeline AI synthesis engine, and our cloud delivery network, you (&quot;Client&quot; or &quot;User&quot;) agree to be bound by these Terms of Service. If you do not agree to these terms, do not access our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">02 /</span>
              <span>Human Studio Services ($49.99 Flat)</span>
            </h2>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>72-Hour Guaranteed Delivery SLA</span>
              </div>
              <p>
                Each Human Studio ticket commissioned at the flat rate of <strong>$49.99 USD</strong> includes full bespoke interface architecture produced by a verified senior designer.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 text-xs">
                <li><strong>Turnaround:</strong> Initial Figma prototype and design tokens delivered within 72 hours of brief submission.</li>
                <li><strong>Unlimited Revisions:</strong> Clients enjoy unlimited revision rounds until complete approval is submitted via the Client Hub.</li>
                <li><strong>Dedicated Designer:</strong> Direct 1-on-1 encrypted channel communication with your assigned designer throughout the revision cycle.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">03 /</span>
              <span>Adeline Autonomous Website Builder ($29.99 Flat)</span>
            </h2>
            <p>
              Our proprietary Adeline engine autonomously compiles, designs, and packages complete responsive single-page applications at <strong>$29.99 USD</strong> flat per synthesized deployment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-emerald-400 uppercase font-semibold">Zero Vendor Lock-In</span>
                <p className="text-zinc-400 mt-1 font-sans">
                  You receive 100% clean standalone HTML5, Tailwind CSS, or React 19 source code that runs independently on Vercel, Netlify, or any static host.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-cyan-400 uppercase font-semibold">15-Minute Pipeline</span>
                <p className="text-zinc-400 mt-1 font-sans">
                  Instant multi-viewport compilation across 5 visual archetypes with live CDN hosting and full ZIP archive export.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">04 /</span>
              <span>Full Intellectual Property (IP) Ownership Transfer</span>
            </h2>
            <p>
              Upon delivery and payment settlement, <strong>100% of all intellectual property rights</strong>, including Figma design files, source tokens, HTML/CSS/Tailwind code, 3D shader uniforms, typography mappings, and media assets, are unconditionally transferred to the Client.
            </p>
            <p className="text-zinc-400 text-xs">
              Tessro retains only the right to display the finalized design in our public portfolio and case study archive, unless a non-disclosure agreement (NDA) is explicitly requested via the ticket brief.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">05 /</span>
              <span>Micro Studios ($5.00 Flat)</span>
            </h2>
            <p>
              Add-on assets commissioned through the Micro Studio, including typographic wordmarks, animated WebGL canvas headers, vector logos, and video loop adaptations, are priced at <strong>$5.00 USD</strong> flat per deliverable with 24-hour turnaround.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">06 /</span>
              <span>Refund & Satisfaction Guarantee</span>
            </h2>
            <p>
              Because we provide unlimited revisions on all Human Studio tickets, our policy is to iterate until your exact design standards are satisfied. In the rare circumstance where initial concepts fail to satisfy the creative brief and no revisions have yet been executed, full refunds may be requested within 7 days of ticket creation.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">07 /</span>
              <span>Service Modifications & Inquiries</span>
            </h2>
            <p>
              We reserve the right to refine our platform, update pricing tiers, or amend these terms with notice published to this URI. Continued utilization of Tessro constitutes acceptance of updated agreements.
            </p>
            <div className="pt-2 text-xs font-mono text-zinc-400">
              Direct legal inquiries: <a href="mailto:legal@tessro.com" className="text-white hover:underline">legal@tessro.com</a>
            </div>
          </section>

        </div>
      </main>

      <CtaFooter />
    </div>
  );
}
