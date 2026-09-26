import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canPerform, normalizePermissions } from "@/lib/permissions";

export const DELIVERY_ROLES = ["Developer", "Tester", "DevOps"] as const;
export type DeliveryRole = (typeof DELIVERY_ROLES)[number];

// Which user roles are offered when picking someone for each hand-off step.
export const PICKER_ROLES = {
  Setter: ["Setter"],
  Closer: ["Closer", "Sales Manager"],
  Developer: ["Developer"],
  Tester: ["Tester", "QA"],
  DevOps: ["DevOps"],
} as const;

const DELIVERY_ROLE_NAMES = new Set(["Developer", "Tester", "QA", "DevOps"]);

export interface Actor {
  id: string;
  name: string;
  roleName: string;
  isManager: boolean;
}

export function isWorkflowManager(roleName: string | null | undefined, permissions: unknown) {
  return roleName === "Super Admin" || canPerform(permissions, "Workflow", "assign");
}

export async function getActor(): Promise<Actor | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const roleName = session.user.roleName || "";
  return {
    id: session.user.id,
    name: session.user.name || "",
    roleName,
    isManager: isWorkflowManager(roleName, session.user.permissions),
  };
}

export function fullName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`.trim();
}

const sameName = (name: string) => ({ equals: name, mode: "insensitive" as const });

// Setters only see leads assigned to them, closers only leads handed to them.
// Leads assigned before user links existed are matched by the stored name.
export function leadScope(actor: Actor): Prisma.LeadWhereInput {
  if (actor.isManager) return {};
  if (actor.roleName === "Setter") {
    return { OR: [{ setterId: actor.id }, { setterId: null, setter: sameName(actor.name) }] };
  }
  if (actor.roleName === "Closer") return { closerId: actor.id };
  return {};
}

export function dealScope(actor: Actor): Prisma.DealWhereInput {
  if (actor.isManager || actor.roleName !== "Closer") return {};
  return { OR: [{ closerId: actor.id }, { closerId: null, closer: sameName(actor.name) }] };
}

export function assignedToUser(userId: string): Prisma.ProjectAssignmentWhereInput {
  return {
    OR: [
      { userId },
      { team: { OR: [{ leaderId: userId }, { members: { some: { id: userId } } }] } },
    ],
  };
}

// Developers, testers and DevOps only see projects they (or their team) are assigned to.
export function projectScope(actor: Actor): Prisma.ProjectWhereInput {
  if (actor.isManager || !DELIVERY_ROLE_NAMES.has(actor.roleName)) return {};
  return { assignments: { some: assignedToUser(actor.id) } };
}

export function canAccessLead(
  actor: Actor,
  lead: { setterId: string | null; setter: string | null; closerId: string | null },
) {
  if (actor.isManager) return true;
  if (actor.roleName === "Setter") {
    return lead.setterId === actor.id
      || (!lead.setterId && !!lead.setter && lead.setter.toLowerCase() === actor.name.toLowerCase());
  }
  if (actor.roleName === "Closer") return lead.closerId === actor.id;
  return true;
}

export function canAccessDeal(actor: Actor, deal: { closerId: string | null; closer: string | null }) {
  if (actor.isManager || actor.roleName !== "Closer") return true;
  return deal.closerId === actor.id
    || (!deal.closerId && !!deal.closer && deal.closer.toLowerCase() === actor.name.toLowerCase());
}

export async function findActiveUser(id: string) {
  return prisma.user.findFirst({
    where: { id, status: "Active" },
    select: { id: true, firstName: true, lastName: true, image: true, role: { select: { name: true } } },
  });
}

// Maps a free-text name (legacy fields, CSV imports) to a user when exactly one matches.
export async function resolveUserIdByName(name: string | null | undefined) {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  const users = await prisma.user.findMany({ select: { id: true, firstName: true, lastName: true } });
  const matches = users.filter((user) => fullName(user).toLowerCase() === trimmed.toLowerCase());
  return matches.length === 1 ? matches[0].id : null;
}

export async function getManagerIds() {
  const users = await prisma.user.findMany({
    where: { status: "Active", roleId: { not: null } },
    select: { id: true, role: { select: { name: true, permissions: true } } },
  });
  return users
    .filter((user) => isWorkflowManager(user.role?.name, normalizePermissions(user.role?.permissions, user.role?.name)))
    .map((user) => user.id);
}

export async function teamUserIds(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { leaderId: true, members: { select: { id: true } } },
  });
  if (!team) return [];
  return [...new Set([...(team.leaderId ? [team.leaderId] : []), ...team.members.map((member) => member.id)])];
}

interface NotificationInput {
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
}

// Notifications are a side effect: a failure here must never undo the hand-off itself.
export async function notify(userIds: (string | null | undefined)[], input: NotificationInput, exceptUserId?: string) {
  const recipients = [...new Set(userIds.filter((id): id is string => !!id && id !== exceptUserId))];
  if (recipients.length === 0) return;
  try {
    await prisma.notification.createMany({
      data: recipients.map((userId) => ({
        userId,
        type: input.type,
        title: input.title.slice(0, 200),
        body: input.body?.slice(0, 500) || null,
        link: input.link || null,
      })),
    });
  } catch (error) {
    console.error("Failed to create notifications", error);
  }
}

export function parseBudget(value: string | null | undefined) {
  if (!value) return 0;
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*([kKmM])?/);
  if (!match) return 0;
  const amount = parseFloat(match[1]);
  const unit = match[2]?.toLowerCase();
  return unit === "k" ? amount * 1_000 : unit === "m" ? amount * 1_000_000 : amount;
}

// When a closer wins a deal the customer becomes a client and the lead is converted.
export async function handleDealWon(dealId: string, actor: Actor) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, include: { lead: true } });
  if (!deal) return;

  let clientId = deal.clientId;
  if (!clientId) {
    const email = deal.lead?.email || "";
    const existing = await prisma.client.findFirst({
      where: {
        OR: [
          { company: sameName(deal.company) },
          ...(email ? [{ email: sameName(email) }] : []),
        ],
      },
      select: { id: true },
    });
    const client = existing
      ? await prisma.client.update({
          where: { id: existing.id },
          data: { revenue: { increment: deal.value }, lastActivity: new Date(), status: "Active" },
        })
      : await prisma.client.create({
          data: {
            company: deal.company,
            email,
            phone: deal.lead?.phone || null,
            location: deal.lead?.location || null,
            industry: deal.lead?.industry || "Technology",
            companySize: deal.lead?.companySize || null,
            contactName: deal.contact || deal.lead?.name || null,
            contactEmail: email || null,
            contactPhone: deal.lead?.phone || null,
            revenue: deal.value,
            status: "Active",
            notes: `Won by ${deal.closer || actor.name} from deal DL-${deal.dealNumber}`,
          },
        });
    clientId = client.id;
    await prisma.deal.update({ where: { id: deal.id }, data: { clientId } });
  }

  if (deal.leadId) {
    await prisma.lead.update({ where: { id: deal.leadId }, data: { status: "Converted" } });
  }

  await prisma.activity.create({
    data: {
      type: "Note",
      direction: "Internal",
      title: `Deal won: ${deal.title}`,
      description: "Client agreed to work with us. Waiting for a delivery team to be assigned.",
      company: deal.company,
      contact: deal.contact,
      leadId: deal.leadId,
      performedBy: actor.name,
      status: "Completed",
    },
  });

  await notify(await getManagerIds(), {
    type: "deal_won",
    title: `Deal won: ${deal.company}`,
    body: `${deal.closer || actor.name} closed "${deal.title}". Assign a developer or team to start the project.`,
    link: "/workflow",
  }, actor.id);
}

export interface AssignmentInput {
  role: string;
  userId?: string | null;
  teamId?: string | null;
  isLead?: boolean;
}

export function parseAssignments(value: unknown, role?: DeliveryRole): AssignmentInput[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const entry = item as Record<string, unknown>;
    const userId = typeof entry.userId === "string" && entry.userId ? entry.userId : null;
    const teamId = typeof entry.teamId === "string" && entry.teamId ? entry.teamId : null;
    if (!userId === !teamId) return [];
    return [{ role: role || String(entry.role || ""), userId, teamId, isLead: entry.isLead === true }];
  });
}

// Adds people/teams to a project, skipping duplicates, and tells everyone affected.
export async function addProjectAssignments(projectId: string, entries: AssignmentInput[], actor: Actor) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, clientName: true, assignments: { select: { role: true, userId: true, teamId: true } } },
  });
  if (!project) throw new AssignmentError("Project not found", 404);

  const created: string[] = [];
  for (const entry of entries) {
    if (!DELIVERY_ROLES.includes(entry.role as DeliveryRole)) throw new AssignmentError(`Unknown role "${entry.role}"`);
    const duplicate = project.assignments.some((existing) =>
      existing.role === entry.role
      && (entry.userId ? existing.userId === entry.userId : existing.teamId === entry.teamId));
    if (duplicate) continue;

    let recipients: string[];
    let label: string;
    if (entry.userId) {
      const user = await findActiveUser(entry.userId);
      if (!user) throw new AssignmentError("A selected person is not an active user");
      recipients = [user.id];
      label = fullName(user);
    } else {
      const team = await prisma.team.findUnique({ where: { id: entry.teamId! }, select: { id: true, name: true } });
      if (!team) throw new AssignmentError("A selected team was not found");
      recipients = await teamUserIds(team.id);
      label = `${team.name} team`;
    }

    const assignment = await prisma.projectAssignment.create({
      data: {
        projectId,
        role: entry.role,
        userId: entry.userId || null,
        teamId: entry.teamId || null,
        isLead: !!entry.isLead,
        assignedById: actor.id,
        assignedByName: actor.name,
      },
    });
    project.assignments.push({ role: assignment.role, userId: assignment.userId, teamId: assignment.teamId });
    created.push(assignment.id);

    await notify(recipients, {
      type: "project_assigned",
      title: `${entry.role} on ${project.name}`,
      body: `${actor.name} assigned ${label} as ${entry.role}${entry.isLead ? " (lead)" : ""} for ${project.clientName}.`,
      link: `/projects/${project.id}`,
    }, actor.id);
  }

  await syncProjectTeamMembers(projectId);
  return created;
}

export async function syncProjectTeamMembers(projectId: string) {
  const assignments = await prisma.projectAssignment.findMany({
    where: { projectId },
    select: {
      user: { select: { firstName: true, lastName: true } },
      team: {
        select: {
          leader: { select: { firstName: true, lastName: true } },
          members: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });
  const names = new Set<string>();
  for (const assignment of assignments) {
    if (assignment.user) names.add(fullName(assignment.user));
    if (assignment.team?.leader) names.add(fullName(assignment.team.leader));
    assignment.team?.members.forEach((member) => names.add(fullName(member)));
  }
  await prisma.project.update({ where: { id: projectId }, data: { teamMembers: [...names] } });
}

export class AssignmentError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

async function activeUsersWithRoles(roles: readonly string[]) {
  const users = await prisma.user.findMany({
    where: { status: "Active", role: { name: { in: [...roles] } } },
    select: { id: true, firstName: true, lastName: true, image: true, role: { select: { name: true } } },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });
  return users.map((user) => ({ id: user.id, name: fullName(user), image: user.image, role: user.role?.name || "" }));
}

// People and teams offered in the closer / developer / tester / DevOps pickers.
export async function getPickerOptions() {
  const [closers, developers, testers, devops, teams] = await Promise.all([
    activeUsersWithRoles(PICKER_ROLES.Closer),
    activeUsersWithRoles(PICKER_ROLES.Developer),
    activeUsersWithRoles(PICKER_ROLES.Tester),
    activeUsersWithRoles(PICKER_ROLES.DevOps),
    prisma.team.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, department: true, _count: { select: { members: true } } },
    }),
  ]);
  return {
    people: { closers, developers, testers, devops },
    teams: teams.map((team) => ({ id: team.id, name: team.name, department: team.department, memberCount: team._count.members })),
  };
}
