import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/teams/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/teams/[id]">
) {
  const { id } = await ctx.params;
  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      leader: true,
      members: {
        include: { role: true },
      },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(team);
}

// PATCH /api/teams/[id] - update name, department, color, leader, or members
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/teams/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  if (body.name) {
    const duplicate = await prisma.team.findFirst({
      where: {
        name: body.name.trim(),
        NOT: { id },
      },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Another team with this name exists" }, { status: 400 });
    }
  }

  const team = await prisma.team.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name.trim() }),
      ...(body.department && { department: body.department.trim() }),
      ...(body.color && { color: body.color }),
      ...(body.leaderId !== undefined && { leaderId: body.leaderId || null }),
    },
  });

  // Optional: reassign memberIds
  if (Array.isArray(body.memberIds)) {
    // Unassign old members not in the list
    await prisma.user.updateMany({
      where: { teamId: id, id: { notIn: body.memberIds } },
      data: { teamId: null },
    });
    // Assign new members
    if (body.memberIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: body.memberIds } },
        data: { teamId: id },
      });
    }
  }

  return NextResponse.json(team);
}

// DELETE /api/teams/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/teams/[id]">
) {
  const { id } = await ctx.params;

  // Unlink members from team first
  await prisma.user.updateMany({
    where: { teamId: id },
    data: { teamId: null },
  });

  await prisma.team.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
