import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/leads/[id]/activities
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/activities">,
) {
  const { id } = await ctx.params;
  const activities = await prisma.leadActivity.findMany({
    where: { leadId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(activities);
}

// POST /api/leads/[id]/activities
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/activities">,
) {
  const { id } = await ctx.params;
  const body = await request.json();

  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const activity = await prisma.leadActivity.create({
    data: {
      leadId: id,
      type: body.type || "Note",
      title: body.title,
      description: body.description || null,
      performedBy: body.performedBy || null,
    },
  });

  // Update lastContact on the lead
  await prisma.lead.update({
    where: { id },
    data: { lastContact: new Date() },
  });

  return NextResponse.json(activity, { status: 201 });
}

// DELETE /api/leads/[id]/activities/[activityId]
export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/activities">,
) {
  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const activityId = searchParams.get("activityId");

  if (!activityId) {
    return NextResponse.json({ error: "activityId is required" }, { status: 400 });
  }

  await prisma.leadActivity.delete({
    where: { id: activityId, leadId: id },
  });

  return NextResponse.json({ success: true });
}
