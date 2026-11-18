import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const project = await db.projects.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // IDOR Protection: only owning user or admin/staff can access
    if (session.role !== "admin" && session.role !== "staff" && project.user_id !== session.id) {
      return NextResponse.json(
        { error: "Forbidden. You do not have access to this project." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.projects.findById(id);

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // IDOR check: only owning user or admin can delete
    if (session.role !== "admin" && existing.user_id !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await db.projects.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }

    await db.logs.log("PROJECT_DELETED", `Project ${id} deleted by ${session.email}`, session.id);

    return NextResponse.json({ success: true, message: `Project ${id} deleted` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
