import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clients/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/clients/[id]">
) {
  const { id } = await ctx.params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      deals: true,
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json(client);
}

// PATCH /api/clients/[id]
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/clients/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.company) updateData.company = body.company.trim();
  if (body.tagline !== undefined) updateData.tagline = body.tagline?.trim() || null;
  if (body.location !== undefined) updateData.location = body.location?.trim() || null;
  if (body.address !== undefined) updateData.address = body.address?.trim() || null;
  if (body.website !== undefined) updateData.website = body.website?.trim() || null;
  if (body.email) updateData.email = body.email.trim();
  if (body.phone !== undefined) updateData.phone = body.phone?.trim() || null;
  if (body.industry) updateData.industry = body.industry;
  if (body.companySize) updateData.companySize = body.companySize;
  if (body.status) updateData.status = body.status;
  if (body.contactName !== undefined) updateData.contactName = body.contactName?.trim() || null;
  if (body.contactRole !== undefined) updateData.contactRole = body.contactRole?.trim() || null;
  if (body.revenue !== undefined) updateData.revenue = parseFloat(body.revenue);
  if (body.outstanding !== undefined) updateData.outstanding = parseFloat(body.outstanding);
  if (body.projectsCount !== undefined) updateData.projectsCount = parseInt(body.projectsCount);
  if (body.notes !== undefined) updateData.notes = body.notes;

  const client = await prisma.client.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(client);
}

// DELETE /api/clients/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/clients/[id]">
) {
  const { id } = await ctx.params;
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
