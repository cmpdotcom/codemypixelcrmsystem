import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessLead, getActor } from "@/lib/workflow";

async function authorize(id: string) {
  const actor = await getActor();
  if (!actor) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const lead = await prisma.lead.findUnique({ where: { id }, select: { setterId: true, setter: true, closerId: true } });
  if (!lead || !canAccessLead(actor, lead)) return { error: NextResponse.json({ error: "Lead not found" }, { status: 404 }) };
  return { actor };
}

// GET /api/leads/[id]/files
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/files">,
) {
  const { id } = await ctx.params;
  const { error } = await authorize(id);
  if (error) return error;
  const files = await prisma.leadFile.findMany({
    where: { leadId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(files);
}

// POST /api/leads/[id]/files
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/files">,
) {
  const { id } = await ctx.params;
  const { actor, error } = await authorize(id);
  if (error) return error;
  const body = await request.json();

  if (!body.fileName || !body.fileUrl) {
    return NextResponse.json({ error: "fileName and fileUrl are required" }, { status: 400 });
  }

  const file = await prisma.leadFile.create({
    data: {
      leadId: id,
      fileName: body.fileName,
      fileSize: body.fileSize || 0,
      fileType: body.fileType || null,
      fileUrl: body.fileUrl,
      uploadedBy: actor.name || null,
    },
  });

  return NextResponse.json(file, { status: 201 });
}

// DELETE /api/leads/[id]/files?fileId=xxx
export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/files">,
) {
  const { id } = await ctx.params;
  const { error } = await authorize(id);
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json({ error: "fileId is required" }, { status: 400 });
  }

  await prisma.leadFile.delete({
    where: { id: fileId, leadId: id },
  });

  return NextResponse.json({ success: true });
}
