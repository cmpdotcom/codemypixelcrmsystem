import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/users - list all users with role and team relations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const roleName = searchParams.get("role");
  const teamName = searchParams.get("team");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  if (roleName && roleName !== "All Roles") {
    where.role = { name: roleName };
  }
  if (teamName && teamName !== "All Teams") {
    where.team = { name: teamName };
  }
  if (status && status !== "All Statuses") {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      role: { select: { id: true, name: true, color: true } },
      team: { select: { id: true, name: true, department: true, color: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      name: `${u.firstName} ${u.lastName}`.trim(),
      email: u.email,
      image: u.image,
      roleId: u.roleId,
      role: u.role?.name || "Unassigned",
      roleColor: (u.role?.color as "blue" | "green" | "amber" | "purple" | "rose" | "slate") || "slate",
      teamId: u.teamId,
      team: u.team?.name || "Unassigned",
      status: u.status as "Active" | "Inactive",
      lastActive: u.lastActive ? new Date(u.lastActive).toISOString() : null,
      createdAt: u.createdAt.toISOString(),
    }))
  );
}

// POST /api/users - create / invite a new user
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.email || !body.firstName) {
    return NextResponse.json(
      { error: "First name and email are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: body.email.trim().toLowerCase() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User with this email already exists" },
      { status: 400 }
    );
  }

  const password = body.password ? body.password : "tempPassword123!";
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      firstName: body.firstName.trim(),
      lastName: (body.lastName || "").trim(),
      email: body.email.trim().toLowerCase(),
      password: hashedPassword,
      roleId: body.roleId || null,
      teamId: body.teamId || null,
      status: body.status || "Active",
      emailVerified: new Date(),
    },
    include: {
      role: true,
      team: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
