import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings/leads - get statuses with REAL lead counts from database + industries
export async function GET() {
  // 1. Fetch real lead counts grouped by status from Lead table
  const leadCounts = await prisma.lead.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const countMap: Record<string, number> = {};
  for (const item of leadCounts) {
    countMap[item.status] = item._count.id;
  }

  // 2. Fetch configured statuses and industries from Setting table
  const settings = await prisma.setting.findMany({
    where: {
      key: { in: ["lead_statuses", "lead_industries"] },
    },
  });

  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  const defaultStatuses = [
    { name: "New", color: "blue" },
    { name: "Contacted", color: "amber" },
    { name: "Qualified", color: "green" },
    { name: "Meeting", color: "indigo" },
    { name: "Proposal", color: "purple" },
    { name: "Nurture", color: "slate" },
    { name: "Not Interested", color: "rose" },
    { name: "Converted", color: "teal" },
    { name: "Lost", color: "red" },
  ];

  let statuses = defaultStatuses;
  if (settingsMap["lead_statuses"]) {
    try {
      statuses = JSON.parse(settingsMap["lead_statuses"]);
    } catch {
      /* fallback */
    }
  }

  // Attach live counts from database
  const enrichedStatuses = statuses.map((s) => ({
    ...s,
    count: countMap[s.name] || 0,
  }));

  const defaultIndustries = [
    "Technology",
    "Manufacturing",
    "Healthcare",
    "Education",
    "Real Estate",
    "Finance",
    "E-commerce",
    "Construction",
    "Logistics",
    "Marketing",
    "Other",
  ];

  let industries = defaultIndustries;
  if (settingsMap["lead_industries"]) {
    try {
      industries = JSON.parse(settingsMap["lead_industries"]);
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json({
    statuses: enrichedStatuses,
    industries,
  });
}

// POST /api/settings/leads - save statuses and industries
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.statuses) {
    await prisma.setting.upsert({
      where: { key: "lead_statuses" },
      update: { value: JSON.stringify(body.statuses) },
      create: { key: "lead_statuses", value: JSON.stringify(body.statuses) },
    });
  }

  if (body.industries) {
    await prisma.setting.upsert({
      where: { key: "lead_industries" },
      update: { value: JSON.stringify(body.industries) },
      create: { key: "lead_industries", value: JSON.stringify(body.industries) },
    });
  }

  return NextResponse.json({ success: true });
}
