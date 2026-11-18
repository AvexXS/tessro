"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CouponInput from "@/components/CouponInput";
import { Tag, Sparkles } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export type Feature = {
  text: string;
  included: boolean;
};

export type Plan = {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: Feature[];
  featured?: boolean;
  badge?: string;
  bg: string;
  href?: string;
};

// ============================================================================
// Plans Data
// ============================================================================

export const defaultPlans: Plan[] = [
  {
    name: "Course",
    price: "159",
    originalPrice: "497",
    description: "Once. Lifetime. 68% off.",
    bg: "#161616",
    features: [
      { text: "All courses and videos", included: true },
      { text: "All modules. Lifetime access.", included: true },
      { text: "AI Builder", included: true },
      { text: "Unlimited Templates", included: false },
      { text: "Unlimited Motion Videos", included: false },
    ],
  },
  {
    name: "Course + Lovable Templates",
    price: "239",
    originalPrice: "697",
    description: "Once. Lifetime. Best deal.",
    bg: "#252525",
    features: [
      { text: "All courses and videos", included: true },
      { text: "All modules. Lifetime access.", included: true },
      { text: "AI Builder", included: true },
      { text: "Unlimited Templates", included: true },
      { text: "Unlimited Motion Videos", included: true },
    ],
    featured: true,
    badge: "Best Value",
  },
];

export const tessroStudioPlans: Plan[] = [
  {
    name: "Adeline Reels AI",
    price: "20",
    originalPrice: "59",
    description: "Monthly. Viral reel cloner & AI short-form director.",
    bg: "#14141e",
    badge: "Trending Video Editor",
    href: "/reels",
    features: [
      { text: "Clone any trending Instagram or TikTok reel style", included: true },
      { text: "Conversational turn-by-turn AI editing director", included: true },
      { text: "Dynamic kinetic captions (Alex Hormozi style)", included: true },
      { text: "Beat-sync transitions, whip pans & zoom punch cuts", included: true },
      { text: "500MB 4K raw clip upload & direct 9:16 MP4 export", included: true },
    ],
  },
  {
    name: "Adeline AI Studio",
    price: "29.99",
    originalPrice: "99",
    description: "Once. Instant 15-min generation. Production-ready.",
    bg: "#161616",
    href: "/adeline",
    features: [
      { text: "5 Visual Archetypes (Glass, Bento, Neo-Brutalism, Minimal, Clay)", included: true },
      { text: "Adeline neural prompt synthesis & layout engine", included: true },
      { text: "1TB Google Cloud Storage CDN asset sync", included: true },
      { text: "Production-ready ZIP export (React + Tailwind)", included: true },
      { text: "Dedicated 1-on-1 human designer ticketing portal", included: false },
    ],
  },
  {
    name: "Dedicated Human Studio",
    price: "49.99",
    originalPrice: "199",
    description: "Once. Dedicated 1-on-1 designer. 72h turnaround.",
    bg: "#252525",
    featured: true,
    badge: "Best Value",
    href: "/auth?redirect=/dashboard/tickets",
    features: [
      { text: "5 Visual Archetypes + Adeline AI Studio access", included: true },
      { text: "Dedicated 1-on-1 senior web & graphic designer", included: true },
      { text: "Private client ticket hub with real-time designer messaging", included: true },
      { text: "Complete Figma design tokens & source files", included: true },
      { text: "Unlimited revision rounds & 72h delivery guarantee", included: true },
    ],
  },
];

// ============================================================================
// Helper Components
// ============================================================================

/**
 * MIcon: Material Symbols Outlined glyph
 */
export function MIcon({
  name,
  size = 20,
  weight = 400,
  fill = 0,
  grade = 0,
  opticalSize = 24,
  className,
}: {
  name: string;
  size?: number;
  weight?: number;
  fill?: number;
  grade?: number;
  opticalSize?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined select-none leading-none inline-flex items-center justify-center", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
      }}
    >
      {name}
    </span>
  );
}

/**
 * FadeUp: Framer Motion reveal wrapper
 */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * SpotlightBorder: 1px gradient border that follows the cursor via CSS masks
 */
