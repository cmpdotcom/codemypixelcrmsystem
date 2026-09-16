import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding sample tasks...");

  const projects = await prisma.project.findMany();
  const getProjectId = (pname: string) => projects.find((p) => p.name.toLowerCase().includes(pname.toLowerCase()))?.id;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const sampleTasks = [
    {
      name: "Setup CI/CD Pipeline",
      description: "GitHub Actions workflow for automated deployment to staging and production",
      projectName: "ABC ERP Implementation",
      module: "DevOps",
      assignee: "John Smith",
      priority: "Medium",
      status: "Backlog",
      progress: 0,
      dueDate: new Date(today.getTime() + 20 * 86400000),
      estimatedHours: 8,
      loggedHours: 0,
      tags: ["DevOps", "Infrastructure"],
    },
    {
      name: "Stripe Payment Gateway",
      description: "Integrate recurring subscriptions and one-off customer invoices",
      projectName: "E-commerce Platform",
      module: "Billing",
      assignee: "Ali Khan",
      priority: "High",
      status: "Backlog",
      progress: 0,
      dueDate: new Date(today.getTime() + 15 * 86400000),
      estimatedHours: 12,
      loggedHours: 0,
      tags: ["Backend", "Payments"],
    },
    {
      name: "Responsive Dashboard Layout",
      description: "Mobile and tablet sidebar behavior, header widgets, and sticky filters",
      projectName: "ABC ERP Implementation",
      module: "Frontend",
      assignee: "Lisa Wang",
      priority: "Medium",
      status: "Todo",
      progress: 25,
      dueDate: new Date(today.getTime() + 10 * 86400000),
      estimatedHours: 10,
      loggedHours: 2,
      tags: ["UI", "Tailwind"],
    },
    {
      name: "Role-Based Access Control Middleware",
      description: "Protect admin routes based on User roleId permissions JSON matrix",
      projectName: "ABC ERP Implementation",
      module: "Security",
      assignee: "John Smith",
      priority: "Urgent",
      status: "Todo",
      progress: 30,
      dueDate: new Date(today.getTime() + 5 * 86400000),
      estimatedHours: 16,
      loggedHours: 5,
      tags: ["Auth", "Backend"],
    },
    {
      name: "JWT Authentication Flow",
      description: "Refresh token rotation and secure session cookies",
      projectName: "E-commerce Platform",
      module: "Auth",
      assignee: "Ali Khan",
      priority: "High",
      status: "In Progress",
      progress: 65,
      dueDate: new Date(today.getTime() + 3 * 86400000),
      estimatedHours: 14,
      loggedHours: 9,
      tags: ["Auth", "Security"],
    },
    {
      name: "GraphQL Schema & Resolvers",
      description: "Queries and mutations for client catalog, order status, and inventory",
      projectName: "ABC ERP Implementation",
      module: "API",
      assignee: "Usman Tariq",
      priority: "Medium",
      status: "In Progress",
      progress: 50,
      dueDate: new Date(today.getTime() + 7 * 86400000),
      estimatedHours: 20,
      loggedHours: 10,
      tags: ["API", "Backend"],
    },
    {
      name: "Inventory Stock Reconciliation",
      description: "Batch import CSV handler and inventory audit trail",
      projectName: "ABC ERP Implementation",
      module: "Inventory",
      assignee: "John Smith",
      priority: "High",
      status: "Code Review",
      progress: 85,
      dueDate: new Date(today.getTime() + 2 * 86400000),
      estimatedHours: 18,
      loggedHours: 17,
      tags: ["ERP", "Review"],
    },
    {
      name: "Checkout Validation & Tax Rates",
      description: "Automated postal code tax lookups and basket total calculation",
      projectName: "E-commerce Platform",
      module: "Checkout",
      assignee: "Lisa Wang",
      priority: "Medium",
      status: "QA",
      progress: 90,
      dueDate: new Date(today.getTime() + 1 * 86400000),
      estimatedHours: 8,
      loggedHours: 8,
      tags: ["QA", "Testing"],
    },
    {
      name: "Push Notification Service",
      description: "Firebase Cloud Messaging integration for mobile updates",
      projectName: "Mobile Banking App",
      module: "Mobile",
      assignee: "Usman Tariq",
      priority: "Urgent",
      status: "Blocked",
      progress: 40,
      dueDate: new Date(today.getTime() - 2 * 86400000), // overdue
      estimatedHours: 10,
      loggedHours: 6,
      tags: ["Mobile", "Blocked"],
      blocked: true,
    },
    {
      name: "Client Onboarding Wizard",
      description: "Multi-step registration walkthrough for newly converted leads",
      projectName: "ABC ERP Implementation",
      module: "Onboarding",
      assignee: "Sara Ahmed",
      priority: "Medium",
      status: "Done",
      progress: 100,
      dueDate: new Date(today.getTime() - 4 * 86400000),
      estimatedHours: 12,
      loggedHours: 12,
      tags: ["Frontend", "Done"],
    },
    {
      name: "PostgreSQL Database Backup Cron",
      description: "Automated nightly pg_dump snapshots to AWS S3 encrypted bucket",
      projectName: "ABC ERP Implementation",
      module: "DevOps",
      assignee: "John Smith",
      priority: "High",
      status: "Done",
      progress: 100,
      dueDate: new Date(today.getTime() - 7 * 86400000),
      estimatedHours: 6,
      loggedHours: 5,
      tags: ["DevOps", "Database"],
    },
  ];

  for (const t of sampleTasks) {
    const projectId = getProjectId(t.projectName);
    await prisma.task.create({
      data: {
        name: t.name,
        description: t.description,
        projectName: t.projectName,
        module: t.module,
        assignee: t.assignee,
        priority: t.priority,
        status: t.status,
        progress: t.progress,
        dueDate: t.dueDate,
        estimatedHours: t.estimatedHours,
        loggedHours: t.loggedHours,
        tags: t.tags,
        blocked: t.blocked || false,
        projectId,
      },
    });
  }

  console.log(`Seeded ${sampleTasks.length} tasks successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
