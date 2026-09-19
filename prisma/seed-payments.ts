import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding sample payments...");

  const deals = await prisma.deal.findMany();
  const clients = await prisma.client.findMany();
  const dealMap = (title: string) => deals.find((d) => d.title.toLowerCase().includes(title.toLowerCase()));
  const clientMap = (company: string) => clients.find((c) => c.company.toLowerCase() === company.toLowerCase());

  const now = Date.now();
  const day = 86400000;

  const samplePayments = [
    // Paid
    { label: "1st Installment", clientName: "Acme Corp.", dealTitle: "Enterprise ERP Overhaul", amount: 20000, status: "Paid", method: "Bank Transfer", dueDate: new Date(now - 40 * day), paidAt: new Date(now - 38 * day), description: "Milestone 1 payment - project kickoff" },
    { label: "2nd Installment", clientName: "Acme Corp.", dealTitle: "Enterprise ERP Overhaul", amount: 10000, status: "Paid", method: "Bank Transfer", dueDate: new Date(now - 10 * day), paidAt: new Date(now - 9 * day), description: "Milestone 2 payment - development phase" },
    { label: "Full Payment", clientName: "Global Retail", dealTitle: "E-commerce Global Store", amount: 35000, status: "Paid", method: "Stripe", dueDate: new Date(now - 25 * day), paidAt: new Date(now - 25 * day), description: "Full upfront payment for e-commerce build" },
    { label: "1st Installment", clientName: "SaaSify Inc.", dealTitle: "Cloud Portal SaaS", amount: 12500, status: "Paid", method: "Credit Card", dueDate: new Date(now - 20 * day), paidAt: new Date(now - 18 * day), description: "50% advance payment" },
    { label: "Advance Payment", clientName: "Apex Logistics", dealTitle: "Corporate Mobile App", amount: 10000, status: "Paid", method: "Bank Transfer", dueDate: new Date(now - 15 * day), paidAt: new Date(now - 14 * day), description: "Contract signing advance" },

    // Pending
    { label: "Final Payment", clientName: "Acme Corp.", dealTitle: "Enterprise ERP Overhaul", amount: 10000, status: "Pending", method: "Bank Transfer", dueDate: new Date(now + 7 * day), description: "Final payment on delivery & UAT sign-off" },
    { label: "2nd Installment", clientName: "SaaSify Inc.", dealTitle: "Cloud Portal SaaS", amount: 12500, status: "Pending", method: "Credit Card", dueDate: new Date(now + 12 * day), description: "Balance payment before go-live" },
    { label: "Milestone 2", clientName: "Apex Logistics", dealTitle: "Corporate Mobile App", amount: 15000, status: "Pending", method: "Bank Transfer", dueDate: new Date(now + 20 * day), description: "Payment on beta release" },
    { label: "1st Installment", clientName: "Zenith Corp.", dealTitle: "Enterprise ERP", amount: 15000, status: "Pending", method: "Bank Transfer", dueDate: new Date(now + 10 * day), description: "Contract kickoff payment" },
    { label: "Deposit", clientName: "Delta Systems", dealTitle: "Website Redesign & SEO", amount: 9000, status: "Pending", method: "PayPal", dueDate: new Date(now + 5 * day), description: "50% deposit to start work" },

    // Overdue
    { label: "2nd Installment", clientName: "Global Retail", dealTitle: "E-commerce Global Store", amount: 5000, status: "Overdue", method: "Stripe", dueDate: new Date(now - 5 * day), description: "Post-launch support add-on" },
    { label: "Final Payment", clientName: "Horizon Ltd.", dealTitle: "Fintech Mobile App", amount: 7500, status: "Overdue", method: "Bank Transfer", dueDate: new Date(now - 12 * day), description: "Final balance - invoice sent twice" },

    // Partial
    { label: "1st Installment", clientName: "Elevate Tech", dealTitle: "Custom CRM Deployment", amount: 11000, status: "Partial", method: "Bank Transfer", dueDate: new Date(now + 3 * day), paidAt: new Date(now - 2 * day), description: "Partial payment received - $6,000 of $11,000" },

    // Refunded
    { label: "Refund", clientName: "Pioneer Group", dealTitle: "Legacy Migration", amount: 4000, status: "Refunded", method: "Bank Transfer", dueDate: new Date(now - 30 * day), paidAt: new Date(now - 30 * day), description: "Deal lost - deposit refunded" },
  ];

  let count = 0;
  for (const p of samplePayments) {
    const deal = p.dealTitle ? dealMap(p.dealTitle) : undefined;
    const client = clientMap(p.clientName);
    await prisma.payment.create({
      data: {
        invoiceNumber: `INV-2026-${String(count + 1).padStart(3, "0")}`,
        label: p.label,
        description: p.description,
        clientName: p.clientName,
        dealTitle: p.dealTitle,
        amount: p.amount,
        status: p.status,
        method: p.method,
        dueDate: p.dueDate,
        paidAt: p.paidAt || null,
        dealId: deal?.id || null,
        clientId: client?.id || null,
      },
    });
    count++;
  }

  console.log(`Seeded ${count} payments successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
