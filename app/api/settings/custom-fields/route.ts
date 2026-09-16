import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CUSTOM_FIELDS = [
  { id: "cf-1", name: "Estimated Employees", module: "Lead", type: "Number", required: false, options: "" },
  { id: "cf-2", name: "Budget Range", module: "Lead", type: "Dropdown", required: true, options: "$1k-$5k, $5k-$20k, $20k+" },
  { id: "cf-3", name: "Preferred Contact", module: "Client", type: "Dropdown", required: false, options: "Email, Phone, WhatsApp" },
  { id: "cf-4", name: "Project Budget", module: "Deal", type: "Currency", required: true, options: "" },
  { id: "cf-5", name: "Contract Type", module: "Deal", type: "Dropdown", required: true, options: "Fixed Price, Time & Materials, Retainer" },
  { id: "cf-6", name: "Internal Notes", module: "Client", type: "Long Text", required: false, options: "" },
];

// GET /api/settings/custom-fields
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "crm_custom_fields" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json(DEFAULT_CUSTOM_FIELDS);
}

// POST /api/settings/custom-fields
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (Array.isArray(body)) {
    await prisma.setting.upsert({
      where: { key: "crm_custom_fields" },
      update: { value: JSON.stringify(body) },
      create: { key: "crm_custom_fields", value: JSON.stringify(body) },
    });
  }

  return NextResponse.json({ success: true });
}
