"use client";

import {
  Plus,
  Flag,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  CheckSquare,
} from "lucide-react";

type MilestoneStatus = "Completed" | "In Progress" | "Not Started";

interface Milestone {
  id: string;
  name: string;
  project: string;
  status: MilestoneStatus;
  progress: number;
  deadline: string;
  taskCount: number;
  taskTotal: number;
  owner: string;
  ownerInitials: string;
}

const statusConfig: Record<MilestoneStatus, { dot: string; text: string }> = {
  Completed: { dot: "bg-green-500", text: "text-green-700" },
  "In Progress": { dot: "bg-blue-500", text: "text-blue-700" },
  "Not Started": { dot: "bg-slate-400", text: "text-slate-600" },
};

const projectGroups: { project: string; milestones: Milestone[] }[] = [
  {
    project: "ABC ERP Implementation",
    milestones: [
      { id: "MST-101", name: "Requirements Gathering & Analysis", project: "ABC ERP Implementation", status: "Completed", progress: 100, deadline: "2025-01-15", taskCount: 18, taskTotal: 18, owner: "Aarav Sharma", ownerInitials: "AS" },
      { id: "MST-102", name: "Core Module Development", project: "ABC ERP Implementation", status: "In Progress", progress: 65, deadline: "2025-02-28", taskCount: 24, taskTotal: 40, owner: "Karthik Reddy", ownerInitials: "KR" },
      { id: "MST-103", name: "Integration & API Connectivity", project: "ABC ERP Implementation", status: "In Progress", progress: 30, deadline: "2025-03-20", taskCount: 8, taskTotal: 26, owner: "Priya Nair", ownerInitials: "PN" },
      { id: "MST-104", name: "User Acceptance Testing", project: "ABC ERP Implementation", status: "Not Started", progress: 0, deadline: "2025-04-10", taskCount: 0, taskTotal: 22, owner: "Aarav Sharma", ownerInitials: "AS" },
    ],
  },
  {
    project: "Mobile Banking App",
    milestones: [
      { id: "MST-201", name: "Design System & Prototyping", project: "Mobile Banking App", status: "Completed", progress: 100, deadline: "2025-01-20", taskCount: 15, taskTotal: 15, owner: "Sneha Iyer", ownerInitials: "SI" },
      { id: "MST-202", name: "Authentication & Security Layer", project: "Mobile Banking App", status: "In Progress", progress: 75, deadline: "2025-02-25", taskCount: 12, taskTotal: 16, owner: "Priya Nair", ownerInitials: "PN" },
      { id: "MST-203", name: "Transaction Features Rollout", project: "Mobile Banking App", status: "Not Started", progress: 0, deadline: "2025-03-30", taskCount: 0, taskTotal: 28, owner: "Karthik Reddy", ownerInitials: "KR" },
    ],
  },
  {
    project: "Website Redesign",
    milestones: [
      { id: "MST-301", name: "Content Audit & Information Architecture", project: "Website Redesign", status: "Completed", progress: 100, deadline: "2025-01-10", taskCount: 10, taskTotal: 10, owner: "Divya Rao", ownerInitials: "DR" },
      { id: "MST-302", name: "Visual Design & Frontend Build", project: "Website Redesign", status: "In Progress", progress: 45, deadline: "2025-02-22", taskCount: 9, taskTotal: 20, owner: "Rohan Mehta", ownerInitials: "RM" },
    ],
  },
];

const kpis = [
  { label: "Total Milestones", value: 24, icon: Flag, iconBg: "bg-blue-50", iconText: "text-blue-600" },
  { label: "Completed", value: 12, icon: CheckCircle, iconBg: "bg-green-50", iconText: "text-green-600" },
  { label: "In Progress", value: 6, icon: Clock, iconBg: "bg-amber-50", iconText: "text-amber-600" },
  { label: "Overdue", value: 2, icon: AlertCircle, iconBg: "bg-red-50", iconText: "text-red-600" },
];

export default function MilestonesPage() {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Milestones</h1>
          <p className="mt-1 text-xs text-slate-500">Track milestones across all projects</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Add Milestone
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{kpi.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconBg}`}>
                  <Icon className={`h-5 w-5 ${kpi.iconText}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        {projectGroups.map((group) => (
          <div key={group.project} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                <h2 className="text-sm font-semibold text-slate-800">{group.project}</h2>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">{group.milestones.length} milestones</span>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                View project
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {group.milestones.map((milestone) => {
                const cfg = statusConfig[milestone.status];
                return (
                  <div key={milestone.id} className="flex flex-col gap-4 px-4 py-4 transition hover:bg-slate-50/50 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3 md:w-[30%]">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <Flag className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-800">{milestone.name}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
                          <span className={`text-[10px] font-medium ${cfg.text}`}>{milestone.status}</span>
                          <span className="text-[10px] text-slate-400">• {milestone.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-[25%]">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-500">Progress</span>
                        <span className="text-[10px] font-semibold text-slate-700">{milestone.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${milestone.status === "Completed" ? "bg-green-500" : milestone.status === "In Progress" ? "bg-blue-500" : "bg-slate-300"}`} style={{ width: `${milestone.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 md:w-[15%]">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs text-slate-600">{formatDate(milestone.deadline)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 md:w-[12%]">
                      <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs text-slate-600">{milestone.taskCount}/{milestone.taskTotal} tasks</span>
                    </div>

                    <div className="flex items-center justify-between md:w-[10%] md:justify-end">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">{milestone.ownerInitials}</div>
                      </div>
                      <button className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
