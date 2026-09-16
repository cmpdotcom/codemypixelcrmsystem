"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Loader2,
  X,
  Trash2,
  Edit2,
} from "lucide-react";

interface CriticalBug {
  id: string;
  bugNumber: number;
  title: string;
  projectName: string;
  module: string | null;
  assigneeName: string | null;
  status: string;
  severity: string;
  createdAt: string;
}

interface KPIStats {
  totalBugs: number;
  openBugs: number;
  critical: number;
  resolved: number;
  testCases: number;
  passRate: string;
  uatPending: number;
}

interface SeverityItem {
  label: string;
  count: number;
  barColor: string;
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  New: { bg: "bg-blue-50", text: "text-blue-700" },
  Assigned: { bg: "bg-amber-50", text: "text-amber-700" },
  "In Progress": { bg: "bg-purple-50", text: "text-purple-700" },
  Fixed: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Verified: { bg: "bg-green-50", text: "text-green-700" },
  Closed: { bg: "bg-slate-50", text: "text-slate-600" },
};

const moduleQuality = [
  { module: "Authentication", rate: 98, status: "Good" },
  { module: "Billing & Invoicing", rate: 94, status: "Good" },
  { module: "CRM & Contacts", rate: 91, status: "Good" },
  { module: "Reports & Analytics", rate: 82, status: "At Risk" },
  { module: "Inventory", rate: 76, status: "Critical" },
  { module: "Settings & Access", rate: 99, status: "Good" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function QADashboardPage() {
  const [kpi, setKpi] = useState<KPIStats>({
    totalBugs: 0,
    openBugs: 0,
    critical: 0,
    resolved: 0,
    testCases: 1284,
    passRate: "91.4%",
    uatPending: 3,
  });
  const [severityData, setSeverityData] = useState<SeverityItem[]>([
    { label: "Critical", count: 0, barColor: "bg-red-500" },
    { label: "High", count: 0, barColor: "bg-orange-500" },
    { label: "Medium", count: 0, barColor: "bg-amber-500" },
    { label: "Low", count: 0, barColor: "bg-slate-400" },
  ]);
  const [criticalBugs, setCriticalBugs] = useState<CriticalBug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Report Bug Modal
  const [showModal, setShowModal] = useState(false);
  const [bugForm, setBugForm] = useState({
    title: "",
    projectName: "ABC ERP Implementation",
    module: "Core",
    severity: "Critical",
    priority: "High",
    assigneeName: "John Smith",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchQAData = useCallback(async () => {
    try {
      const res = await fetch("/api/qa/bugs");
      if (!res.ok) throw new Error("Failed to load QA telemetry");
      const data = await res.json();
      if (data.kpi) setKpi(data.kpi);
      if (data.severityDistribution) setSeverityData(data.severityDistribution);
      if (data.bugs) {
        // Filter top critical & high bugs
        const crit = data.bugs.filter(
          (b: CriticalBug) => b.severity === "Critical" || b.severity === "High"
        );
        setCriticalBugs(crit.slice(0, 5));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQAData();
  }, [fetchQAData]);

  const handleReportBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugForm.title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/qa/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bugForm),
      });
      if (!res.ok) throw new Error("Failed to file bug");
      setShowModal(false);
      setBugForm({
        title: "",
        projectName: "ABC ERP Implementation",
        module: "Core",
        severity: "Critical",
        priority: "High",
        assigneeName: "John Smith",
      });
      await fetchQAData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Filing failed");
    } finally {
      setSubmitting(false);
    }
  };

  const maxSeverityCount = Math.max(...severityData.map((d) => d.count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading QA telemetry...</span>
      </div>
    );
  }

  const kpiCards = [
    { title: "Total Bugs", value: kpi.totalBugs, icon: Bug, iconColor: "text-rose-600", iconBg: "bg-rose-50" },
    { title: "Open Bugs", value: kpi.openBugs, icon: AlertCircle, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
    { title: "Critical", value: kpi.critical, icon: AlertTriangle, iconColor: "text-red-600", iconBg: "bg-red-50" },
    { title: "Resolved", value: kpi.resolved, icon: CheckCircle, iconColor: "text-green-600", iconBg: "bg-green-50" },
    { title: "Test Cases", value: kpi.testCases.toLocaleString(), icon: ClipboardCheck, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
    { title: "Pass Rate", value: kpi.passRate, icon: TrendingUp, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
    { title: "UAT Pending", value: kpi.uatPending, icon: Users, iconColor: "text-indigo-600", iconBg: "bg-indigo-50" },
  ];

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">QA & Bug Tracking</h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time software quality metrics, bug severities, and release verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/qa/bugs"
            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            All Bugs Table
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Report Bug
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      {/* Row of 7 KPI Cards (Calculated directly from Database) */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-7">
        {kpiCards.map((k, idx) => {
          const Icon = k.icon;
          return (
            <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">{k.title}</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{k.value}</p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${k.iconBg}`}>
                  <Icon className={`h-4 w-4 ${k.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row: Trend + Severity Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Severity Distribution */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-bold text-slate-900">Severity Breakdown</h2>
          <p className="mt-0.5 text-xs text-slate-400">Database bug distribution by impact</p>
          <div className="mt-5 space-y-3.5">
            {severityData.map((item) => {
              const pct = maxSeverityCount > 0 ? (item.count / maxSeverityCount) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="text-slate-500 font-bold">{item.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.barColor} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Quality Pass Rates */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900">Module Quality Health</h2>
          <p className="mt-0.5 text-xs text-slate-400">Automated pass rates across primary CRM functional areas</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {moduleQuality.map((m) => (
              <div key={m.module} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">{m.module}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      m.status === "Good"
                        ? "bg-emerald-50 text-emerald-600"
                        : m.status === "At Risk"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {m.rate}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.rate >= 90 ? "bg-emerald-500" : m.rate >= 80 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${m.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Bugs Table (Live from Database) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Critical & High Severity Bugs</h2>
            <p className="text-xs text-slate-400 mt-0.5">High-impact issues requiring engineering resolution</p>
          </div>
          <Link
            href="/qa/bugs"
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>View All ({kpi.totalBugs})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="px-6 py-3">Bug #</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3 text-right">Filed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criticalBugs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No critical bugs currently active.
                  </td>
                </tr>
              ) : (
                criticalBugs.map((bug) => {
                  const cfg = statusConfig[bug.status] || { bg: "bg-slate-50", text: "text-slate-600" };
                  return (
                    <tr key={bug.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-400">
                        BUG-{String(bug.bugNumber).padStart(4, "0")}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 max-w-sm">
                        <Link href={`/qa/bugs/${bug.id}`} className="hover:text-blue-600 truncate block">
                          {bug.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{bug.projectName}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            bug.severity === "Critical"
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-orange-50 text-orange-600 border border-orange-100"
                          }`}
                        >
                          {bug.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[8px] font-bold flex items-center justify-center">
                            {getInitials(bug.assigneeName || "UN")}
                          </div>
                          <span className="text-slate-700">{bug.assigneeName || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          {bug.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-400 whitespace-nowrap">
                        {new Date(bug.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Bug Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Report Software Defect</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportBug} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Defect Title *</label>
                <input
                  type="text"
                  required
                  value={bugForm.title}
                  onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                  placeholder="e.g. Memory leak during large export"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project *</label>
                <input
                  type="text"
                  required
                  value={bugForm.projectName}
                  onChange={(e) => setBugForm({ ...bugForm, projectName: e.target.value })}
                  placeholder="e.g. ABC ERP Implementation"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={bugForm.severity}
                    onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={bugForm.priority}
                    onChange={(e) => setBugForm({ ...bugForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Module</label>
                  <input
                    type="text"
                    value={bugForm.module}
                    onChange={(e) => setBugForm({ ...bugForm, module: e.target.value })}
                    placeholder="e.g. Checkout / API"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
                  <input
                    type="text"
                    value={bugForm.assigneeName}
                    onChange={(e) => setBugForm({ ...bugForm, assigneeName: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg shadow-sm shadow-red-500/20 transition-all flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Defect Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
