import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findActiveUser, fullName, getActor, leadScope, notify, resolveUserIdByName } from "@/lib/workflow";

// POST /api/leads/bulk - Bulk actions (delete, updateStatus, updateSetter)
export async function POST(request: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { action?: unknown; ids?: unknown; status?: unknown; setter?: unknown; setterId?: unknown; setterImg?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { action, ids, status } = body;
  const leadIds = Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string" && id.length > 0) : [];

  if (leadIds.length === 0) {
    return NextResponse.json(
      { error: "No leads selected" },
      { status: 400 },
    );
  }

  // Non-managers can only act on the leads they can see.
  const where = { AND: [{ id: { in: leadIds } }, leadScope(actor)] };

  if (action === "delete") {
    const result = await prisma.lead.deleteMany({ where });
    return NextResponse.json({ success: true, deleted: result.count });
  }

  if (action === "updateStatus" && typeof status === "string" && status.trim()) {
    const result = await prisma.lead.updateMany({
      where,
      data: { status: status.trim() },
    });
    return NextResponse.json({ success: true, updated: result.count });
  }

  if (action === "updateSetter") {
    if (!actor.isManager) {
      return NextResponse.json({ error: "Only workspace managers can assign leads" }, { status: 403 });
    }
    let setterId: string | null = null;
    let setterName = "";
    let setterImg: string | null = null;
    if (typeof body.setterId === "string" && body.setterId) {
      const user = await findActiveUser(body.setterId);
      if (!user) return NextResponse.json({ error: "Selected setter was not found" }, { status: 400 });
      setterId = user.id;
      setterName = fullName(user);
      setterImg = user.image;
    } else if (typeof body.setter === "string" && body.setter.trim()) {
      setterName = body.setter.trim();
      setterId = await resolveUserIdByName(setterName);
      setterImg = typeof body.setterImg === "string" ? body.setterImg : null;
    } else {
      return NextResponse.json({ error: "Choose a setter" }, { status: 400 });
    }

    const result = await prisma.lead.updateMany({
      where,
      data: { setter: setterName, setterId, setterImg },
    });
    await notify([setterId], {
      type: "lead_assigned",
      title: `${result.count} lead${result.count === 1 ? "" : "s"} assigned to you`,
      body: `${actor.name} assigned you new leads to call.`,
      link: "/leads",
    }, actor.id);
    return NextResponse.json({ success: true, updated: result.count });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
