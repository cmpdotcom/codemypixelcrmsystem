import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/deals - list deals, filter by search/stage/pipeline/closer, and return KPI statistics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const stage = searchParams.get("stage");
  const pipeline = searchParams.get("pipeline");
  const closer = searchParams.get("closer");

  const where: Record<string, unknown> = {};

  if (stage && stage !== "all") {
    where.stage = stage;
  }
  if (pipeline && pipeline !== "All Pipelines") {
    where.pipeline = pipeline;
  }
  if (closer && closer !== "All Closers") {
    where.closer = closer;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { contact: { contains: search, mode: "insensitive" } },
      { service: { contains: search, mode: "insensitive" } },
    ];
  }

  const [deals, totalCount, allDeals] = await Promise.all([
    prisma.deal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        lead: {
          select: { id: true, name: true, company: true, email: true },
        },
      },
    }),
    prisma.deal.count({ where }),
    prisma.deal.findMany({
      select: { stage: true, value: true },
    }),
  ]);

  // Aggregate KPI stats from all deals
  const totalDeals = allDeals.length;
  const wonDeals = allDeals.filter((d) => d.stage === "won");
  const lostDeals = allDeals.filter((d) => d.stage === "lost");
  const activeDeals = allDeals.filter((d) => d.stage !== "won" && d.stage !== "lost");

  const pipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const closedCount = wonDeals.length + lostDeals.length;
  const winRate = closedCount > 0 ? ((wonDeals.length / closedCount) * 100).toFixed(1) : "0.0";

  return NextResponse.json({
    deals,
    totalCount,
    kpi: {
      totalDeals,
      pipelineValue,
      wonDealsCount: wonDeals.length,
      wonValue,
      lostDealsCount: lostDeals.length,
      winRate: `${winRate}%`,
    },
  });
}

// POST /api/deals - create a new deal
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.company) {
    return NextResponse.json(
      { error: "Title and Company are required" },
      { status: 400 }
    );
  }

  const deal = await prisma.deal.create({
    data: {
      title: body.title.trim(),
      company: body.company.trim(),
      contact: body.contact?.trim() || null,
      service: body.service?.trim() || "Custom Software",
      value: parseFloat(body.value) || 0,
      stage: body.stage || "qualified",
      pipeline: body.pipeline || "Software Sales",
      probability: parseInt(body.probability) || 20,
      priority: body.priority || "Medium",
      closer: body.closer?.trim() || null,
      closerImg: body.closerImg || null,
      leadId: body.leadId || null,
      expectedCloseDate: body.expectedCloseDate ? new Date(body.expectedCloseDate) : null,
      notes: body.notes?.trim() || null,
    },
  });

  return NextResponse.json(deal, { status: 201 });
}
