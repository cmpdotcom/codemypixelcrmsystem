import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/team/setters - fetch all setters, their lead stats, qualification rate, and leaderboard
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  // 1. Fetch all users whose role is Setter or who have leads assigned to them
  const [setterRole, allUsers, allLeads, allActivities] = await Promise.all([
    prisma.role.findFirst({
      where: { name: { in: ["Setter", "Sales Manager"] } },
    }),
    prisma.user.findMany({
      include: {
        role: true,
        team: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.lead.findMany({
      select: {
        id: true,
        name: true,
        company: true,
        status: true,
        setter: true,
        createdAt: true,
      },
    }),
    prisma.activity.findMany({
      where: { type: "Call" },
      select: { performedBy: true, createdAt: true },
    }),
  ]);

  // Filter setters
  const setterUsers = allUsers.filter(
    (u) =>
      u.role?.name === "Setter" ||
      u.team?.name?.includes("Setter") ||
      allLeads.some((l) => l.setter?.toLowerCase() === `${u.firstName} ${u.lastName}`.toLowerCase())
  );

  // If none explicitly tagged as setter, use sales team members
  const candidateUsers = setterUsers.length > 0
    ? setterUsers
    : allUsers.filter((u) => u.team?.name?.includes("Sales") || u.role?.name?.includes("Sales"));

  // Build metrics for each setter
  const setters = candidateUsers.map((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.trim();
    const assignedLeads = allLeads.filter(
      (l) => l.setter?.toLowerCase() === fullName.toLowerCase()
    );

    const totalLeads = assignedLeads.length;
    const qualifiedLeads = assignedLeads.filter(
      (l) => l.status === "Qualified" || l.status === "Meeting" || l.status === "Proposal" || l.status === "Converted"
    ).length;
    const contactedLeads = assignedLeads.filter(
      (l) => l.status !== "New"
    ).length;
    const meetingsBooked = assignedLeads.filter(
      (l) => l.status === "Meeting" || l.status === "Proposal" || l.status === "Converted"
    ).length;

    const qualificationRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : "0.0";
    const callsLogged = allActivities.filter((a) => a.performedBy?.toLowerCase() === fullName.toLowerCase()).length;

    return {
      id: u.id,
      name: fullName,
      email: u.email,
      role: u.role?.name || "Setter",
      team: u.team?.name || "Setter Team",
      status: u.status,
      totalLeads,
      qualifiedLeads,
      contactedLeads,
      meetingsBooked,
      callsLogged,
      qualificationRate: `${qualificationRate}%`,
      conversionNum: parseFloat(qualificationRate),
    };
  });

  // Filter by search
  const filteredSetters = search
    ? setters.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
    : setters;

  // Global KPI calculations across all setters
  const totalAssignedLeads = allLeads.filter((l) => Boolean(l.setter)).length;
  const totalQualified = allLeads.filter(
    (l) => l.status === "Qualified" || l.status === "Meeting" || l.status === "Proposal" || l.status === "Converted"
  ).length;
  const avgQualRate = totalAssignedLeads > 0 ? ((totalQualified / totalAssignedLeads) * 100).toFixed(1) : "0.0";
  const totalCalls = allActivities.length;

  return NextResponse.json({
    setters: filteredSetters.sort((a, b) => b.totalLeads - a.totalLeads),
    kpi: {
      activeSettersCount: candidateUsers.filter((u) => u.status === "Active").length,
      totalAssignedLeads,
      totalQualified,
      avgQualRate: `${avgQualRate}%`,
      totalCalls,
    },
  });
}
