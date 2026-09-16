import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding sample projects...");

  const clients = await prisma.client.findMany();
  const getClientId = (name: string) => clients.find((c) => c.company.toLowerCase().includes(name.toLowerCase()))?.id;

  const now = new Date();

  const sampleProjects = [
    {
      name: "E-commerce Platform",
      clientName: "TechCorp",
      description: "Next-gen headless Shopify storefront with custom checkout",
      status: "Planning",
      health: "on-track",
      progress: 15,
      budget: 35000,
      spent: 5000,
      startDate: new Date(now.getTime() - 10 * 86400000),
      deadline: new Date(now.getTime() + 45 * 86400000),
      teamMembers: ["AK", "SA", "MN"],
    },
    {
      name: "Brand Redesign & Portal",
      clientName: "Global Tech Ltd.",
      description: "Full brand overhaul with customer self-service portal",
      status: "Planning",
      health: "on-track",
      progress: 20,
      budget: 25000,
      spent: 4000,
      startDate: new Date(now.getTime() - 5 * 86400000),
      deadline: new Date(now.getTime() + 30 * 86400000),
      teamMembers: ["FN", "UT"],
    },
    {
      name: "CRM Migration",
      clientName: "Acme Corp.",
      description: "Migrating legacy Salesforce records to CMP CRM platform",
      status: "Requirements",
      health: "on-track",
      progress: 35,
      budget: 45000,
      spent: 12000,
      startDate: new Date(now.getTime() - 20 * 86400000),
      deadline: new Date(now.getTime() + 60 * 86400000),
      teamMembers: ["AK", "FN", "UT", "SA"],
    },
    {
      name: "Design System UI Kit",
      clientName: "Skyline Media",
      description: "Figma design system and synchronized React component library",
      status: "Design",
      health: "on-track",
      progress: 55,
      budget: 20000,
      spent: 11000,
      startDate: new Date(now.getTime() - 30 * 86400000),
      deadline: new Date(now.getTime() + 20 * 86400000),
      teamMembers: ["SA", "MN"],
    },
    {
      name: "ABC ERP Implementation",
      clientName: "ABC Technologies",
      description: "Enterprise ERP integration across inventory, HR, and billing",
      status: "Development",
      health: "on-track",
      progress: 78,
      budget: 85000,
      spent: 62000,
      startDate: new Date(now.getTime() - 60 * 86400000),
      deadline: new Date(now.getTime() + 15 * 86400000),
      teamMembers: ["AK", "SA", "UT", "FN", "MN"],
    },
    {
      name: "Mobile Banking App",
      clientName: "NextGen Co.",
      description: "React Native iOS & Android banking client with biometrics",
      status: "Development",
      health: "at-risk",
      progress: 60,
      budget: 65000,
      spent: 45000,
      startDate: new Date(now.getTime() - 40 * 86400000),
      deadline: new Date(now.getTime() + 10 * 86400000),
      teamMembers: ["UT", "FN"],
    },
    {
      name: "Factory IoT Analytics",
      clientName: "BrightLink Solutions",
      description: "Sensor data streaming engine with real-time anomaly detection",
      status: "Testing",
      health: "critical",
      progress: 88,
      budget: 95000,
      spent: 89000,
      startDate: new Date(now.getTime() - 90 * 86400000),
      deadline: new Date(now.getTime() - 2 * 86400000), // overdue
      teamMembers: ["AK", "UT", "MN"],
    },
    {
      name: "Automated Testing Suite",
      clientName: "Vector Inc.",
      description: "Playwright E2E and Cypress test automation pipeline",
      status: "Testing",
      health: "on-track",
      progress: 90,
      budget: 18000,
      spent: 16000,
      startDate: new Date(now.getTime() - 50 * 86400000),
      deadline: new Date(now.getTime() + 5 * 86400000),
      teamMembers: ["SA", "FN"],
    },
    {
      name: "Cloud Migration Phase 2",
      clientName: "Innovate Ltd.",
      description: "AWS ECS container migration with zero-downtime deployment",
      status: "Deployment",
      health: "on-track",
      progress: 95,
      budget: 40000,
      spent: 38000,
      startDate: new Date(now.getTime() - 80 * 86400000),
      deadline: new Date(now.getTime() + 4 * 86400000),
      teamMembers: ["AK", "UT"],
    },
    {
      name: "Analytics Pipeline",
      clientName: "DataFlow Systems",
      description: "Snowflake data warehouse with automated dbt transformations",
      status: "Completed",
      health: "on-track",
      progress: 100,
      budget: 50000,
      spent: 48000,
      startDate: new Date(now.getTime() - 120 * 86400000),
      deadline: new Date(now.getTime() - 10 * 86400000),
      teamMembers: ["SA", "MN", "FN"],
    },
    {
      name: "Headless E-commerce Store",
      clientName: "Prime Digital",
      description: "Next.js storefront with Stripe payments and Algolia search",
      status: "Completed",
      health: "on-track",
      progress: 100,
      budget: 38000,
      spent: 37000,
      startDate: new Date(now.getTime() - 100 * 86400000),
      deadline: new Date(now.getTime() - 15 * 86400000),
      teamMembers: ["AK", "SA"],
    },
    {
      name: "Real Estate Portal",
      clientName: "FutureWorks",
      description: "Property listing CMS with interactive maps and lead capture",
      status: "On Hold",
      health: "at-risk",
      progress: 40,
      budget: 30000,
      spent: 14000,
      startDate: new Date(now.getTime() - 70 * 86400000),
      deadline: new Date(now.getTime() + 50 * 86400000),
      teamMembers: ["UT"],
    },
  ];

  for (const p of sampleProjects) {
    const clientId = getClientId(p.clientName);
    await prisma.project.create({
      data: {
        ...p,
        clientId,
      },
    });
  }

  console.log(`Seeded ${sampleProjects.length} projects successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
