import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding sample milestones...");

  const projects = await prisma.project.findMany();
  const getProjectId = (pname: string) => projects.find((p) => p.name.toLowerCase().includes(pname.toLowerCase()))?.id;

  const sampleMilestones = [
    // ABC ERP Implementation
    {
      name: "Requirements Gathering & Analysis",
      projectName: "ABC ERP Implementation",
      status: "Completed",
      progress: 100,
      deadline: new Date("2025-01-15"),
      taskCount: 18,
      taskTotal: 18,
      owner: "Aarav Sharma",
      ownerInitials: "AS",
    },
    {
      name: "Core Module Development",
      projectName: "ABC ERP Implementation",
      status: "In Progress",
      progress: 65,
      deadline: new Date("2025-02-28"),
      taskCount: 24,
      taskTotal: 40,
      owner: "Karthik Reddy",
      ownerInitials: "KR",
    },
    {
      name: "Integration & API Connectivity",
      projectName: "ABC ERP Implementation",
      status: "In Progress",
      progress: 30,
      deadline: new Date("2025-03-20"),
      taskCount: 8,
      taskTotal: 26,
      owner: "Priya Nair",
      ownerInitials: "PN",
    },
    {
      name: "User Acceptance Testing",
      projectName: "ABC ERP Implementation",
      status: "Not Started",
      progress: 0,
      deadline: new Date("2025-04-10"),
      taskCount: 0,
      taskTotal: 22,
      owner: "Aarav Sharma",
      ownerInitials: "AS",
    },

    // Mobile Banking App
    {
      name: "Design System & Prototyping",
      projectName: "Mobile Banking App",
      status: "Completed",
      progress: 100,
      deadline: new Date("2025-01-20"),
      taskCount: 15,
      taskTotal: 15,
      owner: "Sneha Iyer",
      ownerInitials: "SI",
    },
    {
      name: "Authentication & Security Layer",
      projectName: "Mobile Banking App",
      status: "In Progress",
      progress: 75,
      deadline: new Date("2025-02-25"),
      taskCount: 12,
      taskTotal: 16,
      owner: "Priya Nair",
      ownerInitials: "PN",
    },
    {
      name: "Transaction Features Rollout",
      projectName: "Mobile Banking App",
      status: "Not Started",
      progress: 0,
      deadline: new Date("2025-03-30"),
      taskCount: 0,
      taskTotal: 28,
      owner: "Karthik Reddy",
      ownerInitials: "KR",
    },

    // E-commerce Platform
    {
      name: "Content Audit & Information Architecture",
      projectName: "E-commerce Platform",
      status: "Completed",
      progress: 100,
      deadline: new Date("2025-01-10"),
      taskCount: 10,
      taskTotal: 10,
      owner: "Divya Rao",
      ownerInitials: "DR",
    },
    {
      name: "Visual Design & Frontend Build",
      projectName: "E-commerce Platform",
      status: "In Progress",
      progress: 45,
      deadline: new Date("2025-02-22"),
      taskCount: 9,
      taskTotal: 20,
      owner: "Rohan Mehta",
      ownerInitials: "RM",
    },
  ];

  for (const m of sampleMilestones) {
    const projectId = getProjectId(m.projectName);
    await prisma.milestone.create({
      data: {
        ...m,
        projectId,
      },
    });
  }

  console.log(`Seeded ${sampleMilestones.length} milestones successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
