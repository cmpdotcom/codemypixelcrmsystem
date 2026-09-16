import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_TAGS = [
  { name: "Hot Lead", color: "red", count: 24, applicable: ["Leads", "Deals"] },
  { name: "Enterprise", color: "purple", count: 36, applicable: ["Leads", "Deals", "Clients", "Projects"] },
  { name: "VIP", color: "amber", count: 25, applicable: ["Leads", "Clients"] },
  { name: "High Budget", color: "green", count: 18, applicable: ["Deals"] },
  { name: "Urgent", color: "rose", count: 31, applicable: ["Tasks", "Projects", "Leads"] },
  { name: "International", color: "blue", count: 12, applicable: ["Clients", "Leads"] },
  { name: "Returning Client", color: "teal", count: 9, applicable: ["Clients"] },
  { name: "Potential", color: "indigo", count: 21, applicable: ["Leads"] },
  { name: "At Risk", color: "orange", count: 7, applicable: ["Clients", "Deals"] },
  { name: "Newsletter", color: "slate", count: 14, applicable: ["Leads"] },
  { name: "Cold", color: "cyan", count: 6, applicable: ["Leads"] },
  { name: "Referral", color: "green", count: 11, applicable: ["Leads", "Clients"] },
];

// GET /api/settings/tags
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "crm_tags_config" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json(DEFAULT_TAGS);
}

// POST /api/settings/tags
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (Array.isArray(body)) {
    await prisma.setting.upsert({
      where: { key: "crm_tags_config" },
      update: { value: JSON.stringify(body) },
      create: { key: "crm_tags_config", value: JSON.stringify(body) },
    });
  }

  return NextResponse.json({ success: true });
}
