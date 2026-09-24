import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { defaultPermissionsForRole } from "@/lib/permissions";
import { ensureInvitableRoles } from "@/lib/invitations";

// GET /api/roles - list all roles with user count
export async function GET() {
  await ensureInvitableRoles();
  const roles = await prisma.role.findMany({
    include: {
      _count: {
        select: { users: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    roles.map((r) => ({
      ...r,
      userCount: r._count.users,
    }))
  );
}

// POST /api/roles - create a new role
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Role name is required" }, { status: 400 });
  }

  const existing = await prisma.role.findUnique({
    where: { name: body.name.trim() },
  });

  if (existing) {
    return NextResponse.json({ error: "Role name already exists" }, { status: 400 });
  }

  const role = await prisma.role.create({
    data: {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      color: body.color || "blue",
      permissions: body.permissions || defaultPermissionsForRole(body.name.trim()),
    },
  });

  return NextResponse.json(role, { status: 201 });
}
