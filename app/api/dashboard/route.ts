import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActor, leadScope, dealScope, projectScope } from "@/lib/workflow";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const FUNNEL_STAGES: { name: string; status: string; color: string }[] = [
  { name: "New Leads", status: "New", color: "#3b82f6" },
  { name: "Contacted", status: "Contacted", color: "#38bdf8" },
  { name: "Qualified", status: "Qualified", color: "#34d399" },
  { name: "Meeting", status: "Meeting", color: "#fbbf24" },
  { name: "Proposal", status: "Proposal", color: "#fb923c" },
  { name: "Converted", status: "Converted", color: "#c084fc" },
];

// GET /api/dashboard - aggregated, real-data feed for the dashboard overview
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leadWhere = leadScope(actor);
  const dealWhere = dealScope(actor);
  const projectWhere = projectScope(actor);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 86400000);

  const [
    totalLeads,
    leadsThisMonth,
    leadStatusGroups,
    recentLeads,
    deals,
    activeProjectsCount,
    recentProjects,
    activeUsers,
    todayTasks,
    recentActivities,
  ] = await Promise.all([
    prisma.lead.count({ where: leadWhere }),
    prisma.lead.count({ where: { AND: [leadWhere, { createdAt: { gte: startOfMonth } }] } }),
    prisma.lead.groupBy({ by: ["status"], where: leadWhere, _count: { id: true } }),
    prisma.lead.findMany({
      where: leadWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, company: true, service: true, status: true, createdAt: true },
    }),
    prisma.deal.findMany({
      where: dealWhere,
      select: { id: true, title: true, company: true, service: true, value: true, stage: true, probability: true, closedAt: true, createdAt: true },
    }),
    prisma.project.count({ where: { AND: [projectWhere, { status: { not: "Completed" } }] } }),
    prisma.project.findMany({
      where: projectWhere,
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, name: true, status: true, progress: true },
    }),
    prisma.user.findMany({ where: { status: "Active" }, select: { id: true } }),
    prisma.task.findMany({
      where: { dueDate: { gte: startOfToday, lt: endOfToday } },
      orderBy: { dueDate: "asc" },
      take: 6,
      select: { id: true, name: true, dueDate: true, status: true, module: true },
    }),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, type: true, performedBy: true, createdAt: true },
    }),
  ]);

  const wonDeals = deals.filter((d) => d.stage === "won");
  const activeDealsList = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const pipelineValue = activeDealsList.reduce((sum, d) => sum + d.value, 0);
  const wonRevenueThisMonth = wonDeals
    .filter((d) => new Date(d.closedAt || d.createdAt) >= startOfMonth)
    .reduce((sum, d) => sum + d.value, 0);

  // Real revenue trend: won-deal value per month for the trailing 6 months.
  const months = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return { key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`, name: monthDate.toLocaleDateString("en-US", { month: "short" }), value: 0 };
  });
  for (const deal of wonDeals) {
    const closed = new Date(deal.closedAt || deal.createdAt);
    const bucket = months.find((month) => month.key === `${closed.getFullYear()}-${closed.getMonth()}`);
    if (bucket) bucket.value += deal.value;
  }

  const statusCounts = Object.fromEntries(leadStatusGroups.map((group) => [group.status, group._count.id]));
  const funnel = FUNNEL_STAGES.map((stage) => {
    const value = statusCounts[stage.status] || 0;
    return {
      name: stage.name,
      value,
      percentage: totalLeads ? `${Math.round((value / totalLeads) * 100)}%` : "0%",
      color: stage.color,
    };
  });

  // Team performance leaderboard is company-wide, so only compute it for managers
  // (the same audience the "Performance" permission already gates on the client).
  let teamPerformance: { id: string; name: string; role: string; leads: number; deals: number; revenue: number }[] = [];
  if (actor.isManager) {
    const [users, allLeads, allDeals] = await Promise.all([
      prisma.user.findMany({ where: { status: "Active" }, include: { role: true }, take: 20 }),
      prisma.lead.findMany({ select: { setter: true, status: true } }),
      prisma.deal.findMany({ select: { closer: true, stage: true, value: true } }),
    ]);
    teamPerformance = users
      .map((user) => {
        const name = `${user.firstName} ${user.lastName}`.trim();
        const qualifiedLeads = allLeads.filter(
          (lead) => lead.setter?.toLowerCase() === name.toLowerCase() &&
            ["Qualified", "Meeting", "Converted"].includes(lead.status)
        ).length;
        const wonDealsForUser = allDeals.filter((deal) => deal.closer?.toLowerCase() === name.toLowerCase() && deal.stage === "won");
        return {
          id: user.id,
          name,
          role: user.role?.name || "Member",
          leads: qualifiedLeads,
          deals: wonDealsForUser.length,
          revenue: wonDealsForUser.reduce((sum, deal) => sum + deal.value, 0),
        };
      })
      .filter((member) => member.leads > 0 || member.deals > 0)
      .sort((a, b) => b.revenue - a.revenue || b.leads - a.leads)
      .slice(0, 5);
  }

  return NextResponse.json({
    kpi: {
      totalLeads,
      leadsThisMonth,
      activeDeals: activeDealsList.length,
      pipelineValue,
      wonRevenueThisMonth,
      activeProjects: activeProjectsCount,
      teamMembers: activeUsers.length,
    },
    revenueTrend: months.map((month) => ({ name: month.name, value: month.value })),
    funnel,
    recentLeads: recentLeads.map((lead) => ({
      id: lead.id,
      name: lead.company,
      desc: lead.service || lead.name,
      status: lead.status,
      time: timeAgo(lead.createdAt),
    })),
    activeDeals: activeDealsList
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((deal) => ({
        id: deal.id,
        name: deal.company,
        desc: deal.title,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
      })),
    projectProgress: recentProjects.map((project) => ({
      id: project.id,
      name: project.name,
      desc: project.status,
      progress: project.progress,
    })),
    teamPerformance,
    todayTasks: todayTasks.map((task) => ({
      id: task.id,
      title: task.name,
      time: new Date(task.dueDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      tag: task.module || "Task",
      status: task.status,
      completed: task.status === "Done",
    })),
    activityTimeline: recentActivities.map((activity) => ({
      id: activity.id,
      action: activity.title,
      type: activity.type,
      by: activity.performedBy || "System",
      time: timeAgo(activity.createdAt),
    })),
  });
}
