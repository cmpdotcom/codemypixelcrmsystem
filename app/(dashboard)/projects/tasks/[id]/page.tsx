"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MoreHorizontal,
  Edit,
  UserPlus,
  CheckSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bug,
  GitBranch,
  FileText,
  MessageSquare,
  Activity,
  Link2,
  Timer,
  Plus,
  Paperclip,
  Download,
  Play,
  Lock,
  ChevronRight,
} from "lucide-react";

type Tab =
  | "Overview"
  | "Subtasks"
  | "Comments"
  | "Activity"
  | "Attachments"
  | "Time"
  | "Dependencies"
  | "Bugs"
  | "QA";

const tabs: Tab[] = [
  "Overview",
  "Subtasks",
  "Comments",
  "Activity",
  "Attachments",
  "Time",
  "Dependencies",
  "Bugs",
  "QA",
];

const subtasks = [
  { name: "Create database schema", done: true },
  { name: "Create API endpoints", done: true },
  { name: "Create employee form", done: true },
  { name: "Add validation", done: true },
  { name: "Add permissions", done: true },
  { name: "Add search", done: true },
  { name: "Add pagination", done: false },
  { name: "QA testing", done: false },
];

const comments = [
  {
    name: "Rahim Ahmed",
    initials: "RA",
    time: "10:25 AM",
    text: "Arif, please ensure the API follows our existing REST conventions. Check the docs in the repo for reference.",
  },
  {
    name: "Arif Ahmed",
    initials: "AA",
    time: "11:00 AM",
    text: "Got it. I'll start with the schema and endpoints first, then move to validation and permissions.",
  },
  {
    name: "Fahim Ahmed",
    initials: "FA",
    time: "2:45 PM",
    text: "I've drafted the test cases for the employee endpoints. Will share them once the API is ready for QA.",
  },
  {
    name: "Arif Ahmed",
    initials: "AA",
    time: "4:30 PM",
    text: "Endpoints are ready. Pushed the latest changes. @Fahim you can start reviewing the test cases against the implementation.",
  },
];

