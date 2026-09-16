"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Rocket,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  GitBranch,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Loader2,
  Trash2,
  X,
  Server,
  Terminal,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface DeploymentItem {
  id: string;
  depNumber: number;
  projectName: string;
  environment: "Production" | "Staging" | "QA";
  version: string;
  commitHash: string | null;
  commitMsg: string | null;
  branch: string | null;
  status: "Successful" | "In Progress" | "Failed" | "Rolled Back";
  deployedBy: string;
  duration: string | null;
  releaseNotes: string | null;
  url: string | null;
  rollbackFrom: string | null;
  createdAt: string;
}

interface KPIStats {
  totalDeployments: number;
  successful: number;
  inProgress: number;
  failed: number;
  rolledBack: number;
  successRate: string;
}

const ENV_COLORS: Record<string, string> = {
  Production: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Staging: "bg-blue-50 text-blue-700 border-blue-200",
  QA: "bg-purple-50 text-purple-700 border-purple-200",
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Successful: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  "In Progress": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  Failed: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", dot: "bg-rose-500" },
  "Rolled Back": { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
};

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<"All" | "Production" | "Staging" | "QA">("All");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [envCounts, setEnvCounts] = useState<Record<string, number>>({
    All: 0,
    Production: 0,
    Staging: 0,
    QA: 0,
  });
  const [kpi, setKpi] = useState<KPIStats>({
    totalDeployments: 0,
    successful: 0,
    inProgress: 0,
    failed: 0,
    rolledBack: 0,
    successRate: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trigger Deployment Modal
  const [showModal, setShowModal] = useState(false);
  const [depForm, setDepForm] = useState({
    projectName: "ABC ERP Implementation",
    environment: "Production" as "Production" | "Staging" | "QA",
    version: "v2.5.0",
    branch: "main",
    commitMsg: "Release build with security patches",
    deployedBy: "Ali Khan",
    url: "https://erp.abctechnologies.com",
    releaseNotes: "Automated production deployment cutover",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDeployments = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedEnv !== "All") params.set("environment", selectedEnv);
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/deployments?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load deployments");
      const data = await res.json();
      setDeployments(data.deployments || []);
      if (data.kpi) setKpi(data.kpi);
      if (data.envCounts) setEnvCounts(data.envCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [selectedEnv, statusFilter, searchQuery]);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const handleRollback = async (id: string, version: string) => {
    if (!confirm(`Trigger emergency rollback for ${version}?`)) return;
    try {
      const res = await fetch(`/api/deployments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback" }),
      });
      if (!res.ok) throw new Error("Rollback failed");
      await fetchDeployments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rollback failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deployment record?")) return;
    try {
      const res = await fetch(`/api/deployments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchDeployments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleTriggerDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depForm.projectName.trim() || !depForm.version.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(depForm),
      });
      if (!res.ok) throw new Error("Deployment trigger failed");
      setShowModal(false);
      await fetchDeployments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trigger failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading deployment pipelines...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deployments</h1>
          <p className="mt-1 text-xs text-slate-500">
            Monitor CI/CD releases, staging promotion, production cutovers, and zero-downtime rollbacks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Deploy Release</span>
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

      {/* Row of 5 KPI Metric Cards (Calculated directly from Database) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Deployments</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalDeployments}</h3>
            <p className="text-[10px] text-slate-400">Recorded releases</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Successful</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.successful}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">{kpi.successRate} success rate</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">In Progress</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.inProgress}</h3>
            <p className="text-[10px] text-indigo-600 font-semibold">Active rollout</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Failed</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.failed}</h3>
            <p className="text-[10px] text-rose-500 font-semibold">Build/runtime errors</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Rolled Back</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.rolledBack}</h3>
            <p className="text-[10px] text-amber-600 font-semibold">Auto-reverted</p>
          </div>
        </div>
      </div>

      {/* Environment Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["All", "Production", "Staging", "QA"] as const).map((env) => {
          const isActive = selectedEnv === env;
          return (
            <button
              key={env}
              onClick={() => setSelectedEnv(env)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-white border border-blue-500/40 text-blue-600 shadow-2xs"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>{env}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                {envCounts[env] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deployments by project, version, commit, deployer..."
            className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Successful">Successful</option>
            <option value="In Progress">In Progress</option>
            <option value="Failed">Failed</option>
            <option value="Rolled Back">Rolled Back</option>
          </select>

          {(searchQuery || statusFilter !== "All Statuses" || selectedEnv !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All Statuses");
                setSelectedEnv("All");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Deployments Table */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Release / Project</th>
                <th className="py-3 px-3">Environment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Commit & Branch</th>
                <th className="py-3 px-3">Deployed By</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deployments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No deployments recorded for this filter.
                  </td>
                </tr>
              ) : (
                deployments.map((dep) => {
                  const cfg = STATUS_CONFIG[dep.status] || STATUS_CONFIG["Successful"];
                  return (
                    <tr key={dep.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{dep.version}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-blue-600">{dep.projectName}</span>
                        </div>
                        {dep.commitMsg && (
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-sm">{dep.commitMsg}</p>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${ENV_COLORS[dep.environment]}`}>
                          {dep.environment}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {dep.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <GitBranch className="w-3 h-3 text-slate-400" />
                          <span>{dep.branch || "main"}</span>
                          <span className="text-slate-300">@</span>
                          <span className="text-slate-500">{dep.commitHash || "7ad6808"}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {dep.deployedBy}
                      </td>

                      <td className="py-3 px-3 text-slate-500">
                        {dep.duration || "2m 30s"}
                      </td>

                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(dep.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {dep.url && (
                            <a
                              href={dep.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:text-blue-600 text-slate-400 rounded hover:bg-slate-100"
                              title="Visit live deployment"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {dep.status === "Successful" && (
                            <button
                              onClick={() => handleRollback(dep.id, dep.version)}
                              className="p-1 hover:text-amber-600 text-slate-400 rounded hover:bg-amber-50 cursor-pointer"
                              title="Rollback this version"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(dep.id)}
                            className="p-1 hover:text-red-600 text-slate-400 rounded hover:bg-red-50 cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trigger Deployment Modal */}
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
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Trigger New Release Deployment</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTriggerDeploy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Project *</label>
                <input
                  type="text"
                  required
                  value={depForm.projectName}
                  onChange={(e) => setDepForm({ ...depForm, projectName: e.target.value })}
                  placeholder="e.g. ABC ERP Implementation"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Environment</label>
                  <select
                    value={depForm.environment}
                    onChange={(e) => setDepForm({ ...depForm, environment: e.target.value as "Production" | "Staging" | "QA" })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="QA">QA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Release Version *</label>
                  <input
                    type="text"
                    required
                    value={depForm.version}
                    onChange={(e) => setDepForm({ ...depForm, version: e.target.value })}
                    placeholder="e.g. v2.5.0"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Git Branch</label>
                  <input
                    type="text"
                    value={depForm.branch}
                    onChange={(e) => setDepForm({ ...depForm, branch: e.target.value })}
                    placeholder="main"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Operator</label>
                  <input
                    type="text"
                    value={depForm.deployedBy}
                    onChange={(e) => setDepForm({ ...depForm, deployedBy: e.target.value })}
                    placeholder="Ali Khan"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Commit Message / Changelog</label>
                <input
                  type="text"
                  value={depForm.commitMsg}
                  onChange={(e) => setDepForm({ ...depForm, commitMsg: e.target.value })}
                  placeholder="e.g. Production hotfix for banking webhook"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Production URL</label>
                <input
                  type="text"
                  value={depForm.url}
                  onChange={(e) => setDepForm({ ...depForm, url: e.target.value })}
                  placeholder="https://app.client.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm & Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
