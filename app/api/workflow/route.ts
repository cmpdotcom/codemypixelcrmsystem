import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fullName, getActor, getPickerOptions } from "@/lib/workflow";

// GET /api/workflow - the executive hand-off board: every place work is waiting on a decision
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [awaitingCloser, withClosers, awaitingDelivery, activeProjects, pickers] = await Promise.all([
    prisma.lead.findMany({
      where: { interestedAt: { not: null }, closerId: null },
      orderBy: { interestedAt: "asc" },
      take: 200,
      select: {
        id: true, leadNumber: true, name: true, company: true, email: true, phone: true, service: true,
        budget: true, timeline: true, setter: true, interestedAt: true, interestedNote: true, nextFollowUp: true,
      },
    }),
    prisma.deal.findMany({
      where: { stage: { notIn: ["won", "lost"] }, OR: [{ leadId: { not: null } }, { closerId: { not: null } }] },
      orderBy: { updatedAt: "desc" },
      take: 200,
      select: {
        id: true, dealNumber: true, title: true, company: true, contact: true, closer: true, closerId: true,
        stage: true, value: true, expectedCloseDate: true, updatedAt: true,
      },
    }),
    prisma.deal.findMany({
      where: { stage: "won", projects: { none: {} } },
      orderBy: { closedAt: "asc" },
      take: 200,
      select: {
        id: true, dealNumber: true, title: true, company: true, contact: true, closer: true, service: true,
        value: true, closedAt: true, clientId: true, expectedCloseDate: true,
      },
    }),
    prisma.project.findMany({
      where: { status: { notIn: ["Completed"] } },
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
