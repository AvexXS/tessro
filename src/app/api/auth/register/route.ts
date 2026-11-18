import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name, role = "client" } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await db.users.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Determine role (default to client unless requested as staff/admin with demo flags)
    const validRole = ["client", "staff", "admin"].includes(role) ? role : "client";

    const user = await db.users.create({
      email,
      name,
      password_hash: hashPassword(password),
      role: validRole as "client" | "staff" | "admin",
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    });

    await db.logs.log("USER_REGISTERED", `New user created: ${email} (${validRole})`, user.id);

    const token = await signSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set("tessro_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Registration failed" }, { status: 500 });
  }
}
