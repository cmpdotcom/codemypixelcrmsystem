import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

interface SendResult {
  sent: boolean;
  /** Present only in dev fallback when no provider is configured */
  devCode?: string;
}

export interface InvitationMailInput {
  to: string;
  inviteUrl: string;
  inviterName: string;
  roleName: string;
  companyName: string;
  expiresAt: Date;
}

async function getBranding() {
  const settings = await prisma.setting.findMany();
  const obj: Record<string, string> = {};
  for (const s of settings) obj[s.key] = s.value;
  return {
    companyName: obj.company_name || obj.companyName || "CMP CRM",
    logoUrl: obj.company_emailLogoUrl || obj.company_logoUrl || "/demo-logo-email.svg",
    supportEmail: obj.company_supportEmail || "",
  };
}

function buildHtml(code: string, companyName: string, logoUrl: string, userName: string) {
  const logoBlock = logoUrl
    ? `<img src="${logoUrl}" alt="${companyName}" style="height:36px;border-radius:8px;" />`
    : `<span style="font-size:18px;font-weight:800;color:#0f172a;">${companyName}</span>`;
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f7fc;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
    <div style="background:#0f172a;padding:20px 28px;">${logoBlock}</div>
    <div style="padding:28px;">
      <h1 style="font-size:18px;color:#0f172a;margin:0 0 8px;">Verify your email</h1>
      <p style="font-size:13px;color:#475569;line-height:1.6;margin:0 0 20px;">
        Hi ${userName}, thanks for signing up for ${companyName}.
        Enter this verification code to activate your account:
      </p>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;text-align:center;padding:18px 0;margin:0 0 20px;">
        <span style="font-size:32px;font-weight:800;letter-spacing:10px;color:#1d4ed8;">${code}</span>
      </div>
      <p style="font-size:11px;color:#94a3b8;line-height:1.6;margin:0;">
        This code expires in 10 minutes. If you didn't create an account, you can ignore this email.
      </p>
    </div>
    <div style="padding:14px 28px;border-top:1px solid #f1f5f9;">
      <p style="font-size:10px;color:#94a3b8;margin:0;">&copy; ${new Date().getFullYear()} ${companyName}</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendVerificationEmail(
  to: string,
  code: string,
  userName: string,
): Promise<SendResult> {
  const { companyName, logoUrl } = await getBranding();
  const subject = `${code} is your ${companyName} verification code`;
  const html = buildHtml(code, companyName, logoUrl, userName);
  const text = `Your ${companyName} verification code is ${code}. It expires in 10 minutes.`;
  const from = process.env.MAIL_FROM || `${companyName} <onboarding@resend.dev>`;

  // 1) Resend
  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend failed: ${body}`);
    }
    return { sent: true };
  }

  // 2) Generic SMTP
  if (process.env.SMTP_HOST) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER || "noreply@localhost",
      to,
      subject,
      html,
      text,
    });
    return { sent: true };
  }

  // 3) Dev fallback — no provider configured; log the code
  console.log(`\n[MAIL:DEV] Verification code for ${to}: ${code}\n`);
  return { sent: false, devCode: code };
}

export async function sendInvitationEmail(input: InvitationMailInput): Promise<SendResult & { devLink?: string }> {
  const { to, inviteUrl, inviterName, roleName, companyName, expiresAt } = input;
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f7fc;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:18px;border:1px solid #e2e8f0;overflow:hidden;">
    <div style="background:#0f172a;padding:26px 30px;">
      <div style="font-size:20px;font-weight:800;color:#ffffff;">${companyName}</div>
      <div style="font-size:11px;color:#93c5fd;margin-top:5px;letter-spacing:2px;">CRM WORKSPACE INVITATION</div>
    </div>
    <div style="padding:30px;">
      <h1 style="font-size:22px;color:#0f172a;margin:0 0 10px;">You’re invited to join ${companyName}</h1>
      <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">${inviterName} invited you to join the CRM as a <strong>${roleName}</strong>.</p>
      <a href="${inviteUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 20px;border-radius:10px;">Accept invitation</a>
      <p style="font-size:11px;color:#94a3b8;line-height:1.6;margin:22px 0 0;">This invitation expires on ${expiresAt.toLocaleString()}. If you were not expecting this invitation, you can ignore this email.</p>
      <p style="font-size:11px;color:#64748b;word-break:break-all;margin:16px 0 0;">${inviteUrl}</p>
    </div>
  </div>
</body>
</html>`;
  const text = `${inviterName} invited you to join ${companyName} as a ${roleName}. Accept your invitation here: ${inviteUrl}`;
  const from = process.env.MAIL_FROM || `${companyName} <onboarding@resend.dev>`;

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: `You’re invited to join ${companyName}`, html, text }),
    });
    if (!res.ok) throw new Error(`Invitation email failed: ${await res.text()}`);
    return { sent: true };
  }

  if (process.env.SMTP_HOST) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transport.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER || "noreply@localhost", to, subject: `You’re invited to join ${companyName}`, html, text });
    return { sent: true };
  }

  console.log(`\n[MAIL:DEV] Invitation link for ${to}: ${inviteUrl}\n`);
  return { sent: false, devLink: inviteUrl };
}
