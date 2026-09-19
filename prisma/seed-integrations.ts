import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding integrations catalog...");

  const admin = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  const connectedBy = admin ? `${admin.firstName} ${admin.lastName}`.trim() : "System Admin";

  const integrations = [
    // Genuinely configured in this project
    {
      key: "postgresql", name: "PostgreSQL (AWS RDS)",
      description: "Primary relational database powering all CRM records, users, deals, and analytics.",
      category: "Storage", icon: "Database", color: "blue", status: "Connected",
      config: { host: "AWS RDS (us-east-1)", driver: "Prisma ORM" },
    },
    {
      key: "nextauth", name: "Auth.js / NextAuth",
      description: "Credentials authentication with JWT sessions, bcrypt password hashing, and Prisma adapter.",
      category: "Developer", icon: "KeyRound", color: "purple", status: "Connected",
      config: { strategy: "JWT sessions", provider: "Credentials" },
    },
    {
      key: "turnstile", name: "Cloudflare Turnstile",
      description: "Bot protection and CAPTCHA verification on the signup flow.",
      category: "Developer", icon: "ShieldCheck", color: "amber", status: "Connected",
      config: { scope: "Signup form" },
    },
    {
      key: "firebase", name: "Firebase",
      description: "Firebase app initialized for future realtime and messaging features.",
      category: "Developer", icon: "Flame", color: "amber", status: "Connected",
      config: { services: "Auth-ready, Firestore-ready" },
    },
    {
      key: "uploadthing", name: "UploadThing",
      description: "File and image uploads for company logos, branding assets, and attachments.",
      category: "Storage", icon: "Upload", color: "rose", status: "Connected",
      config: { usage: "Company logo, favicon, email/invoice logos" },
    },

    // Available to connect
    {
      key: "stripe", name: "Stripe",
      description: "Accept online payments, auto-generate invoices, and sync payment status with the Payments module.",
      category: "Payments", icon: "CreditCard", color: "purple", status: "Not Connected",
    },
    {
      key: "paypal", name: "PayPal",
      description: "Collect invoice payments via PayPal checkout and reconcile with deal records.",
      category: "Payments", icon: "Wallet", color: "blue", status: "Not Connected",
    },
    {
      key: "slack", name: "Slack",
      description: "Push CRM notifications (new lead, deal won, payment received) into Slack channels.",
      category: "Communication", icon: "MessageSquare", color: "purple", status: "Not Connected",
    },
    {
      key: "whatsapp", name: "WhatsApp Business",
      description: "Send follow-up reminders, lead updates, and client messages through WhatsApp Business API.",
      category: "Communication", icon: "Phone", color: "green", status: "Not Connected",
    },
    {
      key: "sendgrid", name: "SendGrid Email",
      description: "Transactional email delivery for invoices, follow-up reminders, and team notifications.",
      category: "Communication", icon: "Mail", color: "blue", status: "Not Connected",
    },
    {
      key: "twilio", name: "Twilio SMS",
      description: "SMS alerts for overdue follow-ups, task deadlines, and payment reminders.",
      category: "Communication", icon: "Smartphone", color: "rose", status: "Not Connected",
    },
    {
      key: "google-calendar", name: "Google Calendar",
      description: "Two-way sync for meetings, follow-up schedules, and milestone deadlines.",
      category: "Productivity", icon: "Calendar", color: "blue", status: "Not Connected",
    },
    {
      key: "google-analytics", name: "Google Analytics",
      description: "Track lead capture forms and marketing source attribution.",
      category: "Analytics", icon: "BarChart3", color: "amber", status: "Not Connected",
    },
    {
      key: "github", name: "GitHub",
      description: "Link deployments, commits, and pull requests to projects and tasks.",
      category: "Developer", icon: "GitBranch", color: "slate", status: "Not Connected",
    },
    {
      key: "zapier", name: "Zapier",
      description: "Connect CMP CRM to 6,000+ apps with automated workflows — no code required.",
      category: "Productivity", icon: "Zap", color: "amber", status: "Not Connected",
    },
    {
      key: "mailchimp", name: "Mailchimp",
      description: "Sync leads and clients into email marketing audiences and drip campaigns.",
      category: "Marketing", icon: "MailPlus", color: "amber", status: "Not Connected",
    },
    {
      key: "hubspot", name: "HubSpot",
      description: "Import historical leads, deals, and contact timelines from HubSpot CRM.",
      category: "Marketing", icon: "Globe", color: "rose", status: "Not Connected",
    },
    {
      key: "aws-s3", name: "AWS S3",
      description: "Extended file storage for lead attachments, contracts, and project deliverables.",
      category: "Storage", icon: "HardDrive", color: "amber", status: "Not Connected",
    },
  ];

  for (const i of integrations) {
    await prisma.integration.upsert({
      where: { key: i.key },
      update: {},
      create: {
        key: i.key,
        name: i.name,
        description: i.description,
        category: i.category,
        icon: i.icon || null,
        color: i.color,
        status: i.status,
        config: i.config || undefined,
        connectedAt: i.status === "Connected" ? new Date() : null,
        connectedBy: i.status === "Connected" ? connectedBy : null,
      },
    });
  }

  console.log(`Seeded ${integrations.length} integrations successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
