import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_COMMISSION_SETTINGS = {
  setterType: "Fixed Rate",
  setterTriggers: [
    { trigger: "Qualified Lead", type: "Fixed", amount: "$5" },
    { trigger: "Meeting Booked", type: "Fixed", amount: "$10" },
    { trigger: "Successful Handoff", type: "Fixed", amount: "$15" },
  ],
  closerType: "Percentage of Deal",
  closerPercentageTriggers: [
    { trigger: "Deal Won", rate: "5%" },
    { trigger: "Payment Received", rate: "Additional 2%" },
  ],
  closerTieredTriggers: [
    { range: "$0 – $10,000", rate: "3%" },
    { range: "$10k – $25k", rate: "5%" },
    { range: "$25k – $50k", rate: "7%" },
    { range: "$50k+", rate: "10%" },
  ],
  closerFixedTriggers: [
    { trigger: "Deal Won", amount: "$500" },
  ],
  requireManagerApproval: "true",
  requireFinanceApproval: "true",
};

// GET /api/settings/commissions
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "commission_settings_config" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json(DEFAULT_COMMISSION_SETTINGS);
}

// POST /api/settings/commissions
export async function POST(request: NextRequest) {
  const body = await request.json();

  await prisma.setting.upsert({
    where: { key: "commission_settings_config" },
    update: { value: JSON.stringify(body) },
    create: { key: "commission_settings_config", value: JSON.stringify(body) },
  });

  return NextResponse.json({ success: true });
}
