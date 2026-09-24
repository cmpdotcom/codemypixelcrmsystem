import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/leads - List leads with pagination, search, filters
export async function GET(request: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const requestedPageSize = parseInt(searchParams.get("pageSize") || "50", 10) || 50;
  const pageSize = Math.min(500, Math.max(50, requestedPageSize));
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const setter = searchParams.get("setter") || "";

  const where: Record<string, unknown> = {};
  if (session?.user?.roleName === "Setter") {
    where.setter = session.user.name || "";
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }
  if (status && status !== "All Leads") {
    where.status = status;
  }
  if (source && source !== "All Sources") {
    where.source = source;
  }
  if (setter && setter !== "All Setters" && session?.user?.roleName !== "Setter") {
    where.setter = setter;
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  // Compute KPI stats
  const allLeads = await prisma.lead.findMany({ select: { status: true } });
  const stats = {
    total: allLeads.length,
    new: allLeads.filter((l) => l.status === "New").length,
    contacted: allLeads.filter((l) => l.status === "Contacted").length,
    qualified: allLeads.filter((l) => l.status === "Qualified").length,
    notInterested: allLeads.filter((l) => l.status === "Not Interested").length,
    lost: allLeads.filter((l) => l.status === "Lost").length,
    nurture: allLeads.filter((l) => l.status === "Nurture").length,
    meeting: allLeads.filter((l) => l.status === "Meeting").length,
    proposal: allLeads.filter((l) => l.status === "Proposal").length,
    converted: allLeads.filter((l) => l.status === "Converted").length,
  };

  return NextResponse.json({
    leads,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    stats,
  });
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!name || !company || !email) {
    return NextResponse.json(
      { error: "Name, company, and email are required" },
      { status: 400 },
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const optionalString = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : null;
  const optionalDate = (value: unknown) => {
    if (!value) return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const lead = await prisma.lead.create({
    data: {
      name,
      company,
      email,
      phone: optionalString(body.phone),
      location: optionalString(body.location),
      linkedin: optionalString(body.linkedin),
      source: optionalString(body.source) || "Website",
      service: optionalString(body.service),
      status: optionalString(body.status) || "New",
      setter: optionalString(body.setter),
      setterImg: optionalString(body.setterImg),
      budget: optionalString(body.budget),
      timeline: optionalString(body.timeline),
      companySize: optionalString(body.companySize),
      industry: optionalString(body.industry),
      nextFollowUp: optionalDate(body.nextFollowUp),
      notes: optionalString(body.notes),
      customData: body.customData && typeof body.customData === "object" ? body.customData as object : undefined,
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
