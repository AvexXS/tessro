"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTessro } from "@/lib/tessro-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useTessro();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth?redirect=/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono text-xs gap-3">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-zinc-400 tracking-widest uppercase">Verifying Tessro Session...</span>
      </div>
    );
  }

  return <>{children}</>;
}
