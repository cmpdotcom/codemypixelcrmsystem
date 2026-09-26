import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { fullName, isWorkflowManager, notify } from "@/lib/workflow";

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
  const session = await auth();
  const roleName = session?.user?.roleName;
  if (!roleName || !(isWorkflowManager(roleName, session.user.permissions) || roleName === "Marketing")) {
    return NextResponse.json({ error: "Only workspace managers and marketing can import leads" }, { status: 403 });
  }
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
    setterId?: string | null;
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

  // Imports can be retried after a network interruption. Avoid creating the same
  // email twice, including duplicate rows within the same uploaded file.
  const existing = await prisma.lead.findMany({
    where: { email: { in: validLeads.map((lead) => lead.email) } },
    select: { email: true },
  });
  const seenEmails = new Set(existing.map((lead) => lead.email.toLowerCase()));
  const newLeads = validLeads.filter((lead) => {
    const email = lead.email.toLowerCase();
    if (seenEmails.has(email)) return false;
    seenEmails.add(email);
    return true;
  });
  if (newLeads.length === 0) {
    return NextResponse.json({ inserted: 0, skipped: body.leads.length });
  }

  // Link CSV setter names to real users so the setter sees the leads in their own list.
  const users = await prisma.user.findMany({ select: { id: true, firstName: true, lastName: true } });
  const idsByName = new Map<string, string | null>();
  for (const user of users) {
    const key = fullName(user).toLowerCase();
    idsByName.set(key, idsByName.has(key) ? null : user.id);
  }
  const assignedCounts = new Map<string, number>();
  for (const lead of newLeads) {
    const setterId = lead.setter ? idsByName.get(lead.setter.toLowerCase()) || null : null;
    lead.setterId = setterId;
    if (setterId) assignedCounts.set(setterId, (assignedCounts.get(setterId) || 0) + 1);
  }

  const result = await prisma.lead.createMany({ data: newLeads });
  for (const [setterId, count] of assignedCounts) {
    await notify([setterId], {
      type: "lead_assigned",
      title: `${count} imported lead${count === 1 ? "" : "s"} assigned to you`,
      body: `${session.user.name || "A manager"} imported new leads for you to call.`,
      link: "/leads",
    }, session.user.id);
  }
  return NextResponse.json({ inserted: result.count, skipped: body.leads.length - result.count });
}
