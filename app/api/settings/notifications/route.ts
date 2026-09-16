import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_NOTIFICATIONS = {
  // CRM Events
  notif_new_lead: "true",
  notif_lead_assigned: "true",
  notif_lead_qualified: "true",
  notif_deal_assigned: "true",
  notif_deal_won: "true",
  notif_deal_lost: "false",
  notif_followup_due: "true",
  notif_followup_overdue: "true",
  notif_task_assigned: "true",
  notif_task_due: "true",
  notif_task_overdue: "false",
  notif_payment_received: "true",
  notif_payment_due: "true",
  notif_project_milestone: "true",

  // Channels
  channel_in_app: "true",
  channel_email: "true",
  channel_whatsapp: "false",
  channel_sms: "false",
  channel_push: "true",

  // Quiet Hours
  quiet_hours_enabled: "false",
  quiet_hours_start: "22:00",
  quiet_hours_end: "08:00",
};

// GET /api/settings/notifications
export async function GET() {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        startsWith: "notif_",
      },
    },
  });

  const channels = await prisma.setting.findMany({
    where: {
      key: {
        startsWith: "channel_",
      },
    },
  });

  const quiet = await prisma.setting.findMany({
    where: {
      key: {
        startsWith: "quiet_hours_",
      },
    },
  });

  const map: Record<string, string> = { ...DEFAULT_NOTIFICATIONS };
  for (const item of [...settings, ...channels, ...quiet]) {
    map[item.key] = item.value;
  }

  return NextResponse.json(map);
}

// POST /api/settings/notifications
export async function POST(request: NextRequest) {
  const body = await request.json();

  const entries = Object.entries(body) as [string, string][];

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  return NextResponse.json({ success: true });
}
