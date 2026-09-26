import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dealScope, findActiveUser, fullName, getActor, notify, resolveUserIdByName } from "@/lib/workflow";

// GET /api/deals - list deals, filter by search/stage/pipeline/closer, and return KPI statistics
export async function GET(request: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const scope = dealScope(actor);
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const stage = searchParams.get("stage");
  const pipeline = searchParams.get("pipeline");
  const closer = searchParams.get("closer");

  const where: Record<string, unknown> = { AND: [scope] };

  if (stage && stage !== "all") {
    where.stage = stage;
  }
  if (pipeline && pipeline !== "All Pipelines") {
    where.pipeline = pipeline;
  }
  if (closer && closer !== "All Closers" && actor.isManager) {
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
      where: scope,
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
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  if (!body.title || !body.company) {
    return NextResponse.json(
      { error: "Title and Company are required" },
      { status: 400 }
    );
  }

  // A closer creating a deal owns it; managers can pick any closer.
  let closerId: string | null = null;
  let closerName: string | null = body.closer?.trim() || null;
  let closerImg: string | null = body.closerImg || null;
  if (!actor.isManager && actor.roleName === "Closer") {
    closerId = actor.id;
    closerName = actor.name;
  } else if (typeof body.closerId === "string" && body.closerId) {
    const user = await findActiveUser(body.closerId);
    if (!user) return NextResponse.json({ error: "Selected closer was not found" }, { status: 400 });
    closerId = user.id;
    closerName = fullName(user);
    closerImg = user.image;
  } else if (closerName) {
    closerId = await resolveUserIdByName(closerName);
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
      closer: closerName,
      closerImg,
      closerId,
      leadId: body.leadId || null,
      expectedCloseDate: body.expectedCloseDate ? new Date(body.expectedCloseDate) : null,
      notes: body.notes?.trim() || null,
    },
  });

  await notify([closerId], {
    type: "closer_assigned",
    title: `Deal assigned to you: ${deal.company}`,
    body: `${actor.name} made you the closer for "${deal.title}".`,
    link: "/deals",
  }, actor.id);

  return NextResponse.json(deal, { status: 201 });
}
