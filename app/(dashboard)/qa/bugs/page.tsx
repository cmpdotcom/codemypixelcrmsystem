"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  Bug,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  LayoutGrid,
  List,
  Clock,
  ChevronRight,
} from "lucide-react";

type Severity = "Critical" | "High" | "Medium" | "Low";
type Priority = "Urgent" | "High" | "Medium" | "Low";
type Status =
  | "New"
  | "Assigned"
  | "In Progress"
  | "Fixed"
  | "Ready for QA"
  | "Verified";
type Environment = "Staging" | "Production" | "Dev";
type View = "board" | "list";

interface BugItem {
  id: string;
  title: string;
  project: string;
  projectColor: string;
  module: string;
  reporter: string;
  reporterInitials: string;
  reporterColor: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  severity: Severity;
  priority: Priority;
  status: Status;
  environment: Environment;
  created: string;
  due: string;
  sla?: string;
  overdue?: boolean;
}

const severityStyles: Record<Severity, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};

const severityDot: Record<Severity, string> = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-amber-500",
  Low: "bg-slate-400",
};

const priorityStyles: Record<Priority, string> = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};

const statusStyles: Record<Status, string> = {
  New: "bg-slate-100 text-slate-600",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  Fixed: "bg-violet-100 text-violet-700",
  "Ready for QA": "bg-amber-100 text-amber-700",
  Verified: "bg-green-100 text-green-700",
};

const statusDot: Record<Status, string> = {
  New: "bg-slate-400",
  Assigned: "bg-blue-500",
  "In Progress": "bg-indigo-500",
  Fixed: "bg-violet-500",
  "Ready for QA": "bg-amber-500",
  Verified: "bg-green-500",
};

const environmentStyles: Record<Environment, string> = {
  Staging: "bg-cyan-50 text-cyan-700",
  Production: "bg-rose-50 text-rose-700",
  Dev: "bg-slate-100 text-slate-600",
};

const columns: Status[] = [
  "New",
  "Assigned",
  "In Progress",
  "Fixed",
  "Ready for QA",
  "Verified",
];

