import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding activities...");

  const leads = await prisma.lead.findMany();
  const leadMap = (company: string) => leads.find((l) => l.company === company);

  const users = ["Ali Khan", "Fatima Noor", "Usman Tariq", "Sara Ahmed"];

  const activities = [
    { type: "Call", direction: "Outbound", title: "Discussed project requirements", company: "ABC Technologies", contact: "John Carter", status: "Completed", daysAgo: 0, user: "Ali Khan" },
    { type: "Email", direction: "Sent", title: "Sent proposal and pricing details", company: "Global Tech Ltd.", contact: "Sarah Mitchell", status: "Completed", daysAgo: 0, user: "Fatima Noor" },
    { type: "WhatsApp", direction: "Inbound", title: "Client asked about timeline", company: "Skyline Media", contact: "Emma Wilson", status: "Completed", daysAgo: 0, user: "Usman Tariq" },
    { type: "Meeting", direction: "Online (Zoom)", title: "Product demo with the team", company: "NextGen Co.", contact: "David Lee", status: "Scheduled", daysAgo: 1, user: "Sara Ahmed" },
    { type: "Note", direction: "Internal", title: "Client is interested in ERP", company: "BrightLink Ltd.", contact: "Michael Brown", status: "Completed", daysAgo: 1, user: "Ali Khan" },
    { type: "Call", direction: "Inbound", title: "Discussed budget and next steps", company: "Innovate Ltd.", contact: "Sophia Garcia", status: "Completed", daysAgo: 1, user: "Fatima Noor" },
    { type: "Email", direction: "Received", title: "Received revised requirements", company: "FutureWorks", contact: "Daniel Kim", status: "Completed", daysAgo: 2, user: "Usman Tariq" },
    { type: "WhatsApp", direction: "Outbound", title: "Shared case studies and portfolio", company: "Core Systems", contact: "Olivia Martinez", status: "Completed", daysAgo: 2, user: "Sara Ahmed" },
    { type: "Meeting", direction: "In Person", title: "Initial meeting at client office", company: "Vector Inc.", contact: "James Anderson", status: "Completed", daysAgo: 3, user: "Ali Khan" },
    { type: "Note", direction: "Internal", title: "Follow up next week", company: "Prime Digital", contact: "Isabella Thomas", status: "Pending", daysAgo: 3, user: "Fatima Noor" },
    { type: "Call", direction: "Outbound", title: "Cold call — left voicemail", company: "Quantum Labs", contact: "Robert Chen", status: "Completed", daysAgo: 4, user: "Usman Tariq" },
    { type: "Email", direction: "Sent", title: "Sent NDA for signature", company: "Apex Solutions", contact: "Maria Lopez", status: "Completed", daysAgo: 4, user: "Sara Ahmed" },
    { type: "Meeting", direction: "Online (Zoom)", title: "Kickoff call with stakeholders", company: "BlueWave Inc.", contact: "Tom Harris", status: "Completed", daysAgo: 5, user: "Ali Khan" },
    { type: "WhatsApp", direction: "Inbound", title: "Client confirmed meeting time", company: "Nimbus Tech", contact: "Lisa Park", status: "Completed", daysAgo: 5, user: "Fatima Noor" },
    { type: "Note", direction: "Internal", title: "Need to prepare quote by Friday", company: "Stellar Group", contact: "Kevin Wang", status: "Pending", daysAgo: 6, user: "Usman Tariq" },
    { type: "Call", direction: "Outbound", title: "Follow-up call on proposal", company: "ABC Technologies", contact: "John Carter", status: "Completed", daysAgo: 7, user: "Sara Ahmed" },
    { type: "Email", direction: "Sent", title: "Shared onboarding checklist", company: "Global Tech Ltd.", contact: "Sarah Mitchell", status: "Completed", daysAgo: 7, user: "Ali Khan" },
    { type: "Meeting", direction: "In Person", title: "Contract signing at client HQ", company: "NextGen Co.", contact: "David Lee", status: "Completed", daysAgo: 8, user: "Fatima Noor" },
    { type: "Task", direction: "Internal", title: "Prepare demo environment", company: "Skyline Media", contact: "Emma Wilson", status: "Pending", daysAgo: 0, user: "Usman Tariq" },
    { type: "SMS", direction: "Outbound", title: "Reminder sent for tomorrow call", company: "Innovate Ltd.", contact: "Sophia Garcia", status: "Completed", daysAgo: 0, user: "Sara Ahmed" },
  ];

  for (const a of activities) {
    const lead = a.company ? leadMap(a.company) : null;
    const date = new Date();
    date.setDate(date.getDate() - a.daysAgo);
    date.setHours(9 + (Math.random() * 8), Math.floor(Math.random() * 60));

    await prisma.activity.create({
      data: {
        type: a.type,
        direction: a.direction,
        title: a.title,
        description: `${a.title} — ${a.company}`,
        company: a.company,
        contact: a.contact,
        leadId: lead?.id || null,
        performedBy: a.user,
        status: a.status,
        scheduledAt: a.status === "Scheduled" ? date : null,
        createdAt: date,
      },
    });
  }

  console.log(`Seeded ${activities.length} activities`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
