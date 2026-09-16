import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects - list projects, filters (status, health, search), and KPI metrics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const health = searchParams.get("health");

  const now = new Date();

  const where: Record<string, unknown> = {};

  if (status && status !== "All Statuses" && status !== "all") {
    where.status = status;
  }
  if (health && health !== "All Health") {
    where.health = health;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { clientName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [projects, totalCount, allProjects] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, company: true } },
      },
    }),
    prisma.project.count({ where }),
    prisma.project.findMany({
      select: { status: true, health: true, deadline: true, progress: true },
    }),
  ]);

  // Aggregate KPI stats
  const totalProjects = allProjects.length;
  const activeProjects = allProjects.filter((p) => p.status !== "Completed" && p.status !== "On Hold").length;
  const onTrack = allProjects.filter((p) => p.health === "on-track" && p.status !== "Completed").length;
  const atRisk = allProjects.filter((p) => p.health === "at-risk" || p.health === "critical").length;
  const completed = allProjects.filter((p) => p.status === "Completed").length;
  const overdue = allProjects.filter(
    (p) => p.status !== "Completed" && new Date(p.deadline) < now
  ).length;

  return NextResponse.json({
    projects,
    totalCount,
    kpi: {
      totalProjects,
      activeProjects,
      onTrack,
      atRisk,
      completed,
      overdue,
    },
  });
}

// POST /api/projects - create new project
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.clientName) {
    return NextResponse.json(
      { error: "Project name and client name are required" },
      { status: 400 }
    );
  }

  const startDate = body.startDate ? new Date(body.startDate) : new Date();
  const deadline = body.deadline ? new Date(body.deadline) : new Date(Date.now() + 30 * 86400000);

  const project = await prisma.project.create({
    data: {
      name: body.name.trim(),
      clientName: body.clientName.trim(),
      description: body.description?.trim() || null,
      status: body.status || "Planning",
      health: body.health || "on-track",
      progress: parseInt(body.progress) || 0,
      budget: parseFloat(body.budget) || 0,
      spent: parseFloat(body.spent) || 0,
      startDate,
      deadline,
      teamMembers: Array.isArray(body.teamMembers) ? body.teamMembers : ["AK", "SA"],
      clientId: body.clientId || null,
      notes: body.notes?.trim() || null,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