const bugs: BugItem[] = [
  {
    id: "BUG-10291",
    title: "Payroll overtime calculation incorrect",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Payroll",
    reporter: "Fahim",
    reporterInitials: "FA",
    reporterColor: "bg-blue-500",
    assignee: "Arif",
    assigneeInitials: "AR",
    assigneeColor: "bg-violet-500",
    severity: "Critical",
    priority: "Urgent",
    status: "In Progress",
    environment: "Staging",
    created: "Sep 10",
    due: "Sep 10",
    sla: "4h",
  },
  {
    id: "BUG-10287",
    title: "Login timeout after 30 seconds",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "Auth",
    reporter: "Fahim",
    reporterInitials: "FA",
    reporterColor: "bg-blue-500",
    assignee: "Karim",
    assigneeInitials: "KA",
    assigneeColor: "bg-cyan-500",
    severity: "Critical",
    priority: "High",
    status: "Assigned",
    environment: "Staging",
    created: "Sep 10",
    due: "Sep 10",
  },
  {
    id: "BUG-10284",
    title: "Data loss on inventory save",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Inventory",
    reporter: "Sakib",
    reporterInitials: "SA",
    reporterColor: "bg-amber-500",
    assignee: "Aarav",
    assigneeInitials: "AA",
    assigneeColor: "bg-rose-500",
    severity: "Critical",
    priority: "Urgent",
    status: "In Progress",
    environment: "Production",
    created: "Sep 9",
    due: "Sep 9",
    overdue: true,
  },
  {
    id: "BUG-10280",
    title: "Payment API returns 500 error",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "Payment",
    reporter: "Sakib",
    reporterInitials: "SA",
    reporterColor: "bg-amber-500",
    assignee: "Karthik",
    assigneeInitials: "KA",
    assigneeColor: "bg-cyan-500",
    severity: "Critical",
    priority: "High",
    status: "Fixed",
    environment: "Production",
    created: "Sep 8",
    due: "Sep 9",
  },
  {
    id: "BUG-10275",
    title: "Employee search returns wrong results",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "HR",
    reporter: "Fahim",
    reporterInitials: "FA",
    reporterColor: "bg-blue-500",
    assignee: "Sneha",
    assigneeInitials: "SN",
    assigneeColor: "bg-emerald-500",
    severity: "High",
    priority: "Medium",
    status: "Ready for QA",
    environment: "Staging",
    created: "Sep 8",
    due: "Sep 12",
  },
  {
    id: "BUG-10270",
    title: "Dashboard charts not loading",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "Dashboard",
    reporter: "Sakib",
    reporterInitials: "SA",
    reporterColor: "bg-amber-500",
    assignee: "Rohan",
    assigneeInitials: "RO",
    assigneeColor: "bg-teal-500",
    severity: "High",
    priority: "High",
    status: "In Progress",
    environment: "Staging",
    created: "Sep 7",
    due: "Sep 11",
  },
  {
    id: "BUG-10265",
    title: "Export missing column",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Reports",
    reporter: "Fahim",
    reporterInitials: "FA",
    reporterColor: "bg-blue-500",
    assignee: "Aarav",
    assigneeInitials: "AA",
    assigneeColor: "bg-rose-500",
    severity: "Medium",
    priority: "Medium",
    status: "Verified",
    environment: "Staging",
    created: "Sep 6",
    due: "Sep 10",
  },
  {
    id: "BUG-10260",
    title: "Button alignment off on mobile",
    project: "Website Redesign",
    projectColor: "bg-orange-100 text-orange-700",
    module: "UI",
    reporter: "Sakib",
    reporterInitials: "SA",
    reporterColor: "bg-amber-500",
    assignee: "Rohan",
    assigneeInitials: "RO",
    assigneeColor: "bg-teal-500",
    severity: "Low",
    priority: "Low",
    status: "Verified",
    environment: "Dev",
    created: "Sep 5",
    due: "Sep 8",
  },
  {
    id: "BUG-10255",
    title: "Session not expiring",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Auth",
    reporter: "Fahim",
    reporterInitials: "FA",
    reporterColor: "bg-blue-500",
    assignee: "Priya",
    assigneeInitials: "PR",
    assigneeColor: "bg-indigo-500",
    severity: "High",
    priority: "High",
    status: "New",
    environment: "Staging",
    created: "Sep 10",
    due: "Sep 12",
  },
  {
    id: "BUG-10250",
    title: "Tax calculation rounding error",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Accounting",
    reporter: "Sakib",
    reporterInitials: "SA",
    reporterColor: "bg-amber-500",
    assignee: "Arif",
    assigneeInitials: "AR",
    assigneeColor: "bg-violet-500",
    severity: "Medium",
    priority: "Urgent",
    status: "In Progress",
    environment: "Staging",
    created: "Sep 9",
    due: "Sep 11",
  },
  {
    id: "BUG-10245",
    title: "File upload size limit too low",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "API",
    reporter: "Fahim",
    reporterInitials: "FA",
    reporterColor: "bg-blue-500",
    assignee: "Karthik",
    assigneeInitials: "KA",
    assigneeColor: "bg-cyan-500",
    severity: "Medium",
    priority: "Medium",
    status: "Fixed",
    environment: "Staging",
    created: "Sep 8",
    due: "Sep 10",
  },
  {
    id: "BUG-10240",
    title: "Color contrast fails accessibility",
    project: "Website Redesign",
    projectColor: "bg-orange-100 text-orange-700",
    module: "UI",
    reporter: "Sakib",
    reporterInitials: "SA",
    reporterColor: "bg-amber-500",
    assignee: "Divya",
    assigneeInitials: "DI",
    assigneeColor: "bg-fuchsia-500",
    severity: "Low",
    priority: "Low",
    status: "New",
    environment: "Dev",
    created: "Sep 10",
    due: "Sep 15",
  },
  {
    id: "BUG-10235",
    title: "Pagination breaks at 1000 records",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "CRM",
    reporter: "Fahim",
    reporterInitials: "FA",
    reporterColor: "bg-blue-500",
    assignee: "Aarav",
    assigneeInitials: "AA",
    assigneeColor: "bg-rose-500",
    severity: "Medium",
    priority: "Medium",
    status: "Ready for QA",
    environment: "Staging",
    created: "Sep 7",
    due: "Sep 10",
  },
  {
    id: "BUG-10230",
    title: "Push notification not delivered",
    project: "Mobile Banking",
    projectColor: "bg-emerald-100 text-emerald-700",
    module: "Mobile",
    reporter: "Sakib",
    reporterInitials: "SA",
    reporterColor: "bg-amber-500",
    assignee: "Karthik",
    assigneeInitials: "KA",
    assigneeColor: "bg-cyan-500",
    severity: "High",
    priority: "High",
    status: "Assigned",
    environment: "Production",
    created: "Sep 9",
    due: "Sep 10",
  },
  {
    id: "BUG-10225",
    title: "Currency symbol missing",
    project: "ABC ERP",
    projectColor: "bg-blue-100 text-blue-700",
    module: "Payroll",
    reporter: "Fahim",
    reporterInitials: "FA",
    reporterColor: "bg-blue-500",
    assignee: "Arif",
    assigneeInitials: "AR",
    assigneeColor: "bg-violet-500",
    severity: "Low",
    priority: "Low",
    status: "Verified",
    environment: "Staging",
    created: "Sep 5",
    due: "Sep 8",
  },
  {
    id: "BUG-10220",
    title: "Form validation message unclear",
    project: "Website Redesign",
    projectColor: "bg-orange-100 text-orange-700",
    module: "Forms",
    reporter: "Sakib",
    reporterInitials: "SA",
    reporterColor: "bg-amber-500",
    assignee: "Rohan",
    assigneeInitials: "RO",
    assigneeColor: "bg-teal-500",
    severity: "Low",
    priority: "Medium",
    status: "In Progress",
    environment: "Dev",
    created: "Sep 8",
    due: "Sep 12",
  },
];

