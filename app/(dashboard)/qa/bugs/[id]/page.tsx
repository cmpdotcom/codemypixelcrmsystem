"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MoreHorizontal,
  Edit,
  UserPlus,
  Bug,
  AlertTriangle,
  Clock,
  CheckCircle,
  MessageSquare,
  Activity,
  Paperclip,
  Download,
  History,
  Link2,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Video,
  FileCode,
} from "lucide-react";

type Tab =
  | "Overview"
  | "Steps to Reproduce"
  | "Comments"
  | "Activity"
  | "Attachments"
  | "History";

const tabs: Tab[] = [
  "Overview",
  "Steps to Reproduce",
  "Comments",
  "Activity",
  "Attachments",
  "History",
];

const reproductionSteps = [
  "Login as HR Manager",
  "Open Payroll module",
  "Select employee \"John Carter\"",
  "Generate salary for September",
  "Add 10 hours overtime",
  "Generate payroll",
];

const comments = [
  {
    name: "Fahim Ahmed",
    initials: "FA",
    time: "10:20 AM",
    text: "I'm able to reproduce this on staging.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Arif Ahmed",
    initials: "AA",
    time: "11:15 AM",
    text: "Found the issue. Salary ratio wasn't being applied correctly.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Fahim Ahmed",
    initials: "FA",
    time: "2:10 PM",
    text: "Retested. Still failing for employees with overtime above 20 hours.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Arif Ahmed",
    initials: "AA",
    time: "3:30 PM",
    text: "Fixed the second condition. Please retest.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Fahim Ahmed",
    initials: "FA",
    time: "3:35 PM",
    text: "Retesting now. Will update shortly.",
    color: "bg-amber-100 text-amber-700",
  },
];

