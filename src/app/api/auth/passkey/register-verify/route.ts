import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPasskeyRegistration } from "@/lib/passkeys";

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const user = await db.users.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { response } = await req.json();
    const result = await verifyPasskeyRegistration(user, response);

    if (result.verified) {
      await db.logs.log("PASSKEY_REGISTERED", `New passkey enrolled for ${user.email}`, user.id);
      return NextResponse.json({ success: true, message: "Passkey registered successfully" });
    }

    return NextResponse.json({ error: "Passkey registration verification failed" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
