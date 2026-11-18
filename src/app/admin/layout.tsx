"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTessro } from "@/lib/tessro-context";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, currentUser } = useTessro();

  const isStaffOrAdmin =
    currentUser.role === "admin" ||
    (currentUser.role as any) === "staff" ||
    (currentUser.role as any) === "designer";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth?redirect=/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono text-xs gap-3">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-zinc-400 tracking-widest uppercase">Verifying Admin Credentials...</span>
      </div>
    );
  }

  // Strict Role Protection
  if (!isStaffOrAdmin) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono text-red-400 tracking-widest uppercase mb-2">
          Access Denied · 403 Forbidden
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight mb-3">
          Restricted to Tessro Staff & Administrators
        </h1>
        <p className="text-zinc-400 text-sm max-w-md font-light mb-8">
          Your account ({currentUser.email}) holds client privileges and cannot access the studio administration console.
        </p>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Client Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
