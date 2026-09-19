import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reports?period=30d|90d|12m|all - cross-module analytics aggregation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "all";

  const now = new Date();
  let since: Date | null = null;
  if (period === "30d") since = new Date(now.getTime() - 30 * 86400000);
  else if (period === "90d") since = new Date(now.getTime() - 90 * 86400000);
  else if (period === "12m") since = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  const createdFilter = since ? { gte: since } : undefined;

  const [deals, leads, payments, commissions, tasks, projects, activities, bugs] =
    await Promise.all([
      prisma.deal.findMany({
        where: createdFilter ? { createdAt: createdFilter } : {},
        select: {
          id: true, title: true, company: true, value: true, stage: true,
          pipeline: true, closer: true, createdAt: true, closedAt: true,
        },
      }),
      prisma.lead.findMany({
        where: createdFilter ? { createdAt: createdFilter } : {},
        select: { id: true, status: true, source: true, setter: true, createdAt: true },
      }),
      prisma.payment.findMany({
        where: createdFilter ? { createdAt: createdFilter } : {},
        select: {
          id: true, amount: true, status: true, clientName: true,
          dueDate: true, paidAt: true, createdAt: true,
        },
      }),
      prisma.commission.findMany({
        where: createdFilter ? { createdAt: createdFilter } : {},
        select: {
          id: true, amount: true, status: true, memberName: true,
          memberRole: true, earnedAt: true,
        },
      }),
      prisma.task.findMany({
        where: createdFilter ? { createdAt: createdFilter } : {},
        select: { id: true, status: true, assignee: true, loggedHours: true, estimatedHours: true, dueDate: true },
      }),
      prisma.project.findMany({
        select: { id: true, status: true, health: true, budget: true, spent: true },
      }),
      prisma.activity.count(createdFilter ? { where: { createdAt: createdFilter } } : undefined),
      prisma.bug.findMany({
        select: { id: true, status: true, severity: true },
      }),
    ]);

  // ---------- KPIs ----------
  const wonDeals = deals.filter((d) => d.stage === "won");
  const lostDeals = deals.filter((d) => d.stage === "lost");
  const activeDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const paidPayments = payments.filter((p) => p.status === "Paid");
  const openPayments = payments.filter(
    (p) => p.status === "Pending" || p.status === "Partial" || p.status === "Overdue"
  );
  const completedTasks = tasks.filter((t) => t.status === "Done");
  const paidCommissions = commissions.filter((c) => c.status === "Paid");
  const qualifiedLeads = leads.filter((l) => l.status === "Qualified" || l.status === "Converted");

  const totalRevenue = wonDeals.reduce((s, d) => s + d.value, 0);
  const collected = paidPayments.reduce((s, p) => s + p.amount, 0);
  const receivables = openPayments.reduce((s, p) => s + p.amount, 0);
  const pipelineValue = activeDeals.reduce((s, d) => s + d.value, 0);
  const closedCount = wonDeals.length + lostDeals.length;
  const winRate = closedCount > 0 ? (wonDeals.length / closedCount) * 100 : 0;
  const conversionRate = leads.length > 0 ? (qualifiedLeads.length / leads.length) * 100 : 0;
  const commissionsPaid = paidCommissions.reduce((s, c) => s + c.amount, 0);

  // ---------- Monthly revenue trend (last 6 buckets) ----------
  const months: { key: string; label: string; revenue: number; collected: number; deals: number; leads: number }[] = [];
  const bucketCount = period === "30d" ? 4 : period === "90d" ? 3 : 6;
  for (let i = bucketCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      revenue: 0,
      collected: 0,
      deals: 0,
      leads: 0,
    });
  }
  const inBucket = (date: Date | null) => {
    if (!date) return -1;
    const d = new Date(date);
    return months.findIndex((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
  };
  for (const d of wonDeals) {
    const i = inBucket(d.closedAt || d.createdAt);
    if (i >= 0) {
      months[i].revenue += d.value;
      months[i].deals += 1;
    }
  }
  for (const p of paidPayments) {
    const i = inBucket(p.paidAt || p.createdAt);
    if (i >= 0) months[i].collected += p.amount;
  }
  for (const l of leads) {
    const i = inBucket(l.createdAt);
    if (i >= 0) months[i].leads += 1;
  }

  // ---------- Breakdowns ----------
  const countBy = <T,>(arr: T[], key: (item: T) => string | null | undefined) => {
    const map = new Map<string, number>();
    for (const item of arr) {
      const k = key(item) || "Other";
      map.set(k, (map.get(k) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  };

  const stageLabels: Record<string, string> = {
    qualified: "Qualified", discovery: "Discovery", proposal: "Proposal",
    negotiation: "Negotiation", contract: "Contract", won: "Won", lost: "Lost",
  };
  const dealsByStage = countBy(deals, (d) => stageLabels[d.stage] || d.stage);
  const dealValueByStage = dealsByStage.map((s) => ({
    name: s.name,
    value: deals
      .filter((d) => (stageLabels[d.stage] || d.stage) === s.name)
      .reduce((sum, d) => sum + d.value, 0),
  }));

  const leadsBySource = countBy(leads, (l) => l.source);
  const leadsByStatus = countBy(leads, (l) => l.status);
  const tasksByStatus = countBy(tasks, (t) => t.status);
  const bugsBySeverity = countBy(bugs, (b) => b.severity);
  const projectsByHealth = countBy(projects, (p) => p.health);
  const paymentsByStatus = countBy(payments, (p) => p.status);

  // ---------- Team leaderboard ----------
  const memberMap = new Map<string, { name: string; role: string; revenue: number; deals: number; commissions: number; tasks: number }>();
  const member = (name: string, role: string) => {
    if (!memberMap.has(name)) memberMap.set(name, { name, role, revenue: 0, deals: 0, commissions: 0, tasks: 0 });
    return memberMap.get(name)!;
  };
  for (const d of wonDeals) {
    if (d.closer) {
      const m = member(d.closer, "Closer");
      m.revenue += d.value;
      m.deals += 1;
    }
  }
  for (const c of commissions) {
    const m = member(c.memberName, c.memberRole);
    if (c.status === "Paid") m.commissions += c.amount;
  }
  for (const t of completedTasks) {
    if (t.assignee && t.assignee !== "Unassigned") member(t.assignee, "Developer").tasks += 1;
  }
  for (const l of qualifiedLeads) {
    if (l.setter) member(l.setter, "Setter").deals += 1;
  }
  const teamLeaderboard = Array.from(memberMap.values())
    .sort((a, b) => b.revenue - a.revenue || b.tasks - a.tasks)
    .slice(0, 8);

  // ---------- Top won deals ----------
  const topDeals = wonDeals
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((d) => ({ title: d.title, company: d.company, value: d.value, closer: d.closer }));

  return NextResponse.json({
    period,
    kpi: {
      totalRevenue,
      collected,
      receivables,
      pipelineValue,
      totalDeals: deals.length,
      wonDeals: wonDeals.length,
      winRate: `${winRate.toFixed(1)}%`,
      totalLeads: leads.length,
      conversionRate: `${conversionRate.toFixed(1)}%`,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      totalActivities: activities,
      commissionsPaid,
      totalProjects: projects.length,
      openBugs: bugs.filter((b) => !["Fixed", "Verified", "Closed"].includes(b.status)).length,
    },
    revenueTrend: months,
    dealsByStage,
    dealValueByStage,
    leadsBySource,
    leadsByStatus,
    tasksByStatus,
    bugsBySeverity,
    projectsByHealth,
    paymentsByStatus,
    teamLeaderboard,
    topDeals,
  });
}
