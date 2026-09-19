import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/payments - list payments, filter by search/status/method/client, and return KPI statistics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const method = searchParams.get("method");
  const client = searchParams.get("client");

  const where: Record<string, unknown> = {};

  if (status && status !== "all" && status !== "All Statuses") {
    where.status = status;
  }
  if (method && method !== "All Methods") {
    where.method = method;
  }
  if (client && client !== "All Clients") {
    where.clientName = client;
  }
  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { label: { contains: search, mode: "insensitive" } },
      { clientName: { contains: search, mode: "insensitive" } },
      { dealTitle: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [payments, totalCount, allPayments] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { dueDate: "desc" },
      include: {
        deal: { select: { id: true, title: true, dealNumber: true, stage: true } },
        client: { select: { id: true, company: true, email: true } },
      },
    }),
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      select: { status: true, amount: true, dueDate: true, paidAt: true },
    }),
  ]);

  // Aggregate KPI stats from all payments
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const paid = allPayments.filter((p) => p.status === "Paid");
  const pending = allPayments.filter((p) => p.status === "Pending" || p.status === "Partial");
  const overdue = allPayments.filter(
    (p) => p.status === "Overdue" || ((p.status === "Pending" || p.status === "Partial") && new Date(p.dueDate) < now)
  );

  const totalCollected = paid.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pending.reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = overdue.reduce((sum, p) => sum + p.amount, 0);
  const collectedThisMonth = paid
    .filter((p) => p.paidAt && new Date(p.paidAt) >= monthStart)
    .reduce((sum, p) => sum + p.amount, 0);

  return NextResponse.json({
    payments,
    totalCount,
    kpi: {
      totalPayments: allPayments.length,
      totalCollected,
      collectedThisMonth,
      pendingCount: pending.length,
      pendingAmount,
      overdueCount: overdue.length,
      overdueAmount,
      paidCount: paid.length,
    },
    statusCounts: {
      All: allPayments.length,
      Paid: paid.length,
      Pending: allPayments.filter((p) => p.status === "Pending").length,
      Partial: allPayments.filter((p) => p.status === "Partial").length,
      Overdue: overdue.length,
      Refunded: allPayments.filter((p) => p.status === "Refunded").length,
    },
  });
}

// POST /api/payments - record a new payment / invoice
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.label || !body.clientName) {
    return NextResponse.json(
      { error: "Label and Client Name are required" },
      { status: 400 }
    );
  }

  const count = await prisma.payment.count();
  const status = body.status || "Pending";

  const payment = await prisma.payment.create({
    data: {
      invoiceNumber: body.invoiceNumber?.trim() || `INV-2026-${String(count + 1).padStart(3, "0")}`,
      label: body.label.trim(),
      description: body.description?.trim() || null,
      clientName: body.clientName.trim(),
      dealTitle: body.dealTitle?.trim() || null,
      amount: parseFloat(body.amount) || 0,
      status,
      method: body.method || "Bank Transfer",
      dueDate: body.dueDate ? new Date(body.dueDate) : new Date(),
      paidAt: status === "Paid" ? (body.paidAt ? new Date(body.paidAt) : new Date()) : null,
      notes: body.notes?.trim() || null,
      dealId: body.dealId || null,
      clientId: body.clientId || null,
    },
  });

  return NextResponse.json(payment, { status: 201 });
}
