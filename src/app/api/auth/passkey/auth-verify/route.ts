import { NextResponse } from "next/server";
import { verifyPasskeyAuth } from "@/lib/passkeys";
import { signSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { response: webauthnResponse, sessionKey } = await req.json();

    if (!webauthnResponse || !sessionKey) {
      return NextResponse.json({ error: "Missing credential response or session key" }, { status: 400 });
    }

    const { verified, user } = await verifyPasskeyAuth(webauthnResponse, sessionKey);

    if (!verified || !user) {
      return NextResponse.json({ error: "Passkey biometric verification failed" }, { status: 401 });
    }

    await db.logs.log("USER_PASSKEY_LOGIN", `Passkey login successful for ${user.email}`, user.id);

    const token = await signSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    });

    const response = NextResponse.json({
      success: true,
      message: "Passkey authentication successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set("tessro_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Passkey verification failed" }, { status: 500 });
  }
}
