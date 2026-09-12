import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/activities/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/activities/[id]">,
) {
  const { id } = await ctx.params;
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(activity);
}

// PATCH /api/activities/[id]
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/activities/[id]">,
) {
  const { id } = await ctx.params;
  const body = await request.json();
  const activity = await prisma.activity.update({
    where: { id },
    data: {
      ...(body.type && { type: body.type }),
      ...(body.direction !== undefined && { direction: body.direction }),
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.contact !== undefined && { contact: body.contact }),
      ...(body.performedBy !== undefined && { performedBy: body.performedBy }),
      ...(body.status && { status: body.status }),
      ...(body.scheduledAt && { scheduledAt: new Date(body.scheduledAt) }),
    },
  });
  return NextResponse.json(activity);
}

// DELETE /api/activities/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/activities/[id]">,
) {
  const { id } = await ctx.params;
  await prisma.activity.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
