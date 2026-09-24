import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function findInvitation(token: string) {
  return prisma.invitation.findUnique({ where: { tokenHash: hashToken(token) }, include: { role: { select: { name: true } }, team: { select: { name: true } } } });
}

type InvitationRouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: NextRequest, context: InvitationRouteContext) {
  const { token } = await context.params;
  const invitation = await findInvitation(token);
  if (!invitation || invitation.acceptedAt || invitation.expiresAt <= new Date()) return NextResponse.json({ error: "This invitation is invalid or has expired." }, { status: 410 });
  return NextResponse.json({ email: invitation.email, firstName: invitation.firstName || "", lastName: invitation.lastName || "", role: invitation.role.name, team: invitation.team?.name || null, expiresAt: invitation.expiresAt });
}

export async function POST(request: NextRequest, context: InvitationRouteContext) {
  const { token } = await context.params;
  const invitation = await findInvitation(token);
  if (!invitation || invitation.acceptedAt || invitation.expiresAt <= new Date()) return NextResponse.json({ error: "This invitation is invalid or has expired." }, { status: 410 });
  const body = await request.json();
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : invitation.firstName?.trim() || "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : invitation.lastName?.trim() || "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!firstName || !lastName) return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  if (await prisma.user.findUnique({ where: { email: invitation.email } })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.$transaction(async (tx) => {
    await tx.user.create({ data: { firstName, lastName, email: invitation.email, password: hashedPassword, roleId: invitation.roleId, teamId: invitation.teamId, status: "Active", emailVerified: new Date() } });
    await tx.invitation.update({ where: { id: invitation.id }, data: { firstName, lastName, acceptedAt: new Date() } });
  });
  return NextResponse.json({ success: true, email: invitation.email });
}