const activities = [
  { user: "Fahim", action: "created this bug", time: "10:00 AM", icon: Bug, color: "text-red-600 bg-red-100" },
  { user: "Rahim", action: "assigned to Arif", time: "10:05 AM", icon: UserPlus, color: "text-violet-600 bg-violet-100" },
  { user: "Rahim", action: "Priority changed: Medium → Urgent", time: "10:10 AM", icon: AlertTriangle, color: "text-red-600 bg-red-100" },
  { user: "Rahim", action: "Status changed: New → In Progress", time: "10:15 AM", icon: Activity, color: "text-blue-600 bg-blue-100" },
  { user: "Arif", action: "attached payroll-error.png", time: "10:30 AM", icon: Paperclip, color: "text-slate-600 bg-slate-100" },
  { user: "Arif", action: "Status changed: In Progress → Fixed", time: "1:00 PM", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  { user: "Arif", action: "Status changed: Fixed → Ready for QA", time: "1:05 PM", icon: Activity, color: "text-amber-600 bg-amber-100" },
  { user: "Fahim", action: "Status changed: Ready for QA → Retesting", time: "2:00 PM", icon: Activity, color: "text-blue-600 bg-blue-100" },
];

const attachments = [
  { name: "payroll-error.png", size: "1.4 MB", by: "Fahim Ahmed", date: "Sep 10, 2026", type: "screenshot", icon: ImageIcon, color: "text-blue-500 bg-blue-50" },
  { name: "payroll-bug.mp4", size: "8.2 MB", by: "Fahim Ahmed", date: "Sep 10, 2026", type: "recording", icon: Video, color: "text-violet-500 bg-violet-50" },
  { name: "console-log.txt", size: "12 KB", by: "Arif Ahmed", date: "Sep 10, 2026", type: "log", icon: FileText, color: "text-slate-500 bg-slate-50" },
  { name: "salary-config.json", size: "4 KB", by: "Arif Ahmed", date: "Sep 10, 2026", type: "config", icon: FileCode, color: "text-amber-500 bg-amber-50" },
];

const relationshipMap = [
  { label: "Client", value: "ABC Technologies", icon: UserPlus },
  { label: "Project", value: "ABC ERP", icon: Bug },
  { label: "Module", value: "Payroll", icon: FileText },
  { label: "Requirement", value: "Salary Generation", icon: FileCode },
  { label: "Task", value: "TASK-10421", icon: CheckCircle },
  { label: "Bug", value: "BUG-10291", icon: Bug, highlight: true },
  { label: "Developer", value: "Arif Ahmed", icon: UserPlus },
  { label: "QA", value: "Fahim Ahmed", icon: CheckCircle },
];

const historyRows = [
  { from: "—", to: "New", by: "Fahim Ahmed", time: "Sep 10, 2026 10:00 AM" },
  { from: "New", to: "In Progress", by: "Rahim Ahmed", time: "Sep 10, 2026 10:15 AM" },
  { from: "In Progress", to: "Fixed", by: "Arif Ahmed", time: "Sep 10, 2026 1:00 PM" },
  { from: "Fixed", to: "Ready for QA", by: "Arif Ahmed", time: "Sep 10, 2026 1:05 PM" },
  { from: "Ready for QA", to: "Retesting", by: "Fahim Ahmed", time: "Sep 10, 2026 2:00 PM" },
  { from: "Retesting", to: "In Progress", by: "Fahim Ahmed", time: "Sep 10, 2026 2:15 PM" },
];

const environmentDetails = [
  { label: "Environment", value: "Staging" },
  { label: "Browser", value: "Chrome 140" },
  { label: "OS", value: "macOS" },
  { label: "Version", value: "v2.4.1" },
  { label: "Build", value: "#2841" },
];

const tags = ["#payroll", "#calculation", "#overtime", "#critical"];

function Avatar({ initials, color = "bg-slate-100 text-slate-600" }: { initials: string; color?: string }) {
  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${color}`}>
      {initials}
    </div>
  );
}

export default function BugDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/qa/bugs"
        className="inline-flex items-center gap-1 text-xs text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Bugs
      </Link>

      {/* Bug Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-[10px] text-slate-400">BUG-10291</p>
          <h1 className="text-xl font-bold text-slate-900">Payroll overtime calculation incorrect</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Critical
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Urgent
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
              In Progress
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              ABC ERP
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              Payroll
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              Staging
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

      {/* Metadata Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Reporter</p>
            <div className="flex items-center gap-2">
              <Avatar initials="FA" color="bg-amber-100 text-amber-700" />
              <span className="text-xs font-medium text-slate-700">Fahim Ahmed</span>
            </div>
          </div>
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
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">QA Tester</p>
            <div className="flex items-center gap-2">
              <Avatar initials="FA" color="bg-amber-100 text-amber-700" />
              <span className="text-xs font-medium text-slate-700">Fahim Ahmed</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Related Task</p>
            <Link href="/projects/tasks" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
              <Link2 className="h-3 w-3" />
              TASK-10421
            </Link>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Related Requirement</p>
            <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
              <Link2 className="h-3 w-3" />
              REQ-1032
            </Link>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Created</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Clock className="h-3 w-3 text-slate-400" />
              Sep 10, 2026 10:00 AM
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">SLA Deadline</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Clock className="h-3 w-3 text-slate-400" />
              Sep 10, 2026 02:00 PM
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">SLA Status</p>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              🟠 30 minutes remaining
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Bug Age</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Clock className="h-3 w-3 text-slate-400" />
              2 hours
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
              <p className="text-xs text-slate-600">
                Employee overtime is calculated as ৳500 instead of ৳750. The overtime amount should be calculated
                according to the configured salary ratio.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-xs font-semibold text-slate-700">Actual Result</h3>
                <p className="text-xs text-slate-600">Overtime shows ৳500 for 10 hours</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-xs font-semibold text-slate-700">Expected Result</h3>
                <p className="text-xs text-slate-600">Overtime should show ৳750 for 10 hours</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-xs font-semibold text-slate-700">Environment Details</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {environmentDetails.map((env) => (
                  <div key={env.label} className="space-y-1">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{env.label}</p>
                    <p className="text-xs font-medium text-slate-700">{env.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-semibold text-slate-700">Bug Relationship Map</h3>
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

        {/* Steps to Reproduce Tab */}
        {activeTab === "Steps to Reproduce" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-semibold text-slate-700">Steps to Reproduce</h3>
              <ol className="space-y-3">
                {reproductionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                      {idx + 1}
                    </span>
                    <p className="pt-0.5 text-xs text-slate-700">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  <h3 className="text-xs font-semibold text-green-700">Expected Result</h3>
                </div>
                <p className="text-xs text-slate-700">Overtime amount should be ৳750</p>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                  <h3 className="text-xs font-semibold text-red-700">Actual Result</h3>
                </div>
                <p className="text-xs text-slate-700">Overtime amount shows ৳500</p>
              </div>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "Comments" && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              {comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3">
                  <Avatar initials={comment.initials} color={comment.color} />
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
                      Post Comment
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
              {attachments.map((file) => {
                const Icon = file.icon;
                return (
                  <div
                    key={file.name}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${file.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-700">{file.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {file.size} · {file.type} · {file.by} · {file.date}
                      </p>
                    </div>
                    <button className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-6 text-xs font-medium text-slate-500 transition hover:border-blue-400 hover:text-blue-600">
              <Paperclip className="h-4 w-4" />
              Upload File
            </button>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "History" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <History className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Reopen Count</p>
                </div>
                <p className="mt-1 text-lg font-bold text-slate-900">1</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">SLA Breaches</p>
                </div>
                <p className="mt-1 text-lg font-bold text-green-600">0</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Status Changes</p>
                </div>
                <p className="mt-1 text-lg font-bold text-slate-900">{historyRows.length}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">From</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">To</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Changed By</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-xs text-slate-500">{row.from}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                            <ChevronRight className="h-3 w-3 text-slate-300" />
                            {row.to}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">{row.by}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
