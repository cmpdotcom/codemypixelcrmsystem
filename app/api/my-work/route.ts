import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assignedToUser, getActor } from "@/lib/workflow";

const sameName = (name: string) => ({ equals: name, mode: "insensitive" as const });

// GET /api/my-work - everything currently waiting on the signed-in user, whatever their role
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const name = actor.name;
  const closedLeadStatuses = ["Converted", "Lost", "Not Interested"];

  const [leadsToWork, leadsHandedOff, deals, projectAssignments, tasks, bugs] = await Promise.all([
    prisma.lead.findMany({
      where: {
        OR: [{ setterId: actor.id }, { setterId: null, setter: sameName(name) }],
        interestedAt: null,
        status: { notIn: closedLeadStatuses },
      },
      orderBy: [{ nextFollowUp: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
      take: 50,
      select: { id: true, leadNumber: true, name: true, company: true, phone: true, status: true, nextFollowUp: true },
    }),
    prisma.lead.count({
      where: { OR: [{ setterId: actor.id }, { setterId: null, setter: sameName(name) }], interestedAt: { not: null } },
    }),
    prisma.deal.findMany({
      where: {
        OR: [{ closerId: actor.id }, { closerId: null, closer: sameName(name) }],
        stage: { notIn: ["won", "lost"] },
      },
      orderBy: [{ expectedCloseDate: { sort: "asc", nulls: "last" } }, { updatedAt: "desc" }],
      take: 50,
      select: {
        id: true, dealNumber: true, title: true, company: true, contact: true, stage: true, value: true, expectedCloseDate: true,
        lead: { select: { id: true, phone: true, email: true, interestedNote: true, setter: true } },
      },
    }),
    prisma.projectAssignment.findMany({
      where: { ...assignedToUser(actor.id), project: { status: { not: "Completed" } } },
      orderBy: { createdAt: "desc" },
      select: {
        role: true,
        isLead: true,
        team: { select: { name: true } },
        project: {
          select: { id: true, projNumber: true, name: true, clientName: true, status: true, health: true, progress: true, deadline: true },
        },
      },
    }),
    prisma.task.findMany({
      where: { assignee: sameName(name), status: { not: "Done" } },
      orderBy: { dueDate: "asc" },
      take: 50,
      select: { id: true, taskNumber: true, name: true, projectName: true, status: true, priority: true, dueDate: true },
    }),
    prisma.bug.findMany({
      where: { assigneeName: sameName(name), status: { notIn: ["Closed", "Verified"] } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, bugNumber: true, title: true, projectName: true, status: true, severity: true },
    }),
  ]);

  // One row per project, listing every role the user holds on it.
  const projects = new Map<string, (typeof projectAssignments)[number]["project"] & { roles: string[] }>();
  for (const assignment of projectAssignments) {
    const label = `${assignment.role}${assignment.isLead ? " lead" : ""}${assignment.team ? ` · ${assignment.team.name}` : ""}`;
    const entry = projects.get(assignment.project.id) || { ...assignment.project, roles: [] };
    if (!entry.roles.includes(label)) entry.roles.push(label);
    projects.set(assignment.project.id, entry);
  }

  return NextResponse.json({
    roleName: actor.roleName,
    isManager: actor.isManager,
    leadsToWork,
    leadsHandedOff,
    deals,
    projects: [...projects.values()],
    tasks,
    bugs,
  });
}
