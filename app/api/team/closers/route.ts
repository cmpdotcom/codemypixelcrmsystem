import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/team/closers - calculate live closer win rates, revenue closed, pipeline volume from Deal table
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const [allUsers, allDeals] = await Promise.all([
    prisma.user.findMany({
      include: {
        role: true,
        team: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.deal.findMany({
      select: {
        id: true,
        title: true,
        company: true,
        value: true,
        stage: true,
        closer: true,
        probability: true,
        createdAt: true,
      },
    }),
  ]);

  // Closer candidate users: Role = Closer, Sales Manager, or named in closer field
  const closerUsers = allUsers.filter(
    (u) =>
      u.role?.name === "Closer" ||
      u.role?.name === "Sales Manager" ||
      u.team?.name?.includes("Closer") ||
      allDeals.some((d) => d.closer?.toLowerCase() === `${u.firstName} ${u.lastName}`.toLowerCase())
  );

  const candidateUsers = closerUsers.length > 0
    ? closerUsers
    : allUsers.filter((u) => u.team?.name?.includes("Sales"));

  const closers = candidateUsers.map((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.trim();
    const assignedDeals = allDeals.filter(
      (d) => d.closer?.toLowerCase() === fullName.toLowerCase()
    );

    const totalDeals = assignedDeals.length;
    const wonDeals = assignedDeals.filter((d) => d.stage === "won");
    const lostDeals = assignedDeals.filter((d) => d.stage === "lost");
    const activeDeals = assignedDeals.filter((d) => d.stage !== "won" && d.stage !== "lost");

    const revenueClosed = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const pipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);

    const closedCount = wonDeals.length + lostDeals.length;
    const winRate = closedCount > 0 ? ((wonDeals.length / closedCount) * 100).toFixed(1) : "0.0";
    const avgDealSize = wonDeals.length > 0 ? Math.round(revenueClosed / wonDeals.length) : 0;

    return {
      id: u.id,
      name: fullName,
      email: u.email,
      role: u.role?.name || "Closer",
      team: u.team?.name || "Closer Team",
      status: u.status,
      totalDeals,
      wonDealsCount: wonDeals.length,
      lostDealsCount: lostDeals.length,
      activeDealsCount: activeDeals.length,
      revenueClosed,
      pipelineValue,
      winRate: `${winRate}%`,
      winRateNum: parseFloat(winRate),
      avgDealSize,
    };
  });

  const filtered = search
    ? closers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
    : closers;

  const totalWonDeals = allDeals.filter((d) => d.stage === "won");
  const totalRevenue = totalWonDeals.reduce((s, d) => s + d.value, 0);
  const totalPipeline = allDeals.filter((d) => d.stage !== "won" && d.stage !== "lost").reduce((s, d) => s + d.value, 0);
  const totalClosed = allDeals.filter((d) => d.stage === "won" || d.stage === "lost").length;
  const overallWinRate = totalClosed > 0 ? ((totalWonDeals.length / totalClosed) * 100).toFixed(1) : "0.0";

  return NextResponse.json({
    closers: filtered.sort((a, b) => b.revenueClosed - a.revenueClosed),
    kpi: {
      activeClosersCount: candidateUsers.filter((u) => u.status === "Active").length,
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      totalPipeline: `$${totalPipeline.toLocaleString()}`,
      wonDealsCount: totalWonDeals.length,
      overallWinRate: `${overallWinRate}%`,
    },
  });
}
