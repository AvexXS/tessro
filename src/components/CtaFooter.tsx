"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CtaFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setVideoLoaded(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <section className="relative w-full bg-black text-white pt-16 pb-12 overflow-hidden font-sans border-t border-white/[0.08]">
      <style jsx>{`
        .cta-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .cta-card {
          position: relative;
          min-height: 380px;
          border-radius: clamp(16px, 2.2vw, 24px);
          overflow: hidden;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.9), inset 0 0 40px rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(32px, 5.5vw, 68px) clamp(20px, 4vw, 48px);
          text-align: center;
        }

        .cta-bg-plate {
          position: absolute;
          inset: 0;
          background-image: url('https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/03c58212-3a59-4c80-b19d-30d05a174563.webp');
          background-size: cover;
          background-position: right bottom;
          opacity: 0.45;
          filter: grayscale(100%) contrast(120%) brightness(0.6);
          pointer-events: none;
        }

        .cta-bg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: right bottom;
          opacity: 0;
          filter: grayscale(100%) contrast(120%) brightness(0.6);
          transition: opacity 1.2s ease-in-out;
          pointer-events: none;
        }

        .cta-bg-video.is-loaded {
          opacity: 0.55;
        }

        .cta-overlay-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.9) 100%);
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 10;
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cta-headline {
          font-family: "BubbledotICG-FinePos", "Geist Pixel Circle", monospace;
          font-weight: 300;
          font-size: clamp(26px, 3.4vw, 42px);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin-bottom: 12px;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
        }

        .cta-sub {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(14px, 1.4vw, 16px);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.8);
          max-width: 540px;
          margin-bottom: clamp(24px, 3.6vh, 36px);
        }

        .cta-form {
          position: relative;
          width: 100%;
          max-width: 490px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.16);
          padding: 5px 6px 5px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(16px);
          transition: border-color 0.25s, box-shadow 0.25s;
        }

        .cta-form:focus-within {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 24px rgba(255, 255, 255, 0.12);
        }

        .cta-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: clamp(13px, 1.3vw, 14.5px);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .cta-input::placeholder {
          color: #808081;
        }

        .cta-btn {
          height: 42px;
          padding: 0 22px;
          border-radius: 999px;
          background: #ffffff;
          color: #000000;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'Inter', system-ui, sans-serif;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.2);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }

        .cta-btn:hover {
          background: #e4e4e7;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.35);
        }

        /* Footer */
        .footer-body {
          margin-top: clamp(48px, 6vw, 72px);
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 40px;
          padding-bottom: 36px;
        }

        .footer-logo {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 300;
          font-size: 18px;
          letter-spacing: 0.45em;
          color: #ffffff;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 16px;
        }

        .footer-desc {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13.5px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.65);
          max-width: 480px;
        }

        .footer-right {
          justify-self: end;
          text-align: right;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .footer-right h4 {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .footer-phone {
          display: block;
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .footer-phone:hover {
          color: #FF8A73;
          text-decoration: underline;
        }

        .footer-address {
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.5);
          font-style: normal;
        }

        .footer-bottom {
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .footer-bottom a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-bottom a:hover {
          color: #FF8A73;
          text-decoration: underline;
        }

        @media (max-width: 820px) {
          .footer-body {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-right {
            justify-self: start;
            text-align: left;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="cta-container">
        
        {/* FRAMED CTA CARD WITH SWIRLING CORAL & CRIMSON NEBULA SMOKE */}
        <div className="cta-card">
          {/* Still Plate */}
          <div className="cta-bg-plate" aria-hidden="true" />

          {/* Crossfading Loop Video */}
          <video
            ref={videoRef}
            className={`cta-bg-video ${videoLoaded ? "is-loaded" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
          >
            <source
              src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/f6f4ec49-d5dd-4893-8eb4-fa0f932aceaf.mp4"
              type="video/mp4"
            />
          </video>

          {/* Vignette Overlay */}
          <div className="cta-overlay-gradient" />

          {/* CTA Content */}
          <div className="cta-content">
            <h2 className="cta-headline">
              Synthesize Your Next Digital Standard
            </h2>
            <p className="cta-sub">
              Join 200+ fast-moving brands and engineering teams launching high-converting websites in under 15 minutes with Adeline AI.
            </p>

            {submitted ? (
              <div className="flex items-center gap-3 bg-black/80 border border-emerald-500/40 rounded-full px-6 py-3 text-emerald-300 text-sm font-medium backdrop-blur-xl animate-[fadeIn_0.3s_ease]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>You&apos;re on the priority waitlist. Studio invite dispatched.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="cta-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to join the waitlist"
                  className="cta-input"
                  required
                />
                <button type="submit" className="cta-btn">
                  <span>Get Free Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="mt-4 flex items-center gap-6 text-[11px] font-mono text-white/50">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
                Zero setup friction
              </span>
              <span>•</span>
              <span>1TB Free Image CDN</span>
              <span>•</span>
              <span>Instant ZIP Code Export</span>
            </div>
          </div>
        </div>

        {/* INTEGRATED TWO-COLUMN FOOTER */}
        <div className="footer-body">
          <div className="footer-left">
            <Link href="/" className="footer-logo">
              T E S S R O
            </Link>
            <p className="footer-desc">
              Tessro is the autonomous digital design intelligence. High-end human studio craft ($49.99) paired with 15-minute Adeline AI site synthesis ($29.99), 1TB free Google Cloud CDN storage, and instant production-ready code exports.
            </p>
          </div>

          <div className="footer-right">
            <h4>Contact Studio</h4>
            <a href="tel:+18005928377" className="footer-phone">
              +1 (800) 592-TESSRO
            </a>
            <address className="footer-address">
              Tessro Digital Inc.,<br />
              548 Market St, Suite 9200,<br />
              San Francisco, CA 94104
            </address>
          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="footer-bottom">
          <div className="flex items-center gap-3">
            <span>Copyright &copy; 2026 Tessro Digital Inc. All Rights Reserved.</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition underline underline-offset-4">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition underline underline-offset-4">
              Terms of Service
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@tessro.com">Email us: hello@tessro.com</a>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              1TB GOOGLE CLOUD STORAGE CDN ACTIVE
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
