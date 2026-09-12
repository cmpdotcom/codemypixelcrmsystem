import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/leads/bulk - Bulk actions (delete, updateStatus)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ids, status } = body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "No leads selected" },
      { status: 400 },
    );
  }

  if (action === "delete") {
    await prisma.lead.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true, deleted: ids.length });
  }

  if (action === "updateStatus" && status) {
    await prisma.lead.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
    return NextResponse.json({ success: true, updated: ids.length });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
