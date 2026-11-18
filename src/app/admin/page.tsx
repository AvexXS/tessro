"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import { useTessro } from "@/lib/tessro-context";
import { StudioTicket } from "@/lib/tessro-store";
import {
  ShieldAlert,
  Users,
  DollarSign,
  HardDrive,
  Ticket,
  CheckCircle2,
  Clock,
  Sparkles,
  Settings,
  Database,
  Cloud,
  Check,
  AlertTriangle,
  ExternalLink,
  Layers,
  ArrowRight,
  RefreshCw,
  Cpu,
  Tag,
  Percent,
  Trash2,
  Plus,
} from "lucide-react";

export default function AdminStaffPanelPage() {
  const { currentUser, tickets, updateTicketStatus, assignDesigner, storageStats } = useTessro();
  const [activeTab, setActiveTab] = useState<"queue" | "clients" | "infrastructure" | "coupons">("queue");

  // Live Server Backend States
  const [serverStats, setServerStats] = useState<any>(null);
  const [serverSystem, setServerSystem] = useState<any>(null);
  const [serverUsers, setServerUsers] = useState<any[]>([]);
  const [serverCoupons, setServerCoupons] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Coupon Form State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newDiscountType, setNewDiscountType] = useState<"percent" | "fixed">("percent");
  const [newDiscountValue, setNewDiscountValue] = useState("20");
  const [newApplicableTo, setNewApplicableTo] = useState<"all" | "reels" | "adeline" | "studio">("all");
  const [newMaxUses, setNewMaxUses] = useState("500");
  const [newMinOrder, setNewMinOrder] = useState("0");

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, sysRes, usersRes, couponsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/system"),
        fetch("/api/admin/users"),
        fetch("/api/admin/coupons"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setServerStats(data.stats);
        setRecentLogs(data.recentLogs || []);
      }
      if (sysRes.ok) {
        const data = await sysRes.json();
        setServerSystem(data.system);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setServerUsers(data.users || []);
      }
      if (couponsRes.ok) {
        const data = await couponsRes.json();
        setServerCoupons(data.coupons || []);
      }
    } catch (err) {
      console.warn("Could not fetch admin data from backend:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleClaimTicket = async (ticketId: string) => {
    await assignDesigner(ticketId, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      role: "Staff Interface Architect",
    });
    alert(`Ticket ${ticketId} assigned to you (${currentUser.name}).`);
    fetchAdminData();
  };

  const handleStatusChange = async (ticketId: string, newStatus: StudioTicket["status"]) => {
    await updateTicketStatus(ticketId, newStatus);
    fetchAdminData();
  };

  const handleRoleChange = async (userId: string, newRole: "client" | "staff" | "admin") => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) {
        fetchAdminData();
      } else {
        alert("Failed to update user role");
      }
    } catch (err: any) {
      alert(`Role change error: ${err.message}`);
    }
  };

  const handleToggleCoupon = async (couponId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: couponId, active: !currentActive }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Toggle coupon error:", err);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm("Are you sure you want to permanently delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${couponId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Delete coupon error:", err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newDiscountValue) return;

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCouponCode.trim().toUpperCase(),
          discount_type: newDiscountType,
          discount_value: Number(newDiscountValue),
          applicable_to: newApplicableTo,
          max_uses: newMaxUses ? Number(newMaxUses) : undefined,
          min_order_amount: Number(newMinOrder) || 0,
        }),
      });

      if (res.ok) {
        setShowCouponModal(false);
        setNewCouponCode("");
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create coupon");
      }
    } catch (err: any) {
      alert(err.message || "Failed to create coupon");
    }
  };

  const grossRevenue = serverStats?.totalRevenue || (tickets.reduce((acc, t) => acc + t.price, 0) + 2450.0);
  const activeTicketsCount = tickets.filter((t) => t.status !== "delivered").length;
  const isPostgresConnected = serverSystem?.database?.connected || false;
  const dbEngine = serverSystem?.database?.engine || "Local Persistent JSON DB";

  return (
    <div className="min-h-screen bg-black text-white font-sans select-none">
      <DashboardNav />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-widest uppercase mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              Tessro Studio Admin Console
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Operations & Telemetry Hub
            </h1>
            <p className="mt-1 text-zinc-400 text-sm max-w-xl font-light">
              Manage client ticket queues, assign staff designers, monitor Google Cloud Storage telemetry, and configure production database integrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-neutral-900 border border-white/10 p-1 rounded-full">
            <button
              onClick={() => setActiveTab("queue")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "queue"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Designer Queue ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "clients"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              User Roster ({serverUsers.length || 3})
            </button>
            <button
              onClick={() => setActiveTab("infrastructure")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeTab === "infrastructure"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Cloud & DB Status
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "coupons"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>Coupons ({serverCoupons.length})</span>
            </button>
            <button
              onClick={fetchAdminData}
              title="Refresh telemetry"
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* TOP KPI ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase">
              <span>Gross Studio Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white">${grossRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              <span className="text-xs text-emerald-400 font-mono">+18.4%</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">Includes $20/mo Reels & $49.99 studio</div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase">
              <span>Active Design Orders</span>
              <Ticket className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-light text-white">{activeTicketsCount}</span>
              <span className="text-xs text-indigo-400 font-mono">100% SLA PASS</span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">72h turnaround guaranteed</div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase">
              <span>Storage CDN Engine</span>
              <HardDrive className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-light text-white truncate">
                {serverSystem?.storage?.gcsConfigured ? "1TB GCS CDN" : "Edge Local"}
              </span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {serverSystem?.storage?.bucket || "tessro-cdn-assets"}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-mono uppercase">
              <span>Database Persistence</span>
              <Database className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-xl font-light text-white truncate">
                {isPostgresConnected ? "PostgreSQL" : "Persistent File DB"}
              </span>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              {isPostgresConnected ? "Supabase / Neon Live" : "Auto-syncs on DATABASE_URL"}
            </div>
          </div>
        </div>

        {/* TAB 1: DESIGNER WORKFLOW & TICKET QUEUE */}
        {activeTab === "queue" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light text-white">Live Design Ticket Queue</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Designers can advance workflow phases, attach production deliverables, and chat directly with clients.
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                ACTING AS: {currentUser.role.toUpperCase()} ({currentUser.name})
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden divide-y divide-white/10">
              {tickets.map((t) => (
                <div key={t.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white/[0.02] transition">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-zinc-400 font-semibold">{t.id}</span>
                      <span className="text-xs font-mono text-white bg-white/10 px-2.5 py-0.5 rounded-full">
                        {t.serviceType === "human_studio" ? "$49.99 Human" : "$29.99 AI Builder"}
                      </span>
                      <span className="text-xs font-mono text-cyan-400">{t.archetype}</span>
                    </div>

                    <h3 className="text-lg font-medium text-white">{t.title}</h3>
                    <p className="text-xs text-zinc-400 max-w-2xl line-clamp-1">{t.brief}</p>
                    <div className="text-xs font-mono text-zinc-500">
                      Client: <span className="text-zinc-300">{t.clientName}</span> ({t.clientEmail})
                    </div>
                  </div>

                  {/* Designer Action Controls */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Assigned Designer */}
                    <div className="flex items-center gap-2">
                      {t.assignedDesigner ? (
                        <>
                          <img
                            src={t.assignedDesigner.avatar}
                            alt={t.assignedDesigner.name}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                          <div className="text-left font-mono text-xs">
                            <div className="text-white">{t.assignedDesigner.name}</div>
                            <div className="text-[10px] text-zinc-500">{t.assignedDesigner.role}</div>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => handleClaimTicket(t.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-mono border border-indigo-500/30 cursor-pointer"
                        >
                          Claim Ticket
                        </button>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-500">Status:</span>
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value as StudioTicket["status"])}
                        className="bg-black border border-white/20 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="queued">Queued</option>
                        <option value="wireframing">Wireframing</option>
                        <option value="designing">Designing (Figma)</option>
                        <option value="review">Client Review</option>
                        <option value="delivered">Delivered (Complete)</option>
                      </select>
                    </div>

                    <Link
                      href={`/dashboard/tickets/${t.id}`}
                      className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs tracking-tight hover:bg-zinc-200 transition flex items-center gap-1.5"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: USER ROSTER & ROLE MANAGEMENT */}
        {activeTab === "clients" && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-light text-white">Registered Users & Role Permissions</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Manage all accounts stored in the database. Promote users to Staff Designer or Studio Admin.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 text-zinc-400 border-b border-white/10">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Promote / Reassign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-zinc-300">
                  {serverUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="p-4 font-sans font-medium text-white flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${u.role === "admin" ? "bg-emerald-400" : u.role === "staff" ? "bg-indigo-400" : "bg-cyan-400"}`} />
                        {u.name}
                      </td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase ${u.role === "admin" ? "bg-emerald-500/20 text-emerald-300" : u.role === "staff" ? "bg-indigo-500/20 text-indigo-300" : "bg-white/10 text-zinc-300"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                          className="bg-black border border-white/15 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none cursor-pointer"
                        >
                          <option value="client">Client</option>
                          <option value="staff">Staff Designer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: CLOUD & INFRASTRUCTURE STATUS */}
        {activeTab === "infrastructure" && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-light text-white">Cloud Infrastructure & Backend Telemetry</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time status of connected managed services: PostgreSQL database, Google Cloud Storage CDN, and Gemini AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Database Telemetry */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-amber-400" />
                    <span className="font-medium text-white text-sm">PostgreSQL / Supabase Telemetry</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase ${isPostgresConnected ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {isPostgresConnected ? "Active PostgreSQL" : "Local Persistent JSON"}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Active Storage Engine:</span>
                    <span className="text-white">{dbEngine}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">DATABASE_URL Configured:</span>
                    <span className={serverSystem?.database?.envConfigured ? "text-emerald-400" : "text-amber-400"}>
                      {serverSystem?.database?.envConfigured ? "YES (.env.local active)" : "PENDING (Ready for keys)"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Node.js Runtime:</span>
                    <span className="text-white">{serverSystem?.nodeVersion || process.version}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">Heap Memory Used:</span>
                    <span className="text-white">{serverSystem?.memory?.heapUsedMB || 42} MB</span>
                  </div>
                </div>
              </div>

              {/* Google Cloud Storage Telemetry */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Cloud className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white text-sm">1TB Google Cloud Storage CDN</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase ${serverSystem?.storage?.gcsConfigured ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                    {serverSystem?.storage?.gcsConfigured ? "GCS Live CDN" : "Edge Fallback"}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Target Bucket Name:</span>
                    <span className="text-white">{serverSystem?.storage?.bucket || "tessro-cdn-assets"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Service Account Auth:</span>
                    <span className={serverSystem?.storage?.gcsConfigured ? "text-emerald-400" : "text-amber-400"}>
                      {serverSystem?.storage?.gcsConfigured ? "VERIFIED & SIGNED" : "PENDING GCS_PRIVATE_KEY"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-500">Direct Multipart Upload:</span>
                    <span className="text-emerald-400">ENABLED (/api/upload)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">CDN Edge Location:</span>
                    <span className="text-white">{serverSystem?.vercelRegion || "local-edge-dev"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Activity Audit Trail */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 space-y-4">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>Recent System Audit Logs</span>
              </h3>

              <div className="divide-y divide-white/5 text-xs font-mono">
                {recentLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-semibold">{log.action}</span>
                      <span className="text-zinc-300">{log.details}</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: COUPONS & DISCOUNT ENGINE */}
        {activeTab === "coupons" && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-light text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-cyan-400" />
                  <span>Promotional Coupons & Discount Engine</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Create, toggle, and audit active promo codes across Adeline Reels AI, Human Studio, and Neural Builder.
                </p>
              </div>

              <button
                onClick={() => setShowCouponModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold flex items-center gap-1.5 transition shadow-[0_0_20px_rgba(56,189,248,0.25)]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Coupon</span>
              </button>
            </div>

            {/* Coupons Table */}
            <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase text-[11px]">
                    <tr>
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Target Plan</th>
                      <th className="p-4">Redemptions</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {serverCoupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-4 font-semibold text-white">
                          <span className="px-2.5 py-1 rounded bg-white/10 text-cyan-300 border border-white/15">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-emerald-400 font-bold">
                            {coupon.discount_type === "percent" ? `${coupon.discount_value}% OFF` : `$${coupon.discount_value}.00 OFF`}
                          </span>
                        </td>
                        <td className="p-4 uppercase text-zinc-400">
                          {coupon.applicable_to === "all" ? "All Plans" : coupon.applicable_to}
                        </td>
                        <td className="p-4">
                          <span className="text-white font-medium">{coupon.used_count || 0}</span>
                          <span className="text-zinc-500"> / {coupon.max_uses ? coupon.max_uses : "∞"}</span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleCoupon(coupon.id, coupon.active)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono cursor-pointer border ${
                              coupon.active
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                            }`}
                          >
                            {coupon.active ? "Active" : "Disabled"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {serverCoupons.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 font-sans">
                          No active coupons found. Create your first promo code above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Create Coupon Modal */}
            {showCouponModal && (
              <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setShowCouponModal(false)}
              >
                <div
                  className="relative w-full max-w-md p-6 rounded-3xl bg-[#141419] border border-white/15 shadow-2xl flex flex-col gap-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-cyan-400" />
                      <span>New Promotional Coupon</span>
                    </h3>
                    <button
                      onClick={() => setShowCouponModal(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-mono">
                    <div>
                      <label className="text-zinc-400 block mb-1">COUPON CODE (UPPERCASE)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SUMMER70"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                        className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white uppercase focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-zinc-400 block mb-1">DISCOUNT TYPE</label>
                        <select
                          value={newDiscountType}
                          onChange={(e) => setNewDiscountType(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="percent">Percentage (%)</option>
                          <option value="fixed">Fixed Dollar ($)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-zinc-400 block mb-1">
                          {newDiscountType === "percent" ? "DISCOUNT VALUE (%)" : "DISCOUNT VALUE ($)"}
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max={newDiscountType === "percent" ? "100" : "1000"}
                          value={newDiscountValue}
                          onChange={(e) => setNewDiscountValue(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-zinc-400 block mb-1">APPLICABLE TO</label>
                        <select
                          value={newApplicableTo}
                          onChange={(e) => setNewApplicableTo(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="all">All Plans & Tiers</option>
                          <option value="reels">Adeline Reels AI ($20/mo)</option>
                          <option value="adeline">Adeline AI Studio ($29.99)</option>
                          <option value="studio">Human Studio ($49.99)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-zinc-400 block mb-1">MAX USES LIMIT</label>
                        <input
                          type="number"
                          placeholder="e.g. 500"
                          value={newMaxUses}
                          onChange={(e) => setNewMaxUses(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs tracking-wider uppercase transition shadow-lg mt-2"
                    >
                      Publish Promo Coupon
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
