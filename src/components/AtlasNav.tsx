"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";

export default function AtlasNav() {
  const { isSignedIn, isLoaded } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeStudioIdx, setActiveStudioIdx] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const ddRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const STUDIO_ITEMS = [
    {
      title: "Human Designer Studio",
      desc: "1-on-1 dedicated senior designers with live ticket iterations ($49.99).",
      img: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_051510_400ed870-8ffb-4030-b267-2b003780a5e3.png",
      href: "#pricing",
    },
    {
      title: "Adeline AI Website Builder",
      desc: "Autonomous 15-minute generation across 5 architectural archetypes ($29.99).",
      img: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_051509_384c49d8-b37c-49a7-9180-a06ad914ec24.png",
      href: "/auth?redirect=/studio",
    },
    {
      title: "AI Logo Studio",
      desc: "Clean vector SVG and transparent 4K PNG brandmarks ($5.00).",
      img: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_051509_bf51abc3-090e-459f-8066-8f0cdd0c36b9.png",
      href: "#graphics",
    },
    {
      title: "AI Video Hero Loops",
      desc: "Sub-5MB 16:9 ambient motion hero video backdrops ($5.00).",
      img: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_051511_ab19ff38-a140-442d-b2e7-82e3431bf3b6.png",
      href: "#graphics",
    },
  ];

  const ARCHETYPES = [
    {
      title: "Glassmorphism & Bento",
      desc: "Translucent frosted acrylic cards with specular gradient borders.",
      img: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_051510_3d88d3aa-ac8a-4e80-b70b-0da5523138cf.png",
      href: "#adeline",
    },
    {
      title: "Swiss Minimalism & Clay",
      desc: "Mathematical grid rigor paired with tactile soft 3D extrusions.",
      img: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_051509_c4fa86ad-842a-41c9-8cff-a70068ac1aa3.png",
      href: "#adeline",
    },
  ];

  const ADELINE_LINKS = [
    { name: "3D Neural Archive (21 Sites)", href: "/adeline" },
    { name: "Trending Reels AI Editor ($20/mo)", href: "/reels" },
    { name: "15-Minute Generation Core", href: "/auth?redirect=/studio" },
    { name: "1TB Google Cloud CDN", href: "#pricing" },
    { name: "Launch Adeline Studio ($29.99)", href: "/auth?redirect=/studio" },
  ];

  // Morphing dropdown mechanics
  const menuOrder = ["studio", "archetypes", "adeline"];

  const place = (id: string) => {
    const dd = ddRef.current;
    const header = headerRef.current;
    const trigger = document.querySelector(`[data-menu="${id}"]`) as HTMLElement;
    const panel = document.getElementById(`p-${id}`);
    if (!dd || !header || !trigger || !panel) return;

    const PAD = 20;
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;

    const headerRect = header.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();

    let x = triggerRect.left - PAD;
    x = Math.max(headerRect.left + 12, Math.min(x, headerRect.right - pw - 12));
    const finalX = x - (dd.offsetParent ? (dd.offsetParent as HTMLElement).getBoundingClientRect().left : headerRect.left);

    dd.style.setProperty("--x", `${finalX}px`);
    dd.style.setProperty("--w", `${pw}px`);
    dd.style.setProperty("--h", `${ph}px`);
  };

  const openMenu = (id: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (activeMenu === id) return;

    const dd = ddRef.current;
    if (!dd) return;

    const panels = ["studio", "archetypes", "adeline"];

    if (!activeMenu) {
      // First open: instant positioning without morph jump
      dd.classList.add("instant", "snap");
      panels.forEach((p) => {
        const el = document.getElementById(`p-${p}`);
        if (el) {
          el.classList.add("snap");
          el.removeAttribute("data-state");
        }
      });

      place(id);
      void dd.offsetWidth; // Force reflow

      dd.classList.remove("snap");
      panels.forEach((p) => document.getElementById(`p-${p}`)?.classList.remove("snap"));
      dd.classList.add("open");

      requestAnimationFrame(() => {
        dd.classList.remove("instant");
      });
    } else {
      // Directional transition
      const oldIdx = menuOrder.indexOf(activeMenu);
      const newIdx = menuOrder.indexOf(id);
      const dir = newIdx > oldIdx ? 1 : -1;

      const oldPanel = document.getElementById(`p-${activeMenu}`);
      if (oldPanel) {
        oldPanel.setAttribute("data-state", dir > 0 ? "exit-left" : "exit-right");
      }

      const newPanel = document.getElementById(`p-${id}`);
      if (newPanel) {
        newPanel.classList.add("snap");
        newPanel.setAttribute("data-state", dir > 0 ? "exit-right" : "exit-left");
        void newPanel.offsetWidth;
        newPanel.classList.remove("snap");
      }

      place(id);
    }

    const targetPanel = document.getElementById(`p-${id}`);
    if (targetPanel) {
      targetPanel.setAttribute("data-state", "active");
    }

    setActiveMenu(id);
  };

  const closeDropdown = () => {
    const dd = ddRef.current;
    if (!dd) return;

    dd.classList.remove("open");
    if (activeMenu) {
      const panel = document.getElementById(`p-${activeMenu}`);
      if (panel) panel.removeAttribute("data-state");
    }
    setActiveMenu(null);
  };

  const scheduleClose = (ms = 140) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(closeDropdown, ms);
  };

  useEffect(() => {
    const onResize = () => {
      if (activeMenu) place(activeMenu);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown();
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMenu]);

  return (
    <header ref={headerRef} className="atlas-header" id="header">
      <style jsx global>{`
        :root {
          --panel: rgba(14, 16, 22, 0.88);
          --line: rgba(255, 255, 255, 0.08);
          --hover: rgba(255, 255, 255, 0.065);
          --soft: rgba(255, 255, 255, 0.74);
          --muted: rgba(255, 255, 255, 0.6);
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          --morph: 0.5s;
        }

        .atlas-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(24px) saturate(150%);
          -webkit-backdrop-filter: blur(24px) saturate(150%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .atlas-bar {
          height: 72px;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(18px, 3.2vw, 44px);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        }

        /* Pure Text Wordmark (No Background) */
        .atlas-logo {
          justify-self: start;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 300;
          font-size: clamp(15px, 1.6vw, 18px);
          letter-spacing: 0.45em;
          color: #ffffff;
          text-decoration: none;
          transition: opacity 0.25s ease;
          display: inline-flex;
          align-items: center;
        }
        .atlas-logo:hover {
          opacity: 0.85;
        }

        /* Desktop Nav */
        .atlas-desktop-nav {
          position: relative;
          display: flex;
          align-items: center;
          animation: fadeIn 0.9s ease 0.45s backwards;
        }

        .atlas-links {
          display: flex;
          align-items: center;
          gap: 26px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .atlas-trigger,
        .atlas-plain-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 0;
          font-family: "Geist", "Inter", sans-serif;
          font-size: 14.5px;
          color: var(--soft);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.25s ease;
        }
        .atlas-trigger:hover,
        .atlas-plain-link:hover,
        .atlas-trigger[aria-expanded="true"] {
          color: #ffffff;
        }

        .atlas-chevron {
          width: 8px;
          height: 5px;
          stroke: currentColor;
          stroke-width: 1.3;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          transition: transform 0.35s var(--ease);
        }
        .atlas-trigger[aria-expanded="true"] .atlas-chevron {
          transform: rotate(180deg);
        }

        /* Actions */
        .atlas-actions {
          justify-self: end;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: fadeDown 0.9s var(--ease) 0.55s backwards;
        }

        .atlas-cta {
          height: 34px;
          padding: 0 18px;
          border-radius: 999px;
          background: #ffffff;
          color: #0b0f12;
          font-size: 13.5px;
          font-weight: 500;
          font-family: "Geist", "Inter", sans-serif;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.25s, transform 0.25s;
        }
        .atlas-cta:hover {
          background: #e4e4e7;
          transform: translateY(-1px);
        }

        /* MORPHING DROPDOWN CONTAINER */
        .atlas-dd {
          --x: 0px;
          --w: 400px;
          --h: 300px;
          --s: 0.97;
          position: absolute;
          top: 64px;
          left: 0;
          width: var(--w);
          height: var(--h);
          transform: translateX(var(--x)) scale(var(--s));
          transform-origin: 50% 0;
          opacity: 0;
          pointer-events: none;
          border-radius: 16px;
          background: var(--panel);
          border: 1px solid var(--line);
          box-shadow: 0 30px 70px -25px rgba(0, 0, 0, 0.65), 0 2px 10px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(24px) saturate(140%);
          -webkit-backdrop-filter: blur(24px) saturate(140%);
          overflow: hidden;
          transition: transform var(--morph) var(--ease), width var(--morph) var(--ease), height var(--morph) var(--ease), opacity 0.3s ease;
        }
        .atlas-dd.open {
          --s: 1;
          opacity: 1;
          pointer-events: auto;
        }
        .atlas-dd.instant {
          transition: opacity 0.3s ease, transform var(--morph) var(--ease);
        }
        .atlas-dd.instant.snap {
          transition: none !important;
        }

        /* Content Panels */
        .atlas-panel {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          visibility: hidden;
          filter: blur(8px);
          transform: translateX(0);
          transition: opacity 0.26s ease, transform var(--morph) var(--ease), filter 0.4s ease, visibility 0s linear var(--morph);
        }
        .atlas-panel[data-state="exit-left"] {
          transform: translateX(-56px);
        }
        .atlas-panel[data-state="exit-right"] {
          transform: translateX(56px);
        }
        .atlas-panel[data-state="active"] {
          opacity: 1;
          visibility: visible;
          filter: blur(0);
          transform: translateX(0);
          transition: opacity 0.36s ease 0.06s, transform var(--morph) var(--ease), filter 0.45s ease 0.04s, visibility 0s;
        }
        .atlas-panel.snap {
          transition: none !important;
        }

        /* Panel A: STUDIO (664 x 358px) */
        #p-studio {
          width: 664px;
          height: 358px;
          display: grid;
          grid-template-columns: 248px 1fr;
        }
        .d-list {
          display: flex;
          flex-direction: column;
          padding: 8px;
          gap: 2px;
        }
        .d-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #ffffff;
          transition: background 0.25s ease;
        }
        .d-item:hover,
        .d-item.is-active {
          background: var(--hover);
        }
        .d-item strong {
          font-size: 14.5px;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .d-item span {
          font-size: 12.5px;
          line-height: 1.4;
          color: var(--muted);
        }
        .d-media {
          position: relative;
          overflow: hidden;
          border-radius: 0 15px 15px 0;
        }
        .d-media::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 70px;
          background: linear-gradient(to right, rgba(14, 16, 22, 0.8), transparent);
          z-index: 2;
        }
        .d-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transform: scale(1.06);
          filter: blur(10px);
          transition: opacity 0.6s ease, transform 0.9s var(--ease), filter 0.6s ease;
        }
        .d-media img.is-active {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
          z-index: 1;
        }

        /* Panel B: ARCHETYPES (450 x 310px) */
        #p-archetypes {
          width: 450px;
          height: 310px;
          padding: 7px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }
        .atlas-card {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 14px;
          text-decoration: none;
          color: #fff;
          isolation: isolate;
        }
        .atlas-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
          transition: transform 0.9s var(--ease), filter 0.5s;
        }
        .atlas-card:hover img {
          transform: scale(1.05);
          filter: brightness(1.08);
        }
        .atlas-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(to top, rgba(8, 10, 14, 0.9) 0%, rgba(8, 10, 14, 0.35) 45%, transparent 70%);
        }
        .atlas-card strong {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .atlas-card span {
          font-size: 12.5px;
          line-height: 1.4;
          color: var(--muted);
        }

        /* Panel C: ADELINE (240 x 224px) */
        #p-adeline {
          width: 240px;
          height: 224px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .r-link {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border-radius: 9px;
          font-size: 14px;
          color: #ffffff;
          text-decoration: none;
          transition: background 0.25s ease;
        }
        .r-link:hover {
          background: var(--hover);
        }

        /* Mobile Burger & Sheet */
        .atlas-menu-btn {
          display: none;
          width: 36px;
          height: 32px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .atlas-sheet {
          display: none;
          position: absolute;
          top: 74px;
          left: 12px;
          right: 12px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(12, 14, 18, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
          max-height: calc(100svh - 90px);
          overflow-y: auto;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-6px) scale(0.98);
          transform-origin: 50% 0;
          transition: opacity 0.3s ease, transform 0.45s var(--ease);
        }
        .atlas-sheet.open {
          opacity: 1;
          visibility: visible;
          transform: none;
        }
        .atlas-sheet-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          margin-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .atlas-sheet-logo {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 300;
          font-size: 15px;
          letter-spacing: 0.45em;
          color: #ffffff;
        }
        .atlas-sheet-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #ffffff;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .atlas-sheet-close:hover {
          background: rgba(255, 255, 255, 0.18);
          transform: scale(1.05);
        }
        .atlas-sheet h3 {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 12px 12px 6px;
        }
        .atlas-sheet a {
          display: block;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 14.5px;
          color: #ffffff;
          text-decoration: none;
          transition: background 0.2s;
        }
        .atlas-sheet a:hover {
          background: var(--hover);
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 860px) {
          .atlas-bar {
            grid-template-columns: 1fr auto;
          }
          .atlas-desktop-nav {
            display: none;
          }
          .atlas-menu-btn {
            display: inline-flex;
          }
          .atlas-sheet {
            display: block;
          }
        }
      `}</style>

      <div className="atlas-bar">
        {/* Absolute Left: Pure Text Wordmark Logo */}
        <Link href="/" className="atlas-logo" aria-label="Tessro home">
          TESSRO
        </Link>

        {/* Center Desktop Nav with Morphing Container */}
        <nav
          ref={navRef}
          className="atlas-desktop-nav"
          id="nav"
          aria-label="Main"
          onPointerEnter={() => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") scheduleClose(140);
          }}
        >
          <ul className="atlas-links">
            {/* Trigger 1: Studio */}
            <li>
              <button
                className="atlas-trigger"
                data-menu="studio"
                aria-expanded={activeMenu === "studio"}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") openMenu("studio");
                }}
                onClick={() => (activeMenu === "studio" ? closeDropdown() : openMenu("studio"))}
              >
                Studio
                <svg className="atlas-chevron" viewBox="0 0 8 5">
                  <path d="M1 1l3 3 3-3" />
                </svg>
              </button>
            </li>

            {/* Trigger 2: Archetypes */}
            <li>
              <button
                className="atlas-trigger"
                data-menu="archetypes"
                aria-expanded={activeMenu === "archetypes"}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") openMenu("archetypes");
                }}
                onClick={() => (activeMenu === "archetypes" ? closeDropdown() : openMenu("archetypes"))}
              >
                Archetypes
                <svg className="atlas-chevron" viewBox="0 0 8 5">
                  <path d="M1 1l3 3 3-3" />
                </svg>
              </button>
            </li>

            {/* Trigger 3: Adeline with AI Badge */}
            <li>
              <button
                className="atlas-trigger relative"
                data-menu="adeline"
                aria-expanded={activeMenu === "adeline"}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") openMenu("adeline");
                }}
                onClick={() => (activeMenu === "adeline" ? closeDropdown() : openMenu("adeline"))}
              >
                Adeline
                <span className="ml-0.5 px-1 py-[0.5px] rounded-full bg-cyan-500/20 text-[7.5px] font-mono font-bold text-cyan-300 border border-cyan-400/40 leading-none">
                  AI
                </span>
                <svg className="atlas-chevron" viewBox="0 0 8 5">
                  <path d="M1 1l3 3 3-3" />
                </svg>
              </button>
            </li>

            {/* Plain link: Pricing */}
            <li>
              <a
                href="#pricing"
                className="atlas-plain-link"
                id="story-link"
                onPointerEnter={() => scheduleClose(60)}
              >
                Pricing
              </a>
            </li>

            {/* Plain link: Reels AI ($20/mo) */}
            <li>
              <Link
                href="/reels"
                className="atlas-plain-link text-cyan-300 hover:text-white flex items-center gap-1.5"
                onPointerEnter={() => scheduleClose(60)}
              >
                <span>Reels AI</span>
                <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-[9px] font-mono text-cyan-300 border border-cyan-400/30">
                  $20/mo
                </span>
              </Link>
            </li>

            {/* Plain link: Dashboard */}
            <li>
              <Link
                href="/dashboard"
                className="atlas-plain-link text-cyan-300 hover:text-white"
                onPointerEnter={() => scheduleClose(60)}
              >
                Dashboard
              </Link>
            </li>
          </ul>

          {/* Morphing Dropdown Box (Shared Container) */}
          <div ref={ddRef} className="atlas-dd" id="dd">
            {/* Panel A: STUDIO */}
            <div className="atlas-panel" id="p-studio" data-panel="studio">
              <div className="d-list">
                {STUDIO_ITEMS.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className={`d-item ${activeStudioIdx === idx ? "is-active" : ""}`}
                    onPointerEnter={() => setActiveStudioIdx(idx)}
                    onFocus={() => setActiveStudioIdx(idx)}
                    onClick={closeDropdown}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </a>
                ))}
              </div>
              <div className="d-media" aria-hidden="true">
                {STUDIO_ITEMS.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.img}
                    alt=""
                    className={activeStudioIdx === idx ? "is-active" : ""}
                  />
                ))}
              </div>
            </div>

            {/* Panel B: ARCHETYPES */}
            <div className="atlas-panel" id="p-archetypes" data-panel="archetypes">
              {ARCHETYPES.map((arch, idx) => (
                <a key={idx} href={arch.href} className="atlas-card" onClick={closeDropdown}>
                  <img src={arch.img} alt="" />
                  <strong>{arch.title}</strong>
                  <span>{arch.desc}</span>
                </a>
              ))}
            </div>

            {/* Panel C: ADELINE */}
            <div className="atlas-panel" id="p-adeline" data-panel="adeline">
              {ADELINE_LINKS.map((link, idx) => (
                <Link key={idx} href={link.href} className="r-link" onClick={closeDropdown}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right Actions: Clerk Auth / Start Today CTA + Mobile Menu Button */}
        <div className="atlas-actions flex items-center gap-3">
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-xs font-mono text-zinc-300 hover:text-white px-2 py-1 transition-colors">
                Dashboard
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full border border-white/20" } }} />
            </>
          ) : (
            <>
              <Link href="/login" className="text-xs font-mono text-zinc-300 hover:text-white px-2 py-1 transition-colors hidden sm:inline-block">
                Sign In
              </Link>
              <Link href="/signup" className="atlas-cta">
                Get Started
              </Link>
            </>
          )}

          <button
            className="atlas-menu-btn"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg viewBox="0 0 16 16" width="16" height="16" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="16" height="16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 5.5h12M2 10.5h12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sheet Menu */}
      <div className={`atlas-sheet ${mobileOpen ? "open" : ""}`} id="sheet">
        <div className="atlas-sheet-top">
          <span className="atlas-sheet-logo">T E S S R O</span>
          <button
            className="atlas-sheet-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Exit navbar"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <h3>Studio Services</h3>
        {STUDIO_ITEMS.map((item, idx) => (
          <a key={idx} href={item.href} onClick={() => setMobileOpen(false)}>
            {item.title}
          </a>
        ))}

        <h3>Visual Archetypes</h3>
        {ARCHETYPES.map((arch, idx) => (
          <a key={idx} href={arch.href} onClick={() => setMobileOpen(false)}>
            {arch.title}
          </a>
        ))}

        <h3>Adeline Engine</h3>
        {ADELINE_LINKS.map((link, idx) => (
          <Link key={idx} href={link.href} onClick={() => setMobileOpen(false)}>
            {link.name}
          </Link>
        ))}

        <h3>Platform</h3>
        <a href="#pricing" onClick={() => setMobileOpen(false)}>
          Pricing & Plans
        </a>
      </div>
    </header>
  );
}
