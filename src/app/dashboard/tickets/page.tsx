"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import { useTessro } from "@/lib/tessro-context";
import { StudioTicket } from "@/lib/tessro-store";
import {
  Plus,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  UploadCloud,
  ChevronRight,
  Filter,
  Sparkles,
  Users,
} from "lucide-react";

export default function TicketsListPage() {
  const { currentUser, tickets, createTicket } = useTessro();
  const [filter, setFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [serviceType, setServiceType] = useState<StudioTicket["serviceType"]>("human_studio");
  const [archetype, setArchetype] = useState("Liquid Glass Bento");
  const [priority, setPriority] = useState<StudioTicket["priority"]>("standard");
  const [brief, setBrief] = useState("");

  const filteredTickets = tickets.filter((t) => {
    if (currentUser.role === "client" && t.clientEmail !== currentUser.email) {
      // allow viewing all in demo mode or restrict
    }
    if (filter === "all") return true;
    return t.status === filter;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !brief) return;

    createTicket({
      title,
      serviceType,
      archetype,
      priority,
      brief,
      price: serviceType === "human_studio" ? 49.99 : serviceType === "adeline_builder" ? 29.99 : 5.0,
    });

    setTitle("");
    setBrief("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white/20">
      <DashboardNav />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Client Ticketing & Revision Hub</span>
            </div>
            <h1 className="text-3xl font-light text-white tracking-tight">
              Studio Tickets & Design Workflows
            </h1>
            <p className="mt-1 text-zinc-400 text-sm max-w-xl font-light">
              Submit new requests, review Figma source tokens, request revision rounds, and chat 1-on-1 with your assigned senior designer.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Open New Ticket</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: "all", label: "All Tickets" },
            { id: "queued", label: "In Queue" },
            { id: "in_design", label: "In Design" },
            { id: "in_review", label: "Client Review" },
            { id: "delivered", label: "Delivered" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                filter === item.id
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tickets Grid / List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => {
            const isDelivered = ticket.status === "delivered";
            return (
              <div
                key={ticket.id}
                className="p-6 rounded-2xl bg-neutral-950 border border-white/10 hover:border-white/25 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-zinc-400 font-semibold">
                      {ticket.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                        ticket.status === "delivered"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : ticket.status === "in_review"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : ticket.status === "in_design"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      TIER: ${ticket.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">
                      {ticket.archetype}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-white group-hover:text-cyan-300 transition">
                    {ticket.title}
                  </h3>

                  <p className="text-xs text-zinc-400 max-w-3xl line-clamp-2 leading-relaxed">
                    {ticket.brief}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-1">
                    <span>Client: {ticket.clientName}</span>
                    <span>•</span>
                    <span>Revisions: Round {ticket.revisionRound} ({ticket.maxRevisions})</span>
                    <span>•</span>
                    <span>Messages: {ticket.messages.length}</span>
                  </div>
                </div>

                {/* Right side info & action */}
                <div className="flex items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
                  {ticket.assignedDesigner ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={ticket.assignedDesigner.avatar}
                        alt={ticket.assignedDesigner.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                      <div className="text-left">
                        <div className="text-xs font-medium text-white">
                          {ticket.assignedDesigner.name}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {ticket.assignedDesigner.role}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-amber-400">
                      Awaiting Designer Claim
                    </div>
                  )}

                  <div className="hidden sm:flex flex-col text-right font-mono text-xs">
                    <span className="text-white">
                      {isDelivered ? "Delivered" : `${ticket.deadlineHours}h SLA`}
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                      {isDelivered ? "All Source Sent" : "Active Clock"}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/tickets/${ticket.id}`}
                    className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition flex items-center gap-2 shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enter Hub</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CREATE TICKET MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-xl p-8 rounded-3xl bg-[#09090d] border border-white/15 shadow-2xl relative animate-[fadeIn_0.2s_ease]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-medium text-white">
                    Open Studio Design Ticket
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Assign dedicated human designers or synthesize through Adeline AI.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 hover:border-white text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">
                    Project / Website Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Apex AI Decentralized Exchange"
                    className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                  />
                </div>

                {/* Service Tier */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType("human_studio")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      serviceType === "human_studio"
                        ? "border-indigo-400 bg-indigo-500/10 text-white"
                        : "border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <div className="text-xs font-medium">Human Studio</div>
                    <div className="text-[10px] font-mono text-indigo-400">$49.99 Flat</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType("adeline_builder")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      serviceType === "adeline_builder"
                        ? "border-cyan-400 bg-cyan-500/10 text-white"
                        : "border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <div className="text-xs font-medium">Adeline AI</div>
                    <div className="text-[10px] font-mono text-cyan-400">$29.99 Flat</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType("micro_logo")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      serviceType === "micro_logo"
                        ? "border-amber-400 bg-amber-500/10 text-white"
                        : "border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <div className="text-xs font-medium">Micro Studio</div>
                    <div className="text-[10px] font-mono text-amber-400">$5.00 Flat</div>
                  </button>
                </div>

                {/* Archetype */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">
                    Visual Archetype DNA
                  </label>
                  <select
                    value={archetype}
                    onChange={(e) => setArchetype(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition"
                  >
                    <option value="Liquid Glass Bento">Liquid Glass Bento</option>
                    <option value="Glassmorphism & Specular Refraction">Glassmorphism & Specular Refraction</option>
                    <option value="Neo-Brutalism & High Glow">Neo-Brutalism & High Glow</option>
                    <option value="Swiss Minimalist Rigor">Swiss Minimalist Rigor</option>
                    <option value="Claymorphism 3D Tactile">Claymorphism 3D Tactile</option>
                  </select>
                </div>

                {/* Brief */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">
                    Design Brief & Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Describe your layout, color requirements, target audience, and key sections..."
                    className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none transition resize-none"
                  />
                </div>

                {/* Brand Assets Upload Simulation */}
                <div className="border border-dashed border-white/20 hover:border-cyan-400/60 rounded-xl p-4 flex flex-col items-center justify-center gap-1 bg-white/[0.01] cursor-pointer">
                  <UploadCloud className="w-5 h-5 text-zinc-400" />
                  <span className="text-xs text-zinc-300">Attach Brand Logos or Moodboard</span>
                  <span className="text-[10px] text-zinc-500 font-mono">1TB Google Cloud Storage Edge CDN</span>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition"
                  >
                    Submit Ticket →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
