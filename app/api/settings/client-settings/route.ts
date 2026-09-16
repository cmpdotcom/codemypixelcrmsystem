import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  clientTypes: [
    "Individual",
    "Small Business",
    "Mid-Market",
    "Enterprise",
    "Government",
    "Non-Profit",
  ],
  clientStatuses: [
    { label: "Prospect", color: "bg-slate-400" },
    { label: "Active", color: "bg-emerald-500" },
    { label: "Inactive", color: "bg-amber-500" },
    { label: "VIP", color: "bg-purple-500" },
    { label: "At Risk", color: "bg-rose-500" },
    { label: "Churned", color: "bg-red-500" },
  ],
  industries: [
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
  ],
  companySizes: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
};

// GET /api/settings/client-settings
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "client_settings_config" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json(DEFAULT_SETTINGS);
}

// POST /api/settings/client-settings
export async function POST(request: NextRequest) {
  const body = await request.json();

  await prisma.setting.upsert({
    where: { key: "client_settings_config" },
    update: { value: JSON.stringify(body) },
    create: { key: "client_settings_config", value: JSON.stringify(body) },
  });

  return NextResponse.json({ success: true });
}
