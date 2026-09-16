import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/team/developers - live task completion rates, estimated vs logged hours, and active sprints from Task table
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const [allUsers, allTasks, allProjects] = await Promise.all([
    prisma.user.findMany({
      include: {
        role: true,
        team: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.task.findMany({
      select: {
        id: true,
        name: true,
        projectName: true,
        assignee: true,
        status: true,
        priority: true,
        progress: true,
        estimatedHours: true,
        loggedHours: true,
        dueDate: true,
      },
    }),
    prisma.project.findMany({
      select: { id: true, name: true, teamMembers: true },
    }),
  ]);

  const devUsers = allUsers.filter(
    (u) =>
      u.role?.name === "Developer" ||
      u.role?.name === "QA" ||
      u.team?.name?.includes("Dev") ||
      u.team?.name?.includes("Delivery") ||
      allTasks.some((t) => t.assignee?.toLowerCase() === `${u.firstName} ${u.lastName}`.toLowerCase())
  );

  const candidateUsers = devUsers.length > 0
    ? devUsers
    : allUsers.filter((u) => u.team?.name?.includes("Dev") || u.team?.name?.includes("Delivery"));

  const now = new Date();

  const developers = candidateUsers.map((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.trim();
    const assignedTasks = allTasks.filter(
      (t) => t.assignee?.toLowerCase() === fullName.toLowerCase()
    );

    const totalTasks = assignedTasks.length;
    const completedTasks = assignedTasks.filter((t) => t.status === "Done").length;
    const activeTasks = assignedTasks.filter((t) => t.status === "In Progress" || t.status === "Code Review" || t.status === "QA").length;
    const blockedTasks = assignedTasks.filter((t) => t.status === "Blocked").length;
    const overdueTasks = assignedTasks.filter((t) => t.status !== "Done" && new Date(t.dueDate) < now).length;

    const totalEstimated = assignedTasks.reduce((s, t) => s + t.estimatedHours, 0);
    const totalLogged = assignedTasks.reduce((s, t) => s + t.loggedHours, 0);

    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0.0";

    return {
      id: u.id,
      name: fullName,
      email: u.email,
      role: u.role?.name || "Developer",
      team: u.team?.name || "Development Team",
      status: u.status,
      totalTasks,
      completedTasks,
      activeTasks,
      blockedTasks,
      overdueTasks,
      totalEstimated,
      totalLogged,
      completionRate: `${completionRate}%`,
      completionNum: parseFloat(completionRate),
    };
  });

  const filtered = search
    ? developers.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()))
    : developers;

  const totalDevTasks = allTasks.length;
  const totalCompleted = allTasks.filter((t) => t.status === "Done").length;
  const totalHoursLogged = allTasks.reduce((s, t) => s + t.loggedHours, 0);
  const totalBlocked = allTasks.filter((t) => t.status === "Blocked").length;

  return NextResponse.json({
    developers: filtered.sort((a, b) => b.completedTasks - a.completedTasks),
    kpi: {
      activeDevsCount: candidateUsers.filter((u) => u.status === "Active").length,
      totalDevTasks,
      totalCompleted,
      totalHoursLogged: Math.round(totalHoursLogged),
      totalBlocked,
    },
  });
}
