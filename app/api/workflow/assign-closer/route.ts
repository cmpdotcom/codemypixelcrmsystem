import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findActiveUser, fullName, getActor, notify, parseBudget } from "@/lib/workflow";

// POST /api/workflow/assign-closer - hand an interested lead to a closer; this opens (or reassigns) its deal
export async function POST(request: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!actor.isManager) {
    return NextResponse.json({ error: "Only executives and managers can assign closers" }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const leadId = typeof body?.leadId === "string" ? body.leadId : "";
  const closerId = typeof body?.closerId === "string" ? body.closerId : "";
  if (!leadId || !closerId) {
    return NextResponse.json({ error: "Choose a lead and a closer" }, { status: 400 });
  }

  const [lead, closer] = await Promise.all([
    prisma.lead.findUnique({ where: { id: leadId } }),
    findActiveUser(closerId),
  ]);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  if (!closer) return NextResponse.json({ error: "Selected closer is not an active user" }, { status: 400 });

  const closerName = fullName(closer);
  const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);
  const expectedCloseDate = text(body?.expectedCloseDate) ? new Date(String(body?.expectedCloseDate)) : null;
  if (expectedCloseDate && Number.isNaN(expectedCloseDate.getTime())) {
    return NextResponse.json({ error: "Invalid expected close date" }, { status: 400 });
  }
  const value = body?.value !== undefined && body.value !== "" ? parseFloat(String(body.value)) : parseBudget(lead.budget);

  const openDeal = await prisma.deal.findFirst({
    where: { leadId: lead.id, stage: { notIn: ["won", "lost"] } },
    orderBy: { createdAt: "desc" },
  });

  const [, deal] = await prisma.$transaction([
    prisma.lead.update({
      where: { id: lead.id },
      data: {
        closerId: closer.id,
        closer: closerName,
        closerAssignedAt: new Date(),
        interestedAt: lead.interestedAt || new Date(),
        status: "Meeting",
      },
    }),
    openDeal
      ? prisma.deal.update({
          where: { id: openDeal.id },
          data: { closerId: closer.id, closer: closerName, closerImg: closer.image },
        })
      : prisma.deal.create({
          data: {
            title: text(body?.title) || `${lead.company} — ${lead.service || "New project"}`,
            company: lead.company,
            contact: lead.name,
            service: lead.service || "Custom Software",
            value: Number.isFinite(value) ? value : 0,
            stage: "discovery",
            probability: 40,
            priority: text(body?.priority) || "Medium",
            closer: closerName,
            closerImg: closer.image,
            closerId: closer.id,
            leadId: lead.id,
            expectedCloseDate,
            notes: text(body?.notes) || lead.interestedNote,
          },
        }),
    prisma.activity.create({
      data: {
        type: "Note",
        direction: "Internal",
        title: `Assigned to closer ${closerName}`,
        description: text(body?.notes) || `Meeting hand-off from ${lead.setter || "setter"}.`,
        company: lead.company,
        contact: lead.name,
        leadId: lead.id,
        performedBy: actor.name,
        status: "Completed",
      },
    }),
  ]);

  await notify([closer.id], {
    type: "closer_assigned",
    title: `New meeting: ${lead.name} (${lead.company})`,
    body: `${actor.name} assigned you this interested lead.${lead.interestedNote ? ` Setter note: ${lead.interestedNote}` : ""}`,
    link: "/deals",
  }, actor.id);
  await notify([lead.setterId], {
    type: "lead_handed_off",
    title: `${lead.name} is now with ${closerName}`,
    body: "Your interested lead was handed to a closer.",
    link: `/leads?lead=${lead.id}`,
  }, actor.id);

  return NextResponse.json({ deal, reassigned: !!openDeal });
}