export function SpotlightBorder({
  children,
  className,
  radius = "2xl",
  size = 520,
  intensity = 0.5,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  radius?: string;
  size?: number;
  intensity?: number;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerLeave = () => {
    setCoords({ x: -9999, y: -9999 });
  };

  const radiusClass = radius === "2xl" ? "rounded-2xl" : radius === "xl" ? "rounded-xl" : "rounded-3xl";

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("relative group/spotlight", className)}
      style={
        {
          "--spot-x": `${coords.x}px`,
          "--spot-y": `${coords.y}px`,
          "--size": `${size}px`,
          "--intensity": intensity,
          ...style,
        } as React.CSSProperties
      }
    >
      {/* Outer base ring */}
      <div className={cn("pointer-events-none absolute inset-0 border border-white/10", radiusClass)} />

      {/* Dynamic 1px spotlight ring via CSS masks */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 p-[1px] transition-opacity duration-300",
          radiusClass
        )}
        style={{
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          background:
            "radial-gradient(circle var(--size) at var(--spot-x) var(--spot-y), rgba(255,255,255,var(--intensity)), transparent 60%)",
        }}
      />

      {/* Inner interactive content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/**
 * AnimatedText: Hover text-up-from-below animation
 */
export function AnimatedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="inline-block transition-transform duration-300 ease-out group-hover/btn:-translate-y-full">
        {children}
      </span>
      <span className="absolute inset-0 inline-flex items-center justify-center translate-y-full transition-transform duration-300 ease-out group-hover/btn:translate-y-0">
        {children}
      </span>
    </span>
  );
}

/**
 * PrimaryButton: Pill button with text-up-from-below animation
 */
