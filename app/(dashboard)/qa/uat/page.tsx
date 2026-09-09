"use client";

import {
  Plus,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Play,
  ChevronRight,
  Calendar,
} from "lucide-react";

type UATStatus = "In Progress" | "Completed" | "Pending";
type ModuleStatus = "accepted" | "in-progress" | "pending";

interface UATModule {
  name: string;
  status: ModuleStatus;
}

interface UATCycle {
  id: string;
  name: string;
  client: string;
  project: string;
  status: UATStatus;
  accepted: number;
  total: number;
  modules: UATModule[];
  tester: string;
  testerInitials: string;
  testerColor: string;
  startDate: string;
  endDate: string;
}

const statusConfig: Record<UATStatus, { badge: string; dot: string }> = {
  "In Progress": { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  Completed: { badge: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  Pending: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
};

const moduleConfig: Record<ModuleStatus, { pill: string; symbol: string; label: string }> = {
  accepted: { pill: "bg-green-50 text-green-700 border-green-200", symbol: "✓", label: "Accepted" },
  "in-progress": { pill: "bg-amber-50 text-amber-700 border-amber-200", symbol: "🟡", label: "In Review" },
  pending: { pill: "bg-slate-100 text-slate-500 border-slate-200", symbol: "○", label: "Pending" },
};

const kpis = [
  { label: "Active Cycles", value: "3", icon: Play, iconBg: "bg-blue-50", iconText: "text-blue-600" },
  { label: "Total Features", value: "48", icon: ClipboardCheck, iconBg: "bg-slate-100", iconText: "text-slate-600" },
  { label: "Accepted", value: "32", icon: CheckCircle, iconBg: "bg-green-50", iconText: "text-green-600" },
  { label: "Rejected", value: "8", icon: XCircle, iconBg: "bg-rose-50", iconText: "text-rose-600" },
];

const uatCycles: UATCycle[] = [
  {
    id: "UAT-001",
    name: "ABC ERP Phase 1 UAT",
    client: "ABC Technologies",
    project: "ABC ERP",
    status: "In Progress",
    accepted: 32,
    total: 48,
    modules: [
      { name: "HR", status: "accepted" },
      { name: "Attendance", status: "accepted" },
      { name: "Payroll", status: "in-progress" },
      { name: "Reports", status: "pending" },
    ],
    tester: "Aarav Sharma",
    testerInitials: "AS",
    testerColor: "bg-blue-500",
    startDate: "Mar 05, 2025",
    endDate: "Mar 25, 2025",
  },
  {
    id: "UAT-002",
    name: "Mobile Banking Auth UAT",
    client: "FinanceHub",
    project: "Mobile Banking",
    status: "Completed",
    accepted: 20,
    total: 20,
    modules: [
      { name: "Login", status: "accepted" },
      { name: "OTP", status: "accepted" },
      { name: "Biometric", status: "accepted" },
      { name: "Reset", status: "accepted" },
    ],
    tester: "Sneha Iyer",
    testerInitials: "SI",
    testerColor: "bg-pink-500",
    startDate: "Feb 15, 2025",
    endDate: "Feb 28, 2025",
  },
  {
    id: "UAT-003",
    name: "Website Redesign UAT",
    client: "CreativeCo",
    project: "Website Redesign",
    status: "Pending",
    accepted: 0,
    total: 15,
    modules: [
      { name: "Homepage", status: "pending" },
      { name: "About", status: "pending" },
      { name: "Contact", status: "pending" },
      { name: "Blog", status: "pending" },
    ],
    tester: "Divya Rao",
    testerInitials: "DR",
    testerColor: "bg-indigo-500",
    startDate: "Mar 22, 2025",
    endDate: "Apr 02, 2025",
  },
  {
    id: "UAT-004",
    name: "ABC ERP Payroll UAT",
    client: "ABC Technologies",
    project: "ABC ERP",
    status: "In Progress",
    accepted: 8,
    total: 12,
    modules: [
      { name: "Salary", status: "accepted" },
      { name: "Tax", status: "accepted" },
      { name: "Deductions", status: "in-progress" },
      { name: "Payslip", status: "pending" },
    ],
    tester: "Priya Nair",
    testerInitials: "PN",
    testerColor: "bg-purple-500",
    startDate: "Mar 12, 2025",
    endDate: "Mar 22, 2025",
  },
];

export default function UATPage() {
  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">UAT</h1>
          <p className="mt-1 text-xs text-slate-500">Client acceptance testing and feedback</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Create UAT Cycle
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

      {/* UAT Cycles List */}
      <div className="space-y-4">
        {uatCycles.map((cycle) => {
          const sc = statusConfig[cycle.status];
          const progressPercent = cycle.total > 0 ? (cycle.accepted / cycle.total) * 100 : 0;
          return (
            <div
              key={cycle.id}
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
                      <h3 className="text-sm font-bold text-slate-900">{cycle.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${sc.badge}`}>
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {cycle.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{cycle.client}</span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                        {cycle.project}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{cycle.id}</span>
                    </div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                  View Feedback
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-500">
                    Features Accepted · {cycle.accepted}/{cycle.total}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-700">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Module breakdown */}
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-medium text-slate-500">Module Breakdown</p>
                <div className="flex flex-wrap items-center gap-2">
                  {cycle.modules.map((mod) => {
                    const mc = moduleConfig[mod.status];
                    return (
                      <span
                        key={mod.name}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${mc.pill}`}
                      >
                        <span className="text-[10px] leading-none">{mc.symbol}</span>
                        {mod.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bottom row: tester + dates */}
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ${cycle.testerColor}`}>
                    {cycle.testerInitials}
                  </div>
                  <span className="text-xs text-slate-600">{cycle.tester}</span>
                  <span className="text-[10px] text-slate-400">· Lead Tester</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[10px] text-slate-500">{cycle.startDate}</span>
                  <span className="text-[10px] text-slate-300">→</span>
                  <span className="text-[10px] text-slate-500">{cycle.endDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
