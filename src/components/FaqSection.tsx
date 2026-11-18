"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Sparkles, Layers, HardDrive, Palette, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: "Adeline AI Synthesis",
    question: "How does Adeline AI synthesize production websites in 15 minutes?",
    answer:
      "Adeline analyzes your prompt, token preferences, and design moodboards, directly engineering clean semantic HTML, Tailwind CSS, and TypeScript across 5 architectural archetypes (Glassmorphism, Swiss Minimalism, Neo-Brutalism, Claymorphism, and Liquid Glass Bento). You get instant ZIP exports and live sandboxed previews.",
  },
  {
    category: "Human Studio",
    question: "What is included with the $49.99 Human Designer Studio tier?",
    answer:
      "You receive 1-on-1 private ticketing portal collaboration with dedicated senior digital architects, full Figma source files, responsive production code implementation, unlimited design revisions, and guaranteed 72-hour delivery.",
  },
  {
    category: "Cloud CDN",
    question: "How does the free 1TB Google Cloud Storage CDN work?",
    answer:
      "Every project built on Tessro receives high-speed global media distribution powered by a dedicated 1TB Google Cloud Storage bucket with Edge CDN caching, delivering sub-millisecond asset response times with zero monthly hosting overhead.",
  },
  {
    category: "Code & Export",
    question: "Can I export the full source code and self-host anywhere?",
    answer:
      "Yes, completely. All websites synthesized by Adeline or crafted by our studio export as clean, unminified Tailwind CSS, React/Next.js, or static HTML/CSS with zero vendor lock-in. You can host on Vercel, Cloudflare Pages, AWS, or your private servers.",
  },
  {
    category: "Micro Studios",
    question: "What are the $5.00 Micro AI Studios?",
    answer:
      "Our micro-generation labs deliver specialized standalone digital assets: the AI Logo Studio ($5.00 flat) for transparent 4K PNGs and vector SVGs, and the AI Video Studio ($5.00 flat) for sub-5MB 16:9 ambient motion hero video backdrops.",
  },
  {
    category: "Adeline AI Synthesis",
    question: "Are the generated websites fully mobile-responsive and SEO-optimized?",
    answer:
      "Yes. Every build undergoes automated viewport benchmarking across 320px, 768px, 1024px, and 1440px+ breakpoints with accessible contrast ratios, valid semantic tags, and pre-configured OpenGraph metadata.",
  },
];

const CATEGORIES = [
  {
    title: "Tessro & Adeline",
    desc: "Autonomous Core Intelligence",
    icon: Sparkles,
  },
  {
    title: "Human Studio Craft",
    desc: "Senior 1-on-1 Designers",
    icon: Palette,
  },
  {
    title: "15-Min Synthesis",
    desc: "5 Architectural Archetypes",
    icon: Layers,
  },
  {
    title: "1TB Cloud CDN",
    desc: "Free Edge Asset Storage",
    icon: HardDrive,
  },
];

export default function FaqSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory ? item.category === selectedCategory : true;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-black text-white py-24 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans border-t border-white/10"
    >
      {/* Subtle Monochrome Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06)_0%,_transparent_70%)] pointer-events-none blur-3xl" />

      {/* BALANCED 1240PX CONTAINER */}
      <div className="relative z-10 max-w-[1240px] mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            Frequently Asked Questions
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight" style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}>
            Clear Answers to Every Question
          </h2>

          <p className="mt-3 text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Everything you need to know about our human designer studio ($49.99), 15-minute Adeline AI site synthesis ($29.99), and 1TB Google Cloud CDN storage.
          </p>
        </div>

        {/* SEARCH BAR (Compact Monochrome) */}
        <div className="relative max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="relative flex items-center h-12 sm:h-13 rounded-full bg-neutral-950 border border-white/15 px-4 sm:px-5 transition-all duration-200 focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/10 shadow-lg">
            <Search className="w-4 h-4 text-zinc-500 mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or topics..."
              className="w-full bg-transparent border-none outline-none text-white text-xs sm:text-sm font-light placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/10 ml-2 cursor-pointer transition"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* 4 CATEGORY PILLS (Compact 2x2 Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isFilterActive = searchQuery.toLowerCase().includes(cat.title.toLowerCase().split(" ")[0]);

            return (
              <div
                key={idx}
                onClick={() => setSearchQuery(cat.title.split(" ")[0])}
                className={`p-4 rounded-2xl bg-neutral-950 border transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 group ${
                  isFilterActive
                    ? "border-white bg-white/10 shadow-md"
                    : "border-white/10 hover:border-white/25 hover:bg-neutral-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-white/80 group-hover:text-white transition" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">0{idx + 1}</span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-white tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-light truncate">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ONE-AT-A-TIME ACCORDION LIST */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 px-4 bg-neutral-950 rounded-2xl border border-white/10">
              <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-xs">No questions match your query.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-mono text-white underline cursor-pointer"
              >
                Reset search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-xl bg-neutral-950 border border-white/10 hover:border-white/20 transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-normal text-white leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-white text-black border-white" : "text-zinc-400 bg-white/5"
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-zinc-400 border-t border-white/5 font-light">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
