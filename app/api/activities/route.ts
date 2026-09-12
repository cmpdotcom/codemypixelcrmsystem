import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/activities — paginated list with search, type filter, status filter, KPI stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || ""; // "" = all, or Call/Email/WhatsApp/Meeting/Note/Task/SMS/Other
  const status = searchParams.get("status") || "";
  const performedBy = searchParams.get("performedBy") || "";
  const leadId = searchParams.get("leadId") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const statsOnly = searchParams.get("stats") === "true";
  const todayOnly = searchParams.get("today") === "true";

  // KPI stats endpoint
  if (statsOnly) {
    const [total, calls, emails, whatsapp, meetings, notes] = await Promise.all([
      prisma.activity.count(),
      prisma.activity.count({ where: { type: "Call" } }),
      prisma.activity.count({ where: { type: "Email" } }),
      prisma.activity.count({ where: { type: "WhatsApp" } }),
      prisma.activity.count({ where: { type: "Meeting" } }),
      prisma.activity.count({ where: { type: "Note" } }),
    ]);
    return NextResponse.json({ total, calls, emails, whatsapp, meetings, notes });
  }

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (performedBy) where.performedBy = performedBy;
  if (leadId) where.leadId = leadId;
  if (todayOnly) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    where.createdAt = { gte: start, lte: end };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { contact: { contains: search, mode: "insensitive" } },
    ];
  }

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.activity.count({ where }),
  ]);

  return NextResponse.json({
    activities,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

// POST /api/activities — create a new activity
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const activity = await prisma.activity.create({
    data: {
      type: body.type || "Note",
      direction: body.direction || null,
      title: body.title,
      description: body.description || null,
      company: body.company || null,
      contact: body.contact || null,
      leadId: body.leadId || null,
      performedBy: body.performedBy || null,
      status: body.status || "Completed",
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
  });

  return NextResponse.json(activity, { status: 201 });
}
