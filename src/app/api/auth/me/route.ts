import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const dbUser = await db.users.findById(session.id);
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        email: session.email,
        name: dbUser ? dbUser.name : session.name,
        role: dbUser ? dbUser.role : session.role,
        avatar: session.avatar || dbUser?.avatar,
        title: session.title || (session.role === "admin" ? "Founder & CEO / CTO" : "Studio Client"),
        clerkId: session.clerkId,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}
