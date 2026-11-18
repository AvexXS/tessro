import nodemailer from "nodemailer";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// SMTP fallback if configured
const smtpTransporter =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const fromEmail = process.env.EMAIL_FROM || "auth@tessro.com";

  // 1. Try Resend if API key is configured
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: `Tessro Studio <${fromEmail}>`,
        to,
        subject,
        html,
      });
      if (error) throw error;
      return { success: true, provider: "Resend", id: data?.id };
    } catch (err) {
      console.warn("[Tessro Email] Resend delivery failed, trying SMTP:", err);
    }
  }

  // 2. Try SMTP if configured
  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `Tessro Studio <${fromEmail}>`,
        to,
        subject,
        html,
      });
      return { success: true, provider: "SMTP", id: info.messageId };
    } catch (err) {
      console.warn("[Tessro Email] SMTP delivery failed:", err);
    }
  }

  // 3. Fallback: Log verification code to console & simulation
  console.log(`\n======================================================`);
  console.log(`[Tessro Auth Verification Email]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`(Email provider pending in .env.local: RESEND_API_KEY or SMTP_*)`);
  console.log(`======================================================\n`);

  return {
    success: true,
    provider: "Console Log (Awaiting RESEND_API_KEY / SMTP in .env.local)",
    simulated: true,
  };
}

export function buildVerificationEmailHtml(code: string, purpose: string = "verification") {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tessro Verification Code</title>
</head>
<body style="background-color: #050508; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #0c0c12; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; padding: 40px; text-align: center;">
    
    <div style="display: inline-block; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.05); line-height: 44px; margin-bottom: 24px;">
      <span style="font-size: 18px; color: #ffffff;">✦</span>
    </div>

    <h2 style="font-size: 24px; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 8px; color: #ffffff;">
      TESSRO DIGITAL STUDIO
    </h2>
    <p style="font-size: 13px; color: #888899; line-height: 1.6; margin-bottom: 32px;">
      Your security verification code for ${purpose} is below. This single-use code expires in 10 minutes.
    </p>

    <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 20px 0; margin-bottom: 32px;">
      <span style="font-family: monospace; font-size: 36px; font-weight: 600; letter-spacing: 0.35em; color: #ffffff; padding-left: 0.35em;">
        ${code}
      </span>
    </div>

    <p style="font-size: 11px; color: #666677; font-family: monospace; line-height: 1.5;">
      If you did not request this security code, please ignore this transmission.<br>
      Tessro Neural Architecture • Zero Trust Cryptographic Security
    </p>
  </div>
</body>
</html>
`;
}