export function PrimaryButton({
  href = "/auth?mode=signup",
  size = "sm",
  className,
  children,
  onClick,
}: {
  href?: string;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const sizeClasses = size === "sm" ? "h-8 px-4 text-sm" : "h-10 px-6 text-sm";

  const buttonInner = (
    <span
      onClick={onClick}
      className={cn(
        "group/btn inline-flex items-center justify-center rounded-full font-inter leading-none select-none transition-all duration-200 cursor-pointer",
        "bg-white/80 hover:bg-white text-black font-medium shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]",
        sizeClasses,
        className
      )}
    >
      <AnimatedText>{children}</AnimatedText>
    </span>
  );

  return href ? <Link href={href}>{buttonInner}</Link> : buttonInner;
}

/**
 * SecondaryButton: Pill button with glass surface & text-up-from-below animation
 */
export function SecondaryButton({
  href = "/auth?mode=signup",
  size = "sm",
  className,
  children,
  onClick,
}: {
  href?: string;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const sizeClasses = size === "sm" ? "h-8 px-4 text-sm" : "h-10 px-6 text-sm";

  const buttonInner = (
    <span
      onClick={onClick}
      className={cn(
        "group/btn inline-flex items-center justify-center rounded-full font-inter leading-none select-none transition-all duration-200 cursor-pointer",
        "bg-landing-surface hover:bg-landing-surface-hover border border-landing-border text-foreground backdrop-blur-[2.5px] font-medium",
        sizeClasses,
        className
      )}
    >
      <AnimatedText>{children}</AnimatedText>
    </span>
  );

  return href ? <Link href={href}>{buttonInner}</Link> : buttonInner;
}

// ============================================================================
// PricingCard
// ============================================================================

export function PricingCard({ plan }: { plan: Plan }) {
  return (
    <SpotlightBorder
      radius="2xl"
      size={460}
      intensity={0.5}
      className="relative h-full p-2 sm:p-3"
    >
      <div
        className="relative flex h-full flex-col rounded-2xl border border-white/10 p-7 sm:p-8"
        style={{ backgroundColor: plan.bg }}
      >
        {plan.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-white px-3 py-1 text-xs font-medium text-black shadow-lg">
            {plan.badge}
          </div>
        )}

        <FadeUp delay={0}>
          <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
            {plan.name}
          </div>
        </FadeUp>
        <div className="mt-3 border-t border-white/10" />

        <FadeUp delay={0.1}>
          <div className="mt-10 flex items-baseline gap-2">
            <span className="text-[2.75rem] leading-none font-normal tracking-tight text-foreground">
              ${plan.price}
            </span>
            {plan.originalPrice && (
              <span className="text-lg text-foreground/40 line-through">
                ${plan.originalPrice}
              </span>
            )}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mt-4 text-sm leading-relaxed text-foreground/60">
            {plan.description}
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="mt-7">
            {plan.featured ? (
              <PrimaryButton href={plan.href || "/auth?redirect=/dashboard/tickets"} size="sm">
                Get Started
              </PrimaryButton>
            ) : (
              <SecondaryButton href={plan.href || "/auth?redirect=/studio"} size="sm">
                Get Started
              </SecondaryButton>
            )}
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <ul className="mt-7 flex flex-1 flex-col gap-2">
            {plan.features.map((f, i) => (
              <li
                key={f.text}
                className={cn(
                  "flex items-center gap-3 py-4 text-sm",
                  i !== 0 && "border-t border-white/10",
                  f.included ? "text-foreground/85" : "text-foreground/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border",
                    f.included
                      ? "border-white/20 bg-white/[0.06]"
                      : "border-white/10 bg-transparent"
                  )}
                >
                  {f.included ? (
                    <MIcon name="check" size={12} className="text-foreground" />
                  ) : (
                    <MIcon name="close" size={12} className="text-foreground/50" />
                  )}
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </SpotlightBorder>
  );
}

// ============================================================================
// PricingSection Component
// ============================================================================

export function PricingSection({
  customPlans,
}: {
  customPlans?: Plan[];
}) {
  const [activeTab, setActiveTab] = useState<"tessro" | "course">("tessro");
  const plans = customPlans || (activeTab === "tessro" ? tessroStudioPlans : defaultPlans);

  return (
    <section id="pricing" className="relative w-full bg-background py-24 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 font-sans">
      <div className="mx-auto max-w-[1240px]">
        {/* HEADER */}
        <div className="mb-14 sm:mb-16 flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <FadeUp>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono uppercase tracking-widest text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  Transparent Pricing Plans
                </span>

                {/* Plan Tier Switcher */}
                {!customPlans && (
                  <div className="inline-flex items-center p-0.5 rounded-full bg-neutral-900 border border-white/10 text-xs">
                    <button
                      onClick={() => setActiveTab("tessro")}
                      className={cn(
                        "px-3 py-0.5 rounded-full transition-all duration-200 cursor-pointer text-[11px] font-mono",
                        activeTab === "tessro"
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-foreground/60 hover:text-foreground"
                      )}
                    >
                      Websites & Studio
                    </button>
                    <button
                      onClick={() => setActiveTab("course")}
                      className={cn(
                        "px-3 py-0.5 rounded-full transition-all duration-200 cursor-pointer text-[11px] font-mono",
                        activeTab === "course"
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-foreground/60 hover:text-foreground"
                      )}
                    >
                      Course & Templates
                    </button>
                  </div>
                )}
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight" style={{ fontFamily: '"BubbledotICG-FinePos", "Geist Pixel Circle", monospace' }}>
                Clear Pricing Plans
                <br className="hidden sm:block" /> That Scale With You
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.2}>
            <p className="max-w-sm text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              One-time payment. Lifetime access. Pick the tier that fits your development and design objectives.
            </p>
          </FadeUp>
        </div>

        {/* CARDS */}
        <div className={cn(
          "mx-auto grid gap-6",
          plans.length === 3 ? "max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "max-w-4xl grid-cols-1 md:grid-cols-2"
        )}>
          {plans.map((p) => (
            <PricingCard key={p.name} plan={p} />
          ))}
        </div>

        {/* PROMO COUPON CODE SECTION */}
        <div className="mt-14 max-w-md mx-auto p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>Have a Studio Promo Code?</span>
          </div>
          <p className="text-xs text-zinc-400 font-light">
            Enter your coupon code below to unlock up to 50% discount on any tier (e.g. <span className="font-mono text-white">LAUNCH50</span>, <span className="font-mono text-white">VIRAL20</span>, <span className="font-mono text-white">ADELINE</span>).
          </p>
          <CouponInput
            originalAmount={49.99}
            product="all"
            onApply={(coupon) => {
              if (coupon) {
                alert(`Promo Code ${coupon.code} Verified! ${coupon.discountType === "percent" ? `${coupon.discountValue}% off` : `$${coupon.discountValue} off`} applied.`);
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
