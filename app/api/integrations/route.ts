import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/integrations - list integrations, filter by search/category/status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  if (category && category !== "All Categories") {
    where.category = category;
  }
  if (status && status !== "all" && status !== "All Statuses") {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  const [integrations, all] = await Promise.all([
    prisma.integration.findMany({ where, orderBy: { name: "asc" } }),
    prisma.integration.findMany({ select: { status: true, category: true } }),
  ]);

  const categories = Array.from(new Set(all.map((i) => i.category))).sort();

  return NextResponse.json({
    integrations,
    kpi: {
      total: all.length,
      connected: all.filter((i) => i.status === "Connected").length,
      available: all.filter((i) => i.status === "Not Connected").length,
      errors: all.filter((i) => i.status === "Error").length,
      categories: categories.length,
    },
    categories,
    categoryCounts: categories.reduce<Record<string, number>>((acc, c) => {
      acc[c] = all.filter((i) => i.category === c).length;
      return acc;
    }, {}),
  });
}

// POST /api/integrations - register a custom integration
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const key =
    body.key?.trim() ||
    body.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const existing = await prisma.integration.findUnique({ where: { key } });
  if (existing) {
    return NextResponse.json({ error: "Integration already exists" }, { status: 400 });
  }

  const integration = await prisma.integration.create({
    data: {
      key,
      name: body.name.trim(),
      description: body.description?.trim() || null,
      category: body.category || "Other",
      icon: body.icon || null,
      color: body.color || "blue",
      status: "Not Connected",
    },
  });

  return NextResponse.json(integration, { status: 201 });
}
