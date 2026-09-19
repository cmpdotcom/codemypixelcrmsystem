import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/integrations/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/integrations/[id]">
) {
  const { id } = await ctx.params;
  const integration = await prisma.integration.findUnique({ where: { id } });

  if (!integration) {
    return NextResponse.json({ error: "Integration not found" }, { status: 404 });
  }

  return NextResponse.json(integration);
}

// PATCH /api/integrations/[id] - connect, disconnect, or update config
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/integrations/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.action === "connect") {
    updateData.status = "Connected";
    updateData.connectedAt = new Date();
    if (body.connectedBy) updateData.connectedBy = body.connectedBy;
  } else if (body.action === "disconnect") {
    updateData.status = "Not Connected";
    updateData.connectedAt = null;
    updateData.connectedBy = null;
  } else if (body.status) {
    updateData.status = body.status;
    if (body.status === "Connected" && !body.connectedAt) updateData.connectedAt = new Date();
    if (body.status === "Not Connected") {
      updateData.connectedAt = null;
      updateData.connectedBy = null;
    }
  }

  if (body.name) updateData.name = body.name.trim();
  if (body.description !== undefined) updateData.description = body.description;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.icon !== undefined) updateData.icon = body.icon;
  if (body.color !== undefined) updateData.color = body.color;
  if (body.config !== undefined) updateData.config = body.config;
  if (body.connectedBy !== undefined) updateData.connectedBy = body.connectedBy;

  const integration = await prisma.integration.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(integration);
}

// DELETE /api/integrations/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/integrations/[id]">
) {
  const { id } = await ctx.params;
  await prisma.integration.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
