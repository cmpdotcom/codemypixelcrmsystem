import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dealScope, fullName, getActor, getPickerOptions, leadScope, projectScope } from "@/lib/workflow";

// GET /api/workflow - the hand-off board: every place work is waiting on a decision.
// Managers see everything; everyone else only sees the hand-offs that involve them
// (their own leads, their own deals, their own projects) — same scoping rules the
// Leads/Deals/Projects pages already use, applied here for consistency.
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leadWhere = leadScope(actor);
  const dealWhere = dealScope(actor);
  const projWhere = projectScope(actor);
  // Starting a project from a won deal is a manager-only decision, and a won deal
  // isn't "owned" by anyone the way a lead or open deal is — only managers see this queue.
  const canSeeAwaitingDelivery = actor.isManager;

  const [awaitingCloser, withClosers, awaitingDelivery, activeProjects, pickers] = await Promise.all([
    prisma.lead.findMany({
      where: { AND: [leadWhere, { interestedAt: { not: null }, closerId: null }] },
      orderBy: { interestedAt: "asc" },
      take: 200,
      select: {
        id: true, leadNumber: true, name: true, company: true, email: true, phone: true, service: true,
        budget: true, timeline: true, setter: true, interestedAt: true, interestedNote: true, nextFollowUp: true,
      },
    }),
    prisma.deal.findMany({
      where: { AND: [dealWhere, { stage: { notIn: ["won", "lost"] }, OR: [{ leadId: { not: null } }, { closerId: { not: null } }] }] },
      orderBy: { updatedAt: "desc" },
      take: 200,
      select: {
        id: true, dealNumber: true, title: true, company: true, contact: true, closer: true, closerId: true,
        stage: true, value: true, expectedCloseDate: true, updatedAt: true,
      },
    }),
    canSeeAwaitingDelivery
      ? prisma.deal.findMany({
          where: { stage: "won", projects: { none: {} } },
          orderBy: { closedAt: "asc" },
          take: 200,
          select: {
            id: true, dealNumber: true, title: true, company: true, contact: true, closer: true, service: true,
            value: true, closedAt: true, clientId: true, expectedCloseDate: true,
          },
        })
      : Promise.resolve([]),
    prisma.project.findMany({
      where: { AND: [projWhere, { status: { notIn: ["Completed"] } }] },
      orderBy: { deadline: "asc" },
      take: 200,
      select: {
        id: true, projNumber: true, name: true, clientName: true, status: true, health: true, progress: true, deadline: true,
        assignments: {
          orderBy: [{ isLead: "desc" }, { createdAt: "asc" }],
          select: {
            id: true, role: true, isLead: true,
            user: { select: { firstName: true, lastName: true } },
            team: { select: { name: true } },
          },
        },
      },
    }),
    getPickerOptions(),
  ]);

  return NextResponse.json({
    canManage: actor.isManager,
    awaitingCloser,
    withClosers,
    awaitingDelivery,
    activeProjects: activeProjects.map((project) => ({
      ...project,
      assignments: project.assignments.map((assignment) => ({
        id: assignment.id,
        role: assignment.role,
        isLead: assignment.isLead,
        label: assignment.user ? fullName(assignment.user) : `${assignment.team?.name || "Team"} (team)`,
      })),
    })),
    ...pickers,
  });
}
