import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signSession, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, code, name, password, role = "client" } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    const isValid = await db.verification.verifyCode(email, code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code. Please request a new one." },
        { status: 400 }
      );
    }

    let user = await db.users.findByEmail(email);

    // If new user registering with code, create verified account
    if (!user) {
      user = await db.users.create({
        email,
        name: name || email.split("@")[0],
        password_hash: hashPassword(password || "tessro-default-pass-123!"),
        role: ["client", "staff", "admin"].includes(role) ? role : "client",
        email_verified: true,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
      });
    } else {
      // Existing user verified
      await db.users.update(user.id, { email_verified: true });
    }

    await db.logs.log("USER_EMAIL_VERIFIED", `Email verified for ${email}`, user.id);

    const token = await signSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    });

    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully",
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
    return NextResponse.json({ error: err.message || "Verification failed" }, { status: 500 });
  }
}
