import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureInvitableRoles, INVITABLE_ROLES } from "@/lib/invitations";
import { sendInvitationEmail } from "@/lib/mail";
import { getAppUrl } from "@/lib/app-url";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const invitations = await prisma.invitation.findMany({
    where: { acceptedAt: null, expiresAt: { gt: new Date() } },
    include: { role: { select: { name: true, color: true } }, team: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invitations);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "You must be signed in to invite users." }, { status: 401 });
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const roleId = typeof body.roleId === "string" ? body.roleId : "";
  const teamId = typeof body.teamId === "string" && body.teamId ? body.teamId : null;
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : null;
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : null;
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role || !INVITABLE_ROLES.includes(role.name as (typeof INVITABLE_ROLES)[number])) return NextResponse.json({ error: "Choose a valid invitation role." }, { status: 400 });
  if (teamId && !(await prisma.team.findUnique({ where: { id: teamId } }))) return NextResponse.json({ error: "The selected team no longer exists." }, { status: 400 });
  if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });
  const inviter = await prisma.user.findUnique({ where: { id: session.user.id }, select: { firstName: true, lastName: true } });
  if (!inviter) return NextResponse.json({ error: "Inviting user was not found." }, { status: 401 });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invitation = await prisma.invitation.create({ data: { email, firstName, lastName, roleId: role.id, teamId, invitedById: session.user.id, tokenHash: hashToken(token), expiresAt } });
  const settings = await prisma.setting.findMany({ where: { key: { in: ["company_name", "companyName"] } } });
  const companyName = settings.find((item) => item.key === "company_name")?.value || settings.find((item) => item.key === "companyName")?.value || "CMP CRM";
  const inviteUrl = `${getAppUrl(request)}/invite/${token}`;
  try {
    const mailResult = await sendInvitationEmail({ to: email, inviteUrl, inviterName: `${inviter.firstName} ${inviter.lastName}`.trim(), roleName: role.name, companyName, expiresAt });
    return NextResponse.json({ success: true, invitationId: invitation.id, expiresAt, devLink: mailResult.devLink || null });
  } catch (error) {
    await prisma.invitation.delete({ where: { id: invitation.id } });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not send invitation email." }, { status: 502 });
  }
}
