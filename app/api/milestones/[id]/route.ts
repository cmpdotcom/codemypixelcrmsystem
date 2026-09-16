import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/milestones/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/milestones/[id]">
) {
  const { id } = await ctx.params;
  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!milestone) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
  }

  return NextResponse.json(milestone);
}

// PATCH /api/milestones/[id]
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/milestones/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.name) updateData.name = body.name.trim();
  if (body.description !== undefined) updateData.description = body.description;
  if (body.projectName) updateData.projectName = body.projectName.trim();
  if (body.status) {
    updateData.status = body.status;
    if (body.status === "Completed") {
      updateData.progress = 100;
    }
  }
  if (body.progress !== undefined) updateData.progress = parseInt(body.progress);
  if (body.deadline) updateData.deadline = new Date(body.deadline);
  if (body.owner) {
    updateData.owner = body.owner.trim();
    updateData.ownerInitials = body.owner
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  if (body.taskCount !== undefined) updateData.taskCount = parseInt(body.taskCount);
  if (body.taskTotal !== undefined) updateData.taskTotal = parseInt(body.taskTotal);

  const milestone = await prisma.milestone.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(milestone);
}

// DELETE /api/milestones/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/milestones/[id]">
) {
  const { id } = await ctx.params;
  await prisma.milestone.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
