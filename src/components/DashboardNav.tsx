"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTessro } from "@/lib/tessro-context";
import { UserRole } from "@/lib/tessro-store";
import {
  LayoutDashboard,
  Ticket,
  Sparkles,
  ShieldAlert,
  Globe,
  LogOut,
  ChevronRight,
  Database,
  Cloud,
} from "lucide-react";

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setRole, storageStats, logout } = useTessro();

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Studio Tickets", href: "/dashboard/tickets", icon: Ticket },
    { name: "AI Builder Studio", href: "/studio", icon: Sparkles },
    { name: "3D Sphere Archive", href: "/adeline", icon: Globe },
    { name: "Staff & Admin Hub", href: "/admin", icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      {/* Top micro alert bar showing Google Cloud Storage CDN health */}
      <div className="w-full bg-[#050508] border-b border-white/5 py-1 px-4 sm:px-8 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            1TB GOOGLE CLOUD STORAGE CDN: ACTIVE
          </span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="hidden sm:inline text-zinc-400">
            {storageStats.usedMb.toFixed(1)} MB USED / 1,000 GB ({storageStats.edgeHitRate}% HIT RATE)
          </span>
        </div>

        {/* Live Role Switcher */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-full border border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 px-2 hidden sm:inline">
            Role:
          </span>
          {(["client", "designer", "admin"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition cursor-pointer ${
                currentUser.role === r
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-85 transition">
            <span
              className="text-base sm:text-lg font-light tracking-[0.45em] text-white"
              style={{ letterSpacing: "0.45em" }}
            >
              T E S S R O
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
              HUB
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition ${
                    isActive
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-medium text-white truncate max-w-[140px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[140px]">
                {currentUser.plan}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/auth");
            }}
            className="p-2 rounded-full border border-white/10 hover:border-white/25 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
