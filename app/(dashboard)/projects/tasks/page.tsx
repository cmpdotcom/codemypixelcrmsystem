"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  CheckSquare,
  User,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  MoreHorizontal,
  LayoutGrid,
  List,
  CalendarDays,
  GanttChart,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Priority = "Urgent" | "High" | "Medium" | "Low";
type Status =
  | "Backlog"
  | "Todo"
  | "In Progress"
  | "Code Review"
  | "QA"
  | "Revision"
  | "Done"
  | "Blocked";
type View = "board" | "list" | "calendar" | "timeline";

interface Task {
  id: string;
  name: string;
  project: string;
  projectColor: string;
  module: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  priority: Priority;
  status: Status;
  progress: number;
  dueDate: string;
  dueDay: number;
  estimatedHours: number;
  loggedHours: number;
  tags: string[];
  overdue?: boolean;
  overdueDays?: number;
  blocked?: boolean;
  startDate?: string;
  startDay?: number;
}

const priorityDot: Record<Priority, string> = {
  Urgent: "bg-red-500",
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-green-500",
};

const priorityText: Record<Priority, string> = {
  Urgent: "text-red-600",
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
  Revision: "bg-orange-100 text-orange-700",
  Done: "bg-green-100 text-green-700",
  Blocked: "bg-rose-100 text-rose-700",
};

const statusDot: Record<Status, string> = {
  Backlog: "bg-slate-400",
  Todo: "bg-slate-500",
  "In Progress": "bg-blue-500",
  "Code Review": "bg-violet-500",
  QA: "bg-amber-500",
  Revision: "bg-orange-500",
  Done: "bg-green-500",
  Blocked: "bg-rose-500",
};

const columns: Status[] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Code Review",
  "QA",
  "Revision",
  "Done",
  "Blocked",
];

