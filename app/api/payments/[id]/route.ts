import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/payments/[id]
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/payments/[id]">
) {
  const { id } = await ctx.params;
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      deal: true,
      client: true,
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}

// PATCH /api/payments/[id] - update status, mark paid, edit details
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/payments/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  if (body.status) {
    updateData.status = body.status;
    if (body.status === "Paid" && !body.paidAt) {
      updateData.paidAt = new Date();
    } else if (body.status === "Pending" || body.status === "Overdue") {
      updateData.paidAt = null;
    }
  }

  if (body.paidAt !== undefined) {
    updateData.paidAt = body.paidAt ? new Date(body.paidAt) : null;
  }
  if (body.label) updateData.label = body.label.trim();
  if (body.clientName) updateData.clientName = body.clientName.trim();
  if (body.dealTitle !== undefined) updateData.dealTitle = body.dealTitle;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
  if (body.method !== undefined) updateData.method = body.method;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.dueDate !== undefined) {
    updateData.dueDate = body.dueDate ? new Date(body.dueDate) : new Date();
  }
  if (body.dealId !== undefined) updateData.dealId = body.dealId || null;
  if (body.clientId !== undefined) updateData.clientId = body.clientId || null;

  const payment = await prisma.payment.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(payment);
}

// DELETE /api/payments/[id]
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/payments/[id]">
) {
  const { id } = await ctx.params;
  await prisma.payment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
