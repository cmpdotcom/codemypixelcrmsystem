import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/leads/[id] - Get a single lead
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]">,
) {
  const { id } = await ctx.params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json(lead);
}

// PATCH /api/leads/[id] - Update a lead
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]">,
) {
  const { id } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  if (body.setter !== undefined) {
    const session = await auth();
    if (!session?.user?.roleName || !["Super Admin", "Executive", "Sales Manager"].includes(session.user.roleName)) {
      return NextResponse.json({ error: "Only workspace managers can assign leads" }, { status: 403 });
    }
  }

  if (body.email !== undefined && (typeof body.email !== "string" || !/^\S+@\S+\.\S+$/.test(body.email.trim()))) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const optionalDate = (value: unknown) => {
    if (!value) return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const updateString = (value: unknown) => typeof value === "string" ? value.trim() : null;

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: String(body.name).trim() }),
      ...(body.company !== undefined && { company: String(body.company).trim() }),
      ...(body.email !== undefined && { email: String(body.email).trim() }),
      ...(body.phone !== undefined && { phone: updateString(body.phone) }),
      ...(body.location !== undefined && { location: updateString(body.location) }),
      ...(body.linkedin !== undefined && { linkedin: updateString(body.linkedin) }),
      ...(body.source !== undefined && { source: updateString(body.source) || existing.source }),
      ...(body.service !== undefined && { service: updateString(body.service) }),
      ...(body.status !== undefined && { status: updateString(body.status) || existing.status }),
      ...(body.setter !== undefined && { setter: updateString(body.setter) }),
      ...(body.setterImg !== undefined && { setterImg: updateString(body.setterImg) }),
      ...(body.budget !== undefined && { budget: updateString(body.budget) }),
      ...(body.timeline !== undefined && { timeline: updateString(body.timeline) }),
      ...(body.companySize !== undefined && { companySize: updateString(body.companySize) }),
      ...(body.industry !== undefined && { industry: updateString(body.industry) }),
      ...(body.notes !== undefined && { notes: updateString(body.notes) }),
      ...(body.customData !== undefined && body.customData && typeof body.customData === "object" && { customData: body.customData as object }),
      ...(body.nextFollowUp !== undefined && {
        nextFollowUp: optionalDate(body.nextFollowUp),
      }),
      ...(body.lastContact !== undefined && {
        lastContact: optionalDate(body.lastContact),
      }),
    },
  });

  return NextResponse.json(lead);
}

// DELETE /api/leads/[id] - Delete a lead
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]">,
) {
  const { id } = await ctx.params;
  const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
