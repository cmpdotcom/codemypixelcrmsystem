import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/commissions/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/commissions/[id]">
) {
  const { id } = await ctx.params;
  const commission = await prisma.commission.findUnique({
    where: { id },
    include: { deal: true, payment: true },
  });

  if (!commission) {
    return NextResponse.json({ error: "Commission not found" }, { status: 404 });
  }

  return NextResponse.json(commission);
}

// PATCH /api/commissions/[id] - approve, mark paid, hold, or edit details
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/commissions/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.status) {
    updateData.status = body.status;
    if (body.status === "Paid" && !body.paidAt) {
      updateData.paidAt = new Date();
    } else if (body.status === "Pending" || body.status === "On Hold") {
      updateData.paidAt = null;
    }
  }

  if (body.paidAt !== undefined) {
    updateData.paidAt = body.paidAt ? new Date(body.paidAt) : null;
  }
  if (body.memberName) updateData.memberName = body.memberName.trim();
  if (body.memberRole !== undefined) updateData.memberRole = body.memberRole;
  if (body.dealTitle !== undefined) updateData.dealTitle = body.dealTitle;
  if (body.clientName !== undefined) updateData.clientName = body.clientName;
  if (body.basis !== undefined) updateData.basis = body.basis;
  if (body.rate !== undefined) updateData.rate = parseFloat(body.rate);
  if (body.dealValue !== undefined) updateData.dealValue = parseFloat(body.dealValue);
  if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
  if (body.period !== undefined) updateData.period = body.period;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.earnedAt !== undefined) {
    updateData.earnedAt = body.earnedAt ? new Date(body.earnedAt) : new Date();
  }
  if (body.dealId !== undefined) updateData.dealId = body.dealId || null;
  if (body.paymentId !== undefined) updateData.paymentId = body.paymentId || null;

  const commission = await prisma.commission.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(commission);
}

// DELETE /api/commissions/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/commissions/[id]">
) {
  const { id } = await ctx.params;
  await prisma.commission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
