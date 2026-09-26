import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActor, leadScope, resolveUserIdByName, findActiveUser, fullName, notify } from "@/lib/workflow";

// GET /api/leads - List leads with pagination, search, filters
export async function GET(request: NextRequest) {
  try {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const requestedPageSize = parseInt(searchParams.get("pageSize") || "50", 10) || 50;
  const pageSize = Math.min(500, Math.max(50, requestedPageSize));
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const setter = searchParams.get("setter") || "";

  const scope = leadScope(actor);
  const where: Record<string, unknown> = { AND: [scope] };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }
  if (status && status !== "All Leads") {
    where.status = status;
  }
  if (source && source !== "All Sources") {
    where.source = source;
  }
  if (setter && setter !== "All Setters" && actor.isManager) {
    where.setter = setter;
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  // Compute KPI stats in the database instead of loading every lead into memory.
  const groupedStatuses = await prisma.lead.groupBy({ by: ["status"], where: scope, _count: { id: true } });
  const statusCounts = Object.fromEntries(groupedStatuses.map((item) => [item.status, item._count.id]));
  const stats = {
    total: Object.values(statusCounts).reduce((sum, count) => sum + count, 0),
    new: statusCounts.New || 0,
    contacted: statusCounts.Contacted || 0,
    qualified: statusCounts.Qualified || 0,
    notInterested: statusCounts["Not Interested"] || 0,
    lost: statusCounts.Lost || 0,
    nurture: statusCounts.Nurture || 0,
    meeting: statusCounts.Meeting || 0,
    proposal: statusCounts.Proposal || 0,
    converted: statusCounts.Converted || 0,
  };

  return NextResponse.json({
    leads,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    stats,
  });
  } catch (error) {
    console.error("GET /api/leads failed", error);
    return NextResponse.json({ error: "Unable to load leads right now. Please retry." }, { status: 503 });
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!name || !company || !email) {
    return NextResponse.json(
      { error: "Name, company, and email are required" },
      { status: 400 },
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const optionalString = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : null;
  const optionalDate = (value: unknown) => {
    if (!value) return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  };

  // Managers pick the setter; a setter creating a lead owns it.
  let setterId: string | null = null;
  let setterName = optionalString(body.setter);
  let setterImg = optionalString(body.setterImg);
  if (actor.roleName === "Setter" && !actor.isManager) {
    setterId = actor.id;
    setterName = actor.name;
  } else if (typeof body.setterId === "string" && body.setterId) {
    const user = await findActiveUser(body.setterId);
    if (!user) return NextResponse.json({ error: "Selected setter was not found" }, { status: 400 });
    setterId = user.id;
    setterName = fullName(user);
    setterImg = user.image;
  } else if (setterName) {
    setterId = await resolveUserIdByName(setterName);
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      company,
      email,
      phone: optionalString(body.phone),
      location: optionalString(body.location),
      linkedin: optionalString(body.linkedin),
      source: optionalString(body.source) || "Website",
      service: optionalString(body.service),
      status: optionalString(body.status) || "New",
      setter: setterName,
      setterImg,
      setterId,
      budget: optionalString(body.budget),
      timeline: optionalString(body.timeline),
      companySize: optionalString(body.companySize),
      industry: optionalString(body.industry),
      nextFollowUp: optionalDate(body.nextFollowUp),
      notes: optionalString(body.notes),
      customData: body.customData && typeof body.customData === "object" ? body.customData as object : undefined,
    },
  });

  await notify([setterId], {
    type: "lead_assigned",
    title: `New lead assigned: ${lead.name}`,
    body: `${lead.company} was assigned to you by ${actor.name}.`,
    link: `/leads?lead=${lead.id}`,
  }, actor.id);

  return NextResponse.json(lead, { status: 201 });
}
