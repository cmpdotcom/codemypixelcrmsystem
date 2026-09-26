import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AssignmentError, addProjectAssignments, getActor, parseAssignments } from "@/lib/workflow";

// POST /api/workflow/start-project - turn a won deal into a project with its developer, tester and DevOps assignments
export async function POST(request: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!actor.isManager) {
    return NextResponse.json({ error: "Only executives and managers can start projects" }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const dealId = typeof body?.dealId === "string" ? body.dealId : "";
  const deal = dealId
    ? await prisma.deal.findUnique({ where: { id: dealId }, include: { projects: { select: { id: true } }, lead: { select: { name: true } } } })
    : null;
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  if (deal.stage !== "won") return NextResponse.json({ error: "Only won deals can become projects" }, { status: 400 });
  if (deal.projects.length > 0) return NextResponse.json({ error: "A project already exists for this deal" }, { status: 409 });

  const assignments = [
    ...parseAssignments(body?.developers, "Developer"),
    ...parseAssignments(body?.testers, "Tester"),
    ...parseAssignments(body?.devops, "DevOps"),
  ];
  if (!assignments.some((assignment) => assignment.role === "Developer")) {
    return NextResponse.json({ error: "Assign at least one developer or development team" }, { status: 400 });
  }

  const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);
  const date = (value: unknown, fallback: Date) => {
    const parsed = text(value) ? new Date(String(value)) : fallback;
    return Number.isNaN(parsed.getTime()) ? fallback : parsed;
  };
  const startDate = date(body?.startDate, new Date());
  const deadline = date(body?.deadline, new Date(startDate.getTime() + 30 * 86400000));
  if (deadline < startDate) return NextResponse.json({ error: "Deadline must be after the start date" }, { status: 400 });
  const budget = body?.budget !== undefined && body.budget !== "" ? parseFloat(String(body.budget)) : deal.value;

  const project = await prisma.project.create({
    data: {
      name: text(body?.name) || deal.title,
      clientName: deal.company,
      description: text(body?.description) || `${deal.service || "Project"} for ${deal.company}, closed by ${deal.closer || "sales"}.`,
      status: "Planning",
      health: "on-track",
      budget: Number.isFinite(budget) ? budget : 0,
      startDate,
      deadline,
      teamMembers: [],
      clientId: deal.clientId,
      dealId: deal.id,
      leadId: deal.leadId,
      notes: text(body?.notes),
    },
  });

  try {
    await addProjectAssignments(project.id, assignments, actor);
  } catch (error) {
    await prisma.project.delete({ where: { id: project.id } });
    if (error instanceof AssignmentError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }

  if (deal.clientId) {
    await prisma.client.update({ where: { id: deal.clientId }, data: { projectsCount: { increment: 1 }, lastActivity: new Date() } });
  }

  return NextResponse.json(project, { status: 201 });
}
