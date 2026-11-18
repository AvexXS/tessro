import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

/**
 * GET /api/adeline/projects
 * Strictly secure: Clients only see their own projects. Staff & Admin see all.
 */
export async function GET(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to view Adeline projects." },
        { status: 401 }
      );
    }

    let projects;
    if (session.role === "admin" || session.role === "staff") {
      projects = await db.projects.getAll();
    } else {
      projects = await db.projects.getAll(session.id);
    }

    return NextResponse.json({
      success: true,
      projects,
      count: projects.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/adeline/projects
 * Save a new synthesized website project.
 */
export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to save a project." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, archetype, prompt, html_code, css_code } = body;

    if (!title || !prompt || !html_code) {
      return NextResponse.json(
        { error: "Title, prompt, and html_code are required" },
        { status: 400 }
      );
    }

    const project = await db.projects.create({
      user_id: session.id,
      title: title.trim(),
      archetype: archetype || "Liquid Glass Bento",
      prompt: prompt.trim(),
      html_code,
      css_code: css_code || "",
      status: "completed",
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
