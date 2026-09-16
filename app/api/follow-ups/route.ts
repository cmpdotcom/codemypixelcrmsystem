import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/follow-ups - paginated list, tab filtering, search, and KPI calculations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const tab = searchParams.get("tab") || "All";
  const type = searchParams.get("type");
  const assignee = searchParams.get("assignee");
  const priority = searchParams.get("priority");

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const where: Record<string, unknown> = {};

  if (tab === "Today") {
    where.dueDate = { gte: startOfToday, lte: endOfToday };
  } else if (tab === "Upcoming") {
    where.dueDate = { gt: endOfToday };
    where.completed = false;
  } else if (tab === "Overdue") {
    where.dueDate = { lt: startOfToday };
    where.completed = false;
  } else if (tab === "Completed") {
    where.completed = true;
  }

  if (type && type !== "All Types") {
    where.type = type;
  }
  if (assignee && assignee !== "All Assignees") {
    where.assigneeName = assignee;
  }
  if (priority && priority !== "All Priorities") {
    where.priority = priority;
  }
  if (search) {
    where.OR = [
      { subjectTitle: { contains: search, mode: "insensitive" } },
      { subjectDesc: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { contact: { contains: search, mode: "insensitive" } },
      { assigneeName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [followUps, totalFiltered, allFollowUps] = await Promise.all([
    prisma.followUp.findMany({
      where,
      orderBy: { dueDate: "asc" },
      include: {
        lead: { select: { id: true, name: true, company: true } },
        client: { select: { id: true, company: true } },
      },
    }),
    prisma.followUp.count({ where }),
    prisma.followUp.findMany({
      select: { dueDate: true, completed: true, status: true },
    }),
  ]);

  // Aggregate KPI stats from all followups
  const totalFollowUps = allFollowUps.length;
  const dueToday = allFollowUps.filter(
    (f) => !f.completed && new Date(f.dueDate) >= startOfToday && new Date(f.dueDate) <= endOfToday
  ).length;
  const upcoming = allFollowUps.filter(
    (f) => !f.completed && new Date(f.dueDate) > endOfToday
  ).length;
  const overdue = allFollowUps.filter(
    (f) => !f.completed && new Date(f.dueDate) < startOfToday
  ).length;
  const completed = allFollowUps.filter((f) => f.completed).length;

  return NextResponse.json({
    followUps,
    totalCount: totalFiltered,
    kpi: {
      totalFollowUps,
      dueToday,
      upcoming,
      overdue,
      completed,
    },
    tabCounts: {
      All: totalFollowUps,
      Today: dueToday,
      Upcoming: upcoming,
      Overdue: overdue,
      Completed: completed,
    },
  });
}

// POST /api/follow-ups - create a new follow-up
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.subjectTitle || !body.company) {
    return NextResponse.json(
      { error: "Subject title and company are required" },
      { status: 400 }
    );
  }

  const dueDate = body.dueDate ? new Date(body.dueDate) : new Date();

  const followUp = await prisma.followUp.create({
    data: {
      subjectTitle: body.subjectTitle.trim(),
      subjectDesc: body.subjectDesc?.trim() || null,
      company: body.company.trim(),
      contact: body.contact?.trim() || null,
      relatedRef: body.relatedRef?.trim() || null,
      type: body.type || "Call",
      assigneeName: body.assigneeName || "Ali Khan",
      dueDate,
      dueTime: body.dueTime || "11:00 AM",
      status: body.status || "Upcoming",
      priority: body.priority || "Medium",
      notes: body.notes?.trim() || null,
    },
  });

  return NextResponse.json(followUp, { status: 201 });
}
