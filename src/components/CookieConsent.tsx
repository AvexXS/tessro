"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cookie, X, Check, Settings2 } from "lucide-react";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [cdnCacheEnabled, setCdnCacheEnabled] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem("tessro_cookies");
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 400);
        return () => clearTimeout(timer);
      } else {
        setHasConsent(true);
      }
    } catch {}
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        "tessro_cookies",
        JSON.stringify({
          essential: true,
          analytics: true,
          cdnCache: true,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {}
    setHasConsent(true);
    setVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem(
        "tessro_cookies",
        JSON.stringify({
          essential: true,
          analytics: false,
          cdnCache: false,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {}
    setHasConsent(true);
    setVisible(false);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        "tessro_cookies",
        JSON.stringify({
          essential: true,
          analytics: analyticsEnabled,
          cdnCache: cdnCacheEnabled,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {}
    setHasConsent(true);
    setShowPreferences(false);
    setVisible(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating mini icon to re-open preferences if already accepted */}
      {hasConsent && !visible && (
        <button
          onClick={() => setVisible(true)}
          className="fixed bottom-4 right-4 z-40 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md shadow-lg transition-all hover:scale-105 cursor-pointer"
          title="Cookie & Privacy Settings"
          aria-label="Cookie & Privacy Settings"
        >
          <Cookie className="w-4 h-4" />
        </button>
      )}

      {/* Main Glassmorphic Cookie Banner */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-full"
          >
            <div className="relative p-5 sm:p-6 rounded-3xl bg-[#09090d]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-white font-sans overflow-hidden">
              {/* Specular top highlight */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <Cookie className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium tracking-tight text-white flex items-center gap-1.5">
                      <span>Privacy & Edge Cache</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      Zero-Trust Telemetry
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAcceptEssential}
                  className="text-zinc-500 hover:text-white transition p-1 cursor-pointer"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!showPreferences ? (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    We use edge cookies and 1TB Google Cloud Storage caching to accelerate asset delivery and preserve your studio sessions. No third-party ad tracking.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 font-mono text-xs">
                    <button
                      onClick={handleAcceptAll}
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-white text-black font-semibold uppercase tracking-wider hover:bg-zinc-200 transition cursor-pointer shadow-md text-center"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleAcceptEssential}
                      className="w-full sm:flex-1 py-2.5 px-3 rounded-full border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white uppercase tracking-wider transition cursor-pointer text-center text-[11px]"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="p-2.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
                      title="Configure preferences"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/5">
                    <Link href="/privacy" className="hover:text-zinc-300 transition underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    <span>•</span>
                    <Link href="/terms" className="hover:text-zinc-300 transition underline underline-offset-2">
                      Terms of Service
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1 text-xs font-mono animate-[fadeIn_0.2s_ease]">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div>
                      <div className="text-white font-medium">Essential Auth Cookies</div>
                      <div className="text-[10px] text-zinc-500 font-sans">JWT session & security middleware</div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Required</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div>
                      <div className="text-white font-medium">1TB CDN Edge Caching</div>
                      <div className="text-[10px] text-zinc-500 font-sans">Accelerates preview renders & video loading</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={cdnCacheEnabled}
                      onChange={(e) => setCdnCacheEnabled(e.target.checked)}
                      className="accent-white cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div>
                      <div className="text-white font-medium">Performance Telemetry</div>
                      <div className="text-[10px] text-zinc-500 font-sans">Anonymous Core Web Vitals diagnostics</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      className="accent-white cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 py-2 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition cursor-pointer"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={() => setShowPreferences(false)}
                      className="px-4 py-2 rounded-full border border-white/15 text-zinc-400 hover:text-white text-xs uppercase transition cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
