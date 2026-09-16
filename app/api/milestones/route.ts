import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/milestones - list milestones, filter by project/status/search + KPIs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const project = searchParams.get("project");

  const now = new Date();

  const where: Record<string, unknown> = {};

  if (status && status !== "All Statuses" && status !== "all") {
    where.status = status;
  }
  if (project && project !== "All Projects") {
    where.projectName = project;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { projectName: { contains: search, mode: "insensitive" } },
      { owner: { contains: search, mode: "insensitive" } },
    ];
  }

  const [milestones, totalCount, allMilestones] = await Promise.all([
    prisma.milestone.findMany({
      where,
      orderBy: { deadline: "asc" },
      include: {
        project: { select: { id: true, name: true, clientName: true } },
      },
    }),
    prisma.milestone.count({ where }),
    prisma.milestone.findMany({
      select: { status: true, deadline: true },
    }),
  ]);

  // Aggregate KPI metrics across all milestones
  const totalMilestones = allMilestones.length;
  const completed = allMilestones.filter((m) => m.status === "Completed").length;
  const inProgress = allMilestones.filter((m) => m.status === "In Progress").length;
  const overdue = allMilestones.filter(
    (m) => m.status !== "Completed" && new Date(m.deadline) < now
  ).length;

  return NextResponse.json({
    milestones,
    totalCount,
    kpi: {
      totalMilestones,
      completed,
      inProgress,
      overdue,
    },
  });
}

// POST /api/milestones - create new milestone
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.projectName) {
    return NextResponse.json(
      { error: "Milestone name and project name are required" },
      { status: 400 }
    );
  }

  const deadline = body.deadline ? new Date(body.deadline) : new Date(Date.now() + 30 * 86400000);
  const owner = body.owner || "Aarav Sharma";
  const initials = owner
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const milestone = await prisma.milestone.create({
    data: {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      projectName: body.projectName.trim(),
      status: body.status || "Not Started",
      progress: parseInt(body.progress) || 0,
      deadline,
      taskCount: parseInt(body.taskCount) || 0,
      taskTotal: parseInt(body.taskTotal) || 10,
      owner,
      ownerInitials: initials,
      projectId: body.projectId || null,
    },
  });

  return NextResponse.json(milestone, { status: 201 });
}
