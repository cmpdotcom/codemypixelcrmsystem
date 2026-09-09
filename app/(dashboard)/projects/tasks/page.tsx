"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  CheckSquare,
  Calendar,
  MoreHorizontal,
  LayoutGrid,
  List,
} from "lucide-react";

type Priority = "High" | "Medium" | "Low";
type Status =
  | "Backlog"
  | "Todo"
  | "In Progress"
  | "Code Review"
  | "QA"
  | "Done";

interface Task {
  id: string;
  name: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  priority: Priority;
  status: Status;
  dueDate: string;
}

const priorityDot: Record<Priority, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-green-500",
};

const priorityText: Record<Priority, string> = {
  High: "text-red-600",
  Medium: "text-amber-600",
  Low: "text-green-600",
};

const statusStyles: Record<Status, string> = {
  Backlog: "bg-slate-100 text-slate-600",
  Todo: "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-100 text-blue-700",
  "Code Review": "bg-violet-100 text-violet-700",
  QA: "bg-amber-100 text-amber-700",
  Done: "bg-green-100 text-green-700",
};

const columns: Status[] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Code Review",
  "QA",
  "Done",
];

const tasks: Task[] = [
  { id: "TSK-001", name: "Design database schema for user module", project: "ABC ERP Implementation", assignee: "Aarav Sharma", assigneeInitials: "AS", priority: "High", status: "Backlog", dueDate: "2025-02-18" },
  { id: "TSK-002", name: "Research authentication libraries", project: "Mobile Banking App", assignee: "Priya Nair", assigneeInitials: "PN", priority: "Medium", status: "Backlog", dueDate: "2025-02-20" },
  { id: "TSK-003", name: "Wireframe homepage hero section", project: "Website Redesign", assignee: "Rohan Mehta", assigneeInitials: "RM", priority: "Low", status: "Backlog", dueDate: "2025-02-22" },
  { id: "TSK-004", name: "Set up CI/CD pipeline with GitHub Actions", project: "ABC ERP Implementation", assignee: "Karthik Reddy", assigneeInitials: "KR", priority: "High", status: "Todo", dueDate: "2025-02-15" },
  { id: "TSK-005", name: "Implement login screen UI components", project: "Mobile Banking App", assignee: "Sneha Iyer", assigneeInitials: "SI", priority: "High", status: "Todo", dueDate: "2025-02-17" },
  { id: "TSK-006", name: "Audit existing site for accessibility issues", project: "Website Redesign", assignee: "Divya Rao", assigneeInitials: "DR", priority: "Medium", status: "Todo", dueDate: "2025-02-19" },
  { id: "TSK-007", name: "Build REST API for inventory endpoints", project: "ABC ERP Implementation", assignee: "Aarav Sharma", assigneeInitials: "AS", priority: "High", status: "In Progress", dueDate: "2025-02-14" },
  { id: "TSK-008", name: "Integrate biometric authentication flow", project: "Mobile Banking App", assignee: "Priya Nair", assigneeInitials: "PN", priority: "High", status: "In Progress", dueDate: "2025-02-16" },
  { id: "TSK-009", name: "Develop responsive navigation component", project: "Website Redesign", assignee: "Rohan Mehta", assigneeInitials: "RM", priority: "Medium", status: "In Progress", dueDate: "2025-02-18" },
  { id: "TSK-010", name: "Refactor user service for cleaner separation", project: "ABC ERP Implementation", assignee: "Karthik Reddy", assigneeInitials: "KR", priority: "Medium", status: "Code Review", dueDate: "2025-02-13" },
  { id: "TSK-011", name: "Add unit tests for transaction parsing", project: "Mobile Banking App", assignee: "Sneha Iyer", assigneeInitials: "SI", priority: "Medium", status: "Code Review", dueDate: "2025-02-15" },
  { id: "TSK-012", name: "Review color contrast for new palette", project: "Website Redesign", assignee: "Divya Rao", assigneeInitials: "DR", priority: "Low", status: "QA", dueDate: "2025-02-12" },
  { id: "TSK-013", name: "Run E2E tests for checkout flow", project: "ABC ERP Implementation", assignee: "Aarav Sharma", assigneeInitials: "AS", priority: "High", status: "QA", dueDate: "2025-02-11" },
  { id: "TSK-014", name: "Deploy staging environment configuration", project: "Mobile Banking App", assignee: "Karthik Reddy", assigneeInitials: "KR", priority: "Medium", status: "Done", dueDate: "2025-02-08" },
  { id: "TSK-015", name: "Finalize content migration mapping", project: "Website Redesign", assignee: "Divya Rao", assigneeInitials: "DR", priority: "Low", status: "Done", dueDate: "2025-02-06" },
  { id: "TSK-016", name: "Configure role-based access control policies", project: "ABC ERP Implementation", assignee: "Priya Nair", assigneeInitials: "PN", priority: "High", status: "Done", dueDate: "2025-02-05" },
];

const projects = ["All Projects", "ABC ERP Implementation", "Mobile Banking App", "Website Redesign"];
const statuses = ["All Statuses", "Backlog", "Todo", "In Progress", "Code Review", "QA", "Done"];
const priorities = ["All Priorities", "High", "Medium", "Low"];

export default function TasksPage() {
  const [view, setView] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === "All Projects" || task.project === projectFilter;
    const matchesStatus = statusFilter === "All Statuses" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All Priorities" || task.priority === priorityFilter;
    return matchesSearch && matchesProject && matchesStatus && matchesPriority;
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-1 text-xs text-slate-500">View and manage tasks across all projects</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          New Task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100">
            {projects.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100">
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100">
            {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          <button onClick={() => setView("board")} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${view === "board" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
            <LayoutGrid className="h-3.5 w-3.5" />
            Board
          </button>
          <button onClick={() => setView("list")} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${view === "list" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
            <List className="h-3.5 w-3.5" />
            List
          </button>
        </div>
        <span className="text-xs text-slate-400">{filteredTasks.length} tasks</span>
      </div>

      {view === "board" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column);
            return (
              <div key={column} className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/50 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200/80 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-2 w-2 rounded-full ${column === "Done" ? "bg-green-500" : column === "In Progress" ? "bg-blue-500" : column === "Code Review" ? "bg-violet-500" : column === "QA" ? "bg-amber-500" : "bg-slate-400"}`} />
                    <span className="text-xs font-semibold text-slate-700">{column}</span>
                  </div>
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">{columnTasks.length}</span>
                </div>
                <div className="flex flex-col gap-2 p-2">
                  {columnTasks.map((task) => (
                    <div key={task.id} className="group cursor-pointer rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-slate-800 leading-snug">{task.name}</p>
                        <span className={`mt-1 inline-block h-2 w-2 shrink-0 rounded-full ${priorityDot[task.priority]}`} title={`${task.priority} priority`} />
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">{task.project}</span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(task.dueDate)}
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">{task.assigneeInitials}</div>
                      </div>
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">No tasks</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "list" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Assignee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Due Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
                        <div>
                          <p className="text-xs font-medium text-slate-800">{task.name}</p>
                          <p className="text-[10px] text-slate-400">{task.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">{task.project}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">{task.assigneeInitials}</div>
                        <span className="text-xs text-slate-600">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${priorityDot[task.priority]}`} />
                        <span className={`text-xs font-medium ${priorityText[task.priority]}`}>{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[task.status]}`}>{task.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {formatDate(task.dueDate)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-xs text-slate-400">No tasks found matching your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
