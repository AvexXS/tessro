"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Circle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  Mail,
  ShieldCheck,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { startAuthentication } from "@simplewebauthn/browser";
import { useTessro } from "@/lib/tessro-context";

export default function AuthPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
          INITIALIZING TESSRO AUTH...
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "verify_code">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const { login } = useTessro();

  // 1. Password-based Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const success = await login(email, password, "client");
      if (success) {
        setSubmitted(true);
        setTimeout(() => router.push(redirectTarget), 700);
      } else {
        setErrorMsg("Invalid email or password.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. Send 6-Digit Email Verification Code
  const handleRequestCode = async (purpose: "registration" | "magic_link") => {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address first.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });

      const data = await res.json();
      if (res.ok) {
        setAuthMode("verify_code");
        if (data.devCode) {
          setInfoMsg(`Code sent! (Dev mode key: ${data.devCode})`);
          setOtpCode(data.devCode);
        } else {
          setInfoMsg(`A 6-digit security code was dispatched to ${email}.`);
        }
      } else {
        setErrorMsg(data.error || "Failed to send code");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify Code & Complete Sign In / Sign Up
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const fullName = `${firstName || "Julian"} ${lastName || "Vance"}`.trim();
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otpCode,
          name: fullName,
          password: password || undefined,
          role: "client",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await login(email, password || "tessro-pass", "client");
        setSubmitted(true);
        setTimeout(() => router.push(redirectTarget), 700);
      } else {
        setErrorMsg(data.error || "Code verification failed.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Verification error");
    } finally {
      setLoading(false);
    }
  };

  // 4. Passkey (WebAuthn / Biometric) Authentication
  const handlePasskeyLogin = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const optRes = await fetch("/api/auth/passkey/auth-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined }),
      });

      if (!optRes.ok) throw new Error("Could not initialize passkey challenge");
      const { options, sessionKey } = await optRes.json();

      // Trigger native browser TouchID / FaceID / Windows Hello prompt
      const authResponse = await startAuthentication({ optionsJSON: options });

      const verifyRes = await fetch("/api/auth/passkey/auth-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: authResponse,
          sessionKey,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.user) {
        await login(verifyData.user.email, "", verifyData.user.role);
        setSubmitted(true);
        setTimeout(() => router.push(redirectTarget), 700);
      } else {
        setErrorMsg(verifyData.error || "Passkey verification was rejected.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Passkey authentication cancelled or unsupported.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: "client" | "designer" | "admin") => {
    setErrorMsg(null);
    setLoading(true);
    let demoEmail = "client@acme.ai";
    let demoPass = "client123";

    if (role === "designer") {
      demoEmail = "designer@tessro.com";
      demoPass = "staff123";
    } else if (role === "admin") {
      demoEmail = "admin@tessro.com";
      demoPass = "admin123";
    }

    const success = await login(demoEmail, demoPass, role);
    setLoading(false);
    if (success) {
      if (role === "admin") router.push("/admin");
      else if (role === "designer") router.push(redirectTarget.includes("admin") ? "/admin" : redirectTarget);
      else router.push(redirectTarget);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4 font-sans text-white antialiased">
      {/* LEFT COLUMN: HERO & PURE BACKGROUND VIDEO (w-[52%]) */}
      <section className="hidden lg:flex w-full lg:w-[52%] relative flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute top-8 left-8 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/85 text-xs font-mono tracking-wider text-white border border-white/15 backdrop-blur-md transition-all hover:scale-105"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>TESSRO HOME</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="z-10 w-full max-w-xs space-y-8 text-center flex flex-col items-center"
        >
          <div className="flex items-center gap-2.5">
            <Circle className="w-4 h-4 fill-white text-white" />
            <span className="text-xl font-light tracking-[0.45em] text-white">TESSRO</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap text-white">
              {authMode === "verify_code"
                ? "Verify Email"
                : authMode === "login"
                ? "Welcome Back"
                : "Join Tessro"}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed px-4">
              Biometric Passkeys & Zero-Trust Email Verification Protocol.
            </p>
          </div>

          <div className="w-full space-y-3">
            <div className="w-full h-14 px-4 rounded-2xl flex items-center gap-3.5 text-sm font-medium bg-white text-black border border-white shadow-lg">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-black text-white">
                1
              </div>
              <span className="truncate">Cryptographic Identity</span>
            </div>
            <div className="w-full h-14 px-4 rounded-2xl flex items-center gap-3.5 text-sm font-medium bg-[#1A1A1A] text-white border-none">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-white/10 text-white/40">
                2
              </div>
              <span className="truncate">Adeline AI Studio Access</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* RIGHT COLUMN: INTERACTIVE AUTH FORM */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden relative">
        <div className="lg:hidden absolute top-4 left-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xl space-y-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-medium tracking-tight text-white">
              {authMode === "verify_code"
                ? "Security Code Verification"
                : authMode === "login"
                ? "Sign In to Studio"
                : "Create Verified Account"}
            </h2>
            <p className="text-white/40 text-sm">
              {authMode === "verify_code"
                ? `Enter the 6-digit confirmation code dispatched to ${email}.`
                : authMode === "login"
                ? "Sign in with Google, GitHub, biometric passkey, or password."
                : "Register with verified email and passkey capabilities."}
            </p>
          </div>

          {/* Real 1-Click OAuth Providers (Google & GitHub) */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`/api/auth/oauth/google?redirect=${encodeURIComponent(redirectTarget)}`}
              className="h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-white transition cursor-pointer active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span>Google OAuth</span>
            </a>

            <a
              href={`/api/auth/oauth/github?redirect=${encodeURIComponent(redirectTarget)}`}
              className="h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-white transition cursor-pointer active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub OAuth</span>
            </a>
          </div>

          {/* Passkey 1-Tap Biometric Button */}
          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 flex items-center justify-center gap-3 text-sm font-medium text-white transition cursor-pointer active:scale-[0.99]"
          >
            <Fingerprint className="w-5 h-5 text-cyan-400" />
            <span>Sign In With Passkey (Face ID / Touch ID)</span>
          </button>

          {/* Demo Personas Switcher */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] font-mono">
            <span className="text-zinc-500 pl-1">Demo Access:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo("client")}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white text-zinc-300 hover:text-black transition cursor-pointer"
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("designer")}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-400 text-indigo-300 hover:text-black transition cursor-pointer"
              >
                Staff Designer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-400 text-emerald-300 hover:text-black transition cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/10"></div>
            <span className="absolute bg-black px-4 text-xs font-medium text-white/40 uppercase tracking-widest font-mono">
              OR EMAIL AUTH
            </span>
          </div>

          {/* Form States */}
          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#121216] border border-white/10 text-center space-y-5 animate-[fadeIn_0.3s_ease]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-medium text-white">Identity Verified & Session Active</h3>
              <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                Welcome to Tessro. Redirecting to your workspace...
              </p>
            </div>
          ) : authMode === "verify_code" ? (
            /* 6-DIGIT OTP VERIFICATION FORM */
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-medium text-white block">Enter 6-Digit Security Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="bg-[#1A1A1A] border border-white/10 rounded-xl h-14 px-4 text-center font-mono text-2xl tracking-[0.4em] text-white placeholder:text-white/20 focus:ring-2 focus:ring-cyan-400 w-full outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition cursor-pointer shadow-lg disabled:opacity-50"
              >
                {loading ? "Verifying Code..." : "Verify & Enter Studio →"}
              </button>

              <div className="flex items-center justify-between text-xs text-white/50 pt-2">
                <button
                  type="button"
                  onClick={() => handleRequestCode("registration")}
                  className="hover:text-white underline cursor-pointer"
                >
                  Resend Security Code
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="hover:text-white underline cursor-pointer"
                >
                  Back to Password Sign In
                </button>
              </div>
            </form>
          ) : (
            /* LOGIN / SIGNUP FORM */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              {authMode === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="First Name"
                    placeholder="Julian"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <InputGroup
                    label="Last Name"
                    placeholder="Vance"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              )}

              <InputGroup
                label="Work Email"
                placeholder="julian@acme.ai"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <div className="relative">
                  <InputGroup
                    label="Password"
                    placeholder="••••••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-white/40 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition cursor-pointer shadow-lg disabled:opacity-50 text-xs sm:text-sm"
                >
                  {loading ? "Authenticating..." : authMode === "login" ? "Sign In With Password" : "Create Account"}
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestCode(authMode === "signup" ? "registration" : "magic_link")}
                  className="h-12 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium rounded-xl transition cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Send 6-Digit Email Code</span>
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "signup" : "login");
                    setErrorMsg(null);
                    setInfoMsg(null);
                  }}
                  className="text-sm text-white/50 hover:text-white transition cursor-pointer"
                >
                  {authMode === "login" ? (
                    <span>
                      Don&apos;t have an account?{" "}
                      <strong className="text-white underline font-medium">Sign up</strong>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{" "}
                      <strong className="text-white underline font-medium">Log in</strong>
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </section>
    </main>
  );
}

function InputGroup({
  label,
  placeholder,
  type = "text",
  ...rest
}: { label: string; placeholder?: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5 w-full text-left">
      <label className="text-sm font-medium text-white block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-[#1A1A1A] border-none rounded-xl h-11 px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 w-full outline-none transition"
        {...rest}
      />
    </div>
  );
}
