import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

/**
 * GET /api/tickets
 * Strictly secure: Unauthenticated requests return 401.
 * Clients only see their own tickets. Staff & Admins see all tickets.
 */
export async function GET(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to view tickets." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    let tickets;
    if (session.role === "admin" || session.role === "staff") {
      tickets = await db.tickets.getAll({ status });
    } else {
      tickets = await db.tickets.getAll({ client_id: session.id, status });
    }

    return NextResponse.json({
      success: true,
      tickets,
      count: tickets.length,
      storage: db.getEngine(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/tickets
 * Create a new studio ticket. Requires authenticated session.
 */
export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to create a design ticket." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      category = "Design",
      priority = "medium",
      figma_url,
    } = body;

    if (!title || !title.trim() || !description || !description.trim()) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    const clientId = session.id;
    const clientName = session.name || "Client User";

    const ticket = await db.tickets.create({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: "open",
      client_id: clientId,
      client_name: clientName,
      assigned_to: "usr_staff_01",
      assigned_name: "Elena Rostova",
      figma_url: figma_url ? String(figma_url).trim() : undefined,
    });

    // Add initial message
    await db.messages.create({
      ticket_id: ticket.id,
      sender_id: clientId,
      sender_name: clientName,
      sender_role: session.role,
      message: description.trim(),
      attachment_url: figma_url ? String(figma_url).trim() : undefined,
    });

    await db.logs.log(
      "TICKET_CREATED",
      `Ticket ${ticket.id} (${category} - ${priority}) created: ${title}`,
      clientId
    );

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
