import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail, buildVerificationEmailHtml } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, purpose = "registration" } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    // Generate secure 6-digit verification code
    const code = crypto.randomInt(100000, 999999).toString();

    // Store in DB with 10-minute validity
    await db.verification.createCode(email, code, 10);

    // Send via Resend / SMTP / Console fallback
    const emailResult = await sendEmail({
      to: email,
      subject: `Your Tessro Verification Code [${code}]`,
      html: buildVerificationEmailHtml(code, purpose),
    });

    await db.logs.log(
      "AUTH_CODE_DISPATCHED",
      `Verification code dispatched to ${email} via ${emailResult.provider}`
    );

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      provider: emailResult.provider,
      // If running locally without external email provider configured, provide code in payload for instant testing
      devCode: emailResult.simulated ? code : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to send code" }, { status: 500 });
  }
}
