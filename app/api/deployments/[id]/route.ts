import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/deployments/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/deployments/[id]">
) {
  const { id } = await ctx.params;
  const deployment = await prisma.deployment.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!deployment) {
    return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
  }

  return NextResponse.json(deployment);
}

// PATCH /api/deployments/[id] - rollback or update deployment status
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/deployments/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.action === "rollback") {
    const original = await prisma.deployment.findUnique({ where: { id } });
    if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Mark current as rolled back
    const rolledBack = await prisma.deployment.update({
      where: { id },
      data: {
        status: "Rolled Back",
        rollbackFrom: original.version,
      },
    });
    return NextResponse.json(rolledBack);
  }

  if (body.status) updateData.status = body.status;
  if (body.version) updateData.version = body.version.trim();
  if (body.environment) updateData.environment = body.environment;
  if (body.releaseNotes !== undefined) updateData.releaseNotes = body.releaseNotes;

  const deployment = await prisma.deployment.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(deployment);
}

// DELETE /api/deployments/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/deployments/[id]">
) {
  const { id } = await ctx.params;
  await prisma.deployment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
