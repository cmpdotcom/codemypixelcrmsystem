import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/app-url";
import { sendInvitationEmail } from "@/lib/mail";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

type ResendRouteContext = { params: Promise<{ token: string }> };

export async function POST(request: NextRequest, context: ResendRouteContext) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token: invitationId } = await context.params;
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { role: { select: { name: true } } },
  });
  if (!invitation) return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
  if (invitation.acceptedAt) return NextResponse.json({ error: "This invitation has already been accepted." }, { status: 409 });

  const inviter = await prisma.user.findUnique({ where: { id: session.user.id }, select: { firstName: true, lastName: true } });
  if (!inviter) return NextResponse.json({ error: "Inviting user was not found." }, { status: 401 });
  const settings = await prisma.setting.findMany({ where: { key: { in: ["company_name", "companyName"] } } });
  const companyName = settings.find((item) => item.key === "company_name")?.value || settings.find((item) => item.key === "companyName")?.value || "CMP CRM";
  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const inviteUrl = `${getAppUrl(request)}/invite/${rawToken}`;

  await prisma.invitation.update({ where: { id: invitation.id }, data: { tokenHash: hashToken(rawToken), expiresAt } });
  try {
    const mailResult = await sendInvitationEmail({ to: invitation.email, inviteUrl, inviterName: `${inviter.firstName} ${inviter.lastName}`.trim(), roleName: invitation.role.name, companyName, expiresAt });
    return NextResponse.json({ success: true, expiresAt, devLink: mailResult.devLink || null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not resend invitation email." }, { status: 502 });
  }
}
