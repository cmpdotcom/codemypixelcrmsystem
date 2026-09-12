import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/leads - List leads with pagination, search, filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const setter = searchParams.get("setter") || "";

  const where: Record<string, unknown> = {};
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
  if (setter && setter !== "All Setters") {
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
  const body = await request.json();

  if (!body.name || !body.company || !body.email) {
    return NextResponse.json(
      { error: "Name, company, and email are required" },
      { status: 400 },
    );
  }

  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      company: body.company,
      email: body.email,
      phone: body.phone || null,
      location: body.location || null,
      linkedin: body.linkedin || null,
      source: body.source || "Website",
      service: body.service || null,
      status: body.status || "New",
      setter: body.setter || null,
      setterImg: body.setterImg || null,
      budget: body.budget || null,
      timeline: body.timeline || null,
      companySize: body.companySize || null,
      industry: body.industry || null,
      nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
