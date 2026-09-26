import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActor, projectScope } from "@/lib/workflow";

async function findVisibleProject(id: string) {
  const actor = await getActor();
  if (!actor) return null;
  return prisma.project.findFirst({ where: { AND: [{ id }, projectScope(actor)] }, select: { id: true } });
}

// GET /api/projects/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/projects/[id]">
) {
  const { id } = await ctx.params;
  if (!(await findVisibleProject(id))) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PATCH /api/projects/[id]
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/projects/[id]">
) {
  const { id } = await ctx.params;
  if (!(await findVisibleProject(id))) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.name) updateData.name = body.name.trim();
  if (body.clientName) updateData.clientName = body.clientName.trim();
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status) {
    updateData.status = body.status;
    if (body.status === "Completed") {
      updateData.progress = 100;
    }
  }
  if (body.health) updateData.health = body.health;
  if (body.progress !== undefined) updateData.progress = parseInt(body.progress);
  if (body.budget !== undefined) updateData.budget = parseFloat(body.budget);
  if (body.spent !== undefined) updateData.spent = parseFloat(body.spent);
  if (body.deadline) updateData.deadline = new Date(body.deadline);
  if (body.startDate) updateData.startDate = new Date(body.startDate);
  if (Array.isArray(body.teamMembers)) updateData.teamMembers = body.teamMembers;
  if (body.notes !== undefined) updateData.notes = body.notes;

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(project);
}

// DELETE /api/projects/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/projects/[id]">
) {
  const { id } = await ctx.params;
  if (!(await findVisibleProject(id))) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
