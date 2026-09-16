import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/roles/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/roles/[id]">
) {
  const { id } = await ctx.params;
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  return NextResponse.json(role);
}

// PATCH /api/roles/[id] - update role name, description, color, or permissions
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/roles/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  if (body.name) {
    const duplicate = await prisma.role.findFirst({
      where: {
        name: body.name.trim(),
        NOT: { id },
      },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Another role with this name exists" }, { status: 400 });
    }
  }

  const role = await prisma.role.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name.trim() }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.color && { color: body.color }),
      ...(body.permissions !== undefined && { permissions: body.permissions }),
    },
  });

  return NextResponse.json(role);
}

// DELETE /api/roles/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/roles/[id]">
) {
  const { id } = await ctx.params;

  // Check if role has active users
  const userCount = await prisma.user.count({ where: { roleId: id } });
  if (userCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete role with ${userCount} assigned users. Reassign users first.` },
      { status: 400 }
    );
  }

  await prisma.role.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
