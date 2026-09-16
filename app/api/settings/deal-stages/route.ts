import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_STAGES: Record<
  string,
  { name: string; probability: string; color: string; requiredFields: string; expectedDuration: string }[]
> = {
  "Software Sales": [
    { name: "Qualified", probability: "10%", color: "blue", requiredFields: "None", expectedDuration: "1 day" },
    { name: "Discovery", probability: "25%", color: "cyan", requiredFields: "Discovery Date", expectedDuration: "3 days" },
    { name: "Proposal", probability: "50%", color: "amber", requiredFields: "Proposal Amount", expectedDuration: "5 days" },
    { name: "Negotiation", probability: "70%", color: "purple", requiredFields: "Negotiation Notes", expectedDuration: "7 days" },
    { name: "Contract Sent", probability: "85%", color: "indigo", requiredFields: "Contract Document", expectedDuration: "3 days" },
    { name: "Won", probability: "100%", color: "green", requiredFields: "Closed Date, Won Reason", expectedDuration: "—" },
  ],
  "Website Sales": [
    { name: "Qualified", probability: "10%", color: "blue", requiredFields: "None", expectedDuration: "1 day" },
    { name: "Meeting", probability: "25%", color: "cyan", requiredFields: "Meeting Date", expectedDuration: "2 days" },
    { name: "Quotation", probability: "50%", color: "amber", requiredFields: "Quotation Amount", expectedDuration: "3 days" },
    { name: "Negotiation", probability: "70%", color: "purple", requiredFields: "Negotiation Notes", expectedDuration: "5 days" },
    { name: "Won", probability: "100%", color: "green", requiredFields: "Closed Date, Won Reason", expectedDuration: "—" },
  ],
  "ERP Sales": [
    { name: "Qualified", probability: "10%", color: "blue", requiredFields: "None", expectedDuration: "1 day" },
    { name: "Requirement Analysis", probability: "20%", color: "cyan", requiredFields: "Requirements Document", expectedDuration: "7 days" },
    { name: "Demo", probability: "35%", color: "amber", requiredFields: "Demo Date", expectedDuration: "5 days" },
    { name: "Proposal", probability: "55%", color: "purple", requiredFields: "Proposal Amount", expectedDuration: "7 days" },
    { name: "Negotiation", probability: "75%", color: "indigo", requiredFields: "Negotiation Notes", expectedDuration: "10 days" },
    { name: "Contract", probability: "90%", color: "slate", requiredFields: "Contract Document", expectedDuration: "5 days" },
    { name: "Won", probability: "100%", color: "green", requiredFields: "Closed Date, Won Reason", expectedDuration: "—" },
  ],
};

// GET /api/settings/deal-stages
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "deal_stages_map" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json(DEFAULT_STAGES);
}

// POST /api/settings/deal-stages
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body && typeof body === "object") {
    await prisma.setting.upsert({
      where: { key: "deal_stages_map" },
      update: { value: JSON.stringify(body) },
      create: { key: "deal_stages_map", value: JSON.stringify(body) },
    });
  }

  return NextResponse.json({ success: true });
}
