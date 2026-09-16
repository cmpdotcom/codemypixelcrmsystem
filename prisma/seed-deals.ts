import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding sample deals...");

  const leads = await prisma.lead.findMany();
  const leadMap = (comp: string) => leads.find((l) => l.company.toLowerCase() === comp.toLowerCase());

  const sampleDeals = [
    // Qualified
    { title: "Custom ERP System", company: "ABC Technologies", contact: "John Carter", service: "Custom ERP", value: 25000, stage: "qualified", probability: 20, priority: "High", closer: "Ali Khan" },
    { title: "Website Redesign", company: "Global Tech Ltd.", contact: "Sarah Mitchell", service: "Website Redesign", value: 15000, stage: "qualified", probability: 20, priority: "Medium", closer: "Fatima Noor" },
    { title: "Mobile App MVP", company: "Skyline Media", contact: "Emma Wilson", service: "Mobile App", value: 20000, stage: "qualified", probability: 20, priority: "High", closer: "Ali Khan" },
    { title: "CRM Implementation", company: "BrightLink Solutions", contact: "Michael Brown", service: "CRM Implementation", value: 12000, stage: "qualified", probability: 15, priority: "Medium", closer: "Usman Tariq" },

    // Discovery
    { title: "Custom Software Architecture", company: "NextGen Co.", contact: "David Lee", service: "Custom Software", value: 18000, stage: "discovery", probability: 35, priority: "Medium", closer: "Fatima Noor" },
    { title: "ERP Development Core", company: "Innovate Ltd.", contact: "Sophia Garcia", service: "ERP Development", value: 22000, stage: "discovery", probability: 40, priority: "High", closer: "Usman Tariq" },
    { title: "System Integration", company: "Core Systems", contact: "Olivia Martinez", service: "System Integration", value: 10000, stage: "discovery", probability: 30, priority: "Medium", closer: "Sara Ahmed" },
    { title: "Web Application Suite", company: "Vector Inc.", contact: "James Anderson", service: "Web Application", value: 22000, stage: "discovery", probability: 35, priority: "Low", closer: "Ali Khan" },

    // Proposal
    { title: "Mobile App Full Build", company: "Prime Digital", contact: "Isabella Thomas", service: "Mobile App", value: 30000, stage: "proposal", probability: 55, priority: "High", closer: "Sara Ahmed" },
    { title: "Custom ERP Multi-Branch", company: "FutureWorks", contact: "Daniel Kim", service: "Custom ERP", value: 25000, stage: "proposal", probability: 60, priority: "Medium", closer: "Fatima Noor" },
    { title: "Portal & Website Dev", company: "TechCorp", contact: "Robert Chen", service: "Website Development", value: 18000, stage: "proposal", probability: 50, priority: "Medium", closer: "Usman Tariq" },
    { title: "CRM Customization & Sync", company: "Alpha Solutions", contact: "Maria Lopez", service: "CRM Customization", value: 22000, stage: "proposal", probability: 65, priority: "High", closer: "Ali Khan" },

    // Negotiation
    { title: "Digital Marketing Platform", company: "Orbit Media", contact: "Tom Harris", service: "Digital Platform", value: 28000, stage: "negotiation", probability: 75, priority: "High", closer: "Sara Ahmed" },
    { title: "Mobile Client App", company: "BlueSky Inc.", contact: "Lisa Park", service: "Mobile App", value: 20000, stage: "negotiation", probability: 70, priority: "Medium", closer: "Fatima Noor" },
    { title: "Enterprise ERP", company: "Zenith Corp.", contact: "Kevin Wang", service: "ERP Development", value: 30000, stage: "negotiation", probability: 75, priority: "High", closer: "Ali Khan" },

    // Contract Sent
    { title: "Website Redesign & SEO", company: "Delta Systems", contact: "Eric Taylor", service: "Website Redesign", value: 18000, stage: "contract", probability: 85, priority: "Medium", closer: "Usman Tariq" },
    { title: "Custom CRM Deployment", company: "Elevate Tech", contact: "Rachel Adams", service: "Custom CRM", value: 22000, stage: "contract", probability: 90, priority: "Medium", closer: "Sara Ahmed" },
    { title: "Fintech Mobile App", company: "Horizon Ltd.", contact: "Brian Scott", service: "Mobile App", value: 15000, stage: "contract", probability: 85, priority: "Medium", closer: "Ali Khan" },

    // Won
    { title: "Enterprise ERP Overhaul", company: "Acme Corp.", contact: "George Miller", service: "ERP Development", value: 40000, stage: "won", probability: 100, priority: "High", closer: "Sara Ahmed" },
    { title: "E-commerce Global Store", company: "Global Retail", contact: "Diana Ross", service: "E-commerce Platform", value: 35000, stage: "won", probability: 100, priority: "High", closer: "Fatima Noor" },
    { title: "Cloud Portal SaaS", company: "SaaSify Inc.", contact: "Nathan Drake", service: "SaaS Portal", value: 25000, stage: "won", probability: 100, priority: "Medium", closer: "Ali Khan" },
    { title: "Corporate Mobile App", company: "Apex Logistics", contact: "Elena Fisher", service: "Mobile App", value: 25000, stage: "won", probability: 100, priority: "Medium", closer: "Usman Tariq" },

    // Lost
    { title: "Legacy Migration", company: "Pioneer Group", contact: "Arthur Morgan", service: "Migration", value: 14000, stage: "lost", probability: 0, priority: "Low", closer: "Ali Khan", lostReason: "Budget constraints" },
    { title: "CRM Integration", company: "Vanguard Tech", contact: "John Marston", service: "CRM", value: 16000, stage: "lost", probability: 0, priority: "Medium", closer: "Sara Ahmed", lostReason: "Went with competitor" },
  ];

  for (const d of sampleDeals) {
    const lead = leadMap(d.company);
    await prisma.deal.create({
      data: {
        title: d.title,
        company: d.company,
        contact: d.contact,
        service: d.service,
        value: d.value,
        stage: d.stage,
        probability: d.probability,
        priority: d.priority,
        closer: d.closer,
        leadId: lead?.id || null,
        lostReason: (d as { lostReason?: string }).lostReason || null,
        expectedCloseDate: new Date(Date.now() + 15 * 86400000),
      },
    });
  }

  console.log(`Seeded ${sampleDeals.length} deals successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
