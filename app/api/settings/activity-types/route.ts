import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_ACTIVITY_TYPES = [
  { id: "call", name: "Call", icon: "📞", color: "green", requirements: ["Date", "Description"], active: true },
  { id: "email", name: "Email", icon: "✉️", color: "blue", requirements: ["Date", "Description"], active: true },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", color: "green", requirements: ["Date"], active: true },
  { id: "meeting", name: "Meeting", icon: "🗓️", color: "purple", requirements: ["Date", "Time", "Description"], active: true },
  { id: "note", name: "Note", icon: "📝", color: "amber", requirements: ["Description"], active: true },
  { id: "sms", name: "SMS", icon: "📱", color: "cyan", requirements: ["Date"], active: true },
  { id: "demo", name: "Demo", icon: "🎯", color: "indigo", requirements: ["Date", "Time", "Related Lead"], active: true },
  { id: "task", name: "Task", icon: "✅", color: "rose", requirements: ["Date", "Description"], active: true },
  { id: "site-visit", name: "Site Visit", icon: "🏗️", color: "teal", requirements: ["Date", "Related Client"], active: true },
  { id: "video-call", name: "Video Call", icon: "🎥", color: "slate", requirements: ["Date", "Time", "Description"], active: true },
];

// GET /api/settings/activity-types
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "crm_activity_types" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json(DEFAULT_ACTIVITY_TYPES);
}

// POST /api/settings/activity-types
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (Array.isArray(body)) {
    await prisma.setting.upsert({
      where: { key: "crm_activity_types" },
      update: { value: JSON.stringify(body) },
      create: { key: "crm_activity_types", value: JSON.stringify(body) },
    });
  }

  return NextResponse.json({ success: true });
}
