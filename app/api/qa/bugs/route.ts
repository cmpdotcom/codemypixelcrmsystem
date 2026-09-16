import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/qa/bugs - filter, search, and aggregate metrics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");
  const project = searchParams.get("project");

  const where: Record<string, unknown> = {};

  if (severity && severity !== "All Severities") {
    where.severity = severity;
  }
  if (status && status !== "All Statuses") {
    where.status = status;
  }
  if (project && project !== "All Projects") {
    where.projectName = project;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { projectName: { contains: search, mode: "insensitive" } },
      { module: { contains: search, mode: "insensitive" } },
      { assigneeName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [bugs, totalFiltered, allBugs] = await Promise.all([
    prisma.bug.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { id: true, name: true, clientName: true } },
      },
    }),
    prisma.bug.count({ where }),
    prisma.bug.findMany({
      select: { severity: true, status: true, createdAt: true },
    }),
  ]);

  // Aggregate KPI metrics across all bugs in database
  const totalBugs = allBugs.length;
  const openBugs = allBugs.filter((b) => b.status !== "Closed" && b.status !== "Verified").length;
  const critical = allBugs.filter((b) => b.severity === "Critical" && b.status !== "Closed").length;
  const resolved = allBugs.filter((b) => b.status === "Closed" || b.status === "Verified" || b.status === "Fixed").length;

  const criticalCount = allBugs.filter((b) => b.severity === "Critical").length;
  const highCount = allBugs.filter((b) => b.severity === "High").length;
  const mediumCount = allBugs.filter((b) => b.severity === "Medium").length;
  const lowCount = allBugs.filter((b) => b.severity === "Low").length;

  return NextResponse.json({
    bugs,
    totalCount: totalFiltered,
    kpi: {
      totalBugs,
      openBugs,
      critical,
      resolved,
      testCases: 1284,
      passRate: "91.4%",
      uatPending: 3,
    },
    severityDistribution: [
      { label: "Critical", count: criticalCount, barColor: "bg-red-500" },
      { label: "High", count: highCount, barColor: "bg-orange-500" },
      { label: "Medium", count: mediumCount, barColor: "bg-amber-500" },
      { label: "Low", count: lowCount, barColor: "bg-slate-400" },
    ],
  });
}

// POST /api/qa/bugs - report new bug
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.projectName) {
    return NextResponse.json(
      { error: "Bug title and project name are required" },
      { status: 400 }
    );
  }

  const bug = await prisma.bug.create({
    data: {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      projectName: body.projectName.trim(),
      module: body.module?.trim() || "General",
      severity: body.severity || "Medium",
      priority: body.priority || "Medium",
      status: body.status || "New",
      environment: body.environment || "Production",
      reportedBy: body.reportedBy?.trim() || "QA Team",
      assigneeName: body.assigneeName?.trim() || "Unassigned",
      assigneeRole: body.assigneeRole || "Developer",
      stepsToReproduce: body.stepsToReproduce || null,
      expectedResult: body.expectedResult || null,
      actualResult: body.actualResult || null,
      projectId: body.projectId || null,
    },
  });

  return NextResponse.json(bug, { status: 201 });
}
