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
    const ticket = await db.tickets.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // IDOR verification
    if (session.role !== "admin" && session.role !== "staff" && ticket.client_id !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await db.messages.getByTicket(id);
    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: ticketId } = await params;
    const { message, attachment_url } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const ticket = await db.tickets.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // IDOR check: only owning client or staff/admin can post messages
    if (session.role !== "admin" && session.role !== "staff" && ticket.client_id !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const senderId = session.id;
    const senderName = session.name || "Client User";
    const senderRole = session.role;

    const newMessage = await db.messages.create({
      ticket_id: ticketId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      message: message.trim(),
      attachment_url: attachment_url || undefined,
    });

    // If client sends message and ticket is resolved, re-open to in_progress
    if (senderRole === "client" && ticket.status === "resolved") {
      await db.tickets.update(ticketId, { status: "in_progress" });
    }

    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
