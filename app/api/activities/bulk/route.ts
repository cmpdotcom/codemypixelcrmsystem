import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/activities/bulk — bulk delete or bulk status update
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: "ids array is required" }, { status: 400 });
  }

  if (body.action === "delete") {
    await prisma.activity.deleteMany({ where: { id: { in: body.ids } } });
    return NextResponse.json({ success: true, deleted: body.ids.length });
  }

  if (body.action === "status" && body.status) {
    await prisma.activity.updateMany({
      where: { id: { in: body.ids } },
      data: { status: body.status },
    });
    return NextResponse.json({ success: true, updated: body.ids.length });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
