import { NextRequest, NextResponse } from "next/server";
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
  const body = await request.json();

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.linkedin !== undefined && { linkedin: body.linkedin }),
      ...(body.source !== undefined && { source: body.source }),
      ...(body.service !== undefined && { service: body.service }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.setter !== undefined && { setter: body.setter }),
      ...(body.setterImg !== undefined && { setterImg: body.setterImg }),
      ...(body.budget !== undefined && { budget: body.budget }),
      ...(body.timeline !== undefined && { timeline: body.timeline }),
      ...(body.companySize !== undefined && { companySize: body.companySize }),
      ...(body.industry !== undefined && { industry: body.industry }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.nextFollowUp !== undefined && {
        nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
      }),
      ...(body.lastContact !== undefined && {
        lastContact: body.lastContact ? new Date(body.lastContact) : null,
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
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