const tasks: Task[] = [
  {
    id: "TSK-001",
    name: "Implement Employee API",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "HR",
    assignee: "Arif Ahmed",
    assigneeInitials: "AA",
    assigneeColor: "bg-blue-500",
    priority: "High",
    status: "In Progress",
    progress: 65,
    dueDate: "Sep 14",
    dueDay: 14,
    estimatedHours: 8,
    loggedHours: 6,
    tags: ["backend", "api"],
  },
  {
    id: "TSK-002",
    name: "Fix payroll calculation",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Payroll",
    assignee: "Arif Ahmed",
    assigneeInitials: "AA",
    assigneeColor: "bg-blue-500",
    priority: "Urgent",
    status: "Revision",
    progress: 80,
    dueDate: "Sep 12",
    dueDay: 12,
    estimatedHours: 8,
    loggedHours: 6,
    tags: ["backend", "bug"],
    overdue: true,
    overdueDays: 2,
  },
  {
    id: "TSK-003",
    name: "Design dashboard UI",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "UI",
    assignee: "Sneha Iyer",
    assigneeInitials: "SI",
    assigneeColor: "bg-emerald-500",
    priority: "Medium",
    status: "Todo",
    progress: 0,
    dueDate: "Sep 18",
    dueDay: 18,
    estimatedHours: 6,
    loggedHours: 4,
    tags: ["frontend", "ui"],
  },
  {
    id: "TSK-004",
    name: "Set up CI/CD pipeline",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "DevOps",
    assignee: "Karim Khan",
    assigneeInitials: "KK",
    assigneeColor: "bg-violet-500",
    priority: "High",
    status: "Code Review",
    progress: 90,
    dueDate: "Sep 15",
    dueDay: 15,
    estimatedHours: 4,
    loggedHours: 5,
    tags: ["devops", "ci"],
  },
  {
    id: "TSK-005",
    name: "Write unit tests for auth",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "Auth",
    assignee: "Priya Nair",
    assigneeInitials: "PN",
    assigneeColor: "bg-rose-500",
    priority: "Medium",
    status: "QA",
    progress: 95,
    dueDate: "Sep 16",
    dueDay: 16,
    estimatedHours: 3,
    loggedHours: 3,
    tags: ["testing", "auth"],
  },
  {
    id: "TSK-006",
    name: "Database schema design",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Database",
    assignee: "Aarav Sharma",
    assigneeInitials: "AS",
    assigneeColor: "bg-amber-500",
    priority: "High",
    status: "Done",
    progress: 100,
    dueDate: "Sep 8",
    dueDay: 8,
    estimatedHours: 6,
    loggedHours: 8,
    tags: ["database", "schema"],
  },
  {
    id: "TSK-007",
    name: "Client UAT feedback",
    project: "Website Redesign",
    projectColor: "bg-orange-100 text-orange-700",
    module: "QA",
    assignee: "Divya Rao",
    assigneeInitials: "DR",
    assigneeColor: "bg-indigo-500",
    priority: "Low",
    status: "Blocked",
    progress: 50,
    dueDate: "Sep 20",
    dueDay: 20,
    estimatedHours: 4,
    loggedHours: 2,
    tags: ["qa", "uat"],
    blocked: true,
  },
  {
    id: "TSK-008",
    name: "Deploy staging environment",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "DevOps",
    assignee: "Karthik Reddy",
    assigneeInitials: "KR",
    assigneeColor: "bg-cyan-500",
    priority: "Medium",
    status: "Done",
    progress: 100,
    dueDate: "Sep 10",
    dueDay: 10,
    estimatedHours: 4,
    loggedHours: 3,
    tags: ["devops", "deploy"],
  },
  {
    id: "TSK-009",
    name: "Implement role permissions",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Auth",
    assignee: "Priya Nair",
    assigneeInitials: "PN",
    assigneeColor: "bg-rose-500",
    priority: "High",
    status: "In Progress",
    progress: 40,
    dueDate: "Sep 17",
    dueDay: 17,
    estimatedHours: 10,
    loggedHours: 6,
    tags: ["backend", "auth"],
  },
  {
    id: "TSK-010",
    name: "Responsive navigation",
    project: "Website Redesign",
    projectColor: "bg-orange-100 text-orange-700",
    module: "Frontend",
    assignee: "Rohan Mehta",
    assigneeInitials: "RM",
    assigneeColor: "bg-teal-500",
    priority: "Medium",
    status: "In Progress",
    progress: 55,
    dueDate: "Sep 19",
    dueDay: 19,
    estimatedHours: 6,
    loggedHours: 3,
    tags: ["frontend", "ui"],
  },
  {
    id: "TSK-011",
    name: "API documentation",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Docs",
    assignee: "Aarav Sharma",
    assigneeInitials: "AS",
    assigneeColor: "bg-amber-500",
    priority: "Low",
    status: "Backlog",
    progress: 0,
    dueDate: "Sep 25",
    dueDay: 25,
    estimatedHours: 0,
    loggedHours: 4,
    tags: ["docs", "api"],
  },
  {
    id: "TSK-012",
    name: "Payment gateway integration",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "Payment",
    assignee: "Karthik Reddy",
    assigneeInitials: "KR",
    assigneeColor: "bg-cyan-500",
    priority: "Urgent",
    status: "Todo",
    progress: 0,
    dueDate: "Sep 22",
    dueDay: 22,
    estimatedHours: 0,
    loggedHours: 8,
    tags: ["backend", "payment"],
  },
  {
    id: "TSK-013",
    name: "Employee form validation",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "HR",
    assignee: "Sneha Iyer",
    assigneeInitials: "SI",
    assigneeColor: "bg-emerald-500",
    priority: "Medium",
    status: "Todo",
    progress: 0,
    dueDate: "Sep 16",
    dueDay: 16,
    estimatedHours: 0,
    loggedHours: 3,
    tags: ["frontend", "forms"],
  },
  {
    id: "TSK-014",
    name: "Inventory search",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Inventory",
    assignee: "Aarav Sharma",
    assigneeInitials: "AS",
    assigneeColor: "bg-amber-500",
    priority: "Medium",
    status: "Backlog",
    progress: 0,
    dueDate: "Sep 28",
    dueDay: 28,
    estimatedHours: 0,
    loggedHours: 4,
    tags: ["backend", "search"],
  },
  {
    id: "TSK-015",
    name: "UAT test cases",
    project: "Website Redesign",
    projectColor: "bg-orange-100 text-orange-700",
    module: "QA",
    assignee: "Divya Rao",
    assigneeInitials: "DR",
    assigneeColor: "bg-indigo-500",
    priority: "Medium",
    status: "QA",
    progress: 70,
    dueDate: "Sep 21",
    dueDay: 21,
    estimatedHours: 2,
    loggedHours: 3,
    tags: ["testing", "qa"],
  },
  {
    id: "TSK-016",
    name: "OAuth integration",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "Auth",
    assignee: "Priya Nair",
    assigneeInitials: "PN",
    assigneeColor: "bg-rose-500",
    priority: "High",
    status: "Code Review",
    progress: 85,
    dueDate: "Sep 14",
    dueDay: 14,
    estimatedHours: 5,
    loggedHours: 6,
    tags: ["backend", "auth"],
  },
];

