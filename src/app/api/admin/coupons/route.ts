import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

/**
 * GET /api/admin/coupons
 * Returns all active & historic coupon codes. Staff or Admin role required.
 */
export async function GET(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session || (session.role !== "admin" && session.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized. Staff or Admin role required." }, { status: 403 });
    }

    const coupons = await db.coupons.getAll();
    return NextResponse.json({ success: true, coupons });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/coupons
 * Create a new promo coupon. Admin only.
 */
export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin role required to create coupons." }, { status: 403 });
    }

    const body = await req.json();
    const {
      code,
      discount_type = "percent",
      discount_value,
      applicable_to = "all",
      max_uses,
      valid_until,
      min_order_amount = 0,
      active = true,
    } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    if (discount_value === undefined || isNaN(Number(discount_value)) || Number(discount_value) <= 0) {
      return NextResponse.json({ error: "A positive discount value is required" }, { status: 400 });
    }

    const existing = await db.coupons.getByCode(code);
    if (existing) {
      return NextResponse.json({ error: `Coupon code '${code.toUpperCase()}' already exists.` }, { status: 409 });
    }

    const created = await db.coupons.create({
      code: code.trim().toUpperCase(),
      discount_type: discount_type === "fixed" ? "fixed" : "percent",
      discount_value: Number(discount_value),
      applicable_to: applicable_to || "all",
      max_uses: max_uses ? Number(max_uses) : undefined,
      valid_until: valid_until || undefined,
      min_order_amount: Number(min_order_amount) || 0,
      active: active !== false,
    });

    await db.logs.log(
      "COUPON_CREATED",
      `Coupon ${created.code} (${created.discount_type}: ${created.discount_value}) created`,
      session.id
    );

    return NextResponse.json({ success: true, coupon: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/coupons
 * Update coupon active status or limits. Admin only.
 */
export async function PATCH(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin role required to update coupons." }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon id is required" }, { status: 400 });
    }

    const updated = await db.coupons.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    await db.logs.log("COUPON_UPDATED", `Coupon ${updated.code} updated`, session.id);

    return NextResponse.json({ success: true, coupon: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/coupons
 * Delete a promo coupon. Admin only.
 */
export async function DELETE(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin role required to delete coupons." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon id is required in query params (?id=...)" }, { status: 400 });
    }

    const deleted = await db.coupons.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    await db.logs.log("COUPON_DELETED", `Coupon ${id} deleted`, session.id);

    return NextResponse.json({ success: true, message: `Coupon ${id} deleted` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
