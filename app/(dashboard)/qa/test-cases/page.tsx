"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Play,
  MoreHorizontal,
  ChevronRight,
  Clock,
  FileText,
  Bug,
} from "lucide-react";

type TestResult = "Pass" | "Fail" | "Not Run";
type Priority = "Critical" | "High" | "Medium" | "Low";
type TestType = "Functional" | "Regression" | "Smoke" | "Integration" | "UI" | "Performance";

interface TestCase {
  id: string;
  title: string;
  project: string;
  module: string;
  priority: Priority;
  type: TestType;
  lastResult: TestResult;
  executedBy: string;
  executedByInitials: string;
}

const resultConfig: Record<TestResult, { badge: string; dot: string; icon: typeof CheckCircle }> = {
  Pass: { badge: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500", icon: CheckCircle },
  Fail: { badge: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", icon: XCircle },
  "Not Run": { badge: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-400", icon: Clock },
};

const priorityConfig: Record<Priority, { dot: string; text: string }> = {
  Critical: { dot: "bg-rose-500", text: "text-rose-600" },
  High: { dot: "bg-amber-500", text: "text-amber-600" },
  Medium: { dot: "bg-blue-500", text: "text-blue-600" },
  Low: { dot: "bg-slate-400", text: "text-slate-500" },
};

const kpis = [
  { label: "Total Cases", value: "1,284", icon: ClipboardCheck, iconBg: "bg-blue-50", iconText: "text-blue-600" },
  { label: "Passed", value: "842", icon: CheckCircle, iconBg: "bg-green-50", iconText: "text-green-600" },
  { label: "Failed", value: "62", icon: XCircle, iconBg: "bg-rose-50", iconText: "text-rose-600" },
  { label: "Not Run", value: "380", icon: Clock, iconBg: "bg-slate-100", iconText: "text-slate-500" },
];

const testCases: TestCase[] = [
  { id: "TC-1001", title: "Login with valid credentials", project: "ABC ERP", module: "Auth", priority: "Critical", type: "Functional", lastResult: "Pass", executedBy: "Aarav Sharma", executedByInitials: "AS" },
  { id: "TC-1002", title: "Verify payroll calculation for monthly salary", project: "ABC ERP", module: "Payroll", priority: "High", type: "Functional", lastResult: "Pass", executedBy: "Priya Nair", executedByInitials: "PN" },
  { id: "TC-1003", title: "Test file upload with large PDF (10MB)", project: "ABC ERP", module: "Documents", priority: "Medium", type: "Functional", lastResult: "Fail", executedBy: "Karthik Reddy", executedByInitials: "KR" },
  { id: "TC-1004", title: "Verify OTP delivery via SMS", project: "Mobile Banking", module: "Auth", priority: "Critical", type: "Integration", lastResult: "Pass", executedBy: "Sneha Iyer", executedByInitials: "SI" },
  { id: "TC-1005", title: "Check dashboard loads under 2 seconds", project: "Website Redesign", module: "Dashboard", priority: "High", type: "Performance", lastResult: "Pass", executedBy: "Rohan Mehta", executedByInitials: "RM" },
  { id: "TC-1006", title: "Verify leave request approval workflow", project: "ABC ERP", module: "HR", priority: "Medium", type: "Functional", lastResult: "Not Run", executedBy: "Divya Rao", executedByInitials: "DR" },
  { id: "TC-1007", title: "Test password reset email flow", project: "Mobile Banking", module: "Auth", priority: "High", type: "Regression", lastResult: "Pass", executedBy: "Aarav Sharma", executedByInitials: "AS" },
  { id: "TC-1008", title: "Verify bulk employee import from CSV", project: "ABC ERP", module: "HR", priority: "Medium", type: "Functional", lastResult: "Fail", executedBy: "Karthik Reddy", executedByInitials: "KR" },
  { id: "TC-1009", title: "Test responsive layout on mobile viewport", project: "Website Redesign", module: "UI", priority: "Low", type: "UI", lastResult: "Pass", executedBy: "Sneha Iyer", executedByInitials: "SI" },
  { id: "TC-1010", title: "Verify tax deduction slab calculation", project: "ABC ERP", module: "Payroll", priority: "High", type: "Functional", lastResult: "Pass", executedBy: "Priya Nair", executedByInitials: "PN" },
  { id: "TC-1011", title: "Test session timeout after 15 minutes", project: "Mobile Banking", module: "Security", priority: "Critical", type: "Regression", lastResult: "Not Run", executedBy: "Rohan Mehta", executedByInitials: "RM" },
  { id: "TC-1012", title: "Verify attendance biometric sync", project: "ABC ERP", module: "Attendance", priority: "Medium", type: "Integration", lastResult: "Pass", executedBy: "Divya Rao", executedByInitials: "DR" },
];

const projectOptions = ["All Projects", "ABC ERP", "Mobile Banking", "Website Redesign"];
const moduleOptions = ["All Modules", "Auth", "Payroll", "HR", "Attendance", "Documents", "Dashboard", "UI", "Security"];
const priorityOptions = ["All Priorities", "Critical", "High", "Medium", "Low"];
const typeOptions = ["All Types", "Functional", "Regression", "Smoke", "Integration", "UI", "Performance"];

export default function TestCasesPage() {
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

  const filteredCases = testCases.filter((tc) => {
    const matchesSearch =
      tc.title.toLowerCase().includes(search.toLowerCase()) ||
      tc.id.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === "All Projects" || tc.project === projectFilter;
    const matchesModule = moduleFilter === "All Modules" || tc.module === moduleFilter;
    const matchesPriority = priorityFilter === "All Priorities" || tc.priority === priorityFilter;
    const matchesType = typeFilter === "All Types" || tc.type === typeFilter;
    return matchesSearch && matchesProject && matchesModule && matchesPriority && matchesType;
  });

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Test Cases</h1>
          <p className="mt-1 text-xs text-slate-500">Manage test cases and test suites</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Create Test Case
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

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search test cases by title or ID..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className={selectClass}>
            {projectOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className={selectClass}>
            {moduleOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={selectClass}>
            {priorityOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
            {typeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearch("");
              setProjectFilter("All Projects");
              setModuleFilter("All Modules");
              setPriorityFilter("All Priorities");
              setTypeFilter("All Types");
            }}
            className="ml-auto text-xs font-semibold text-slate-500 transition hover:text-slate-800"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-800">Test Cases</h2>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {filteredCases.length} cases
            </span>
          </div>
          <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700">
            View all suites
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Test Case ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Module</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Last Result</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Executed By</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((tc) => {
                const rc = resultConfig[tc.lastResult];
                const pc = priorityConfig[tc.priority];
                const ResultIcon = rc.icon;
                return (
                  <tr key={tc.id} className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-slate-400">{tc.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-800">{tc.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                        {tc.project}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600">{tc.module}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${pc.dot}`} />
                        <span className={`text-xs font-medium ${pc.text}`}>{tc.priority}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600">{tc.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${rc.badge}`}>
                        <ResultIcon className="h-3 w-3" />
                        {tc.lastResult}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                          {tc.executedByInitials}
                        </div>
                        <span className="text-xs text-slate-600">{tc.executedBy}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50">
                          Edit
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-blue-700">
                          <Play className="h-3 w-3" />
                          Run
                        </button>
                        <button className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredCases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bug className="h-8 w-8 text-slate-300" />
            <p className="mt-2 text-xs text-slate-500">No test cases match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
