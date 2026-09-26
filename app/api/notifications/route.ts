import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActor } from "@/lib/workflow";

// GET /api/notifications - the signed-in user's latest notifications
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [notifications, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: actor.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.notification.count({ where: { userId: actor.id, readAt: null } }),
  ]);
  return NextResponse.json({ notifications, unread });
}

// PATCH /api/notifications - mark some ({ ids }) or all ({ all: true }) as read
export async function PATCH(request: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { ids?: unknown; all?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === "string") : [];
  if (body.all !== true && ids.length === 0) {
    return NextResponse.json({ error: "Nothing to mark as read" }, { status: 400 });
  }
  const result = await prisma.notification.updateMany({
    where: { userId: actor.id, readAt: null, ...(body.all === true ? {} : { id: { in: ids } }) },
    data: { readAt: new Date() },
  });
  return NextResponse.json({ updated: result.count });
}
