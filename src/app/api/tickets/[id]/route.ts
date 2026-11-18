import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

/**
 * GET /api/tickets/[id]
 * Only the owning client or staff/admin can view this ticket.
 */
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
    const ticket = await db.tickets.findById(id);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // IDOR Protection: client can only view their own ticket
    if (session.role !== "admin" && session.role !== "staff" && ticket.client_id !== session.id) {
      return NextResponse.json(
        { error: "Forbidden. You do not have permission to view this ticket." },
        { status: 403 }
      );
    }

    const messages = await db.messages.getByTicket(id);

    return NextResponse.json({
      success: true,
      ticket,
      messages,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/tickets/[id]
 * Only owning client or staff/admin can update.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    const existing = await db.tickets.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // IDOR check: client can only update their own ticket
    if (session.role !== "admin" && session.role !== "staff" && existing.client_id !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only staff/admin can change assignment or resolve status
    const allowedUpdates = { ...updates };
    if (session.role === "client") {
      delete allowedUpdates.assigned_to;
      delete allowedUpdates.assigned_name;
    }

    const updated = await db.tickets.update(id, allowedUpdates);

    await db.logs.log(
      "TICKET_UPDATED",
      `Ticket ${id} updated: ${Object.keys(allowedUpdates).join(", ")}`,
      session.id
    );

    return NextResponse.json({ success: true, ticket: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/tickets/[id]
 * Staff/Admin only.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession(req);
    if (!session || (session.role !== "admin" && session.role !== "staff")) {
      return NextResponse.json(
        { error: "Forbidden. Admin or Staff permission required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const deleted = await db.tickets.delete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    await db.logs.log("TICKET_DELETED", `Ticket ${id} deleted`, session.id);

    return NextResponse.json({ success: true, message: `Ticket ${id} deleted` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
