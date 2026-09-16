import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tasks - filter by search, status, project, assignee, priority + real-time KPIs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const assignee = searchParams.get("assignee");
  const project = searchParams.get("project");

  const now = new Date();

  const where: Record<string, unknown> = {};

  if (status && status !== "All Statuses" && status !== "all") {
    where.status = status;
  }
  if (priority && priority !== "All Priorities") {
    where.priority = priority;
  }
  if (assignee && assignee !== "All Assignees") {
    where.assignee = assignee;
  }
  if (project && project !== "All Projects") {
    where.projectName = project;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { projectName: { contains: search, mode: "insensitive" } },
      { module: { contains: search, mode: "insensitive" } },
      { assignee: { contains: search, mode: "insensitive" } },
    ];
  }

  const [tasks, totalFiltered, allTasks] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { dueDate: "asc" },
      include: {
        project: { select: { id: true, name: true, clientName: true } },
      },
    }),
    prisma.task.count({ where }),
    prisma.task.findMany({
      select: { status: true, dueDate: true, priority: true, estimatedHours: true, loggedHours: true },
    }),
  ]);

  // Aggregate KPI metrics across all tasks
  const totalTasks = allTasks.length;
  const inProgress = allTasks.filter((t) => t.status === "In Progress").length;
  const done = allTasks.filter((t) => t.status === "Done").length;
  const blocked = allTasks.filter((t) => t.status === "Blocked").length;
  const overdue = allTasks.filter(
    (t) => t.status !== "Done" && new Date(t.dueDate) < now
  ).length;

  const totalEstimatedHours = allTasks.reduce((s, t) => s + t.estimatedHours, 0);
  const totalLoggedHours = allTasks.reduce((s, t) => s + t.loggedHours, 0);

  return NextResponse.json({
    tasks,
    totalCount: totalFiltered,
    kpi: {
      totalTasks,
      inProgress,
      done,
      blocked,
      overdue,
      totalEstimatedHours,
      totalLoggedHours,
    },
  });
}

// POST /api/tasks - create new task
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.projectName) {
    return NextResponse.json(
      { error: "Task name and project name are required" },
      { status: 400 }
    );
  }

  const dueDate = body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 7 * 86400000);

  const task = await prisma.task.create({
    data: {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      projectName: body.projectName.trim(),
      module: body.module?.trim() || "General",
      assignee: body.assignee?.trim() || "Unassigned",
      priority: body.priority || "Medium",
      status: body.status || "Todo",
      progress: parseInt(body.progress) || 0,
      dueDate,
      estimatedHours: parseFloat(body.estimatedHours) || 8,
      loggedHours: parseFloat(body.loggedHours) || 0,
      tags: Array.isArray(body.tags) ? body.tags : ["Dev"],
      blocked: body.status === "Blocked",
      projectId: body.projectId || null,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
