import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/leads/[id]/files
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/leads/[id]/files">,
) {
  const { id } = await ctx.params;
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
      uploadedBy: body.uploadedBy || null,
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
