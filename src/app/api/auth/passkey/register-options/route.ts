import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPasskeyRegistrationOptions } from "@/lib/passkeys";

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json({ error: "Authentication required to register passkey" }, { status: 401 });
    }

    const user = await db.users.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const options = await getPasskeyRegistrationOptions(user);
    return NextResponse.json(options);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
