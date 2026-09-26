import { NextResponse } from "next/server";
import { getActor, getPickerOptions } from "@/lib/workflow";

// GET /api/workflow/people - closers, developers, testers, DevOps and teams for assignment pickers
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getPickerOptions());
}
