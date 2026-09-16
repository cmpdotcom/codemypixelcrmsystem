import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/follow-ups/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/follow-ups/[id]">
) {
  const { id } = await ctx.params;
  const followUp = await prisma.followUp.findUnique({
    where: { id },
  });

  if (!followUp) {
    return NextResponse.json({ error: "Follow-up not found" }, { status: 404 });
  }

  return NextResponse.json(followUp);
}

// PATCH /api/follow-ups/[id] - toggle completed, change dates, assignee, status
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/follow-ups/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.completed !== undefined) {
    updateData.completed = body.completed;
    updateData.status = body.completed ? "Completed" : "Upcoming";
    updateData.completedAt = body.completed ? new Date() : null;
  }

  if (body.status) updateData.status = body.status;
  if (body.subjectTitle) updateData.subjectTitle = body.subjectTitle.trim();
  if (body.subjectDesc !== undefined) updateData.subjectDesc = body.subjectDesc;
  if (body.company) updateData.company = body.company.trim();
  if (body.contact !== undefined) updateData.contact = body.contact;
  if (body.relatedRef !== undefined) updateData.relatedRef = body.relatedRef;
  if (body.type) updateData.type = body.type;
  if (body.assigneeName !== undefined) updateData.assigneeName = body.assigneeName;
  if (body.priority) updateData.priority = body.priority;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.dueTime) updateData.dueTime = body.dueTime;
  if (body.dueDate) updateData.dueDate = new Date(body.dueDate);

  const followUp = await prisma.followUp.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(followUp);
}

// DELETE /api/follow-ups/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/follow-ups/[id]">
) {
  const { id } = await ctx.params;
  await prisma.followUp.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
