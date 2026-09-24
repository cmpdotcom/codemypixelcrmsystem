import { prisma } from "@/lib/prisma";

export const INVITABLE_ROLES = ["Executive", "Setter", "Closer", "Developer", "Tester"] as const;
export type InvitableRole = (typeof INVITABLE_ROLES)[number];

const ROLE_DEFAULTS: Record<InvitableRole, { color: string; description: string }> = {
  Executive: { color: "purple", description: "Business leadership and workspace management" },
  Setter: { color: "amber", description: "Qualify leads and book calls for closers" },
  Closer: { color: "green", description: "Close sales deals and manage the customer pipeline" },
  Developer: { color: "slate", description: "Delivery, code tasks, and milestone execution" },
  Tester: { color: "rose", description: "Quality assurance, testing, and bug verification" },
};

export async function ensureInvitableRoles() {
  await Promise.all(
    INVITABLE_ROLES.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: {
          name,
          color: ROLE_DEFAULTS[name].color,
          description: ROLE_DEFAULTS[name].description,
          permissions: {},
        },
      }),
    ),
  );

  return prisma.role.findMany({
    where: { name: { in: [...INVITABLE_ROLES] } },
    select: { id: true, name: true, color: true, description: true },
    orderBy: { name: "asc" },
  });
}
