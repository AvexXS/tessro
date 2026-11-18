import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    const body = await req.json().catch(() => ({}));
    const { code, amount = 0, product = "all" } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await db.coupons.getByCode(cleanCode);

    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 400 });
    }

    // Increment usage counter
    await db.coupons.incrementUsage(cleanCode);

    await db.logs.log(
      "COUPON_APPLIED",
      `Coupon ${cleanCode} applied to purchase of $${amount} (${product})`,
      session?.id
    );

    return NextResponse.json({
      success: true,
      code: coupon.code,
      message: `Coupon ${coupon.code} successfully claimed and recorded.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
