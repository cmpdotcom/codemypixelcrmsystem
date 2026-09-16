import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/teams - list all teams with leader and member list
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (department && department !== "All Departments") {
    where.department = department;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
    ];
  }

  const teams = await prisma.team.findMany({
    where,
    include: {
      leader: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      members: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
          role: { select: { name: true } },
        },
      },
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    teams.map((t) => ({
      id: t.id,
      name: t.name,
      department: t.department,
      color: t.color,
      leader: t.leader
        ? `${t.leader.firstName} ${t.leader.lastName}`
        : "Unassigned",
      leaderId: t.leaderId,
      leaderData: t.leader,
      memberCount: t._count.members,
      members: t.members.map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        role: m.role?.name || "Member",
      })),
    }))
  );
}

// POST /api/teams - create a new team
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  }

  const existing = await prisma.team.findUnique({
    where: { name: body.name.trim() },
  });

  if (existing) {
    return NextResponse.json({ error: "Team name already exists" }, { status: 400 });
  }

  const team = await prisma.team.create({
    data: {
      name: body.name.trim(),
      department: body.department?.trim() || "Sales",
      color: body.color || "blue",
      leaderId: body.leaderId || null,
    },
  });

  // If memberIds are provided, assign them
  if (Array.isArray(body.memberIds) && body.memberIds.length > 0) {
    await prisma.user.updateMany({
      where: { id: { in: body.memberIds } },
      data: { teamId: team.id },
    });
  }

  return NextResponse.json(team, { status: 201 });
}
