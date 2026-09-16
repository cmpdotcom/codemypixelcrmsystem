import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tasks/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/tasks/[id]">
) {
  const { id } = await ctx.params;
  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

// PATCH /api/tasks/[id] - update status, progress, priority, assignee, hours
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/tasks/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.status) {
    updateData.status = body.status;
    updateData.blocked = body.status === "Blocked";
    if (body.status === "Done") {
      updateData.progress = 100;
    }
  }

  if (body.name) updateData.name = body.name.trim();
  if (body.description !== undefined) updateData.description = body.description;
  if (body.projectName) updateData.projectName = body.projectName.trim();
  if (body.module !== undefined) updateData.module = body.module;
  if (body.assignee !== undefined) updateData.assignee = body.assignee;
  if (body.priority) updateData.priority = body.priority;
  if (body.progress !== undefined) updateData.progress = parseInt(body.progress);
  if (body.estimatedHours !== undefined) updateData.estimatedHours = parseFloat(body.estimatedHours);
  if (body.loggedHours !== undefined) updateData.loggedHours = parseFloat(body.loggedHours);
  if (body.dueDate) updateData.dueDate = new Date(body.dueDate);
  if (Array.isArray(body.tags)) updateData.tags = body.tags;

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(task);
}

// DELETE /api/tasks/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/tasks/[id]">
) {
  const { id } = await ctx.params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
