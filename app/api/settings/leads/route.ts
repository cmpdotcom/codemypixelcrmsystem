import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActor, leadScope } from "@/lib/workflow";

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

const defaultIndustries = [
  "Technology", "Manufacturing", "Healthcare", "Education", "Real Estate",
  "Finance", "E-commerce", "Construction", "Logistics", "Marketing", "Other",
];

const allowedColors = new Set([
  "blue", "purple", "amber", "cyan", "green", "indigo", "teal", "slate", "rose", "red",
]);

function normalizeStatuses(value: unknown) {
  if (!Array.isArray(value)) return defaultStatuses;
  const seen = new Set<string>();
  const statuses = value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const name = "name" in item && typeof item.name === "string" ? item.name.trim() : "";
    const color = "color" in item && typeof item.color === "string" ? item.color : "blue";
    const key = name.toLowerCase();
    if (!name || seen.has(key)) return [];
    seen.add(key);
    return [{ name: name.slice(0, 60), color: allowedColors.has(color) ? color : "blue" }];
  });
  return statuses.length > 0 ? statuses : defaultStatuses;
}

function normalizeIndustries(value: unknown) {
  if (!Array.isArray(value)) return defaultIndustries;
  const seen = new Set<string>();
  const industries = value.flatMap((item) => {
    if (typeof item !== "string") return [];
    const industry = item.trim();
    const key = industry.toLowerCase();
    if (!industry || seen.has(key)) return [];
    seen.add(key);
    return [industry.slice(0, 80)];
  });
  return industries.length > 0 ? industries : defaultIndustries;
}

// GET /api/settings/leads - get statuses with REAL lead counts from database + industries
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // 1. Fetch real lead counts grouped by status from Lead table
  const leadCounts = await prisma.lead.groupBy({
    by: ["status"],
    where: leadScope(actor),
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

  let statuses = defaultStatuses;
  if (settingsMap["lead_statuses"]) {
    try {
      statuses = normalizeStatuses(JSON.parse(settingsMap["lead_statuses"]));
    } catch {
      /* fallback */
    }
  }

  // Attach live counts from database
  const enrichedStatuses = statuses.map((s) => ({
    ...s,
    count: countMap[s.name] || 0,
  }));

  let industries = defaultIndustries;
  if (settingsMap["lead_industries"]) {
    try {
      industries = normalizeIndustries(JSON.parse(settingsMap["lead_industries"]));
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
  let body: { statuses?: unknown; industries?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.statuses !== undefined) {
    await prisma.setting.upsert({
      where: { key: "lead_statuses" },
      update: { value: JSON.stringify(normalizeStatuses(body.statuses)) },
      create: { key: "lead_statuses", value: JSON.stringify(normalizeStatuses(body.statuses)) },
    });
  }

  if (body.industries !== undefined) {
    await prisma.setting.upsert({
      where: { key: "lead_industries" },
      update: { value: JSON.stringify(normalizeIndustries(body.industries)) },
      create: { key: "lead_industries", value: JSON.stringify(normalizeIndustries(body.industries)) },
    });
  }

  return NextResponse.json({ success: true });
}
