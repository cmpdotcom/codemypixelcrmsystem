import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessDeal, findActiveUser, fullName, getActor, handleDealWon, notify, resolveUserIdByName } from "@/lib/workflow";

// GET /api/deals/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/deals/[id]">
) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      lead: true,
    },
  });

  if (!deal || !canAccessDeal(actor, deal)) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  return NextResponse.json(deal);
}

// PATCH /api/deals/[id] - update stage, value, priority, notes, etc.
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/deals/[id]">
) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await request.json();

  const existing = await prisma.deal.findUnique({ where: { id } });
  if (!existing || !canAccessDeal(actor, existing)) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};

  if (body.stage) {
    updateData.stage = body.stage;
    if (body.stage === "won") {
      updateData.closedAt = new Date();
      updateData.probability = 100;
    } else if (body.stage === "lost") {
      updateData.closedAt = new Date();
      updateData.probability = 0;
      if (body.lostReason) updateData.lostReason = body.lostReason;
    } else {
      updateData.closedAt = null;
    }
  }

  if (body.title) updateData.title = body.title.trim();
  if (body.company) updateData.company = body.company.trim();
  if (body.contact !== undefined) updateData.contact = body.contact;
  if (body.service !== undefined) updateData.service = body.service;
  if (body.value !== undefined) updateData.value = parseFloat(body.value);
  if (body.probability !== undefined) updateData.probability = parseInt(body.probability);
  if (body.priority !== undefined) updateData.priority = body.priority;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.expectedCloseDate !== undefined) {
    updateData.expectedCloseDate = body.expectedCloseDate ? new Date(body.expectedCloseDate) : null;
  }

  // Only managers can hand a deal to a different closer.
  if (actor.isManager && typeof body.closerId === "string" && body.closerId !== (existing.closerId || "")) {
    const user = body.closerId ? await findActiveUser(body.closerId) : null;
    if (body.closerId && !user) return NextResponse.json({ error: "Selected closer was not found" }, { status: 400 });
    updateData.closerId = user?.id || null;
    updateData.closer = user ? fullName(user) : null;
    updateData.closerImg = user?.image || null;
  } else if (actor.isManager && body.closerId === undefined && body.closer !== undefined && body.closer !== existing.closer) {
    updateData.closer = body.closer || null;
    updateData.closerId = await resolveUserIdByName(body.closer);
  }

  const deal = await prisma.deal.update({
    where: { id },
    data: updateData,
  });

  if (deal.leadId && updateData.closerId !== undefined) {
    await prisma.lead.update({
      where: { id: deal.leadId },
      data: { closerId: deal.closerId, closer: deal.closer, closerAssignedAt: new Date() },
    });
  }
  if (typeof updateData.closerId === "string" && updateData.closerId !== existing.closerId) {
    await notify([deal.closerId], {
      type: "closer_assigned",
      title: `Deal assigned to you: ${deal.company}`,
      body: `${actor.name} made you the closer for "${deal.title}".`,
      link: "/deals",
    }, actor.id);
  }

  if (deal.stage === "won" && existing.stage !== "won") {
    await handleDealWon(deal.id, actor);
  } else if (deal.stage === "lost" && existing.stage !== "lost" && deal.leadId) {
    await prisma.lead.update({ where: { id: deal.leadId }, data: { status: "Lost" } });
  }

  const fresh = await prisma.deal.findUnique({ where: { id } });
  return NextResponse.json(fresh);
}

// DELETE /api/deals/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/deals/[id]">
) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await prisma.deal.findUnique({ where: { id }, select: { closerId: true, closer: true } });
  if (!existing || !canAccessDeal(actor, existing)) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
