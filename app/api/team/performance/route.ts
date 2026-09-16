import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/team/performance - combined cross-functional sales & delivery performance analytics
export async function GET() {
  const [allUsers, allLeads, allDeals, allTasks, allProjects, allActivities] = await Promise.all([
    prisma.user.findMany({
      include: { role: true, team: true },
    }),
    prisma.lead.findMany({ select: { setter: true, status: true, createdAt: true } }),
    prisma.deal.findMany({ select: { closer: true, stage: true, value: true, createdAt: true } }),
    prisma.task.findMany({ select: { assignee: true, status: true, loggedHours: true, estimatedHours: true } }),
    prisma.project.findMany({ select: { status: true, progress: true } }),
    prisma.activity.findMany({ select: { performedBy: true, type: true, createdAt: true } }),
  ]);

  // Total Metrics
  const totalRevenueWon = allDeals.filter((d) => d.stage === "won").reduce((s, d) => s + d.value, 0);
  const totalLeadsCount = allLeads.length;
  const totalTasksCompleted = allTasks.filter((t) => t.status === "Done").length;
  const totalHoursLogged = allTasks.reduce((s, t) => s + t.loggedHours, 0);

  // Leaderboard combining all team members
  const memberRankings = allUsers.map((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.trim();
    const wonDeals = allDeals.filter((d) => d.closer?.toLowerCase() === fullName.toLowerCase() && d.stage === "won");
    const repRevenue = wonDeals.reduce((s, d) => s + d.value, 0);
    const assignedLeads = allLeads.filter((l) => l.setter?.toLowerCase() === fullName.toLowerCase());
    const qualifiedLeads = assignedLeads.filter((l) => l.status === "Qualified" || l.status === "Meeting" || l.status === "Converted").length;
    const completedTasks = allTasks.filter((t) => t.assignee?.toLowerCase() === fullName.toLowerCase() && t.status === "Done").length;
    const activitiesCount = allActivities.filter((a) => a.performedBy?.toLowerCase() === fullName.toLowerCase()).length;

    // Score calculation (weighted metric)
    const score = Math.round(repRevenue / 1000 * 20 + qualifiedLeads * 15 + completedTasks * 10 + activitiesCount * 2);

    return {
      id: u.id,
      name: fullName,
      email: u.email,
      role: u.role?.name || "Member",
      team: u.team?.name || "General Team",
      status: u.status,
      revenueWon: repRevenue,
      qualifiedLeads,
      completedTasks,
      activitiesCount,
      score,
    };
  });

  return NextResponse.json({
    kpi: {
      totalRevenueWon: `$${totalRevenueWon.toLocaleString()}`,
      totalLeadsCount,
      totalTasksCompleted,
      totalHoursLogged: Math.round(totalHoursLogged),
      activeTeamMembers: allUsers.filter((u) => u.status === "Active").length,
    },
    rankings: memberRankings.sort((a, b) => b.score - a.score),
  });
}
