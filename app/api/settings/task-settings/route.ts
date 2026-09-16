import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_TASK_SETTINGS = {
  statuses: [
    { label: "Backlog", color: "bg-slate-100 text-slate-600 border-slate-200" },
    { label: "Todo", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { label: "In Progress", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    { label: "Code Review", color: "bg-violet-50 text-violet-600 border-violet-200" },
    { label: "QA", color: "bg-amber-50 text-amber-600 border-amber-200" },
    { label: "Revision", color: "bg-orange-50 text-orange-600 border-orange-200" },
    { label: "Done", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { label: "Blocked", color: "bg-rose-50 text-rose-600 border-rose-200" },
  ],
  priorities: [
    { label: "Low", color: "bg-emerald-500", description: "No urgency" },
    { label: "Medium", color: "bg-amber-500", description: "Normal priority" },
    { label: "High", color: "bg-orange-500", description: "Important" },
    { label: "Urgent", color: "bg-red-500", description: "Critical - immediate action" },
  ],
  defaultAssignee: "Unassigned",
  defaultPriority: "Medium",
  defaultDueOffset: "1 week",
  autoCreateFromDeals: "true",
};

// GET /api/settings/task-settings
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "task_settings_config" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json(DEFAULT_TASK_SETTINGS);
}

// POST /api/settings/task-settings
export async function POST(request: NextRequest) {
  const body = await request.json();

  await prisma.setting.upsert({
    where: { key: "task_settings_config" },
    update: { value: JSON.stringify(body) },
    create: { key: "task_settings_config", value: JSON.stringify(body) },
  });

  return NextResponse.json({ success: true });
}
