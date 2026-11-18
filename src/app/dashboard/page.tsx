"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import { useTessro } from "@/lib/tessro-context";
import {
  Sparkles,
  Users,
  ExternalLink,
  Download,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  FileCode,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser, projects, tickets, storageStats } = useTessro();
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // Filter client-relevant tickets
  const myTickets =
    currentUser.role === "client"
      ? tickets.filter((t) => t.clientEmail === currentUser.email)
      : tickets;

  const activeTickets = myTickets.filter((t) => t.status !== "delivered");
  const completedTickets = myTickets.filter((t) => t.status === "delivered");

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white/20">
      <DashboardNav />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LOGGED IN AS: {currentUser.role.toUpperCase()}</span>
              <span>•</span>
              <span className="text-zinc-500">{currentUser.company || "Tessro Ecosystem"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
              Welcome back, {currentUser.name.split(" ")[0]}
            </h1>
            <p className="mt-2 text-zinc-400 text-sm max-w-xl font-light">
              Manage your active web platforms, communicate directly with your assigned human designer, and access your 1TB Cloud Storage CDN assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/tickets"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Open New Ticket ($49.99)</span>
            </Link>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-semibold text-xs font-mono uppercase tracking-wider hover:bg-cyan-400/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Adeline AI ($29.99)</span>
            </Link>
          </div>
        </div>

        {/* TOP METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase">
              <span>Active Platforms</span>
              <FileCode className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white">{projects.length}</span>
              <span className="text-xs text-emerald-400 font-mono">100% UPTIME</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">Deployed to production edge</div>
          </div>

          {/* Metric 2 */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase">
              <span>Human Studio Tickets</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white">{activeTickets.length}</span>
              <span className="text-xs text-indigo-400 font-mono">
                {activeTickets.length > 0 ? "72H TURNAROUND" : "ALL COMPLETED"}
              </span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">1-on-1 dedicated designer assigned</div>
          </div>

          {/* Metric 3 */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase">
              <span>GCS 1TB CDN Storage</span>
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white">
                {storageStats.usedMb.toFixed(1)} <span className="text-sm font-normal text-zinc-400">MB</span>
              </span>
              <span className="text-xs text-emerald-400 font-mono">OF 1,000 GB</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">Edge caching active with free SSL</div>
          </div>

          {/* Metric 4 */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase">
              <span>Cost Saved vs Agency</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white">$4,850</span>
              <span className="text-xs text-amber-400 font-mono">ZERO RETAINER</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">Flat one-time fee per project</div>
          </div>
        </div>

        {/* ACTIVE WEBSITES GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-light text-white tracking-tight">
                Active Client Platforms
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Instant access to production URLs, Figma tokens, and complete React source code bundles.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {projects.length} WEB ARCHITECTURES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-between gap-6 hover:border-white/20 transition group"
              >
                <div>
                  {/* Chrome Browser Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[150px]">
                      {proj.domain}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      LIVE
                    </span>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-zinc-300 font-medium mb-3">
                    {proj.archetype}
                  </span>

                  <h3 className="text-lg font-medium text-white group-hover:text-cyan-300 transition">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 font-mono">
                    <span>MODE: {proj.mode === "human_craft" ? "Human Studio ($49.99)" : "Adeline AI ($29.99)"}</span>
                    <span>•</span>
                    <span>{proj.storageMb} MB</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <a
                    href={proj.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-zinc-300 hover:text-white transition"
                  >
                    <span>Visit Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() =>
                      alert(
                        `Triggered instant download for ${proj.title}. ZIP containing clean HTML5, Tailwind CSS, and React components is ready.`
                      )
                    }
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ZIP</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTIVE HUMAN STUDIO TICKETS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-light text-white tracking-tight">
                Studio Ticketing & Revision Hub
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every Human Studio tier ($49.99) includes a dedicated 1-on-1 designer, live messaging, and unlimited revisions.
              </p>
            </div>
            <Link
              href="/dashboard/tickets"
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition"
            >
              <span>View All Tickets ({myTickets.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
            <div className="divide-y divide-white/10">
              {myTickets.map((ticket) => {
                const isDelivered = ticket.status === "delivered";
                return (
                  <div
                    key={ticket.id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white/[0.02] transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-400">{ticket.id}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                            ticket.status === "delivered"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : ticket.status === "in_review"
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {ticket.status.replace("_", " ")}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {ticket.serviceType === "human_studio"
                            ? "$49.99 Human Studio"
                            : ticket.serviceType === "adeline_builder"
                            ? "$29.99 Adeline AI"
                            : "$5.00 Micro Studio"}
                        </span>
                      </div>

                      <h3 className="text-lg font-medium text-white">{ticket.title}</h3>
                      <p className="text-xs text-zinc-400 max-w-2xl line-clamp-1">{ticket.brief}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Assigned Designer */}
                      {ticket.assignedDesigner && (
                        <div className="flex items-center gap-3">
                          <img
                            src={ticket.assignedDesigner.avatar}
                            alt={ticket.assignedDesigner.name}
                            className="w-9 h-9 rounded-full object-cover border border-white/15"
                          />
                          <div>
                            <div className="text-xs font-medium text-white">
                              {ticket.assignedDesigner.name}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400">
                              {ticket.assignedDesigner.role}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Turnaround / Revisions */}
                      <div className="hidden sm:flex flex-col text-right font-mono text-xs">
                        <span className="text-white">
                          Round {ticket.revisionRound} ({ticket.maxRevisions})
                        </span>
                        <span className="text-zinc-500 text-[10px]">
                          {isDelivered ? "DELIVERED & VERIFIED" : `${ticket.deadlineHours}h GUARANTEE`}
                        </span>
                      </div>

                      {/* Action */}
                      <Link
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open Hub</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* QUICK SERVICE PURCHASE TIERS */}
        <section className="p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-950 to-black space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Expand Your Digital Footprint
              </span>
              <h2 className="text-2xl font-light text-white mt-1">
                Initiate New Projects with Tessro Studio
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              ALL ASSETS SYNCED TO 1TB GOOGLE CLOUD STORAGE CDN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase">Human Designer Studio</span>
                <div className="text-2xl font-light text-white mt-1">$49.99</div>
                <p className="text-xs text-zinc-400 mt-2">
                  Dedicated 1-on-1 designer, private ticketing hub, unlimited revisions, Figma source tokens, 72h delivery.
                </p>
              </div>
              <Link
                href="/dashboard/tickets"
                className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase text-center hover:bg-zinc-200 transition"
              >
                Open Designer Ticket →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-400/20 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase">Adeline AI Website Builder</span>
                <div className="text-2xl font-light text-white mt-1">$29.99</div>
                <p className="text-xs text-zinc-400 mt-2">
                  15-minute generation across 5 architectural archetypes, live sandboxed preview, instant ZIP source export.
                </p>
              </div>
              <Link
                href="/studio"
                className="w-full py-2.5 rounded-xl bg-cyan-400 text-black font-semibold text-xs font-mono uppercase text-center hover:bg-cyan-300 transition"
              >
                Synthesize Website →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">$5 Micro Studios</span>
                <div className="text-2xl font-light text-white mt-1">$5.00</div>
                <p className="text-xs text-zinc-400 mt-2">
                  Flat $5 vector logo suite or 16:9 ambient motion hero video backdrops for your platform.
                </p>
              </div>
              <Link
                href="/#graphics"
                className="w-full py-2.5 rounded-xl border border-white/20 hover:border-white text-white font-semibold text-xs font-mono uppercase text-center transition"
              >
                Order Micro Add-On →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
