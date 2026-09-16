import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/deals/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/deals/[id]">
) {
  const { id } = await ctx.params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      lead: true,
    },
  });

  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  return NextResponse.json(deal);
}

// PATCH /api/deals/[id] - update stage, value, priority, notes, etc.
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/deals/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

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
    }
  }

  if (body.title) updateData.title = body.title.trim();
  if (body.company) updateData.company = body.company.trim();
  if (body.contact !== undefined) updateData.contact = body.contact;
  if (body.service !== undefined) updateData.service = body.service;
  if (body.value !== undefined) updateData.value = parseFloat(body.value);
  if (body.probability !== undefined) updateData.probability = parseInt(body.probability);
  if (body.priority !== undefined) updateData.priority = body.priority;
  if (body.closer !== undefined) updateData.closer = body.closer;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.expectedCloseDate !== undefined) {
    updateData.expectedCloseDate = body.expectedCloseDate ? new Date(body.expectedCloseDate) : null;
  }

  const deal = await prisma.deal.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(deal);
}

// DELETE /api/deals/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/deals/[id]">
) {
  const { id } = await ctx.params;
  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