const projectOptions = [
  "All Projects",
  "ABC ERP",
  "Mobile Banking",
  "Website Redesign",
];
const assigneeOptions = [
  "All Assignees",
  "Arif Ahmed",
  "Sneha Iyer",
  "Karim Khan",
  "Priya Nair",
  "Aarav Sharma",
  "Divya Rao",
  "Karthik Reddy",
  "Rohan Mehta",
];
const statusOptions = [
  "All Statuses",
  "Backlog",
  "Todo",
  "In Progress",
  "Code Review",
  "QA",
  "Revision",
  "Done",
  "Blocked",
];
const priorityOptions = ["All Priorities", "Urgent", "High", "Medium", "Low"];
const typeOptions = [
  "All Types",
  "Bug",
  "Feature",
  "Task",
  "Improvement",
  "Documentation",
];

const filterTabs = [
  { label: "All", count: 1284 },
  { label: "My Tasks", count: 42 },
  { label: "Due Today", count: 18 },
  { label: "Upcoming", count: 56 },
  { label: "Overdue", count: 7 },
  { label: "Completed", count: 941 },
  { label: "Blocked", count: 12 },
];

const kpis = [
  {
    label: "Total Tasks",
    value: "1,284",
    subtitle: "↑ 12% this month",
    icon: CheckSquare,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "My Tasks",
    value: "42",
    subtitle: "8 active",
    icon: User,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    label: "Due Today",
    value: "18",
    subtitle: "Take action",
    icon: Calendar,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    label: "Overdue",
    value: "7",
    subtitle: "⚠ Attention",
    icon: AlertTriangle,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    label: "In Progress",
    value: "286",
    subtitle: "22% of total",
    icon: Clock,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    label: "Completed",
    value: "941",
    subtitle: "73% completion",
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

// September 2026: starts on Tuesday (Sep 1 = Tue)
// Week layout Mon-Sun: Aug 31(Mon), Sep 1(Tue)... 
const calendarDays = [
  { day: 31, month: "Aug", current: false },
  { day: 1, month: "Sep", current: true },
  { day: 2, month: "Sep", current: true },
  { day: 3, month: "Sep", current: true },
  { day: 4, month: "Sep", current: true },
  { day: 5, month: "Sep", current: true },
  { day: 6, month: "Sep", current: true },
  { day: 7, month: "Sep", current: true },
  { day: 8, month: "Sep", current: true },
  { day: 9, month: "Sep", current: true },
  { day: 10, month: "Sep", current: true },
  { day: 11, month: "Sep", current: true },
  { day: 12, month: "Sep", current: true },
  { day: 13, month: "Sep", current: true },
  { day: 14, month: "Sep", current: true },
  { day: 15, month: "Sep", current: true },
  { day: 16, month: "Sep", current: true },
  { day: 17, month: "Sep", current: true },
  { day: 18, month: "Sep", current: true },
  { day: 19, month: "Sep", current: true },
  { day: 20, month: "Sep", current: true },
  { day: 21, month: "Sep", current: true },
  { day: 22, month: "Sep", current: true },
  { day: 23, month: "Sep", current: true },
  { day: 24, month: "Sep", current: true },
  { day: 25, month: "Sep", current: true },
  { day: 26, month: "Sep", current: true },
  { day: 27, month: "Sep", current: true },
  { day: 28, month: "Sep", current: true },
  { day: 29, month: "Sep", current: true },
  { day: 30, month: "Sep", current: true },
  { day: 1, month: "Oct", current: false },
  { day: 2, month: "Oct", current: false },
  { day: 3, month: "Oct", current: false },
  { day: 4, month: "Oct", current: false },
];

const calendarTaskColors: Record<string, string> = {
  "TSK-001": "bg-blue-500",
  "TSK-002": "bg-red-500",
  "TSK-003": "bg-emerald-500",
  "TSK-004": "bg-violet-500",
  "TSK-005": "bg-amber-500",
  "TSK-006": "bg-green-500",
  "TSK-009": "bg-blue-500",
  "TSK-012": "bg-red-500",
};

const timelineTasks = [
  { id: "TSK-001", name: "Implement Employee API", startDay: 8, endDay: 14, color: "bg-blue-500" },
  { id: "TSK-004", name: "Set up CI/CD pipeline", startDay: 10, endDay: 15, color: "bg-violet-500" },
  { id: "TSK-009", name: "Implement role permissions", startDay: 11, endDay: 17, color: "bg-blue-500" },
  { id: "TSK-010", name: "Responsive navigation", startDay: 14, endDay: 19, color: "bg-teal-500" },
  { id: "TSK-012", name: "Payment gateway integration", startDay: 18, endDay: 22, color: "bg-red-500" },
];

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState<View>("board");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(search.toLowerCase()) ||
      task.project.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase()) ||
      task.id.toLowerCase().includes(search.toLowerCase());
    const matchesProject =
      projectFilter === "All Projects" || task.project === projectFilter;
    const matchesAssignee =
      assigneeFilter === "All Assignees" || task.assignee === assigneeFilter;
    const matchesStatus =
      statusFilter === "All Statuses" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All Priorities" || task.priority === priorityFilter;
    return (
      matchesSearch &&
      matchesProject &&
      matchesAssignee &&
      matchesStatus &&
      matchesPriority
    );
  });

  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage your team's work and keep projects on track.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            <CalendarDays className="h-3.5 w-3.5" />
            Calendar
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
            <Plus className="h-3.5 w-3.5" />
            Create Task
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${kpi.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
                </div>
              </div>
              <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                {kpi.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {kpi.value}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">{kpi.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Filter Tabs */}
      <div className="overflow-x-auto">
        <div className="flex items-center gap-1 border-b border-slate-200">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveFilter(tab.label)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition ${
                activeFilter === tab.label
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  activeFilter === tab.label
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filters Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by name, project, assignee, ID..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className={selectClass}
          >
            {projectOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className={selectClass}
          >
            {assigneeOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={selectClass}
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={selectClass}
          >
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              onClick={() => setView("board")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                view === "board"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Board
            </button>
            <button
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                view === "list"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                view === "calendar"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Calendar
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                view === "timeline"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <GanttChart className="h-3.5 w-3.5" />
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {view === "board" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status === column
            );
            return (
              <div
                key={column}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/50 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${statusDot[column]}`}
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {column}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group cursor-pointer rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] text-slate-400">
                          {task.id}
                        </span>
                        <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <Link
                        href="/projects/tasks/1"
                        className="mt-1 block text-xs font-medium text-slate-800 transition hover:text-blue-600"
                      >
                        {task.name}
                      </Link>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${task.projectColor}`}
                        >
                          {task.project}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {task.module}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ${task.assigneeColor}`}
                        >
                          {task.assigneeInitials}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${priorityDot[task.priority]}`}
                          />
                          <span className="text-[10px] text-slate-500">
                            {task.loggedHours}h / {task.estimatedHours}h
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {task.progress}%
                        </span>
                      </div>
                      {task.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] text-slate-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {task.overdue && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Overdue by {task.overdueDays} days
                          </span>
                        </div>
                      )}
                      {task.blocked && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            <Lock className="h-2.5 w-2.5" />
                            Blocked
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">
                      No tasks
                    </div>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Task ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Task Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Assignee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Health
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-slate-400">
                        {task.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href="/projects/tasks/1"
                        className="text-xs font-medium text-slate-800 transition hover:text-blue-600"
                      >
                        {task.name}
                      </Link>
                      <div className="mt-0.5">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${task.projectColor}`}
                        >
                          {task.project}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ${task.assigneeColor}`}
                        >
                          {task.assigneeInitials}
                        </div>
                        <span className="text-xs text-slate-600">
                          {task.assignee}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${priorityDot[task.priority]}`}
                        />
                        <span
                          className={`text-xs font-medium ${priorityText[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              task.progress === 100
                                ? "bg-green-500"
                                : task.progress >= 50
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {task.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`flex items-center gap-1.5 text-xs ${task.overdue ? "font-medium text-rose-600" : "text-slate-600"}`}
                      >
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {task.dueDate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600">
                        {task.loggedHours}h / {task.estimatedHours}h
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {task.overdue ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Overdue
                        </span>
                      ) : task.blocked ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          <Lock className="h-2.5 w-2.5" />
                          Blocked
                        </span>
                      ) : task.progress === 100 ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Healthy
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                          <Clock className="h-2.5 w-2.5" />
                          On track
                        </span>
                      )}
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
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-xs text-slate-400"
                    >
                      No tasks found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              September 2026
            </h2>
            <div className="flex items-center gap-1">
              <button className="rounded-md border border-slate-200 p-1 text-slate-500 transition hover:bg-slate-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-50">
                Today
              </button>
              <button className="rounded-md border border-slate-200 p-1 text-slate-500 transition hover:bg-slate-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="bg-slate-50 px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((date, i) => {
              const dayTasks = tasks.filter((t) => t.dueDay === date.day && date.current);
              return (
                <div
                  key={i}
                  className={`min-h-[80px] bg-white p-1.5 ${date.current ? "" : "bg-slate-50/50"}`}
                >
                  <span
                    className={`text-[10px] font-medium ${date.current ? "text-slate-700" : "text-slate-400"}`}
                  >
                    {date.day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-1 rounded px-1 py-0.5 text-[9px] text-white ${calendarTaskColors[task.id] || "bg-slate-400"}`}
                      >
                        <span className="truncate">{task.name}</span>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[9px] text-slate-400">
                        +{dayTasks.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "timeline" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              September 2026
            </h2>
            <div className="flex items-center gap-1">
              <button className="rounded-md border border-slate-200 p-1 text-slate-500 transition hover:bg-slate-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-50">
                Today
              </button>
              <button className="rounded-md border border-slate-200 p-1 text-slate-500 transition hover:bg-slate-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Day header */}
          <div className="grid grid-cols-[200px_1fr] gap-2">
            <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Task
            </div>
            <div className="relative">
              <div
                className="grid gap-px"
                style={{ gridTemplateColumns: "repeat(30, 1fr)" }}
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className="text-center text-[9px] text-slate-400"
                  >
                    {day % 5 === 0 || day === 1 ? day : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Timeline rows */}
          <div className="mt-2 space-y-2">
            {timelineTasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[200px_1fr] items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400">
                    {task.id}
                  </span>
                  <span className="truncate text-xs text-slate-700">
                    {task.name}
                  </span>
                </div>
                <div className="relative h-6 rounded-md bg-slate-50">
                  <div
                    className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-md ${task.color} opacity-80`}
                    style={{
                      left: `${((task.startDay - 1) / 30) * 100}%`,
                      width: `${((task.endDay - task.startDay + 1) / 30) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded bg-blue-500" />
              <span className="text-[10px] text-slate-500">Backend</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded bg-violet-500" />
              <span className="text-[10px] text-slate-500">DevOps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded bg-teal-500" />
              <span className="text-[10px] text-slate-500">Frontend</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded bg-red-500" />
              <span className="text-[10px] text-slate-500">Urgent</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
