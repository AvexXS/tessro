import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code, amount = 0, product = "all" } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await db.coupons.getByCode(cleanCode);

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Invalid coupon code." },
        { status: 404 }
      );
    }

    if (!coupon.active) {
      return NextResponse.json(
        { valid: false, error: "This promo coupon is currently inactive." },
        { status: 400 }
      );
    }

    // Expiry check
    if (coupon.valid_until && new Date() > new Date(coupon.valid_until)) {
      return NextResponse.json(
        { valid: false, error: "This coupon code has expired." },
        { status: 400 }
      );
    }

    // Max uses check
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, error: "This coupon code has reached its maximum usage limit." },
        { status: 400 }
      );
    }

    // Min order amount check
    const orderAmt = Number(amount) || 0;
    if (coupon.min_order_amount && orderAmt < coupon.min_order_amount) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum order amount of $${coupon.min_order_amount} required to use this coupon.`,
        },
        { status: 400 }
      );
    }

    // Product eligibility check
    if (coupon.applicable_to !== "all" && product !== "all" && coupon.applicable_to !== product) {
      return NextResponse.json(
        {
          valid: false,
          error: `This coupon is exclusively applicable to ${coupon.applicable_to} plans.`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === "percent") {
      discountAmount = Math.round(orderAmt * (coupon.discount_value / 100) * 100) / 100;
    } else {
      discountAmount = Math.min(orderAmt, coupon.discount_value);
    }

    const finalAmount = Math.max(0, Math.round((orderAmt - discountAmount) * 100) / 100);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        applicable_to: coupon.applicable_to,
      },
      discount_amount: discountAmount,
      original_amount: orderAmt,
      final_amount: finalAmount,
      message: `Coupon ${coupon.code} applied: ${
        coupon.discount_type === "percent" ? `${coupon.discount_value}% off` : `$${coupon.discount_value} off`
      }!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
