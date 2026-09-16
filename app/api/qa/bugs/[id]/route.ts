import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/qa/bugs/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/qa/bugs/[id]">
) {
  const { id } = await ctx.params;
  const bug = await prisma.bug.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!bug) {
    return NextResponse.json({ error: "Bug not found" }, { status: 404 });
  }

  return NextResponse.json(bug);
}

// PATCH /api/qa/bugs/[id]
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/qa/bugs/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.title) updateData.title = body.title.trim();
  if (body.description !== undefined) updateData.description = body.description;
  if (body.projectName) updateData.projectName = body.projectName.trim();
  if (body.module !== undefined) updateData.module = body.module;
  if (body.severity) updateData.severity = body.severity;
  if (body.priority) updateData.priority = body.priority;
  if (body.status) {
    updateData.status = body.status;
    if (body.status === "Closed" || body.status === "Verified") {
      updateData.resolvedAt = new Date();
    }
  }
  if (body.environment) updateData.environment = body.environment;
  if (body.assigneeName !== undefined) updateData.assigneeName = body.assigneeName;

  const bug = await prisma.bug.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(bug);
}

// DELETE /api/qa/bugs/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/qa/bugs/[id]">
) {
  const { id } = await ctx.params;
  await prisma.bug.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
