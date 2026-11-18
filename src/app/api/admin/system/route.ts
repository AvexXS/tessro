import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session || (session.role !== "admin" && session.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const memory = process.memoryUsage();
    const stats = await db.getStats();

    return NextResponse.json({
      success: true,
      system: {
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        memory: {
          heapUsedMB: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotalMB: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
          rssMB: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
        },
        database: {
          engine: stats.engine,
          connected: stats.databaseConnected,
          envConfigured: !!process.env.DATABASE_URL,
        },
        storage: {
          bucket: stats.storageBucket,
          gcsConfigured: !!(process.env.GCS_CLIENT_EMAIL && process.env.GCS_PRIVATE_KEY),
          directUploadEnabled: true,
        },
        environment: process.env.NODE_ENV || "development",
        vercelRegion: process.env.VERCEL_REGION || "local-edge-dev",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
