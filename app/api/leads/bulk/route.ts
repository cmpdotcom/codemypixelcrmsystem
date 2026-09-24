import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/leads/bulk - Bulk actions (delete, updateStatus)
export async function POST(request: NextRequest) {
  let body: { action?: unknown; ids?: unknown; status?: unknown };
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

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
