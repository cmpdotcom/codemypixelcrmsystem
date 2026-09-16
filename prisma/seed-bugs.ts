import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding sample bugs...");

  const projects = await prisma.project.findMany();
  const getProjectId = (pname: string) => projects.find((p) => p.name.toLowerCase().includes(pname.toLowerCase()))?.id;

  const sampleBugs = [
    {
      title: "Payment Gateway 500 on currency conversion",
      description: "When converting EUR to USD during checkout, the webhook returns internal server error.",
      projectName: "E-commerce Platform",
      module: "Payments",
      severity: "Critical",
      priority: "Urgent",
      status: "In Progress",
      environment: "Production",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "Ali Khan",
    },
    {
      title: "Memory leak during bulk CSV reconciliation",
      description: "Uploading CSVs greater than 50MB causes worker thread crash.",
      projectName: "ABC ERP Implementation",
      module: "Inventory",
      severity: "Critical",
      priority: "Urgent",
      status: "Assigned",
      environment: "Production",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "John Smith",
    },
    {
      title: "Session token not invalidated after password change",
      description: "Active mobile tokens continue to authenticate after credential reset.",
      projectName: "Mobile Banking App",
      module: "Authentication",
      severity: "Critical",
      priority: "High",
      status: "In Progress",
      environment: "Staging",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "Usman Tariq",
    },
    {
      title: "Data truncation in foreign address fields",
      description: "Addresses with non-ASCII characters fail SQL insert.",
      projectName: "ABC ERP Implementation",
      module: "Clients",
      severity: "Critical",
      priority: "High",
      status: "New",
      environment: "QA",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "Sara Ahmed",
    },
    {
      title: "Slow query on reporting date range filter",
      description: "Reports module takes > 12s when querying all transactions for past 12 months.",
      projectName: "ABC ERP Implementation",
      module: "Reports",
      severity: "High",
      priority: "High",
      status: "In Progress",
      environment: "Production",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "John Smith",
    },
    {
      title: "Broken layout on tablet safari viewport",
      description: "Kanban board cards overlap on iPad screen widths.",
      projectName: "E-commerce Platform",
      module: "Frontend",
      severity: "High",
      priority: "Medium",
      status: "Fixed",
      environment: "Staging",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "Ali Khan",
    },
    {
      title: "Incorrect tax rate applied to Canadian orders",
      description: "Ontario HST defaults to 5% GST instead of 13% blended rate.",
      projectName: "E-commerce Platform",
      module: "Tax",
      severity: "High",
      priority: "High",
      status: "Verified",
      environment: "Production",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "Usman Tariq",
      resolvedAt: new Date(),
    },
    {
      title: "Push notifications delay during peak traffic",
      description: "FCM batch queue blocks when > 1000 messages trigger simultaneously.",
      projectName: "Mobile Banking App",
      module: "Notifications",
      severity: "Medium",
      priority: "Medium",
      status: "In Progress",
      environment: "Staging",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "Usman Tariq",
    },
    {
      title: "Missing hover tooltip on deal probability bar",
      description: "CSS opacity transition glitch on tooltip popover.",
      projectName: "ABC ERP Implementation",
      module: "UI/UX",
      severity: "Low",
      priority: "Low",
      status: "Fixed",
      environment: "QA",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "Sara Ahmed",
      resolvedAt: new Date(),
    },
    {
      title: "Export to CSV includes deleted lead records",
      description: "Soft-deleted records not filtered out in SQL query.",
      projectName: "ABC ERP Implementation",
      module: "Leads",
      severity: "Medium",
      priority: "Medium",
      status: "Verified",
      environment: "Production",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "John Smith",
      resolvedAt: new Date(),
    },
    {
      title: "Password input does not show reveal eye icon",
      description: "Minor accessibility and usability improvement for signup form.",
      projectName: "E-commerce Platform",
      module: "Auth",
      severity: "Low",
      priority: "Low",
      status: "Closed",
      environment: "Production",
      reportedBy: "Lisa Wang (QA)",
      assigneeName: "Ali Khan",
      resolvedAt: new Date(),
    },
  ];

  for (const b of sampleBugs) {
    const projectId = getProjectId(b.projectName);
    await prisma.bug.create({
      data: {
        ...b,
        projectId,
      },
    });
  }

  console.log(`Seeded ${sampleBugs.length} bugs successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
