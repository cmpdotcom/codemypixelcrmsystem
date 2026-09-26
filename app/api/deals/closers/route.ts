import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PICKER_ROLES, fullName, getActor } from "@/lib/workflow";

// GET /api/deals/closers - active users who can be assigned as a deal's closer
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await prisma.user.findMany({
    where: { status: "Active", role: { name: { in: [...PICKER_ROLES.Closer] } } },
    select: { id: true, firstName: true, lastName: true, image: true },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });
  return NextResponse.json({
    canAssign: actor.isManager,
    closers: users.map((user) => ({ id: user.id, name: fullName(user), image: user.image })),
  });
}
