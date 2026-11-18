"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { useTessro } from "@/lib/tessro-context";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Paperclip,
  Send,
  Sparkles,
  Users,
  ShieldCheck,
  FileCode,
  Layers,
  Upload,
} from "lucide-react";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;
  const router = useRouter();
  const { currentUser, getTicket, updateTicketStatus, addMessage } = useTessro();

  const ticket = getTicket(ticketId);

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>(ticket?.messages || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch live messages from server
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((m: any) => ({
              id: m.id,
              senderId: m.sender_id,
              senderName: m.sender_name,
              senderRole: m.sender_role,
              avatar:
                m.sender_role === "staff"
                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  : "https://api.dicebear.com/7.x/identicon/svg?seed=julian",
              text: m.message,
              timestamp: new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              attachmentUrl: m.attachment_url,
              attachmentName: m.attachment_url ? m.attachment_url.split("/").pop() : undefined,
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Could not fetch server messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, ticket?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const currentText = messageText.trim();
    setMessageText("");

    // Optimistic append
    const optimistic = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      avatar: currentUser.avatar,
      text: currentText,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, optimistic]);

    // Send to server API
    await addMessage(ticketId, currentText);
    fetchMessages();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;
        await addMessage(
          ticketId,
          `Attached file: ${file.name} (${data.storage})`,
          file.name,
          uploadedUrl
        );
        fetchMessages();
      } else {
        alert("Upload failed. Please check file type and size.");
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRequestRevision = async () => {
    const note = prompt("Please provide specific feedback for this revision round:");
    if (!note) return;

    await addMessage(
      ticketId,
      `[CLIENT REVISION REQUEST]: ${note}`
    );
    await updateTicketStatus(ticketId, "in_design");
    fetchMessages();
    alert("Revision round recorded. Your designer has been notified.");
  };

  const handleApproveDelivery = async () => {
    if (confirm("Are you sure you want to approve this delivery and finalize the project?")) {
      await updateTicketStatus(ticketId, "delivered");
      await addMessage(ticketId, "[SYSTEM EVENT]: Client approved all deliverables. Project marked as DELIVERED.");
      fetchMessages();
    }
  };

  if (!ticket) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex flex-col">
        <DashboardNav />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <AlertCircle className="w-12 h-12 text-zinc-500" />
          <h2 className="text-2xl font-light text-white">Ticket Not Found</h2>
          <p className="text-zinc-400 text-sm max-w-md">
            The requested ticket ID "{ticketId}" does not exist or may have been archived.
          </p>
          <Link
            href="/dashboard/tickets"
            className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs uppercase font-medium"
          >
            ← Return to Tickets List
          </Link>
        </div>
      </div>
    );
  }

  const activeMessages = messages.length > 0 ? messages : ticket.messages;

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white/20 flex flex-col">
      <DashboardNav />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-8 space-y-6 flex flex-col">
        {/* Top Back Row & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <Link
            href="/dashboard/tickets"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO TICKETS</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">
              Role Acting: <span className="text-white uppercase">{currentUser.role}</span>
            </span>

            {ticket.status !== "delivered" && (
              <>
                <button
                  onClick={handleRequestRevision}
                  className="px-4 py-2 rounded-full border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs font-mono uppercase tracking-wider transition cursor-pointer"
                >
                  Request Revision Round
                </button>
                <button
                  onClick={handleApproveDelivery}
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition cursor-pointer"
                >
                  Approve Deliverables ✓
                </button>
              </>
            )}
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-start">
          
          {/* LEFT COLUMN: TICKET DETAILS & DELIVERABLES (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Overview Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-neutral-950 border border-white/10 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-zinc-400 font-semibold">{ticket.id}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                      ticket.status === "delivered"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : ticket.status === "in_review"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    }`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>

                <h1 className="text-2xl font-light text-white tracking-tight">{ticket.title}</h1>
                
                <div className="flex items-center gap-2 mt-2 text-xs font-mono text-zinc-400">
                  <span className="text-cyan-400">{ticket.archetype}</span>
                  <span>•</span>
                  <span>${ticket.price.toFixed(2)} Flat</span>
                </div>
              </div>

              {/* Assigned Designer */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {ticket.assignedDesigner && (
                    <img
                      src={ticket.assignedDesigner.avatar}
                      alt={ticket.assignedDesigner.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/20"
                    />
                  )}
                  <div>
                    <div className="text-xs font-mono text-zinc-400 uppercase">Dedicated Designer</div>
                    <div className="text-sm font-medium text-white">
                      {ticket.assignedDesigner?.name || "Elena Rostova"}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online & Assigned
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="text-white">Round {ticket.revisionRound}</div>
                  <div className="text-[10px] text-zinc-500">Unlimited Revisions</div>
                </div>
              </div>

              {/* Brief */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Client Brief & Specifications
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed p-4 rounded-xl bg-black border border-white/10">
                  {ticket.brief}
                </p>
              </div>

              {/* Deliverables Section */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Production Deliverables</span>
                  <span className="text-[10px] text-emerald-400 font-mono">1TB GCS CDN SYNCED</span>
                </span>

                <div className="space-y-2">
                  <a
                    href={ticket.deliverables?.figmaUrl || "https://figma.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between transition text-xs font-mono group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span className="text-zinc-200">Figma Source Design Tokens</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition" />
                  </a>

                  <button
                    onClick={() => {
                      const dummyHtml = `<!DOCTYPE html><html><body style="background:#000;color:#fff;font-family:sans-serif;padding:40px;"><h1>Tessro Production Delivery // ${ticket.id}</h1><p>${ticket.brief}</p></body></html>`;
                      const blob = new Blob([dummyHtml], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${ticket.id}-production.html`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full p-3.5 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition cursor-pointer shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Production Package</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME MESSAGING HUB (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col h-[700px] rounded-3xl bg-neutral-950 border border-white/10 overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-black/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-medium text-white">Direct Designer Channel</h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    Encrypted channel with {ticket.assignedDesigner?.name || "Staff Designer"}
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-500">
                {activeMessages.length} MESSAGES
              </div>
            </div>

            {/* Scrollable Message List */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {activeMessages.map((msg: any) => {
                const isMe = msg.senderRole === currentUser.role || msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <img
                        src={msg.avatar || "https://api.dicebear.com/7.x/identicon/svg?seed=avatar"}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0 mt-1"
                      />
                    )}

                    <div
                      className={`max-w-lg space-y-1.5 ${
                        isMe ? "items-end text-right" : "items-start text-left"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-zinc-300 font-medium">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.2 rounded ${
                            msg.senderRole === "designer" || msg.senderRole === "staff"
                              ? "bg-indigo-500/20 text-indigo-300"
                              : msg.senderRole === "admin"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/10 text-zinc-400"
                          }`}
                        >
                          {msg.senderRole}
                        </span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? "bg-white text-black font-normal rounded-tr-none shadow-md"
                            : "bg-[#121218] border border-white/10 text-white rounded-tl-none"
                        }`}
                      >
                        {msg.text}

                        {/* Optional Attachment Card */}
                        {msg.attachmentUrl && (
                          <a
                            href={msg.attachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`mt-3 p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition ${
                              isMe
                                ? "bg-black/10 border-black/20 text-black hover:bg-black/15"
                                : "bg-black/60 border-white/10 text-zinc-300 hover:border-white/30"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Paperclip className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate max-w-[200px]">
                                {msg.attachmentName || "Attached CDN Asset"}
                              </span>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-cyan-400 shrink-0">
                              VIEW / DOWNLOAD ↗
                            </span>
                          </a>
                        )}
                      </div>
                    </div>

                    {isMe && (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0 mt-1"
                      />
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/60 flex items-center gap-3">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl border border-white/10 hover:border-white/25 text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50"
                title="Upload file to Google Cloud Storage CDN"
              >
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Message as ${currentUser.name} (${currentUser.role})...`}
                className="flex-1 p-3.5 rounded-xl bg-black border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition"
              />

              <button
                type="submit"
                className="p-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold transition cursor-pointer flex items-center justify-center shrink-0 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
