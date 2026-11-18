import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getCurrentSession(req);
    return NextResponse.json({
      active: true,
      tier: "ReelPro Creator",
      price: "$20",
      billingPeriod: "monthly",
      nextBillingDate: "2026-12-16",
      credits: "Unlimited",
      exportQuality: "4K 60FPS",
      watermarkRemoved: true,
      features: [
        "Clone Any Trending Reel Style",
        "AI Audio Beat-Sync & Whip Transitions",
        "Kinetic Subtitles (Alex Hormozi Style)",
        "Conversational Edit Directing",
        "500MB 4K Raw Video Uploads",
        "Direct 9:16 MP4 Export",
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    const body = await req.json().catch(() => ({}));

    // Simulate instant $20/mo checkout activation
    return NextResponse.json({
      success: true,
      message: "ReelPro Creator Subscription activated successfully for $20/month.",
      subscription: {
        status: "active",
        tier: "ReelPro Creator",
        price: "$20/month",
        userEmail: session?.email || "creator@tessro.design",
        activatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
