"use client";

import {
  Plus,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Play,
  ChevronRight,
  Users,
  Calendar,
} from "lucide-react";

type RunStatus = "In Progress" | "Completed" | "Ready";

interface TestRun {
  id: string;
  name: string;
  project: string;
  status: RunStatus;
  passed: number;
  failed: number;
  total: number;
  executed: number;
  passRate: number;
  startDate: string;
  endDate: string;
  team: { name: string; initials: string; color: string }[];
}

const statusConfig: Record<RunStatus, { badge: string; dot: string }> = {
  "In Progress": { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  Completed: { badge: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  Ready: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
};

const kpis = [
  { label: "Active Runs", value: "5", icon: Play, iconBg: "bg-blue-50", iconText: "text-blue-600" },
  { label: "Total Tests", value: "500", icon: ClipboardCheck, iconBg: "bg-slate-100", iconText: "text-slate-600" },
  { label: "Passed", value: "462", icon: CheckCircle, iconBg: "bg-green-50", iconText: "text-green-600" },
  { label: "Failed", value: "21", icon: XCircle, iconBg: "bg-rose-50", iconText: "text-rose-600" },
];

const testRuns: TestRun[] = [
  {
    id: "TR-001",
    name: "ABC ERP v2.5.0 Regression",
    project: "ABC ERP",
    status: "In Progress",
    passed: 323,
    failed: 27,
    total: 500,
    executed: 350,
    passRate: 92.4,
    startDate: "Mar 10, 2025",
    endDate: "Mar 20, 2025",
    team: [
      { name: "Aarav Sharma", initials: "AS", color: "bg-blue-500" },
      { name: "Priya Nair", initials: "PN", color: "bg-purple-500" },
      { name: "Karthik Reddy", initials: "KR", color: "bg-emerald-500" },
    ],
  },
  {
    id: "TR-002",
    name: "Mobile Banking Auth Suite",
    project: "Mobile Banking",
    status: "Completed",
    passed: 118,
    failed: 2,
    total: 120,
    executed: 120,
    passRate: 98.3,
    startDate: "Mar 01, 2025",
    endDate: "Mar 05, 2025",
    team: [
      { name: "Sneha Iyer", initials: "SI", color: "bg-pink-500" },
      { name: "Rohan Mehta", initials: "RM", color: "bg-amber-500" },
    ],
  },
  {
    id: "TR-003",
    name: "Website Redesign Smoke Test",
    project: "Website Redesign",
    status: "Ready",
    passed: 0,
    failed: 0,
    total: 45,
    executed: 0,
    passRate: 0,
    startDate: "Mar 18, 2025",
    endDate: "Mar 22, 2025",
    team: [
      { name: "Divya Rao", initials: "DR", color: "bg-indigo-500" },
    ],
  },
  {
    id: "TR-004",
    name: "ABC ERP Payroll Module",
    project: "ABC ERP",
    status: "In Progress",
    passed: 40,
    failed: 5,
    total: 80,
    executed: 45,
    passRate: 87.8,
    startDate: "Mar 12, 2025",
    endDate: "Mar 19, 2025",
    team: [
      { name: "Priya Nair", initials: "PN", color: "bg-purple-500" },
      { name: "Divya Rao", initials: "DR", color: "bg-indigo-500" },
      { name: "Aarav Sharma", initials: "AS", color: "bg-blue-500" },
      { name: "Karthik Reddy", initials: "KR", color: "bg-emerald-500" },
    ],
  },
  {
    id: "TR-005",
    name: "Mobile Banking v1.2 UAT",
    project: "Mobile Banking",
    status: "Completed",
    passed: 191,
    failed: 9,
    total: 200,
    executed: 200,
    passRate: 95.5,
    startDate: "Feb 20, 2025",
    endDate: "Feb 28, 2025",
    team: [
      { name: "Sneha Iyer", initials: "SI", color: "bg-pink-500" },
      { name: "Rohan Mehta", initials: "RM", color: "bg-amber-500" },
      { name: "Aarav Sharma", initials: "AS", color: "bg-blue-500" },
    ],
  },
];

export default function TestRunsPage() {
  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Test Runs</h1>
          <p className="mt-1 text-xs text-slate-500">Execute test suites and track results</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Create Test Run
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
            >
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

      {/* Test Runs List */}
      <div className="space-y-4">
        {testRuns.map((run) => {
          const sc = statusConfig[run.status];
          const progressPercent = run.total > 0 ? (run.executed / run.total) * 100 : 0;
          const passPercent = run.executed > 0 ? (run.passed / run.executed) * 100 : 0;
          const failPercent = run.executed > 0 ? (run.failed / run.executed) * 100 : 0;
          return (
            <div
              key={run.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Top row: name + status + actions */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <ClipboardCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{run.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${sc.badge}`}>
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {run.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                        {run.project}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{run.id}</span>
                    </div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                  View Details
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-500">
                    Progress · {run.executed}/{run.total} tests executed
                  </span>
                  <span className="text-[10px] font-semibold text-slate-700">{Math.round(progressPercent)}%</span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-green-500" style={{ width: `${passPercent}%` }} />
                  <div className="h-full bg-rose-500" style={{ width: `${failPercent}%` }} />
                </div>
                <div className="mt-2 flex items-center gap-4 text-[10px]">
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    {run.passed} Passed
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
                    {run.failed} Failed
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
                    {run.total - run.executed} Pending
                  </span>
                </div>
              </div>

              {/* Bottom row: pass rate + dates + team */}
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs font-semibold text-slate-700">{run.passRate}%</span>
                    <span className="text-[10px] text-slate-400">pass rate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-500">{run.startDate}</span>
                    <span className="text-[10px] text-slate-300">→</span>
                    <span className="text-[10px] text-slate-500">{run.endDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <div className="flex -space-x-2">
                    {run.team.map((member) => (
                      <div
                        key={member.initials}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white ${member.color}`}
                        title={member.name}
                      >
                        {member.initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{run.team.length} testers</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
