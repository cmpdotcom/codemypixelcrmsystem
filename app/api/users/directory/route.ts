import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/directory - team directory with per-member workload stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const roleName = searchParams.get("role");
  const teamName = searchParams.get("team");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  if (roleName && roleName !== "All Roles") {
    where.role = { name: roleName };
  }
  if (teamName && teamName !== "All Teams") {
    where.team = { name: teamName };
  }
  if (status && status !== "All Statuses") {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, leads, deals, tasks, activities, commissions, roles, teams] =
    await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          role: { select: { name: true, color: true } },
          team: { select: { name: true, department: true, color: true } },
          ledTeams: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.findMany({ select: { setter: true, status: true } }),
      prisma.deal.findMany({ select: { closer: true, stage: true, value: true } }),
      prisma.task.findMany({ select: { assignee: true, status: true } }),
      prisma.activity.findMany({ select: { performedBy: true } }),
      prisma.commission.findMany({ select: { memberName: true, amount: true, status: true } }),
      prisma.role.findMany({ select: { name: true } }),
      prisma.team.findMany({ select: { name: true } }),
    ]);

  const directory = users.map((u) => {
    const name = `${u.firstName} ${u.lastName}`.trim();

    const userLeads = leads.filter((l) => l.setter === name);
    const userDeals = deals.filter((d) => d.closer === name);
    const wonDeals = userDeals.filter((d) => d.stage === "won");
    const userTasks = tasks.filter((t) => t.assignee === name);
    const userActivities = activities.filter((a) => a.performedBy === name);
    const userCommissions = commissions.filter((c) => c.memberName === name);

    return {
      id: u.id,
      name,
      email: u.email,
      image: u.image,
      role: u.role?.name || "Unassigned",
      roleColor: u.role?.color || "slate",
      team: u.team?.name || "Unassigned",
      teamDepartment: u.team?.department || null,
      teamColor: u.team?.color || "slate",
      isTeamLeader: u.ledTeams.length > 0,
      ledTeams: u.ledTeams.map((t) => t.name),
      status: u.status,
      lastActive: u.lastActive ? new Date(u.lastActive).toISOString() : null,
      createdAt: u.createdAt.toISOString(),
      stats: {
        leads: userLeads.length,
        qualifiedLeads: userLeads.filter((l) => l.status === "Qualified" || l.status === "Converted").length,
        deals: userDeals.length,
        wonDeals: wonDeals.length,
        revenue: wonDeals.reduce((s, d) => s + d.value, 0),
        tasks: userTasks.length,
        tasksDone: userTasks.filter((t) => t.status === "Done").length,
        activities: userActivities.length,
        commissions: userCommissions
          .filter((c) => c.status === "Paid")
          .reduce((s, c) => s + c.amount, 0),
      },
    };
  });

  const activeUsers = users.filter((u) => u.status === "Active").length;

  return NextResponse.json({
    users: directory,
    kpi: {
      totalMembers: users.length,
      activeMembers: activeUsers,
      inactiveMembers: users.length - activeUsers,
      teams: teams.length,
      roles: roles.length,
      teamLeaders: directory.filter((u) => u.isTeamLeader).length,
    },
    roleOptions: roles.map((r) => r.name),
    teamOptions: teams.map((t) => t.name),
  });
}
