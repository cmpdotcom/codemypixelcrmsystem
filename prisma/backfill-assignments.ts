import { prisma } from "../lib/prisma";

// One-time: link leads/deals that only stored a setter/closer name to the matching user.
// Names shared by more than one user are skipped. Safe to re-run.
async function main() {
  const users = await prisma.user.findMany({ select: { id: true, firstName: true, lastName: true } });
  const idsByName = new Map<string, string | null>();
  for (const user of users) {
    const key = `${user.firstName} ${user.lastName}`.trim().toLowerCase();
    idsByName.set(key, idsByName.has(key) ? null : user.id);
  }

  let leads = 0;
  let deals = 0;
  for (const [name, id] of idsByName) {
    if (!id) {
      console.warn(`Skipping "${name}": more than one user has this name`);
      continue;
    }
    const nameFilter = { equals: name, mode: "insensitive" as const };
    leads += (await prisma.lead.updateMany({ where: { setterId: null, setter: nameFilter }, data: { setterId: id } })).count;
    deals += (await prisma.deal.updateMany({ where: { closerId: null, closer: nameFilter }, data: { closerId: id } })).count;
  }
  console.log(`Linked ${leads} leads to setters and ${deals} deals to closers.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
