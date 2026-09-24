import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    where: { status: "Active", role: { name: { in: ["Setter", "Closer"] } } },
    select: { id: true, firstName: true, lastName: true, image: true, role: { select: { name: true } } },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });
  return NextResponse.json(users.map((user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    image: user.image,
    role: user.role?.name || "Unassigned",
  })));
}
