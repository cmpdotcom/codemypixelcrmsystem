import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/users/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/users/[id]">
) {
  const { id } = await ctx.params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
      team: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { password: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

// PATCH /api/users/[id] - update user info, role, team, status, or password
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/users/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  if (body.email) {
    const duplicate = await prisma.user.findFirst({
      where: {
        email: body.email.trim().toLowerCase(),
        NOT: { id },
      },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Another user has this email" }, { status: 400 });
    }
  }

  const updateData: Record<string, unknown> = {};
  if (body.firstName) updateData.firstName = body.firstName.trim();
  if (body.lastName !== undefined) updateData.lastName = body.lastName.trim();
  if (body.email) updateData.email = body.email.trim().toLowerCase();
  if (body.roleId !== undefined) updateData.roleId = body.roleId || null;
  if (body.teamId !== undefined) updateData.teamId = body.teamId || null;
  if (body.status) updateData.status = body.status;
  if (body.image !== undefined) updateData.image = body.image;
  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    include: {
      role: true,
      team: true,
    },
  });

  const { password: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

// DELETE /api/users/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/users/[id]">
) {
  const { id } = await ctx.params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
