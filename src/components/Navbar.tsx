"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#050507]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-xl tracking-[0.35em] font-medium text-white group-hover:text-cyan-400 transition-colors">
            TESSRO
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-400">
          <a href="#plans" className="hover:text-white transition-colors">Plans</a>
          <a href="#ai-builder" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Adeline AI
          </a>
          <a href="#human-design" className="hover:text-white transition-colors">Human Studio</a>
          <a href="#micro-tools" className="hover:text-white transition-colors">$5 Tools</a>
          <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => alert("Google OAuth integration will be triggered here.")}
            className="text-xs font-mono tracking-wider text-zinc-400 hover:text-white transition px-3 py-1.5 cursor-pointer"
          >
            Sign In
          </button>
          
          <a 
            href="#plans"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider text-black bg-white hover:bg-zinc-200 transition font-medium cursor-pointer"
          >
            <span>Start Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#09090e] px-4 py-5 flex flex-col gap-4 text-xs font-mono uppercase tracking-widest text-zinc-400">
          <a href="#plans" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Plans & Pricing</a>
          <a href="#ai-builder" onClick={() => setMobileMenuOpen(false)} className="hover:text-white flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Website Builder ($29.99)
          </a>
          <a href="#human-design" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Human Design Studio ($49.99)</a>
          <a href="#micro-tools" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">$5 Micro Tools (Logo & Video)</a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">How It Works</a>
          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <button 
              onClick={() => alert("Google OAuth Sign In")} 
              className="w-full py-2 text-center text-zinc-300 hover:text-white border border-white/10 rounded-lg"
            >
              Sign In (OAuth)
            </button>
            <a 
              href="#plans" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full py-2.5 text-center text-black bg-white font-medium rounded-lg"
            >
              Start Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
