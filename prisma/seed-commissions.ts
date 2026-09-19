import { prisma } from "../lib/prisma";

const CLOSER_RATE = 0.1; // 10% of deal value
const SETTER_QUALIFIED_BONUS = 150; // flat per qualified lead handoff
const SETTER_MEETING_BONUS = 75;

const SETTERS = ["Ali Khan", "Usman Tariq"];
const SETTER_DEALS: Record<string, string> = {
  "Ali Khan": "Sara Ahmed",
  "Usman Tariq": "Fatima Noor",
};

function periodOf(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

async function main() {
  console.log("Seeding commissions from won deals and setter bonuses...");

  const wonDeals = await prisma.deal.findMany({ where: { stage: "won" } });
  const paidPayments = await prisma.payment.findMany({
    where: { status: "Paid" },
    include: { deal: true },
  });

  const now = Date.now();
  const day = 86400000;
  let count = 0;

  // Closer commissions: 10% of each won deal
  for (const deal of wonDeals) {
    const earnedAt = deal.closedAt || deal.createdAt;
    const isPaid = earnedAt.getTime() < now - 20 * day;
    await prisma.commission.create({
      data: {
        memberName: deal.closer || "Ali Khan",
        memberRole: "Closer",
        dealTitle: deal.title,
        clientName: deal.company,
        basis: `${CLOSER_RATE * 100}% of deal value`,
        rate: CLOSER_RATE * 100,
        dealValue: deal.value,
        amount: Math.round(deal.value * CLOSER_RATE),
        status: isPaid ? "Paid" : "Approved",
        period: periodOf(earnedAt),
        earnedAt,
        paidAt: isPaid ? new Date(earnedAt.getTime() + 10 * day) : null,
        dealId: deal.id,
        notes: `Deal won - ${deal.title}`,
      },
    });
    count++;
  }

  // Setter bonuses tied to the same won deals (handoff credit)
  for (const setter of SETTERS) {
    const linkedDeal = wonDeals.find((d) => d.closer === SETTER_DEALS[setter]);
    await prisma.commission.create({
      data: {
        memberName: setter,
        memberRole: "Setter",
        dealTitle: linkedDeal?.title || "Qualified pipeline handoff",
        clientName: linkedDeal?.company || null,
        basis: `Qualified lead handoff bonus`,
        rate: 0,
        dealValue: linkedDeal?.value || 0,
        amount: SETTER_QUALIFIED_BONUS,
        status: "Paid",
        period: periodOf(new Date(now - 30 * day)),
        earnedAt: new Date(now - 30 * day),
        paidAt: new Date(now - 18 * day),
        dealId: linkedDeal?.id || null,
        notes: "Lead qualified and handed off to closing team",
      },
    });
    count++;

    await prisma.commission.create({
      data: {
        memberName: setter,
        memberRole: "Setter",
        dealTitle: null,
        clientName: null,
        basis: `Meetings booked bonus (3 meetings)`,
        rate: 0,
        dealValue: 0,
        amount: SETTER_MEETING_BONUS * 3,
        status: "Pending",
        period: periodOf(new Date(now - 5 * day)),
        earnedAt: new Date(now - 5 * day),
        notes: "3 discovery meetings booked this cycle",
      },
    });
    count++;
  }

  // Collection bonus: 2% of each paid payment to the deal's closer
  for (const payment of paidPayments.slice(0, 4)) {
    const closer = payment.deal?.closer;
    if (!closer) continue;
    const earnedAt = payment.paidAt || payment.createdAt;
    await prisma.commission.create({
      data: {
        memberName: closer,
        memberRole: "Closer",
        dealTitle: payment.dealTitle,
        clientName: payment.clientName,
        basis: `2% collection bonus on ${payment.invoiceNumber}`,
        rate: 2,
        dealValue: payment.amount,
        amount: Math.round(payment.amount * 0.02),
        status: "Pending",
        period: periodOf(earnedAt),
        earnedAt,
        dealId: payment.dealId,
        paymentId: payment.id,
        notes: `Payment ${payment.invoiceNumber} collected`,
      },
    });
    count++;
  }

  console.log(`Seeded ${count} commissions successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
