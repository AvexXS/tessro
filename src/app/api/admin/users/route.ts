import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session || (session.role !== "admin" && session.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await db.users.getAll();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Only full Admins can modify user roles" }, { status: 403 });
    }

    const { id, role } = await req.json();
    if (!id || !role || !["client", "staff", "admin"].includes(role)) {
      return NextResponse.json({ error: "Valid id and role (client, staff, admin) required" }, { status: 400 });
    }

    const updated = await db.users.updateRole(id, role);
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.logs.log("USER_ROLE_CHANGED", `User ${id} role updated to ${role}`, session.id);

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
