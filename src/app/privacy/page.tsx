"use client";

import Link from "next/link";
import AtlasNav from "@/components/AtlasNav";
import CtaFooter from "@/components/CtaFooter";
import { Shield, Lock, Eye, HardDrive, Key, CheckCircle2, ArrowRight } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white/20">
      <AtlasNav />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-8 pt-36 pb-24 space-y-12">
        {/* Header Block */}
        <div className="space-y-4 pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy Standard // GDPR & CCPA Verified</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight"
            style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}
          >
            Privacy Policy
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Our architectural commitment to zero-trust client confidentiality, cryptographic passkey authentication, and decentralized asset delivery.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-zinc-300 font-light">
          
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">01 /</span>
              <span>Our Privacy Philosophy</span>
            </h2>
            <p>
              Tessro (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;) designs digital standards for the world&apos;s leading tech and financial organizations. We operate on a strict <strong>minimal data footprint</strong> principle: we collect only what is cryptographically required to authenticate your identity, deliver your custom design briefs, and accelerate asset distribution across our 1TB cloud edge network.
            </p>
          </section>

          {/* Section 2: Data Collection */}
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">02 /</span>
              <span>Information We Process</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Account & Authentication</span>
                </div>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  Your work email address, display name, and securely salted PBKDF2 password hash. We never store raw plain-text passwords under any condition.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Biometric Passkeys (FIDO2)</span>
                </div>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  When using Face ID or Touch ID passkeys, biometric raw data never leaves your hardware device. We store only the standard cryptographic public key for challenge verification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <HardDrive className="w-4 h-4 text-indigo-400" />
                  <span>Cloud Storage CDN Assets</span>
                </div>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  Brand files, SVG logos, and Figma tokens uploaded through the Client Hub are stored in isolated Google Cloud Storage buckets encrypted at rest with AES-256.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Zero Third-Party Advertising</span>
                </div>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  We never sell, rent, monetize, or broker your personal information or design deliverables to marketing data brokers or advertising exchanges.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Cookies and Edge Caching */}
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">03 /</span>
              <span>Cookie Governance & Edge Caching</span>
            </h2>
            <p>
              We use strictly functional cookies and edge tokens to maintain your active authenticated session across our route middleware. You may configure granular preferences or reject non-essential telemetry at any time via the floating Cookie Preference panel in the bottom-right corner of the interface.
            </p>
          </section>

          {/* Section 4: Data Security & Retention */}
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">04 /</span>
              <span>Data Security & Right to Erasure</span>
            </h2>
            <p>
              All traffic between your browser and Tessro is secured with TLS 1.3 encryption. In compliance with the European General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain the right to request full export or permanent cryptographic deletion of your account records, tickets, and cloud storage files.
            </p>
            <p className="text-zinc-400 text-xs">
              To request full data erasure, submit an account request to <a href="mailto:privacy@tessro.com" className="text-white hover:underline">privacy@tessro.com</a> or use the account settings in your Client Dashboard.
            </p>
          </section>

          {/* Section 5: Contact */}
          <section className="space-y-3 pt-4 border-t border-white/10">
            <h2 className="text-base font-medium text-white">Data Protection Officer</h2>
            <p className="text-xs text-zinc-400">
              For security disclosures, sub-processor inquiries, or compliance audits, contact our security operations desk at <a href="mailto:security@tessro.com" className="text-white hover:underline">security@tessro.com</a>.
            </p>
          </section>

        </div>
      </main>

      <CtaFooter />
    </div>
  );
}
