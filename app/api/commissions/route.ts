import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/commissions - list commissions, filter by search/status/role/member, KPI + per-member stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const role = searchParams.get("role");
  const member = searchParams.get("member");

  const where: Record<string, unknown> = {};

  if (status && status !== "all" && status !== "All Statuses") {
    where.status = status;
  }
  if (role && role !== "All Roles") {
    where.memberRole = role;
  }
  if (member && member !== "All Members") {
    where.memberName = member;
  }
  if (search) {
    where.OR = [
      { memberName: { contains: search, mode: "insensitive" } },
      { dealTitle: { contains: search, mode: "insensitive" } },
      { clientName: { contains: search, mode: "insensitive" } },
      { basis: { contains: search, mode: "insensitive" } },
    ];
  }

  const [commissions, totalCount, allCommissions] = await Promise.all([
    prisma.commission.findMany({
      where,
      orderBy: { earnedAt: "desc" },
      include: {
        deal: { select: { id: true, title: true, dealNumber: true, value: true, stage: true } },
      },
    }),
    prisma.commission.count({ where }),
    prisma.commission.findMany({
      select: {
        status: true,
        amount: true,
        memberName: true,
        memberRole: true,
        dealValue: true,
        earnedAt: true,
      },
    }),
  ]);

  // Aggregate KPI stats from all commissions
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const paid = allCommissions.filter((c) => c.status === "Paid");
  const pending = allCommissions.filter((c) => c.status === "Pending");
  const approved = allCommissions.filter((c) => c.status === "Approved");

  const totalEarned = allCommissions.reduce((sum, c) => sum + c.amount, 0);
  const paidOut = paid.reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = pending.reduce((sum, c) => sum + c.amount, 0);
  const approvedAmount = approved.reduce((sum, c) => sum + c.amount, 0);
  const earnedThisMonth = allCommissions
    .filter((c) => new Date(c.earnedAt) >= monthStart)
    .reduce((sum, c) => sum + c.amount, 0);

  // Per-member aggregation for the leaderboard
  const memberMap = new Map<
    string,
    { memberName: string; memberRole: string; totalEarned: number; paidOut: number; pending: number; count: number }
  >();
  for (const c of allCommissions) {
    const entry =
      memberMap.get(c.memberName) ||
      { memberName: c.memberName, memberRole: c.memberRole, totalEarned: 0, paidOut: 0, pending: 0, count: 0 };
    entry.totalEarned += c.amount;
    entry.count += 1;
    if (c.status === "Paid") entry.paidOut += c.amount;
    else entry.pending += c.amount;
    memberMap.set(c.memberName, entry);
  }
  const memberStats = Array.from(memberMap.values()).sort((a, b) => b.totalEarned - a.totalEarned);

  return NextResponse.json({
    commissions,
    totalCount,
    kpi: {
      totalCommissions: allCommissions.length,
      totalEarned,
      paidOut,
      pendingAmount,
      pendingCount: pending.length,
      approvedAmount,
      earnedThisMonth,
    },
    statusCounts: {
      All: allCommissions.length,
      Pending: pending.length,
      Approved: approved.length,
      Paid: paid.length,
      "On Hold": allCommissions.filter((c) => c.status === "On Hold").length,
    },
    memberStats,
    members: memberStats.map((m) => m.memberName),
  });
}

// POST /api/commissions - record a manual commission / bonus
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.memberName) {
    return NextResponse.json(
      { error: "Member name is required" },
      { status: 400 }
    );
  }

  const status = body.status || "Pending";

  const commission = await prisma.commission.create({
    data: {
      memberName: body.memberName.trim(),
      memberRole: body.memberRole || "Closer",
      dealTitle: body.dealTitle?.trim() || null,
      clientName: body.clientName?.trim() || null,
      basis: body.basis?.trim() || null,
      rate: parseFloat(body.rate) || 0,
      dealValue: parseFloat(body.dealValue) || 0,
      amount: parseFloat(body.amount) || 0,
      status,
      period: body.period || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      earnedAt: body.earnedAt ? new Date(body.earnedAt) : new Date(),
      paidAt: status === "Paid" ? (body.paidAt ? new Date(body.paidAt) : new Date()) : null,
      notes: body.notes?.trim() || null,
      dealId: body.dealId || null,
      paymentId: body.paymentId || null,
    },
  });

  return NextResponse.json(commission, { status: 201 });
}
