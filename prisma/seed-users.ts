import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const DEFAULT_MODULES = [
  "Leads",
  "Activities",
  "Deals",
  "Clients",
  "Projects",
  "Payments",
  "Commissions",
  "Reports",
];

const FULL_PERMS = { view: true, create: true, edit: true, del: true, assign: true };
const READ_PERMS = { view: true, create: false, edit: false, del: false, assign: false };
const STANDARD_PERMS = { view: true, create: true, edit: true, del: false, assign: true };

async function main() {
  console.log("Seeding Roles, Teams, and Users...");

  // 1. Roles
  const rolesData = [
    {
      name: "Super Admin",
      description: "Full system control with all permissions",
      color: "purple",
      permissions: DEFAULT_MODULES.reduce((acc, m) => ({ ...acc, [m]: FULL_PERMS }), {}),
    },
    {
      name: "Sales Manager",
      description: "Manage sales team, leads, deals, and reports",
      color: "blue",
      permissions: DEFAULT_MODULES.reduce(
        (acc, m) => ({
          ...acc,
          [m]: m === "Payments" || m === "Commissions" ? READ_PERMS : FULL_PERMS,
        }),
        {}
      ),
    },
    {
      name: "Setter",
      description: "Qualify leads and book calls for closers",
      color: "amber",
      permissions: DEFAULT_MODULES.reduce(
        (acc, m) => ({
          ...acc,
          [m]: m === "Leads" || m === "Activities" ? STANDARD_PERMS : READ_PERMS,
        }),
        {}
      ),
    },
    {
      name: "Closer",
      description: "Close sales deals and manage customer pipeline",
      color: "green",
      permissions: DEFAULT_MODULES.reduce(
        (acc, m) => ({
          ...acc,
          [m]: m === "Deals" || m === "Clients" || m === "Activities" ? FULL_PERMS : READ_PERMS,
        }),
        {}
      ),
    },
    {
      name: "Developer",
      description: "Delivery, code tasks, and milestone execution",
      color: "slate",
      permissions: DEFAULT_MODULES.reduce(
        (acc, m) => ({
          ...acc,
          [m]: m === "Projects" ? STANDARD_PERMS : READ_PERMS,
        }),
        {}
      ),
    },
    {
      name: "QA",
      description: "Quality assurance, bug reporting, and test cases",
      color: "rose",
      permissions: DEFAULT_MODULES.reduce(
        (acc, m) => ({
          ...acc,
          [m]: m === "Projects" ? STANDARD_PERMS : READ_PERMS,
        }),
        {}
      ),
    },
  ];

  const createdRoles: Record<string, { id: string }> = {};
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description, color: r.color, permissions: r.permissions },
      create: r,
    });
    createdRoles[r.name] = role;
  }
  console.log(`Created ${Object.keys(createdRoles).length} roles.`);

  // 2. Teams (without leaders first)
  const teamsData = [
    { name: "Sales Team", department: "Sales", color: "blue" },
    { name: "Setter Team", department: "Sales", color: "amber" },
    { name: "Closer Team", department: "Sales", color: "green" },
    { name: "Development Team", department: "Delivery", color: "purple" },
    { name: "QA & Testing Team", department: "Delivery", color: "rose" },
  ];

  const createdTeams: Record<string, { id: string }> = {};
  for (const t of teamsData) {
    const team = await prisma.team.upsert({
      where: { name: t.name },
      update: { department: t.department, color: t.color },
      create: t,
    });
    createdTeams[t.name] = team;
  }
  console.log(`Created ${Object.keys(createdTeams).length} teams.`);

  // 3. Users
  const hashedPassword = await bcrypt.hash("test123456", 12);

  const usersData = [
    {
      firstName: "Ahmed",
      lastName: "Raza",
      email: "ahmed.raza@crm.com",
      role: "Super Admin",
      team: "Sales Team",
      status: "Active",
    },
    {
      firstName: "Sara",
      lastName: "Ahmed",
      email: "sara.ahmed@crm.com",
      role: "Sales Manager",
      team: "Sales Team",
      status: "Active",
    },
    {
      firstName: "Ali",
      lastName: "Khan",
      email: "ali.khan@crm.com",
      role: "Setter",
      team: "Setter Team",
      status: "Active",
    },
    {
      firstName: "Mike",
      lastName: "David",
      email: "mike.david@crm.com",
      role: "Closer",
      team: "Closer Team",
      status: "Active",
    },
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@crm.com",
      role: "Developer",
      team: "Development Team",
      status: "Inactive",
    },
    {
      firstName: "Lisa",
      lastName: "Wang",
      email: "lisa.wang@crm.com",
      role: "QA",
      team: "QA & Testing Team",
      status: "Active",
    },
    {
      firstName: "Pravas",
      lastName: "Sarkar",
      email: "info.pravas.cs@gmail.com",
      role: "Super Admin",
      team: "Sales Team",
      status: "Active",
    },
    {
      firstName: "Test",
      lastName: "User",
      email: "test@test.com",
      role: "Super Admin",
      team: "Sales Team",
      status: "Active",
    },
  ];

  const createdUsers: Record<string, { id: string }> = {};
  for (const u of usersData) {
    const roleId = createdRoles[u.role]?.id;
    const teamId = createdTeams[u.team]?.id;

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
        roleId,
        teamId,
        status: u.status,
      },
      create: {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: hashedPassword,
        roleId,
        teamId,
        status: u.status,
        emailVerified: new Date(),
      },
    });
    createdUsers[u.email] = user;
  }
  console.log(`Created ${Object.keys(createdUsers).length} users.`);

  // 4. Assign Team Leaders
  await prisma.team.update({
    where: { name: "Sales Team" },
    data: { leaderId: createdUsers["ahmed.raza@crm.com"]?.id },
  });
  await prisma.team.update({
    where: { name: "Setter Team" },
    data: { leaderId: createdUsers["ali.khan@crm.com"]?.id },
  });
  await prisma.team.update({
    where: { name: "Closer Team" },
    data: { leaderId: createdUsers["mike.david@crm.com"]?.id },
  });
  await prisma.team.update({
    where: { name: "Development Team" },
    data: { leaderId: createdUsers["john.smith@crm.com"]?.id },
  });
  await prisma.team.update({
    where: { name: "QA & Testing Team" },
    data: { leaderId: createdUsers["lisa.wang@crm.com"]?.id },
  });

  console.log("Team leaders assigned successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
