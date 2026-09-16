import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/deployments - filter by environment, status, search, and calculate live KPIs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const environment = searchParams.get("environment");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  if (environment && environment !== "All Environments" && environment !== "All") {
    where.environment = environment;
  }
  if (status && status !== "All Statuses") {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { projectName: { contains: search, mode: "insensitive" } },
      { version: { contains: search, mode: "insensitive" } },
      { commitMsg: { contains: search, mode: "insensitive" } },
      { deployedBy: { contains: search, mode: "insensitive" } },
    ];
  }

  const [deployments, totalFiltered, allDeployments] = await Promise.all([
    prisma.deployment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { id: true, name: true, clientName: true } },
      },
    }),
    prisma.deployment.count({ where }),
    prisma.deployment.findMany({
      select: { environment: true, status: true },
    }),
  ]);

  // Aggregate live KPI metrics
  const totalDeployments = allDeployments.length;
  const successful = allDeployments.filter((d) => d.status === "Successful").length;
  const inProgress = allDeployments.filter((d) => d.status === "In Progress").length;
  const failed = allDeployments.filter((d) => d.status === "Failed").length;
  const rolledBack = allDeployments.filter((d) => d.status === "Rolled Back").length;

  const successRate = totalDeployments > 0 ? ((successful / totalDeployments) * 100).toFixed(1) : "0.0";

  return NextResponse.json({
    deployments,
    totalCount: totalFiltered,
    kpi: {
      totalDeployments,
      successful,
      inProgress,
      failed,
      rolledBack,
      successRate: `${successRate}%`,
    },
    envCounts: {
      All: totalDeployments,
      Production: allDeployments.filter((d) => d.environment === "Production").length,
      Staging: allDeployments.filter((d) => d.environment === "Staging").length,
      QA: allDeployments.filter((d) => d.environment === "QA").length,
    },
  });
}

// POST /api/deployments - trigger/record new deployment
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.projectName || !body.version) {
    return NextResponse.json(
      { error: "Project name and version are required" },
      { status: 400 }
    );
  }

  const commitHash = body.commitHash || Math.random().toString(16).substring(2, 9);

  const deployment = await prisma.deployment.create({
    data: {
      projectName: body.projectName.trim(),
      environment: body.environment || "Production",
      version: body.version.trim(),
      commitHash,
      commitMsg: body.commitMsg?.trim() || `Deployment release ${body.version}`,
      branch: body.branch || "main",
      status: body.status || "Successful",
      deployedBy: body.deployedBy?.trim() || "Ali Khan",
      duration: body.duration || "2m 15s",
      url: body.url?.trim() || null,
      releaseNotes: body.releaseNotes?.trim() || null,
      projectId: body.projectId || null,
    },
  });

  return NextResponse.json(deployment, { status: 201 });
}
