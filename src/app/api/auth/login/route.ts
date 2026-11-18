import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSession, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    let user = await db.users.findByEmail(email);

    // If user does not exist, and it's a demo quick-switch or password provided, auto-create
    if (!user) {
      if (password) {
        user = await db.users.create({
          email,
          name: email.split("@")[0],
          password_hash: hashPassword(password),
          role: role || "client",
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
        });
      } else {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
    } else if (password) {
      // Validate password if supplied
      const isValid = verifyPassword(password, user.password_hash);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
    }

    // Role override for demo switcher if requested
    if (role && ["client", "staff", "admin"].includes(role) && user.role !== role) {
      user = await db.users.updateRole(user.id, role);
    }

    if (!user) {
      return NextResponse.json({ error: "Authentication failed." }, { status: 401 });
    }

    await db.logs.log("USER_LOGIN", `User signed in: ${user.email} (${user.role})`, user.id);

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

    response.cookies.set("tessro_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}
