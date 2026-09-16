import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings — fetch all settings as a key-value object
export async function GET() {
  const settings = await prisma.setting.findMany();
  const obj: Record<string, string> = {};
  for (const s of settings) obj[s.key] = s.value;
  return NextResponse.json(obj);
}

// PUT /api/settings — upsert multiple settings
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const entries = Object.entries(body) as [string, string][];

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  return NextResponse.json({ success: true, saved: entries.length });
}
