"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Activity,
  CheckCircle,
  AlertTriangle,
  CheckCheck,
  Clock,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

// --- KPI Stats Data ---
const kpiStats = [
  {
    title: "Total Projects",
    value: "48",
    icon: FolderKanban,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Active",
    value: "27",
    icon: Activity,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
  {
    title: "On Track",
    value: "21",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    title: "At Risk",
    value: "4",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    title: "Completed",
    value: "14",
    icon: CheckCheck,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    title: "Overdue",
    value: "3",
    icon: Clock,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
];

// --- Kanban Pipeline Data ---
type Health = "on-track" | "at-risk" | "critical";

interface KanbanProject {
  name: string;
  client: string;
  progress: number;
  health: Health;
  deadline: string;
  team: { initials: string; bg: string }[];
}

interface KanbanColumn {
  status: string;
  projects: KanbanProject[];
}

const healthColors: Record<Health, string> = {
  "on-track": "bg-emerald-500",
  "at-risk": "bg-amber-500",
  critical: "bg-rose-500",
};

const kanbanColumns: KanbanColumn[] = [
  {
    status: "Planning",
    projects: [
      {
        name: "E-commerce Platform",
        client: "TechCorp",
        progress: 15,
        health: "on-track",
        deadline: "Sep 30",
        team: [
          { initials: "AK", bg: "bg-blue-100 text-blue-700" },
          { initials: "SA", bg: "bg-emerald-100 text-emerald-700" },
          { initials: "UT", bg: "bg-purple-100 text-purple-700" },
        ],
      },
      {
        name: "CRM Migration",
        client: "DataSys",
        progress: 8,
        health: "on-track",
        deadline: "Oct 15",
        team: [
          { initials: "FN", bg: "bg-rose-100 text-rose-700" },
          { initials: "BK", bg: "bg-sky-100 text-sky-700" },
        ],
      },
    ],
  },
  {
    status: "Development",
    projects: [
      {
        name: "ABC ERP Implementation",
        client: "ABC Technologies",
        progress: 78,
        health: "on-track",
        deadline: "Sep 25",
        team: [
          { initials: "AK", bg: "bg-blue-100 text-blue-700" },
          { initials: "SA", bg: "bg-emerald-100 text-emerald-700" },
          { initials: "UT", bg: "bg-purple-100 text-purple-700" },
          { initials: "FN", bg: "bg-rose-100 text-rose-700" },
        ],
      },
      {
        name: "Mobile Banking App",
        client: "FinanceHub",
        progress: 45,
        health: "at-risk",
        deadline: "Oct 5",
        team: [
          { initials: "BK", bg: "bg-sky-100 text-sky-700" },
          { initials: "DM", bg: "bg-amber-100 text-amber-700" },
          { initials: "JL", bg: "bg-indigo-100 text-indigo-700" },
        ],
      },
      {
        name: "Inventory System",
        client: "RetailCo",
        progress: 62,
        health: "on-track",
        deadline: "Sep 28",
        team: [
          { initials: "SA", bg: "bg-emerald-100 text-emerald-700" },
          { initials: "FN", bg: "bg-rose-100 text-rose-700" },
        ],
      },
    ],
  },
  {
    status: "QA",
    projects: [
      {
        name: "Website Redesign",
        client: "CreativeCo",
        progress: 90,
        health: "on-track",
        deadline: "Sep 20",
        team: [
          { initials: "UT", bg: "bg-purple-100 text-purple-700" },
          { initials: "DM", bg: "bg-amber-100 text-amber-700" },
          { initials: "JL", bg: "bg-indigo-100 text-indigo-700" },
        ],
      },
      {
        name: "API Gateway",
        client: "TechCorp",
        progress: 85,
        health: "at-risk",
        deadline: "Sep 22",
        team: [
          { initials: "AK", bg: "bg-blue-100 text-blue-700" },
          { initials: "BK", bg: "bg-sky-100 text-sky-700" },
        ],
      },
    ],
  },
  {
    status: "UAT",
    projects: [
      {
        name: "HR Dashboard",
        client: "PeopleInc",
        progress: 95,
        health: "on-track",
        deadline: "Sep 18",
        team: [
          { initials: "FN", bg: "bg-rose-100 text-rose-700" },
          { initials: "SA", bg: "bg-emerald-100 text-emerald-700" },
          { initials: "DM", bg: "bg-amber-100 text-amber-700" },
        ],
      },
    ],
  },
  {
    status: "Deployment",
    projects: [
      {
        name: "Landing Page",
        client: "StartupX",
        progress: 100,
        health: "on-track",
        deadline: "Sep 15",
        team: [
          { initials: "JL", bg: "bg-indigo-100 text-indigo-700" },
          { initials: "BK", bg: "bg-sky-100 text-sky-700" },
        ],
      },
    ],
  },
];

// --- Project Table Data ---
interface ProjectRow {
  id: string;
  name: string;
  client: string;
  manager: { name: string; initials: string; bg: string };
  team: string;
  status: string;
  statusStyle: string;
  progress: number;
  health: Health;
  priority: "High" | "Medium" | "Low";
  priorityStyle: string;
  deadline: string;
}

const projects: ProjectRow[] = [
  {
    id: "PRJ-10291",
    name: "ABC ERP Implementation",
    client: "ABC Technologies",
    manager: { name: "Ali Khan", initials: "AK", bg: "bg-blue-100 text-blue-700" },
    team: "8 members",
    status: "Development",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    progress: 78,
    health: "on-track",
    priority: "High",
    priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100",
    deadline: "Sep 25, 2025",
  },
  {
    id: "PRJ-10292",
    name: "Mobile Banking App",
    client: "FinanceHub",
    manager: { name: "Sara Ahmed", initials: "SA", bg: "bg-emerald-100 text-emerald-700" },
    team: "6 members",
    status: "Development",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    progress: 45,
    health: "at-risk",
    priority: "High",
    priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100",
    deadline: "Oct 5, 2025",
  },
  {
    id: "PRJ-10293",
    name: "E-commerce Platform",
    client: "TechCorp",
    manager: { name: "Usman Tariq", initials: "UT", bg: "bg-purple-100 text-purple-700" },
    team: "5 members",
    status: "Planning",
    statusStyle: "bg-slate-100 text-slate-600 border border-slate-200",
    progress: 15,
    health: "on-track",
    priority: "Medium",
    priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    deadline: "Sep 30, 2025",
  },
  {
    id: "PRJ-10294",
    name: "Website Redesign",
    client: "CreativeCo",
    manager: { name: "Fatima Noor", initials: "FN", bg: "bg-rose-100 text-rose-700" },
    team: "4 members",
    status: "QA",
    statusStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    progress: 90,
    health: "on-track",
    priority: "Medium",
    priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    deadline: "Sep 20, 2025",
  },
  {
    id: "PRJ-10295",
    name: "CRM Migration",
    client: "DataSys",
    manager: { name: "Bilal Khan", initials: "BK", bg: "bg-sky-100 text-sky-700" },
    team: "3 members",
    status: "Planning",
    statusStyle: "bg-slate-100 text-slate-600 border border-slate-200",
    progress: 8,
    health: "on-track",
    priority: "Low",
    priorityStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    deadline: "Oct 15, 2025",
  },
  {
    id: "PRJ-10296",
    name: "Inventory System",
    client: "RetailCo",
    manager: { name: "David Miller", initials: "DM", bg: "bg-amber-100 text-amber-700" },
    team: "5 members",
    status: "Development",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    progress: 62,
    health: "on-track",
    priority: "Medium",
    priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    deadline: "Sep 28, 2025",
  },
  {
    id: "PRJ-10297",
    name: "API Gateway",
    client: "TechCorp",
    manager: { name: "Jane Lee", initials: "JL", bg: "bg-indigo-100 text-indigo-700" },
    team: "4 members",
    status: "QA",
    statusStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    progress: 85,
    health: "at-risk",
    priority: "High",
    priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100",
    deadline: "Sep 22, 2025",
  },
  {
    id: "PRJ-10298",
    name: "HR Dashboard",
    client: "PeopleInc",
    manager: { name: "Sara Ahmed", initials: "SA", bg: "bg-emerald-100 text-emerald-700" },
    team: "6 members",
    status: "UAT",
    statusStyle: "bg-purple-50 text-purple-600 border border-purple-100",
    progress: 95,
    health: "on-track",
    priority: "Medium",
    priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    deadline: "Sep 18, 2025",
  },
];

const healthDotColor: Record<Health, string> = {
  "on-track": "bg-emerald-500",
  "at-risk": "bg-amber-500",
  critical: "bg-rose-500",
};

const healthLabel: Record<Health, string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  critical: "Critical",
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.manager.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Projects
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage projects, teams, milestones, tasks and delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="block w-full sm:w-56 pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
            />
          </div>

          <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpiStats.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mb-2.5 ${kpi.iconBg} ${kpi.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 leading-tight">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                {kpi.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Project Pipeline (Kanban) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Project Pipeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Projects grouped by delivery stage
            </p>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
            View Board
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kanbanColumns.map((column) => (
            <div key={column.status} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    {column.status}
                  </span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {column.projects.length}
                  </span>
                </div>
                <button className="p-0.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Project Mini Cards */}
              <div className="space-y-2.5">
                {column.projects.map((project, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <Link href="/projects/1" className="block">
                      <p className="font-bold text-slate-900 text-xs leading-tight hover:text-blue-600 transition-colors">
                        {project.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {project.client}
                      </p>
                    </Link>

                    {/* Progress Bar */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Progress
                        </span>
                        <span className="text-[10px] font-bold text-slate-700">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${healthColors[project.health]}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Team Avatars + Deadline */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex -space-x-1.5">
                        {project.team.map((member, mIdx) => (
                          <div
                            key={mIdx}
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[8px] ring-1 ring-white ${member.bg}`}
                          >
                            {member.initials}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {project.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">All Projects</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredProjects.length} projects found
            </p>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="py-3 px-3 font-medium">Project ID</th>
                <th className="py-3 px-3 font-medium">Project Name</th>
                <th className="py-3 px-3 font-medium">Project Manager</th>
                <th className="py-3 px-3 font-medium">Team</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium">Progress</th>
                <th className="py-3 px-3 font-medium">Priority</th>
                <th className="py-3 px-3 font-medium">Deadline</th>
                <th className="py-3 px-3 font-medium">Health</th>
                <th className="py-3 px-2 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Project ID */}
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] text-slate-500 font-medium">
                      {project.id}
                    </span>
                  </td>

                  {/* Project Name + Client */}
                  <td className="py-3 px-3">
                    <Link href="/projects/1" className="block">
                      <p className="font-bold text-slate-900 leading-tight hover:text-blue-600 transition-colors">
                        {project.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {project.client}
                      </p>
                    </Link>
                  </td>

                  {/* Project Manager */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${project.manager.bg}`}
                      >
                        {project.manager.initials}
                      </div>
                      <span className="font-medium text-slate-700">
                        {project.manager.name}
                      </span>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-600 font-medium">
                      {project.team}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${project.statusStyle}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  {/* Progress */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${healthColors[project.health]}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 w-8">
                        {project.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${project.priorityStyle}`}
                    >
                      {project.priority}
                    </span>
                  </td>

                  {/* Deadline */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-xs text-slate-600 font-medium">
                      {project.deadline}
                    </span>
                  </td>

                  {/* Health */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${healthDotColor[project.health]}`}
                      />
                      <span className="text-[10px] text-slate-500 font-medium">
                        {healthLabel[project.health]}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">1</span> to{" "}
            <span className="font-bold text-slate-800">{filteredProjects.length}</span> of{" "}
            <span className="font-bold text-slate-800">48</span> projects
          </p>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </button>
            <button className="w-7 h-7 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs">
              1
            </button>
            <button className="w-7 h-7 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              2
            </button>
            <button className="w-7 h-7 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              3
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
