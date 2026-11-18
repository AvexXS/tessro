"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  UploadCloud, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  Scissors, 
  Zap, 
  Film, 
  Type, 
  Volume2, 
  VolumeX, 
  Download, 
  ExternalLink, 
  Layers, 
  Sliders, 
  MessageSquare, 
  Send, 
  HelpCircle,
  Video,
  Plus,
  Trash2,
  Maximize2,
  CheckCircle2,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import AtlasNav from "@/components/AtlasNav";
import CouponInput from "@/components/CouponInput";
import type { ReelAnalysisResult, ReelCut, ReelSubtitle } from "@/app/api/reels/edit/route";

interface RawClipItem {
  id: string;
  name: string;
  url: string;
  duration?: number;
  size?: string;
}

export default function ReelEditorPage() {
  // Subscription State
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [showSubModal, setShowSubModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);

  // Workflow Inputs
  const [referenceUrl, setReferenceUrl] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<"hormozi" | "cinematic" | "hype" | "vlog">("hormozi");
  const [prompt, setPrompt] = useState("");

  // Raw Clips
  const [rawClips, setRawClips] = useState<RawClipItem[]>([
    {
      id: "clip_01",
      name: "Hero Talking Intro.mp4",
      url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/glaze-motion.mp4",
      duration: 4.5,
      size: "12 MB",
    },
    {
      id: "clip_02",
      name: "Product B-Roll Spin.mp4",
      url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/orbit-spher-hero-interactive.mp4",
      duration: 3.8,
      size: "9 MB",
    },
    {
      id: "clip_03",
      name: "Studio Screen Capture.mp4",
      url: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/reelmark-hero-interaction.mp4",
      duration: 5.2,
      size: "16 MB",
    },
  ]);

  // Synthesis & Playback State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisStage, setSynthesisStage] = useState("");
  const [reelData, setReelData] = useState<ReelAnalysisResult | null>(null);

  // Video Player Controls
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(12);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<ReelSubtitle | null>(null);

  // Turn-by-Turn AI Director Chat
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string; time: string }[]>([
    {
      role: "assistant",
      content: "Welcome to Adeline ReelForge ($20/mo). I can analyze any viral Instagram or TikTok reel, extract its cut pacing, transitions, and kinetic subtitles, then edit your raw footage to match it. How would you like your reel styled?",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Export State
  const [showExportModal, setShowExportModal] = useState(false);

  // Handle Initial Default Load
  useEffect(() => {
    // Generate an initial mock reel so the player is alive on page load
    triggerSynthesis("Create an Alex Hormozi style high-retention reel with yellow kinetic captions");
  }, []);

  // Update active subtitle based on currentTime
  useEffect(() => {
    if (!reelData?.subtitles) return;
    const sub = reelData.subtitles.find(
      (s) => currentTime >= s.startTime && currentTime <= s.endTime
    );
    setActiveSubtitle(sub || null);
  }, [currentTime, reelData]);

  // Video time tracking
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Upload Raw Clip to CDN
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setRawClips((prev) => [
            ...prev,
            {
              id: `clip_${Date.now()}_${i}`,
              name: file.name,
              url: data.url,
              duration: 5.0,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            },
          ]);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

  // Upload Reference Reel
  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceFile(file);
      const url = URL.createObjectURL(file);
      setReferencePreviewUrl(url);
    }
  };

  // Core Synthesis Trigger
  const triggerSynthesis = async (customPrompt?: string) => {
    setIsSynthesizing(true);
    setSynthesisStage("Analyzing Reference Rhythm & Cut Points...");

    const activePrompt = customPrompt || prompt || "Edit my raw clips to mirror the trending reference style";

    setTimeout(() => setSynthesisStage("Detecting Audio Waveforms & Beat Drops..."), 600);
    setTimeout(() => setSynthesisStage("Synthesizing Kinetic Typography & Color Grade..."), 1200);

    try {
      const res = await fetch("/api/reels/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceReelUrl: referenceUrl || referencePreviewUrl || "Trending Instagram Reel",
          rawClips,
          prompt: activePrompt,
          templateStyle: selectedTemplate,
          chatHistory: chatMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setReelData(json.data);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }

        // Add assistant reply to chat
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✨ Reel compiled! ${json.data.aiDirectorNotes}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error("Synthesis failed:", err);
    } finally {
      setIsSynthesizing(false);
      setSynthesisStage("");
    }
  };

  // Chat Revision Directives
  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const newMsg = {
      role: "user" as const,
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    triggerSynthesis(text);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & TELEMETRY */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#0d0d11]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              R
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight group-hover:text-cyan-400 transition">
                ADELINE REELFORGE
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-500 ml-2">
                v2.6 VIRAL ENGINE
              </span>
            </div>
          </Link>

          <span className="hidden md:inline-block w-px h-4 bg-white/15" />

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI Short-Form Video Director</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Subscription Status Pill ($20/Month) */}
          <button
            onClick={() => setShowSubModal(true)}
            className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 hover:bg-cyan-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">$20 / Month · Pro Active</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 9:16</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN 3-COLUMN CREATOR WORKSPACE */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: INPUT DECK & STYLE CLONER (4 cols) */}
        {/* ========================================================= */}
        <section className="lg:col-span-4 border-r border-white/10 p-5 sm:p-6 overflow-y-auto max-h-[calc(100vh-62px)] custom-scrollbar flex flex-col gap-6 bg-[#0a0a0e]/50">
          
          {/* Deck Header */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Scissors className="w-3.5 h-3.5" />
              <span>Step 1 · Reference & Style Match</span>
            </div>
            <h2 className="text-xl font-medium text-white tracking-tight">
              Clone Any Trending Reel
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Upload a viral video or choose a template style. Adeline will reverse-engineer its cut pacing, transitions, and audio sync.
            </p>
          </div>

          {/* Reference Reel Upload / URL */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
              <span>REFERENCE VIDEO</span>
              <span className="text-[10px] text-zinc-500">MP4 / MOV UP TO 500MB</span>
            </div>

            <label className="border-2 border-dashed border-white/15 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-cyan-500/50 hover:bg-cyan-500/[0.02] transition cursor-pointer text-center group">
              <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-cyan-400 transition" />
              <span className="text-xs font-medium text-zinc-200">
                {referenceFile ? referenceFile.name : "Drop trending reel here or browse"}
              </span>
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleReferenceUpload}
                className="hidden"
              />
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">OR</span>
              <input
                type="text"
                placeholder="Paste Instagram / TikTok Reel URL..."
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Viral Style Presets */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-zinc-400 uppercase">
              Or Choose 1-Click Viral Preset:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "hormozi", name: "Hormozi Hook", desc: "Kinetic yellow subtitles, 1.8s cuts", icon: "🗣️" },
                { id: "hype", name: "Hype Beast Beat", desc: "0.8s cuts, whip pans, bass drop", icon: "⚡" },
                { id: "cinematic", name: "Cinematic 35mm", desc: "Kodak LUT, anamorphic tone", icon: "🎬" },
                { id: "vlog", name: "Minimalist Aesthetic", desc: "Clean serif text, chill vibe", icon: "☕" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedTemplate(style.id as any)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1 ${
                    selectedTemplate === style.id
                      ? "bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{style.icon}</span>
                    {selectedTemplate === style.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">{style.name}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{style.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Raw User Footage */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <Film className="w-3.5 h-3.5" />
                  <span>Step 2 · Your Raw Clips ({rawClips.length})</span>
                </div>
                <h3 className="text-sm font-medium text-white mt-0.5">
                  Upload Your Video Footage
                </h3>
              </div>

              <label className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono cursor-pointer transition flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Clip
                <input
                  type="file"
                  multiple
                  accept="video/mp4,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* List of uploaded clips */}
            <div className="flex flex-col gap-2">
              {rawClips.map((clip, idx) => (
                <div
                  key={clip.id}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-[10px] font-mono text-cyan-400">
                      0{idx + 1}
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-white truncate">{clip.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {clip.duration}s · {clip.size || "1080p"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setRawClips((prev) => prev.filter((c) => c.id !== clip.id))}
                    className="p-1 text-zinc-500 hover:text-red-400 transition shrink-0"
                    title="Remove clip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: AI Prompt & Synthesize Button */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <label className="text-xs font-mono text-zinc-300 uppercase flex items-center justify-between">
              <span>Step 3 · AI Director Directives</span>
              <span className="text-[10px] text-cyan-400">NATURAL LANGUAGE</span>
            </label>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Cut dynamically to the bass drop, add yellow kinetic captions like Hormozi, punch zoom 1.2x on jokes..."
              className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 resize-none"
            />

            <button
              onClick={() => triggerSynthesis()}
              disabled={isSynthesizing}
              className={`w-full py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-xl ${
                isSynthesizing
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-400 to-indigo-500 text-black hover:opacity-90 shadow-[0_0_25px_rgba(56,189,248,0.35)]"
              }`}
            >
              {isSynthesizing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>{synthesisStage || "Synthesizing Viral Reel..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Synthesize Viral Reel ($20/mo)</span>
                </>
              )}
            </button>
          </div>

        </section>

        {/* ========================================================= */}
        {/* CENTER COLUMN: LIVE 9:16 SMARTPHONE VIDEO PLAYER (5 cols) */}
        {/* ========================================================= */}
        <section className="lg:col-span-5 p-5 sm:p-6 flex flex-col items-center justify-between bg-black relative overflow-hidden">
          
          {/* Subtle Ambient Glow behind Phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[550px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Telemetry Bar */}
          <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE 9:16 REEL PREVIEW</span>
            </div>
            <div className="text-[11px] text-zinc-500">
              VIRAL RETENTION SCORE: <span className="text-cyan-400 font-bold">{reelData?.viralScore || 94}%</span>
            </div>
          </div>

          {/* 9:16 Smartphone Frame */}
          <div className="relative my-auto w-[270px] sm:w-[310px] aspect-[9/16] rounded-[42px] p-2 bg-[#121216] border-4 border-[#22222a] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.15)] flex flex-col justify-between overflow-hidden group">
            
            {/* Phone Speaker & Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-white/10" />
            </div>

            {/* Video Container */}
            <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={reelData?.previewVideoUrl || rawClips[0]?.url}
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Dynamic Kinetic Subtitles Overlay */}
              {activeSubtitle && (
                <div className="absolute bottom-16 left-4 right-4 text-center pointer-events-none z-20 animate-in zoom-in-95 duration-150">
                  <span className="inline-block px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 font-black text-sm tracking-tight uppercase shadow-2xl leading-snug">
                    {activeSubtitle.text.split(" ").map((word, wIdx) => {
                      const isHighlighted = activeSubtitle.highlightWords?.some(
                        (hw) => hw.toUpperCase() === word.replace(/[^\w]/g, "").toUpperCase()
                      );
                      return (
                        <span
                          key={wIdx}
                          className={`inline-block mr-1.5 ${
                            isHighlighted
                              ? activeSubtitle.style === "red_pop"
                                ? "text-red-400 scale-110 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                : activeSubtitle.style === "cyan_glow"
                                ? "text-cyan-300 scale-110 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                                : "text-yellow-300 scale-110 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]"
                              : "text-white"
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </span>
                </div>
              )}

              {/* Play/Pause Overlay Indicator on Hover */}
              <div
                onClick={togglePlay}
                className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity cursor-pointer ${
                  isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl hover:scale-105 transition">
                  {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                </div>
              </div>

              {/* Video Overlay Top Badge */}
              <div className="absolute top-6 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/80 z-20 pointer-events-none">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                  {reelData?.detectedPacing || "High-Retention Hook"}
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  9:16 HD
                </span>
              </div>
            </div>

          </div>

          {/* Video Scrub Bar & Timecode */}
          <div className="w-full mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-1 text-white hover:text-cyan-400 transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-white hover:text-cyan-400 transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-white">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </span>
              </div>

              <span className="text-zinc-500 font-mono text-[11px]">
                {reelData?.audioTrackName || "Trending Phonk / Bassline Drift"}
              </span>
            </div>

            {/* Timeline Multi-Track Visualizer */}
            <div className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
              {/* Cut Blocks Track */}
              <div className="h-6 w-full flex gap-1 rounded bg-black/60 p-0.5 overflow-hidden">
                {(reelData?.cuts || Array(4).fill(null)).map((cut, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-full rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[9px] font-mono text-cyan-300 truncate px-1"
                  >
                    Cut {idx + 1}
                  </div>
                ))}
              </div>

              {/* Subtitles Waveform Track */}
              <div className="h-3 w-full bg-black/40 rounded flex items-center justify-around px-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-zinc-600 rounded-full"
                    style={{
                      height: `${Math.max(3, Math.sin(i * 0.8) * 10 + 4)}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: AI DIRECTOR CHAT & REVISIONS (3 cols) */}
        {/* ========================================================= */}
        <section className="lg:col-span-3 border-l border-white/10 p-5 sm:p-6 flex flex-col justify-between bg-[#0a0a0e]/50 max-h-[calc(100vh-62px)]">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-sm font-medium text-white">Adeline AI Director</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">LIVE REVISIONS</span>
            </div>

            {/* Quick Directive Pills */}
            <div className="flex flex-col gap-1.5 mb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                1-Click Edit Directives:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "⚡ Make cuts faster",
                  "✨ Add yellow bold captions",
                  "🎵 Sync to bass drops",
                  "🔍 Add punch zoom 1.2x",
                  "🎬 Apply 35mm film LUT",
                ].map((pill, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(pill)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-white/10 text-[10px] font-mono text-zinc-300 transition"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2 custom-scrollbar text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl flex flex-col gap-1 ${
                  msg.role === "user"
                    ? "bg-cyan-500/15 border border-cyan-500/30 ml-4 text-white"
                    : "bg-white/[0.04] border border-white/10 mr-4 text-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>{msg.role === "user" ? "YOU" : "ADELINE DIRECTOR"}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="leading-relaxed font-sans">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* Chat Input Deck */}
          <div className="pt-3 border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask Adeline for changes..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendChat();
                }}
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleSendChat()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition"
                title="Send instruction"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-2 text-center">
              Included in your $20/month ReelPro Plan
            </p>
          </div>

        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. SUBSCRIPTION MODAL ($20/MONTH) */}
      {/* ------------------------------------------------------------- */}
      {showSubModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setShowSubModal(false)}
        >
          <div 
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#141419] border border-white/15 shadow-2xl flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                  CREATOR MEMBERSHIP
                </span>
                <h3 className="text-2xl font-light text-white mt-2">
                  Adeline ReelPro Unlimited
                </h3>
              </div>
              <button
                onClick={() => setShowSubModal(false)}
                className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex items-baseline gap-2 pb-4 border-b border-white/10">
              <span className="text-5xl font-semibold text-white tracking-tight">
                ${appliedCoupon ? appliedCoupon.finalAmount.toFixed(0) : "20"}
              </span>
              <span className="text-zinc-400 text-sm font-mono">/ month</span>
              {appliedCoupon && (
                <span className="text-xs font-mono text-zinc-500 line-through ml-2">
                  $20/mo
                </span>
              )}
              <span className="ml-auto text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {appliedCoupon ? "Discount Applied" : "Active Tier"}
              </span>
            </div>

            {/* Promo Coupon Input Deck */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                Have a Promo Code?
              </span>
              <CouponInput
                originalAmount={20}
                product="reels"
                onApply={(c) => setAppliedCoupon(c)}
              />
            </div>

            <div className="flex flex-col gap-3">
              {[
                "Clone Any Trending Instagram & TikTok Reel Style",
                "Conversational Turn-by-Turn AI Video Director",
                "Dynamic Kinetic Captions (Alex Hormozi Style)",
                "Beat-Sync Transitions & Whip Pans",
                "500MB 4K Raw Video Upload Pipeline",
                "Instant 1080x1920 60FPS MP4 Video Exports",
                "Zero Watermark & Full Commercial License",
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={async () => {
                if (appliedCoupon) {
                  await fetch("/api/coupons/apply", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      code: appliedCoupon.code,
                      amount: 20,
                      product: "reels",
                    }),
                  });
                }
                setIsSubscribed(true);
                setShowSubModal(false);
              }}
              className="w-full py-3 rounded-xl bg-cyan-400 text-black font-semibold text-xs tracking-wider uppercase hover:bg-cyan-300 transition shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer"
            >
              {appliedCoupon && appliedCoupon.finalAmount === 0
                ? "Claim 100% Free Trial · Continue"
                : "Subscription Active · Continue Editing"}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. EXPORT MODAL */}
      {/* ------------------------------------------------------------- */}
      {showExportModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setShowExportModal(false)}
        >
          <div 
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#141419] border border-white/15 shadow-2xl flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  READY FOR DOWNLOAD
                </span>
                <h3 className="text-2xl font-light text-white mt-2">
                  Export 9:16 Video
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col gap-2 text-xs font-mono text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">FORMAT:</span>
                <span className="text-white">MP4 (H.264 High Profile)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">RESOLUTION:</span>
                <span className="text-white">1080 × 1920 (9:16 Portrait)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">FRAMERATE:</span>
                <span className="text-white">60 FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">WATERMARK:</span>
                <span className="text-emerald-400">Removed (Pro Plan)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={reelData?.previewVideoUrl || rawClips[0]?.url}
                download="trending_reel_adeline.mp4"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition text-center shadow-xl"
              >
                Download MP4 Video
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reelData?.previewVideoUrl || window.location.href);
                  alert("Shareable video link copied to clipboard!");
                }}
                className="px-4 py-3 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20 transition"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
