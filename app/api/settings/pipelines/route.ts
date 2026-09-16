import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_PIPELINES = [
  {
    id: "software-sales",
    name: "Software Sales",
    stages: [
      { name: "Qualified", color: "blue" },
      { name: "Discovery", color: "cyan" },
      { name: "Proposal", color: "amber" },
      { name: "Negotiation", color: "purple" },
      { name: "Contract Sent", color: "indigo" },
      { name: "Won", color: "green" },
    ],
  },
  {
    id: "website-sales",
    name: "Website Sales",
    stages: [
      { name: "Qualified", color: "blue" },
      { name: "Meeting", color: "cyan" },
      { name: "Quotation", color: "amber" },
      { name: "Negotiation", color: "purple" },
      { name: "Won", color: "green" },
    ],
  },
  {
    id: "erp-sales",
    name: "ERP Sales",
    stages: [
      { name: "Qualified", color: "blue" },
      { name: "Requirement Analysis", color: "cyan" },
      { name: "Demo", color: "amber" },
      { name: "Proposal", color: "purple" },
      { name: "Negotiation", color: "indigo" },
      { name: "Contract", color: "slate" },
      { name: "Won", color: "green" },
    ],
  },
];

// GET /api/settings/pipelines
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "crm_pipelines" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json(DEFAULT_PIPELINES);
}

// POST /api/settings/pipelines
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (Array.isArray(body)) {
    await prisma.setting.upsert({
      where: { key: "crm_pipelines" },
      update: { value: JSON.stringify(body) },
      create: { key: "crm_pipelines", value: JSON.stringify(body) },
    });
  }

  return NextResponse.json({ success: true });
}
