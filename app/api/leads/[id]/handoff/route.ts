import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessLead, getActor, getManagerIds, notify } from "@/lib/workflow";

// POST /api/leads/[id]/handoff - the setter marks the lead interested and hands it to the executives
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/handoff">,
) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({})) as { note?: unknown; meetingAt?: unknown };

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead || !canAccessLead(actor, lead)) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  if (lead.closerId) {
    return NextResponse.json({ error: "This lead is already with a closer" }, { status: 409 });
  }

  const note = typeof body.note === "string" ? body.note.trim().slice(0, 1000) : "";
  const meetingAt = typeof body.meetingAt === "string" && body.meetingAt ? new Date(body.meetingAt) : null;
  if (meetingAt && Number.isNaN(meetingAt.getTime())) {
    return NextResponse.json({ error: "Invalid meeting date" }, { status: 400 });
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      status: "Meeting",
      interestedAt: new Date(),
      interestedNote: note || null,
      lastContact: new Date(),
      ...(meetingAt && { nextFollowUp: meetingAt }),
    },
  });

  await prisma.activity.create({
    data: {
      type: "Note",
      direction: "Internal",
      title: "Interested — meeting requested",
      description: note || "Setter marked this lead as interested and ready for a closer.",
      company: lead.company,
      contact: lead.name,
      leadId: lead.id,
      performedBy: actor.name,
      status: "Completed",
    },
  });

  await notify(await getManagerIds(), {
    type: "lead_interested",
    title: `Interested lead: ${lead.name} (${lead.company})`,
    body: `${actor.name} booked interest${meetingAt ? ` for ${meetingAt.toLocaleString("en-US")}` : ""}. Assign a closer.`,
    link: "/workflow",
  }, actor.id);

  return NextResponse.json(updated);
}

// DELETE /api/leads/[id]/handoff - send the lead back to the setter before a closer takes it
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/handoff">,
) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead || !canAccessLead(actor, lead)) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  if (lead.closerId) {
    return NextResponse.json({ error: "A closer already has this lead" }, { status: 409 });
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: { interestedAt: null, interestedNote: null, status: "Qualified" },
  });

  if (actor.isManager) {
    await notify([lead.setterId], {
      type: "lead_returned",
      title: `Lead returned: ${lead.name}`,
      body: `${actor.name} sent this lead back to you for more qualification.`,
      link: `/leads?lead=${lead.id}`,
    }, actor.id);
  }

  return NextResponse.json(updated);
}
