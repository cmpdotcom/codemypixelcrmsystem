"use client";

import React from "react";
import Link from "next/link";
import {
  Bug,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  TrendingUp,
  Users,
  Plus,
  ChevronRight,
  Clock,
} from "lucide-react";

// --- KPI Stats Data ---
const kpiStats = [
  {
    title: "Total Bugs",
    value: "248",
    icon: Bug,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
  },
  {
    title: "Open Bugs",
    value: "42",
    icon: AlertCircle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
  {
    title: "Critical",
    value: "4",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
  },
  {
    title: "Resolved",
    value: "206",
    icon: CheckCircle,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
  {
    title: "Test Cases",
    value: "1,284",
    icon: ClipboardCheck,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Pass Rate",
    value: "91.4%",
    icon: TrendingUp,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    title: "UAT Pending",
    value: "3",
    icon: Users,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
  },
];

// --- Bug Trend Chart Data ---
const bugTrendData = [
  { month: "Jan", count: 45 },
  { month: "Feb", count: 62 },
  { month: "Mar", count: 89 },
  { month: "Apr", count: 76 },
  { month: "May", count: 54 },
  { month: "Jun", count: 38 },
];

const maxBugCount = Math.max(...bugTrendData.map((d) => d.count));

// --- Severity Distribution Data ---
const severityData = [
  { label: "Critical", count: 4, barColor: "bg-red-500" },
  { label: "High", count: 16, barColor: "bg-orange-500" },
  { label: "Medium", count: 31, barColor: "bg-amber-500" },
  { label: "Low", count: 42, barColor: "bg-slate-400" },
];

const maxSeverityCount = Math.max(...severityData.map((d) => d.count));

// --- Recent Critical Bugs Data ---
interface CriticalBug {
  id: string;
  title: string;
  project: string;
  module: string;
  assignedTo: { name: string; initials: string; bg: string };
  age: string;
  status: string;
  statusStyle: string;
}

const criticalBugs: CriticalBug[] = [
  {
    id: "BUG-10291",
    title: "Payroll calculation incorrect",
    project: "ABC ERP",
    module: "Payroll",
    assignedTo: { name: "Arif Ahmed", initials: "AA", bg: "bg-blue-100 text-blue-700" },
    age: "2h",
    status: "In Progress",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  {
    id: "BUG-10287",
    title: "Login timeout issue",
    project: "Mobile Banking",
    module: "Auth",
    assignedTo: { name: "Karim Ahmed", initials: "KA", bg: "bg-emerald-100 text-emerald-700" },
    age: "5h",
    status: "Assigned",
    statusStyle: "bg-amber-50 text-amber-600 border border-amber-100",
  },
  {
    id: "BUG-10284",
    title: "Data loss on save",
    project: "ABC ERP",
    module: "Inventory",
    assignedTo: { name: "Aarav Sharma", initials: "AS", bg: "bg-purple-100 text-purple-700" },
    age: "1d",
    status: "In Progress",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  {
    id: "BUG-10280",
    title: "API returns 500 error",
    project: "Mobile Banking",
    module: "Payment",
    assignedTo: { name: "Karthik Reddy", initials: "KR", bg: "bg-rose-100 text-rose-700" },
    age: "2d",
    status: "Fixed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
];

// --- Module Quality Data ---
interface ModuleQuality {
  name: string;
  passRate: number;
  barColor: string;
}

const moduleQuality: ModuleQuality[] = [
  { name: "Authentication", passRate: 98, barColor: "bg-green-500" },
  { name: "HR", passRate: 95, barColor: "bg-green-500" },
  { name: "Attendance", passRate: 88, barColor: "bg-amber-500" },
  { name: "Payroll", passRate: 72, barColor: "bg-red-500" },
  { name: "CRM", passRate: 94, barColor: "bg-green-500" },
  { name: "Inventory", passRate: 84, barColor: "bg-amber-500" },
];

export default function QAPage() {
  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            QA & Quality
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor bugs, testing, releases and product quality.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2 px-3.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Test Case</span>
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Create Bug</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
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

      {/* Two-column layout: Bug Trend + Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bug Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Bug Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly bug reports over time
            </p>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-48 pt-6">
            {bugTrendData.map((data, idx) => {
              const heightPct = (data.count / maxBugCount) * 100;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full gap-1.5"
                >
                  <span className="text-[10px] font-bold text-slate-700">
                    {data.count}
                  </span>
                  <div className="w-full flex justify-center" style={{ height: "100%" }}>
                    <div
                      className="w-full max-w-[40px] bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Severity Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Open bugs by severity
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {severityData.map((data, idx) => {
              const widthPct = (data.count / maxSeverityCount) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-700">
                      {data.label}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {data.count}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${data.barColor} transition-all`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Critical Bugs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Critical Bugs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {criticalBugs.length} critical bugs need attention
            </p>
          </div>
          <Link
            href="/qa/bugs"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="py-3 px-3 font-medium">Bug ID</th>
                <th className="py-3 px-3 font-medium">Title</th>
                <th className="py-3 px-3 font-medium">Project</th>
                <th className="py-3 px-3 font-medium">Module</th>
                <th className="py-3 px-3 font-medium">Assigned To</th>
                <th className="py-3 px-3 font-medium">Age</th>
                <th className="py-3 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {criticalBugs.map((bug) => (
                <tr
                  key={bug.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Bug ID */}
                  <td className="py-3 px-3">
                    <Link
                      href="/qa/bugs/1"
                      className="font-mono text-[10px] text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      {bug.id}
                    </Link>
                  </td>

                  {/* Title */}
                  <td className="py-3 px-3">
                    <Link href="/qa/bugs/1" className="block">
                      <p className="font-bold text-slate-900 leading-tight hover:text-blue-600 transition-colors">
                        {bug.title}
                      </p>
                    </Link>
                  </td>

                  {/* Project */}
                  <td className="py-3 px-3">
                    <span className="text-slate-700 font-medium">
                      {bug.project}
                    </span>
                  </td>

                  {/* Module */}
                  <td className="py-3 px-3">
                    <span className="text-slate-600">{bug.module}</span>
                  </td>

                  {/* Assigned To */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${bug.assignedTo.bg}`}
                      >
                        {bug.assignedTo.initials}
                      </div>
                      <span className="text-slate-700 font-medium">
                        {bug.assignedTo.name}
                      </span>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="py-3 px-3">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {bug.age}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${bug.statusStyle}`}
                    >
                      {bug.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module Quality */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Module Quality</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pass rate by module
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
          {moduleQuality.map((module, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  {module.name}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {module.passRate}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${module.barColor} transition-all`}
                  style={{ width: `${module.passRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
