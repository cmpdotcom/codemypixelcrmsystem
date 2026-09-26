import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AssignmentError,
  addProjectAssignments,
  getActor,
  parseAssignments,
  projectScope,
  syncProjectTeamMembers,
} from "@/lib/workflow";

const assignmentSelect = {
  id: true,
  role: true,
  isLead: true,
  assignedByName: true,
  createdAt: true,
  user: { select: { id: true, firstName: true, lastName: true, image: true, email: true, role: { select: { name: true } } } },
  team: {
    select: {
      id: true,
      name: true,
      department: true,
      color: true,
      _count: { select: { members: true } },
    },
  },
} as const;

// GET /api/projects/[id]/assignments - who is developing, testing and deploying this project
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/projects/[id]/assignments">,
) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const project = await prisma.project.findFirst({ where: { AND: [{ id }, projectScope(actor)] }, select: { id: true } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const assignments = await prisma.projectAssignment.findMany({
    where: { projectId: id },
    select: assignmentSelect,
    orderBy: [{ role: "asc" }, { isLead: "desc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ assignments, canManage: actor.isManager });
}

// POST /api/projects/[id]/assignments - add a developer, tester or DevOps (person or team) at any time
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/projects/[id]/assignments">,
) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!actor.isManager) {
    return NextResponse.json({ error: "Only executives and managers can assign project teams" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const entries = parseAssignments(Array.isArray(body?.assignments) ? body.assignments : [body]);
  if (entries.length === 0) {
    return NextResponse.json({ error: "Choose a person or a team to assign" }, { status: 400 });
  }

  try {
    const created = await addProjectAssignments(id, entries, actor);
    return NextResponse.json({ created: created.length }, { status: 201 });
  } catch (error) {
    if (error instanceof AssignmentError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
}

// DELETE /api/projects/[id]/assignments?assignmentId=... - remove someone from the project
export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/projects/[id]/assignments">,
) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!actor.isManager) {
    return NextResponse.json({ error: "Only executives and managers can change project teams" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const assignmentId = new URL(request.url).searchParams.get("assignmentId") || "";
  const result = await prisma.projectAssignment.deleteMany({ where: { id: assignmentId, projectId: id } });
  if (result.count === 0) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  await syncProjectTeamMembers(id);
  return NextResponse.json({ success: true });
}
