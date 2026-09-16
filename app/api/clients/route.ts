import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clients - paginated list, search, status/industry filters, and KPI calculation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const industry = searchParams.get("industry");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const where: Record<string, unknown> = {};

  if (status && status !== "All Statuses") {
    where.status = status;
  }
  if (industry && industry !== "All Industries") {
    where.industry = industry;
  }
  if (search) {
    where.OR = [
      { company: { contains: search, mode: "insensitive" } },
      { contactName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  const [clients, totalCount, allClients] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        deals: {
          select: { id: true, title: true, value: true, stage: true },
        },
      },
    }),
    prisma.client.count({ where }),
    prisma.client.findMany({
      select: { status: true, revenue: true, outstanding: true },
    }),
  ]);

  // Aggregate KPI stats across all clients
  const totalClients = allClients.length;
  const activeClients = allClients.filter((c) => c.status === "Active").length;
  const totalRevenue = allClients.reduce((sum, c) => sum + c.revenue, 0);
  const pendingPayments = allClients.reduce((sum, c) => sum + c.outstanding, 0);

  return NextResponse.json({
    clients,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    kpi: {
      totalClients,
      activeClients,
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      pendingPayments: `$${pendingPayments.toLocaleString()}`,
    },
  });
}

// POST /api/clients - create a new client
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.company || !body.email) {
    return NextResponse.json(
      { error: "Company name and email are required" },
      { status: 400 }
    );
  }

  const client = await prisma.client.create({
    data: {
      company: body.company.trim(),
      tagline: body.tagline?.trim() || null,
      location: body.location?.trim() || "Global",
      address: body.address?.trim() || null,
      website: body.website?.trim() || null,
      email: body.email.trim(),
      phone: body.phone?.trim() || null,
      industry: body.industry || "Technology",
      companySize: body.companySize || "50–200 employees",
      status: body.status || "Active",
      contactName: body.contactName?.trim() || null,
      contactRole: body.contactRole?.trim() || "Contact",
      contactEmail: body.contactEmail?.trim() || null,
      contactPhone: body.contactPhone?.trim() || null,
      revenue: parseFloat(body.revenue) || 0,
      outstanding: parseFloat(body.outstanding) || 0,
      projectsCount: parseInt(body.projectsCount) || 0,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
