import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-white/5 via-neutral-500/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Brand header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors mb-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Tessro
          </Link>
          <h1 className="text-3xl font-serif italic text-white tracking-tight">Tessro</h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-mono">
            Client & Studio Gateway
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <SignIn
          routing="hash"
          signUpUrl="/signup"
          fallbackRedirectUrl="/dashboard"
        />

        <div className="mt-8 text-center text-xs text-neutral-500 font-mono">
          Secured with Clerk & Passkeys · Tessro Studio 2026
        </div>
      </div>
    </div>
  );
}
