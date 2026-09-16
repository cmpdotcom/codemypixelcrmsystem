import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding sample deployments...");

  const projects = await prisma.project.findMany();
  const getProjectId = (pname: string) => projects.find((p) => p.name.toLowerCase().includes(pname.toLowerCase()))?.id;

  const sampleDeployments = [
    {
      projectName: "ABC ERP Implementation",
      environment: "Production",
      version: "v2.4.0",
      commitHash: "7ad6808",
      commitMsg: "Release 2.4.0: Automated bank reconciliation & multi-currency billing",
      branch: "main",
      status: "Successful",
      deployedBy: "Ali Khan",
      duration: "3m 12s",
      url: "https://erp.abctechnologies.com",
      releaseNotes: "Critical financial module stabilization and speedup",
    },
    {
      projectName: "E-commerce Platform",
      environment: "Production",
      version: "v1.8.2",
      commitHash: "9a2f10b",
      commitMsg: "Fix Canadian tax rate computation and Algolia sync timeout",
      branch: "main",
      status: "Successful",
      deployedBy: "John Smith",
      duration: "2m 45s",
      url: "https://shop.techcorp.io",
      releaseNotes: "Tax calculation patch and search index speedup",
    },
    {
      projectName: "Mobile Banking App",
      environment: "Staging",
      version: "v3.1.0-rc.2",
      commitHash: "4c8812e",
      commitMsg: "Biometric face ID and push notifications worker queue",
      branch: "staging",
      status: "In Progress",
      deployedBy: "Usman Tariq",
      duration: "1m 15s",
      url: "https://staging-app.nextgenco.io",
      releaseNotes: "Candidate release for internal security audit",
    },
    {
      projectName: "ABC ERP Implementation",
      environment: "QA",
      version: "v2.4.1-alpha",
      commitHash: "3b0042f",
      commitMsg: "Memory leak patch for bulk CSV inventory parser",
      branch: "feature/inventory-patch",
      status: "Successful",
      deployedBy: "Lisa Wang",
      duration: "1m 58s",
      url: "https://qa-erp.abctechnologies.com",
      releaseNotes: "Testing hotfix before promoting to staging",
    },
    {
      projectName: "Factory IoT Analytics",
      environment: "Production",
      version: "v1.2.0",
      commitHash: "d7a4201",
      commitMsg: "WebSocket telemetry connection drop under high throughput",
      branch: "main",
      status: "Failed",
      deployedBy: "John Smith",
      duration: "4m 10s",
      url: "https://iot.brightlink-solutions.de",
      releaseNotes: "Build container exited with code 137 (OOM)",
    },
    {
      projectName: "Factory IoT Analytics",
      environment: "Production",
      version: "v1.1.9",
      commitHash: "c55201a",
      commitMsg: "Automated rollback to stable v1.1.9 after OOM failure",
      branch: "main",
      status: "Rolled Back",
      deployedBy: "System (Auto-Rollback)",
      duration: "1m 20s",
      url: "https://iot.brightlink-solutions.de",
      rollbackFrom: "v1.2.0",
      releaseNotes: "Restored previous stable container image",
    },
    {
      projectName: "Cloud Migration Phase 2",
      environment: "Production",
      version: "v3.0.0",
      commitHash: "8e31002",
      commitMsg: "Full AWS ECS cluster migration & Route53 zero-downtime cutover",
      branch: "main",
      status: "Successful",
      deployedBy: "Ali Khan",
      duration: "5m 48s",
      url: "https://cloud.innovateltd.com.au",
      releaseNotes: "Final milestone signoff for legacy server decommissioning",
    },
    {
      projectName: "Brand Redesign & Portal",
      environment: "Staging",
      version: "v1.0.4",
      commitHash: "1f88e2c",
      commitMsg: "Customer portal layout refresh and mobile responsive adjustments",
      branch: "staging",
      status: "Successful",
      deployedBy: "Sara Ahmed",
      duration: "2m 10s",
      url: "https://portal-stage.globaltech.co.uk",
      releaseNotes: "Stakeholder demo build",
    },
  ];

  for (const d of sampleDeployments) {
    const projectId = getProjectId(d.projectName);
    await prisma.deployment.create({
      data: {
        ...d,
        projectId,
      },
    });
  }

  console.log(`Seeded ${sampleDeployments.length} deployments successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
