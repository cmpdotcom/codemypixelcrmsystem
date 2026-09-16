import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings/lead-sources - live count from Lead table + stored sources
export async function GET() {
  const sourceCounts = await prisma.lead.groupBy({
    by: ["source"],
    _count: { id: true },
  });

  const countMap: Record<string, number> = {};
  for (const item of sourceCounts) {
    countMap[item.source] = item._count.id;
  }

  const setting = await prisma.setting.findUnique({
    where: { key: "lead_sources" },
  });

  const defaultSources = [
    { name: "Website", description: "Direct website form submissions", active: true },
    { name: "LinkedIn", description: "Professional leads from LinkedIn campaigns & outreach", active: true },
    { name: "Referral", description: "Word of mouth and client referrals", active: true },
    { name: "Facebook", description: "Social media leads from Facebook ads", active: true },
    { name: "Instagram", description: "Leads from Instagram campaigns", active: true },
    { name: "Google Ads", description: "Google Ads and organic search leads", active: true },
    { name: "Cold Call", description: "Outbound cold calls by SDR/Setters", active: true },
    { name: "WhatsApp", description: "Direct inbound via WhatsApp Business", active: true },
    { name: "Other", description: "Miscellaneous marketing channels", active: true },
  ];

  let sources = defaultSources;
  if (setting?.value) {
    try {
      sources = JSON.parse(setting.value);
    } catch {
      /* fallback */
    }
  }

  const enriched = sources.map((s) => ({
    ...s,
    count: countMap[s.name] || 0,
  }));

  return NextResponse.json(enriched);
}

// POST /api/settings/lead-sources - save sources list
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (Array.isArray(body.sources)) {
    await prisma.setting.upsert({
      where: { key: "lead_sources" },
      update: { value: JSON.stringify(body.sources) },
      create: { key: "lead_sources", value: JSON.stringify(body.sources) },
    });
  }

  return NextResponse.json({ success: true });
}
