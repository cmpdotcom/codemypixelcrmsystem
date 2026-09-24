import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_BATCH_SIZE = 2000;

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function optionalDate(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

// POST /api/leads/import - Insert a validated batch of leads in one database call.
export async function POST(request: NextRequest) {
  let body: { leads?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.leads) || body.leads.length === 0) {
    return NextResponse.json({ error: "A non-empty leads batch is required" }, { status: 400 });
  }
  if (body.leads.length > MAX_BATCH_SIZE) {
    return NextResponse.json({ error: `A batch cannot contain more than ${MAX_BATCH_SIZE} leads` }, { status: 400 });
  }

  const validLeads: {
    name: string;
    company: string;
    email: string;
    phone: string | null;
    location: string | null;
    linkedin: string | null;
    source: string;
    service: string | null;
    status: string;
    setter: string | null;
    budget: string | null;
    timeline: string | null;
    companySize: string | null;
    industry: string | null;
    nextFollowUp: Date | null;
    notes: string | null;
    customData?: object;
  }[] = [];

  for (const entry of body.leads) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const name = typeof row.name === "string" ? row.name.trim() : "";
    const company = typeof row.company === "string" ? row.company.trim() : "";
    const email = typeof row.email === "string" ? row.email.trim() : "";
    if (!name || !company || !/^\S+@\S+\.\S+$/.test(email)) continue;
    validLeads.push({
      name,
      company,
      email,
      phone: optionalString(row.phone),
      location: optionalString(row.location),
      linkedin: optionalString(row.linkedin),
      source: optionalString(row.source) || "Website",
      service: optionalString(row.service),
      status: optionalString(row.status) || "New",
      setter: optionalString(row.setter),
      budget: optionalString(row.budget),
      timeline: optionalString(row.timeline),
      companySize: optionalString(row.companySize),
      industry: optionalString(row.industry),
      nextFollowUp: optionalDate(row.nextFollowUp),
      notes: optionalString(row.notes),
      customData: row.customData && typeof row.customData === "object" ? row.customData as object : undefined,
    });
  }

  if (validLeads.length === 0) {
    return NextResponse.json({ inserted: 0, skipped: body.leads.length });
  }

  const result = await prisma.lead.createMany({ data: validLeads });
  return NextResponse.json({ inserted: result.count, skipped: body.leads.length - validLeads.length });
}
