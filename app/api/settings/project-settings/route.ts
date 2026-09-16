import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_STATUSES = [
  { label: "Not Started", color: "bg-slate-400" },
  { label: "Planning", color: "bg-blue-500" },
  { label: "Requirements", color: "bg-indigo-500" },
  { label: "Design", color: "bg-violet-500" },
  { label: "Development", color: "bg-sky-500" },
  { label: "Internal QA", color: "bg-cyan-500" },
  { label: "Client QA", color: "bg-teal-500" },
  { label: "Revision", color: "bg-amber-500" },
  { label: "Deployment", color: "bg-emerald-500" },
  { label: "Completed", color: "bg-green-600" },
  { label: "On Hold", color: "bg-orange-500" },
  { label: "Cancelled", color: "bg-red-500" },
];

const DEFAULT_TEMPLATES = [
  {
    name: "Website Project",
    stages: ["Requirements", "UI/UX", "Frontend", "Backend", "CMS", "Testing", "Client Review", "Deployment"],
  },
  {
    name: "ERP Project",
    stages: ["Requirement Analysis", "Database", "UI/UX", "HR Module", "CRM Module", "Accounting", "Inventory", "Reports", "QA", "UAT", "Deployment", "Training"],
  },
];

// GET /api/settings/project-settings
export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "project_settings_config" },
  });

  if (setting?.value) {
    try {
      return NextResponse.json(JSON.parse(setting.value));
    } catch {
      /* fallback */
    }
  }

  return NextResponse.json({
    statuses: DEFAULT_PROJECT_STATUSES,
    templates: DEFAULT_TEMPLATES,
  });
}

// POST /api/settings/project-settings
export async function POST(request: NextRequest) {
  const body = await request.json();

  await prisma.setting.upsert({
    where: { key: "project_settings_config" },
    update: { value: JSON.stringify(body) },
    create: { key: "project_settings_config", value: JSON.stringify(body) },
  });

  return NextResponse.json({ success: true });
}