const projectOptions = [
  "All Projects",
  "ABC ERP",
  "Mobile Banking",
  "Website Redesign",
];
const severityOptions = [
  "All Severities",
  "Critical",
  "High",
  "Medium",
  "Low",
];
const priorityOptions = [
  "All Priorities",
  "Urgent",
  "High",
  "Medium",
  "Low",
];
const statusOptions = [
  "All Statuses",
  "New",
  "Assigned",
  "In Progress",
  "Fixed",
  "Ready for QA",
  "Verified",
];
const environmentOptions = [
  "All Environments",
  "Staging",
  "Production",
  "Dev",
];
const moduleOptions = [
  "All Modules",
  "Payroll",
  "Auth",
  "Inventory",
  "Payment",
  "HR",
  "Dashboard",
  "Reports",
  "UI",
  "Accounting",
  "API",
  "CRM",
  "Mobile",
  "Forms",
];

const filterTabs = [
  { label: "All", count: 248 },
  { label: "My Bugs", count: 19 },
  { label: "Open", count: 42 },
  { label: "Critical", count: 4 },
  { label: "Overdue", count: 7 },
  { label: "Resolved", count: 206 },
  { label: "Reopened", count: 12 },
];

export default function BugsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState<View>("board");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [severityFilter, setSeverityFilter] = useState("All Severities");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [environmentFilter, setEnvironmentFilter] = useState("All Environments");
  const [moduleFilter, setModuleFilter] = useState("All Modules");

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch =
      bug.title.toLowerCase().includes(search.toLowerCase()) ||
      bug.project.toLowerCase().includes(search.toLowerCase()) ||
      bug.id.toLowerCase().includes(search.toLowerCase());
    const matchesProject =
      projectFilter === "All Projects" || bug.project === projectFilter;
    const matchesSeverity =
      severityFilter === "All Severities" || bug.severity === severityFilter;
    const matchesPriority =
      priorityFilter === "All Priorities" || bug.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "All Statuses" || bug.status === statusFilter;
    const matchesEnvironment =
      environmentFilter === "All Environments" ||
      bug.environment === environmentFilter;
    const matchesModule =
      moduleFilter === "All Modules" || bug.module === moduleFilter;
    return (
      matchesSearch &&
      matchesProject &&
      matchesSeverity &&
      matchesPriority &&
      matchesStatus &&
      matchesEnvironment &&
      matchesModule
    );
  });

  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bugs</h1>
          <p className="mt-1 text-xs text-slate-500">
            Track and manage all reported bugs
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Create Bug
        </button>
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
            placeholder="Search bugs by ID, title, project..."
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
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className={selectClass}
          >
            {severityOptions.map((s) => (
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
            value={environmentFilter}
            onChange={(e) => setEnvironmentFilter(e.target.value)}
            className={selectClass}
          >
            {environmentOptions.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className={selectClass}
          >
            {moduleOptions.map((m) => (
              <option key={m} value={m}>
                {m}
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
          </div>
        </div>
      </div>

      {/* Content Area */}
      {view === "board" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {columns.map((column) => {
            const columnBugs = filteredBugs.filter(
              (b) => b.status === column
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
                    {columnBugs.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-2">
                  {columnBugs.map((bug) => (
                    <div
                      key={bug.id}
                      className="group cursor-pointer rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/qa/bugs/1`}
                          className="font-mono text-[10px] text-slate-400 transition hover:text-blue-600"
                        >
                          {bug.id}
                        </Link>
                        <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <Link
                        href={`/qa/bugs/1`}
                        className="mt-1 block text-xs font-medium text-slate-800 transition hover:text-blue-600"
                      >
                        {bug.title}
                      </Link>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${bug.projectColor}`}
                        >
                          {bug.project}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {bug.module}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center -space-x-1.5">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white ${bug.reporterColor}`}
                            title={`Reporter: ${bug.reporter}`}
                          >
                            {bug.reporterInitials}
                          </div>
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white ${bug.assigneeColor}`}
                            title={`Assignee: ${bug.assignee}`}
                          >
                            {bug.assigneeInitials}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${severityStyles[bug.severity]}`}
                        >
                          <span
                            className={`inline-block h-1.5 w-1.5 rounded-full ${severityDot[bug.severity]}`}
                          />
                          {bug.severity}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${environmentStyles[bug.environment]}`}
                        >
                          {bug.environment}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="h-3 w-3" />
                          {bug.due}
                        </div>
                      </div>
                      {bug.overdue && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            SLA breached
                          </span>
                        </div>
                      )}
                      {bug.sla && !bug.overdue && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                            <Clock className="h-2.5 w-2.5" />
                            SLA {bug.sla}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {columnBugs.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-[10px] text-slate-400">
                      No bugs
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
                    Bug ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Reporter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Assignee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Severity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Environment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Due
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBugs.map((bug) => (
                  <tr
                    key={bug.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/qa/bugs/1`}
                        className="font-mono text-[10px] text-slate-400 transition hover:text-blue-600"
                      >
                        {bug.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/qa/bugs/1`}
                        className="text-xs font-medium text-slate-800 transition hover:text-blue-600"
                      >
                        {bug.title}
                      </Link>
                      <div className="mt-0.5">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${bug.projectColor}`}
                        >
                          {bug.project}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600">
                        {bug.module}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ${bug.reporterColor}`}
                        >
                          {bug.reporterInitials}
                        </div>
                        <span className="text-xs text-slate-600">
                          {bug.reporter}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ${bug.assigneeColor}`}
                        >
                          {bug.assigneeInitials}
                        </div>
                        <span className="text-xs text-slate-600">
                          {bug.assignee}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${severityStyles[bug.severity]}`}
                      >
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${severityDot[bug.severity]}`}
                        />
                        {bug.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${priorityStyles[bug.priority]}`}
                      >
                        {bug.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[bug.status]}`}
                      >
                        {bug.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${environmentStyles[bug.environment]}`}
                      >
                        {bug.environment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600">
                        {bug.created}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`flex items-center gap-1.5 text-xs ${bug.overdue ? "font-medium text-rose-600" : "text-slate-600"}`}
                      >
                        <Clock className="h-3 w-3 text-slate-400" />
                        {bug.due}
                      </div>
                      {bug.overdue && (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-rose-600">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          SLA breached
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
                {filteredBugs.length === 0 && (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-4 py-10 text-center text-xs text-slate-400"
                    >
                      No bugs found matching your filters.
                    </td>
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
