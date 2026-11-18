"use client";

import React, { useState } from "react";
import { Tag, Check, X, RotateCcw, Sparkles } from "lucide-react";

interface CouponInputProps {
  originalAmount: number;
  product?: "all" | "reels" | "adeline" | "studio";
  onApply: (data: {
    code: string;
    discountAmount: number;
    finalAmount: number;
    discountType: "percent" | "fixed";
    discountValue: number;
  } | null) => void;
  className?: string;
}

export default function CouponInput({
  originalAmount,
  product = "all",
  onApply,
  className = "",
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
    discountType: "percent" | "fixed";
    discountValue: number;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          amount: originalAmount,
          product,
        }),
      });

      const data = await res.json();

      if (data.valid) {
        const result = {
          code: data.coupon.code,
          discountAmount: data.discount_amount,
          finalAmount: data.final_amount,
          discountType: data.coupon.discount_type,
          discountValue: data.coupon.discount_value,
          message: data.message,
        };
        setAppliedCoupon(result);
        onApply(result);
      } else {
        setErrorMsg(data.error || "Invalid coupon code");
        setAppliedCoupon(null);
        onApply(null);
      }
    } catch (err: any) {
      setErrorMsg("Network error validating coupon");
      setAppliedCoupon(null);
      onApply(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCode("");
    setErrorMsg(null);
    onApply(null);
  };

  return (
    <div className={`w-full font-mono text-xs ${className}`}>
      {!appliedCoupon ? (
        <form onSubmit={handleApply} className="flex flex-col gap-1.5">
          <div className="relative flex items-center">
            <Tag className="absolute left-3 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Promo code (e.g. LAUNCH50)"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (errorMsg) setErrorMsg(null);
              }}
              className="w-full pl-9 pr-20 py-2 rounded-xl bg-black/40 border border-white/15 text-white uppercase text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="absolute right-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] disabled:opacity-40 transition"
            >
              {isLoading ? (
                <RotateCcw className="w-3 h-3 animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          </div>
          {errorMsg && (
            <p className="text-[11px] text-red-400 pl-1">{errorMsg}</p>
          )}
        </form>
      ) : (
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold tracking-wider">{appliedCoupon.code}</span>
              <span className="text-zinc-400 ml-1.5 text-[11px]">
                ({appliedCoupon.discountType === "percent" ? `-${appliedCoupon.discountValue}%` : `-$${appliedCoupon.discountValue}`})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">
              ${appliedCoupon.finalAmount.toFixed(2)}
            </span>
            <button
              onClick={handleRemove}
              className="p-1 text-zinc-400 hover:text-white transition"
              title="Remove coupon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
