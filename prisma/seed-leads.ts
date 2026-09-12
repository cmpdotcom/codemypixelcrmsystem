import { prisma } from "@/lib/prisma";

const setterImages: Record<string, string> = {
  "Ali Khan": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "Fatima Noor": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
  "Usman Tariq": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "Sara Ahmed": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
};

const seedLeads = [
  {
    name: "John Carter", company: "ABC Technologies", email: "john@abc.com",
    phone: "+1 415 823 4567", location: "San Francisco, USA",
    linkedin: "linkedin.com/in/johncarter", source: "LinkedIn", service: "Custom ERP",
    status: "New", setter: "Ali Khan", budget: "$20,000 – $50,000", timeline: "1 – 3 months",
    companySize: "50–200 employees", industry: "Manufacturing",
  },
  {
    name: "Sarah Mitchell", company: "Global Tech Ltd.", email: "sarah@globaltech.com",
    phone: "+44 7700 900123", location: "London, UK",
    linkedin: "linkedin.com/in/sarahmitchell", source: "Website", service: "Website",
    status: "Contacted", setter: "Fatima Noor", budget: "$15,000 – $25,000", timeline: "2 months",
    companySize: "20–50 employees", industry: "E-commerce",
  },
  {
    name: "Michael Brown", company: "Bright Solutions", email: "michael@bright.com",
    phone: "+1 321 555 7890", location: "Austin, TX, USA",
    linkedin: "linkedin.com/in/michaelbrown", source: "Referral", service: "Mobile App",
    status: "Qualified", setter: "Usman Tariq", budget: "$40,000 – $60,000", timeline: "3 – 4 months",
    companySize: "100–300 employees", industry: "Logistics",
  },
  {
    name: "Emma Wilson", company: "Skyline Media", email: "emma@skyline.com",
    phone: "+61 412 345 678", location: "Sydney, Australia",
    linkedin: "linkedin.com/in/emmawilson", source: "Instagram", service: "Website",
    status: "Meeting", setter: "Sara Ahmed", budget: "$12,000 – $18,000", timeline: "1 month",
    companySize: "10–20 employees", industry: "Media & Design",
  },
  {
    name: "David Lee", company: "NextGen Co.", email: "david@nextgen.com",
    phone: "+1 646 555 1212", location: "New York, USA",
    linkedin: "linkedin.com/in/davidlee", source: "Cold Call", service: "CRM",
    status: "Not Interested", setter: "Ali Khan", budget: "$25,000", timeline: "Indefinite",
    companySize: "50–100 employees", industry: "FinTech",
  },
  {
    name: "Sophia Garcia", company: "Innovate Ltd.", email: "sophia@innovate.com",
    phone: "+34 600 123 456", location: "Madrid, Spain",
    linkedin: "linkedin.com/in/sophiagarcia", source: "Google Ads", service: "ERP",
    status: "Nurture", setter: "Fatima Noor", budget: "$35,000 – $50,000", timeline: "3 – 6 months",
    companySize: "80–150 employees", industry: "Manufacturing",
  },
  {
    name: "Daniel Kim", company: "FutureWorks", email: "daniel@futureworks.com",
    phone: "+82 10 1234 5678", location: "Seoul, South Korea",
    linkedin: "linkedin.com/in/danielkim", source: "Facebook", service: "Mobile App",
    status: "Qualified", setter: "Usman Tariq", budget: "$30,000 – $45,000", timeline: "2 – 3 months",
    companySize: "30–70 employees", industry: "SaaS",
  },
  {
    name: "Olivia Martinez", company: "Core Systems", email: "olivia@core.com",
    phone: "+1 213 555 9876", location: "Los Angeles, CA, USA",
    linkedin: "linkedin.com/in/oliviamartinez", source: "Website", service: "Custom ERP",
    status: "Proposal", setter: "Sara Ahmed", budget: "$50,000 – $80,000", timeline: "4 – 6 months",
    companySize: "150–400 employees", industry: "Healthcare",
  },
  {
    name: "James Anderson", company: "Vector Inc.", email: "james@vector.com",
    phone: "+1 305 555 4321", location: "Miami, FL, USA",
    linkedin: "linkedin.com/in/jamesanderson", source: "WhatsApp", service: "Website",
    status: "Contacted", setter: "Ali Khan", budget: "$10,000 – $15,000", timeline: "1 month",
    companySize: "10–30 employees", industry: "Real Estate",
  },
  {
    name: "Isabella Thomas", company: "Prime Digital", email: "isabella@prime.com",
    phone: "+1 617 555 7654", location: "Boston, MA, USA",
    linkedin: "linkedin.com/in/isabellathomas", source: "Referral", service: "CRM",
    status: "New", setter: "Fatima Noor", budget: "$20,000 – $30,000", timeline: "2 months",
    companySize: "40–90 employees", industry: "Retail",
  },
];

async function main() {
  console.log("Seeding leads...");
  for (const lead of seedLeads) {
    await prisma.lead.create({
      data: {
        ...lead,
        setterImg: setterImages[lead.setter] || null,
      },
    });
  }
  console.log(`Seeded ${seedLeads.length} leads.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