const activities = [
  { user: "Rahim", action: "created this task", time: "10:20 AM", icon: Plus, color: "text-blue-600 bg-blue-100" },
  { user: "Rahim", action: "assigned to Arif", time: "10:25 AM", icon: UserPlus, color: "text-violet-600 bg-violet-100" },
  { user: "Rahim", action: "Priority changed: Medium → High", time: "10:30 AM", icon: AlertTriangle, color: "text-red-600 bg-red-100" },
  { user: "Rahim", action: "Status changed: Todo → In Progress", time: "11:15 AM", icon: Activity, color: "text-blue-600 bg-blue-100" },
  { user: "Arif", action: "uploaded employee-api.zip", time: "2:30 PM", icon: Paperclip, color: "text-slate-600 bg-slate-100" },
  { user: "Rahim", action: "Status changed: In Progress → Code Review", time: "4:10 PM", icon: Activity, color: "text-violet-600 bg-violet-100" },
  { user: "Rahim", action: "approved the code", time: "5:00 PM", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  { user: "Rahim", action: "Status changed: Code Review → QA", time: "5:05 PM", icon: Activity, color: "text-amber-600 bg-amber-100" },
];

const attachments = [
  { name: "employee-api-spec.pdf", size: "245 KB", by: "Rahim Ahmed", date: "Sep 10, 2026", color: "text-red-500 bg-red-50" },
  { name: "employee-form.png", size: "1.2 MB", by: "Arif Ahmed", date: "Sep 11, 2026", color: "text-blue-500 bg-blue-50" },
  { name: "requirements.docx", size: "89 KB", by: "Rahim Ahmed", date: "Sep 10, 2026", color: "text-blue-600 bg-blue-50" },
  { name: "api-test-results.pdf", size: "512 KB", by: "Fahim Ahmed", date: "Sep 12, 2026", color: "text-red-500 bg-red-50" },
];

const timesheet = [
  { date: "Sep 10, 2026", developer: "Arif Ahmed", task: "Schema + endpoints", hours: "3h" },
  { date: "Sep 11, 2026", developer: "Arif Ahmed", task: "Form + validation", hours: "2h" },
  { date: "Sep 12, 2026", developer: "Arif Ahmed", task: "Permissions + search", hours: "1h" },
  { date: "Sep 12, 2026", developer: "Arif Ahmed", task: "Code review fixes", hours: "0h" },
];

const dependencies = {
  dependsOn: [{ id: "TASK-10280", name: "Database Design", status: "Done", color: "bg-green-100 text-green-700" }],
  blocks: [
    { id: "TASK-10305", name: "Employee UI", status: "In Progress", color: "bg-blue-100 text-blue-700" },
    { id: "TASK-10310", name: "Integration", status: "Todo", color: "bg-slate-100 text-slate-600" },
  ],
};

const bugs = [
  { id: "BUG-10291", name: "Overtime calculation incorrect", severity: "Critical", status: "Open", sevColor: "text-red-600 bg-red-50", statusColor: "bg-amber-100 text-amber-700" },
  { id: "BUG-10295", name: "Missing pagination on list", severity: "Medium", status: "Fixed", sevColor: "text-amber-600 bg-amber-50", statusColor: "bg-green-100 text-green-700" },
  { id: "BUG-10298", name: "Search returns wrong results", severity: "Low", status: "Verified", sevColor: "text-green-600 bg-green-50", statusColor: "bg-blue-100 text-blue-700" },
];

const testCases = [
  { name: "Create employee with valid data", status: "pass" },
  { name: "Create employee with invalid email", status: "pass" },
  { name: "Update employee details", status: "pass" },
  { name: "Pagination returns correct page", status: "fail" },
  { name: "Search by name returns matches", status: "fail" },
  { name: "Role-based access enforced", status: "pass" },
  { name: "Delete employee removes record", status: "pass" },
];

const relationshipMap = [
  { label: "Client", value: "ABC Technologies", icon: UserPlus },
  { label: "Project", value: "ABC ERP", icon: GitBranch },
  { label: "Milestone", value: "HR Module", icon: CheckSquare },
  { label: "Requirement", value: "Employee Management", icon: FileText },
  { label: "Task", value: "Implement Employee API", icon: CheckCircle, highlight: true },
  { label: "Developer", value: "Arif Ahmed", icon: UserPlus },
  { label: "QA", value: "Fahim Ahmed", icon: CheckSquare },
];

const requirements = [
  "Create employee",
  "Update employee",
  "Delete employee",
  "List employees",
  "Search",
  "Pagination",
  "Role-based access",
];

const tags = ["#backend", "#api", "#hr", "#employee"];

function Avatar({ initials, color = "bg-slate-100 text-slate-600" }: { initials: string; color?: string }) {
  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${color}`}>
      {initials}
    </div>
  );
}

export default function TaskDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/projects/tasks"
        className="inline-flex items-center gap-1 text-xs text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Tasks
      </Link>

      {/* Task Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-[10px] text-slate-400">TASK-10291</p>
          <h1 className="text-xl font-bold text-slate-900">Implement Employee API</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
              In Progress
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              High
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              ABC ERP
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              HR
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            <Edit className="h-3.5 w-3.5" />
            Edit
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            <UserPlus className="h-3.5 w-3.5" />
            Assign
          </button>
          <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Progress + Metadata Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Progress</span>
            <span className="text-xs font-medium text-slate-500">65%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-500" style={{ width: "65%" }} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Assignee</p>
            <div className="flex items-center gap-2">
              <Avatar initials="AA" color="bg-blue-100 text-blue-700" />
              <span className="text-xs font-medium text-slate-700">Arif Ahmed</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Reviewer</p>
            <div className="flex items-center gap-2">
              <Avatar initials="RA" color="bg-violet-100 text-violet-700" />
              <span className="text-xs font-medium text-slate-700">Rahim Ahmed</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">QA</p>
            <div className="flex items-center gap-2">
              <Avatar initials="FA" color="bg-amber-100 text-amber-700" />
              <span className="text-xs font-medium text-slate-700">Fahim Ahmed</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Priority</p>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-red-600">High</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Due Date</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Clock className="h-3 w-3 text-slate-400" />
              Sep 14, 2026
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Estimate</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Timer className="h-3 w-3 text-slate-400" />
              8h
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Actual</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Timer className="h-3 w-3 text-slate-400" />
              6h
              <span className="text-[10px] font-normal text-slate-400">(2h remaining)</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Start Date</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Clock className="h-3 w-3 text-slate-400" />
              Sep 10, 2026
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-1 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative whitespace-nowrap px-3 py-2.5 text-xs font-medium transition ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-xs font-semibold text-slate-700">Description</h3>
              <p className="text-xs text-slate-600">Implement REST API for employee management.</p>
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Requirements</p>
                <ul className="space-y-1.5">
                  {requirements.map((req) => (
                    <li key={req} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckSquare className="h-3.5 w-3.5 text-blue-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-semibold text-slate-700">Task Relationship Map</h3>
              <div className="flex flex-col items-center gap-0">
                {relationshipMap.map((node, idx) => {
                  const Icon = node.icon;
                  return (
                    <div key={node.label} className="flex flex-col items-center">
                      <div
                        className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 ${
                          node.highlight
                            ? "border-blue-300 bg-blue-50"
                            : "border-slate-200/80 bg-slate-50/50"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${node.highlight ? "text-blue-600" : "text-slate-400"}`} />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{node.label}</span>
                          <span className={`text-xs font-medium ${node.highlight ? "text-blue-700" : "text-slate-700"}`}>{node.value}</span>
                        </div>
                      </div>
                      {idx < relationshipMap.length - 1 && (
                        <div className="h-5 w-px bg-slate-200" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-xs font-semibold text-slate-700">Tags</h3>
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Subtasks Tab */}
        {activeTab === "Subtasks" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Subtasks Progress</span>
                <span className="text-xs font-medium text-slate-500">6 / 8 completed</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-500" style={{ width: "75%" }} />
              </div>
            </div>
            <div className="space-y-1.5">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.name}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-100 px-3 py-2 transition hover:bg-slate-50/50"
                >
                  {subtask.done ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <CheckSquare className="h-4 w-4 text-slate-300" />
                  )}
                  <span className={`text-xs ${subtask.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                    {subtask.name}
                  </span>
                  <span
                    className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      subtask.done ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {subtask.done ? "Done" : "Todo"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a subtask..."
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
                <Plus className="h-3.5 w-3.5" />
                Add Subtask
              </button>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "Comments" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              {comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3">
                  <Avatar initials={comment.initials} color="bg-slate-100 text-slate-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">{comment.name}</span>
                      <span className="text-[10px] text-slate-400">{comment.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex gap-3">
                <Avatar initials="You" color="bg-blue-100 text-blue-700" />
                <div className="flex-1 space-y-2">
                  <textarea
                    placeholder="Write a comment..."
                    rows={2}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <div className="flex justify-end">
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "Activity" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="space-y-0">
              {activities.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${act.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      {idx < activities.length - 1 && <div className="h-6 w-px bg-slate-200" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs text-slate-700">
                        <span className="font-semibold">{act.user}</span> {act.action}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{act.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Attachments Tab */}
        {activeTab === "Attachments" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {attachments.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${file.color}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-700">{file.name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {file.size} · {file.by} · {file.date}
                    </p>
                  </div>
                  <button className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-6 text-xs font-medium text-slate-500 transition hover:border-blue-400 hover:text-blue-600">
              <Paperclip className="h-4 w-4" />
              Upload File
            </button>
          </div>
        )}

        {/* Time Tab */}
        {activeTab === "Time" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Estimated</p>
                <p className="mt-1 text-lg font-bold text-slate-900">8h</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Actual</p>
                <p className="mt-1 text-lg font-bold text-blue-600">6h</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Remaining</p>
                <p className="mt-1 text-lg font-bold text-amber-600">2h</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Developer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Task</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timesheet.map((entry, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-xs text-slate-600">{entry.date}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{entry.developer}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{entry.task}</td>
                        <td className="px-4 py-3 text-right text-xs font-medium text-slate-700">{entry.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-green-700">
                <Play className="h-3.5 w-3.5" />
                Start Timer
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <Timer className="h-3.5 w-3.5" />
                Log Time
              </button>
            </div>
          </div>
        )}

        {/* Dependencies Tab */}
        {activeTab === "Dependencies" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-700">Depends On</h3>
              </div>
              <div className="space-y-2">
                {dependencies.dependsOn.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 transition hover:border-blue-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs font-medium text-slate-700">{dep.name}</p>
                        <p className="font-mono text-[10px] text-slate-400">{dep.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${dep.color}`}>
                        {dep.status}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-700">Blocks</h3>
              </div>
              <div className="space-y-2">
                {dependencies.blocks.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 transition hover:border-blue-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <Lock className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-medium text-slate-700">{dep.name}</p>
                        <p className="font-mono text-[10px] text-slate-400">{dep.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${dep.color}`}>
                        {dep.status}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bugs Tab */}
        {activeTab === "Bugs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700">Related Bugs</h3>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
                <Bug className="h-3.5 w-3.5" />
                Create Bug
              </button>
            </div>
            <div className="space-y-2">
              {bugs.map((bug) => (
                <div
                  key={bug.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                      <Bug className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">{bug.name}</p>
                      <p className="font-mono text-[10px] text-slate-400">{bug.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${bug.sevColor}`}>
                      {bug.severity}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${bug.statusColor}`}>
                      {bug.status}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QA Tab */}
        {activeTab === "QA" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">QA Status</p>
                  <span className="mt-1 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                    In QA
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">5</p>
                    <p className="text-[10px] text-slate-400">Passed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">2</p>
                    <p className="text-[10px] text-slate-400">Failed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-xs font-semibold text-slate-700">Test Cases</h3>
              <div className="space-y-1.5">
                {testCases.map((tc) => (
                  <div
                    key={tc.name}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <span className="text-xs text-slate-700">{tc.name}</span>
                    {tc.status === "pass" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        Fail
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex gap-3">
                <Avatar initials="FA" color="bg-amber-100 text-amber-700" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">Fahim Ahmed</span>
                    <span className="text-[10px] text-slate-400">QA Engineer · 5:10 PM</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Pagination and search test cases are failing. Pagination returns all records instead of the
                    requested page size, and search does not filter by name correctly. Please fix before re-review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
