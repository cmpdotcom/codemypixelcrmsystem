import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/leads/bulk - Bulk actions (delete, updateStatus)
export async function POST(request: NextRequest) {
  const session = await auth();
  let body: { action?: unknown; ids?: unknown; status?: unknown; setter?: unknown; setterImg?: unknown };
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

  if (action === "delete") {
    const result = await prisma.lead.deleteMany({ where: { id: { in: leadIds } } });
    return NextResponse.json({ success: true, deleted: result.count });
  }

  if (action === "updateStatus" && typeof status === "string" && status.trim()) {
    const result = await prisma.lead.updateMany({
      where: { id: { in: leadIds } },
      data: { status: status.trim() },
    });
    return NextResponse.json({ success: true, updated: result.count });
  }

  if (action === "updateSetter" && typeof body.setter === "string" && body.setter.trim()) {
    if (!session?.user?.roleName || !["Super Admin", "Executive", "Sales Manager"].includes(session.user.roleName)) {
      return NextResponse.json({ error: "Only workspace managers can assign leads" }, { status: 403 });
    }
    const result = await prisma.lead.updateMany({
      where: { id: { in: leadIds } },
      data: { setter: body.setter.trim(), setterImg: typeof body.setterImg === "string" ? body.setterImg : null },
    });
    return NextResponse.json({ success: true, updated: result.count });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
