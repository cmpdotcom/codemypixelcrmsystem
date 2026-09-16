import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding sample follow-ups...");

  const leads = await prisma.lead.findMany();
  const clients = await prisma.client.findMany();

  const getLeadId = (name: string) => leads.find((l) => l.company.toLowerCase() === name.toLowerCase())?.id;
  const getClientId = (name: string) => clients.find((c) => c.company.toLowerCase() === name.toLowerCase())?.id;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const inTwoDays = new Date(today.getTime() + 2 * 86400000);
  const yesterday = new Date(today.getTime() - 86400000);

  const sampleFollowUps = [
    {
      subjectTitle: "Discuss proposal",
      subjectDesc: "Go over final proposal and commercial terms",
      company: "ABC Technologies",
      contact: "John Carter",
      relatedRef: "Deal #DL-1082",
      type: "Call",
      assigneeName: "Ali Khan",
      dueDate: today,
      dueTime: "11:00 AM",
      status: "Due Today",
      priority: "High",
      completed: false,
    },
    {
      subjectTitle: "Follow up on requirements",
      subjectDesc: "Check if client has reviewed technical specifications",
      company: "Global Tech Ltd.",
      contact: "Sarah Mitchell",
      relatedRef: "Lead #LD-2291",
      type: "Email",
      assigneeName: "Fatima Noor",
      dueDate: today,
      dueTime: "02:30 PM",
      status: "Due Today",
      priority: "High",
      completed: false,
    },
    {
      subjectTitle: "Demo meeting",
      subjectDesc: "Product demonstration for team leads",
      company: "Skyline Media",
      contact: "Emma Wilson",
      relatedRef: "Deal #DL-1076",
      type: "Meeting",
      assigneeName: "Usman Tariq",
      dueDate: today,
      dueTime: "04:00 PM",
      status: "Due Today",
      priority: "Medium",
      completed: false,
    },
    {
      subjectTitle: "Check payment status",
      subjectDesc: "Confirm first installment wire transfer",
      company: "BrightLink Solutions",
      contact: "Michael Brown",
      relatedRef: "Client #CL-332",
      type: "Call",
      assigneeName: "Sara Ahmed",
      dueDate: tomorrow,
      dueTime: "10:00 AM",
      status: "Upcoming",
      priority: "Medium",
      completed: false,
    },
    {
      subjectTitle: "Send revised quotation",
      subjectDesc: "Share updated pricing with volume discount",
      company: "NextGen Co.",
      contact: "David Lee",
      relatedRef: "Lead #LD-1074",
      type: "Email",
      assigneeName: "Ali Khan",
      dueDate: tomorrow,
      dueTime: "01:00 PM",
      status: "Upcoming",
      priority: "High",
      completed: false,
    },
    {
      subjectTitle: "Follow up after meeting",
      subjectDesc: "Client was interested in ERP module addons",
      company: "Innovate Ltd.",
      contact: "Sophia Garcia",
      relatedRef: "Lead #LD-2260",
      type: "WhatsApp",
      assigneeName: "Fatima Noor",
      dueDate: inTwoDays,
      dueTime: "11:30 AM",
      status: "Upcoming",
      priority: "Low",
      completed: false,
    },
    {
      subjectTitle: "Schedule next meeting",
      subjectDesc: "Discuss technical architecture and APIs",
      company: "Core Systems",
      contact: "Daniel Kim",
      relatedRef: "Deal #DL-1071",
      type: "Meeting",
      assigneeName: "Usman Tariq",
      dueDate: inTwoDays,
      dueTime: "03:00 PM",
      status: "Upcoming",
      priority: "Medium",
      completed: false,
    },
    {
      subjectTitle: "Contract signing follow up",
      subjectDesc: "Check if the legal team has cleared MSA",
      company: "FutureWorks",
      contact: "Olivia Martinez",
      relatedRef: "Client #CL-331",
      type: "Call",
      assigneeName: "Sara Ahmed",
      dueDate: yesterday,
      dueTime: "11:00 AM",
      status: "Overdue",
      priority: "High",
      completed: false,
    },
    {
      subjectTitle: "Client feedback",
      subjectDesc: "Get feedback on the delivered milestone sprint",
      company: "Vector Inc.",
      contact: "James Anderson",
      relatedRef: "Project #PR-090",
      type: "Email",
      assigneeName: "Ali Khan",
      dueDate: yesterday,
      dueTime: "04:00 PM",
      status: "Overdue",
      priority: "Medium",
      completed: false,
    },
    {
      subjectTitle: "Renewal discussion",
      subjectDesc: "Discuss annual enterprise SLA contract renewal",
      company: "Prime Digital",
      contact: "Isabella Thomas",
      relatedRef: "Client #CL-329",
      type: "Call",
      assigneeName: "Fatima Noor",
      dueDate: new Date(today.getTime() + 4 * 86400000),
      dueTime: "10:30 AM",
      status: "Upcoming",
      priority: "Low",
      completed: false,
    },
    {
      subjectTitle: "Introductory Onboarding Check-in",
      subjectDesc: "Verify client has access to production portal",
      company: "ABC Technologies",
      contact: "John Carter",
      relatedRef: "Client #CL-001",
      type: "Call",
      assigneeName: "Sara Ahmed",
      dueDate: yesterday,
      dueTime: "09:00 AM",
      status: "Completed",
      priority: "Medium",
      completed: true,
      completedAt: yesterday,
    },
  ];

  for (const fu of sampleFollowUps) {
    const leadId = getLeadId(fu.company);
    const clientId = getClientId(fu.company);
    await prisma.followUp.create({
      data: {
        ...fu,
        leadId,
        clientId,
      },
    });
  }

  console.log(`Seeded ${sampleFollowUps.length} follow-ups successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
