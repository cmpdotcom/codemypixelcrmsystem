"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Flag,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Trash2,
  Edit2,
  X,
  Search,
} from "lucide-react";

type MilestoneStatus = "Completed" | "In Progress" | "Not Started";

interface MilestoneItem {
  id: string;
  mstNumber: number;
  name: string;
  description: string | null;
  projectName: string;
  status: MilestoneStatus;
  progress: number;
  deadline: string;
  taskCount: number;
  taskTotal: number;
  owner: string;
  ownerInitials: string;
}

interface KPIStats {
  totalMilestones: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

const statusConfig: Record<MilestoneStatus, { dot: string; text: string; bg: string }> = {
  Completed: { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50 border-green-200" },
  "In Progress": { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  "Not Started": { dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-50 border-slate-200" },
};

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({
    totalMilestones: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [error, setError] = useState<string | null>(null);

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [mstForm, setMstForm] = useState({
    id: "",
    name: "",
    projectName: "ABC ERP Implementation",
    status: "In Progress" as MilestoneStatus,
    progress: "50",
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    taskCount: "10",
    taskTotal: "20",
    owner: "Aarav Sharma",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchMilestones = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);
      if (projectFilter !== "All Projects") params.set("project", projectFilter);

      const res = await fetch(`/api/milestones?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load milestones");
      const data = await res.json();
      setMilestones(data.milestones || []);
      if (data.kpi) setKpi(data.kpi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, projectFilter]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const handleStatusChange = async (id: string, nextStatus: MilestoneStatus) => {
    try {
      const res = await fetch(`/api/milestones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchMilestones();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update error");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      const res = await fetch(`/api/milestones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchMilestones();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete error");
    }
  };

  const handleOpenCreate = (defaultProject = "ABC ERP Implementation") => {
    setModalMode("create");
    setMstForm({
      id: "",
      name: "",
      projectName: defaultProject,
      status: "In Progress",
      progress: "50",
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      taskCount: "10",
      taskTotal: "20",
      owner: "Aarav Sharma",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (m: MilestoneItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setMstForm({
      id: m.id,
      name: m.name,
      projectName: m.projectName,
      status: m.status,
      progress: String(m.progress),
      deadline: m.deadline ? m.deadline.slice(0, 10) : "",
      taskCount: String(m.taskCount),
      taskTotal: String(m.taskTotal),
      owner: m.owner,
    });
    setShowModal(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mstForm.name.trim() || !mstForm.projectName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/milestones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mstForm),
        });
        if (!res.ok) throw new Error("Create failed");
      } else {
        const res = await fetch(`/api/milestones/${mstForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mstForm),
        });
        if (!res.ok) throw new Error("Update failed");
      }
      setShowModal(false);
      await fetchMilestones();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading project milestones...</span>
      </div>
    );
  }

  // Group milestones by project
  const projectNames = Array.from(new Set(milestones.map((m) => m.projectName)));

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Top Title Bar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Milestones</h1>
          <p className="mt-1 text-xs text-slate-500">Track key deliverables and deadlines across all client projects</p>
        </div>
        <button
          onClick={() => handleOpenCreate()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Milestone
        </button>
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

      {/* 4 Metric KPI Cards (Calculated directly from Database) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Milestones</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{kpi.totalMilestones}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Flag className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Completed</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{kpi.completed}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">In Progress</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{kpi.inProgress}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Overdue</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{kpi.overdue}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestones by name, project, or owner..."
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
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Projects">All Projects</option>
            {projectNames.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {(searchQuery || statusFilter !== "All Statuses" || projectFilter !== "All Projects") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All Statuses");
                setProjectFilter("All Projects");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Project Grouped Cards */}
      <div className="space-y-6">
        {projectNames.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 text-xs">
            No milestones found. Click &quot;Add Milestone&quot; to create one.
          </div>
        ) : (
          projectNames.map((projName) => {
            const groupMilestones = milestones.filter((m) => m.projectName === projName);
            if (groupMilestones.length === 0) return null;
            return (
              <div key={projName} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
                      {projName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">{projName}</h2>
                      <p className="text-[10px] text-slate-400">{groupMilestones.length} milestones tracked</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenCreate(projName)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + Add to project
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {groupMilestones.map((m) => {
                    const cfg = statusConfig[m.status] || statusConfig["Not Started"];
                    return (
                      <div
                        key={m.id}
                        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${cfg.dot}`} />
                          <div className="min-w-0">
                            <h3 className="text-xs font-semibold text-slate-900 truncate">{m.name}</h3>
                            <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                Due {new Date(m.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                              <span>•</span>
                              <span>{m.taskCount} / {m.taskTotal} tasks</span>
                              <span>•</span>
                              <span>{m.owner}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="w-24">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                              <span>Progress</span>
                              <span className="font-bold text-slate-700">{m.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-600 transition-all"
                                style={{ width: `${m.progress}%` }}
                              />
                            </div>
                          </div>

                          <select
                            value={m.status}
                            onChange={(e) => handleStatusChange(m.id, e.target.value as MilestoneStatus)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 bg-white cursor-pointer"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleOpenEdit(m, e)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(m.id, e)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Milestone Modal */}
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
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "Add Milestone" : "Edit Milestone"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Milestone Name *</label>
                <input
                  type="text"
                  required
                  value={mstForm.name}
                  onChange={(e) => setMstForm({ ...mstForm, name: e.target.value })}
                  placeholder="e.g. Core Module Development"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={mstForm.projectName}
                  onChange={(e) => setMstForm({ ...mstForm, projectName: e.target.value })}
                  placeholder="e.g. ABC ERP Implementation"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={mstForm.status}
                    onChange={(e) => setMstForm({ ...mstForm, status: e.target.value as MilestoneStatus })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mstForm.progress}
                    onChange={(e) => setMstForm({ ...mstForm, progress: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Completed Tasks</label>
                  <input
                    type="number"
                    value={mstForm.taskCount}
                    onChange={(e) => setMstForm({ ...mstForm, taskCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Tasks</label>
                  <input
                    type="number"
                    value={mstForm.taskTotal}
                    onChange={(e) => setMstForm({ ...mstForm, taskTotal: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Deadline</label>
                  <input
                    type="date"
                    required
                    value={mstForm.deadline}
                    onChange={(e) => setMstForm({ ...mstForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Owner / Lead</label>
                  <input
                    type="text"
                    value={mstForm.owner}
                    onChange={(e) => setMstForm({ ...mstForm, owner: e.target.value })}
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {modalMode === "create" ? "Add Milestone" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
