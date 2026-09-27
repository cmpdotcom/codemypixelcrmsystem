"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Activity,
  CheckCircle,
  AlertTriangle,
  CheckCheck,
  Clock,
  Search,
  Plus,
  Loader2,
  Trash2,
  Edit2,
  AlertCircle,
  Kanban,
  List,
  Building2,
  Sparkles,
  X,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

interface ProjectItem {
  id: string;
  projNumber: number;
  name: string;
  clientName: string;
  description: string | null;
  status: string;
  health: "on-track" | "at-risk" | "critical";
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  deadline: string;
  teamMembers: string[];
}

interface KPIStats {
  totalProjects: number;
  activeProjects: number;
  onTrack: number;
  atRisk: number;
  completed: number;
  overdue: number;
}

const STAGES = [
  "Planning",
  "Requirements",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Completed",
  "On Hold",
];

const STAGE_TONES: Record<string, { dot: string; badge: string; empty: string }> = {
  Planning: { dot: "bg-slate-400", badge: "bg-slate-100 text-slate-600", empty: "text-slate-300" },
  Requirements: { dot: "bg-violet-500", badge: "bg-violet-50 text-violet-700", empty: "text-violet-200" },
  Design: { dot: "bg-fuchsia-500", badge: "bg-fuchsia-50 text-fuchsia-700", empty: "text-fuchsia-200" },
  Development: { dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700", empty: "text-blue-200" },
  Testing: { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700", empty: "text-amber-200" },
  Deployment: { dot: "bg-cyan-500", badge: "bg-cyan-50 text-cyan-700", empty: "text-cyan-200" },
  Completed: { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", empty: "text-emerald-200" },
  "On Hold": { dot: "bg-rose-500", badge: "bg-rose-50 text-rose-700", empty: "text-rose-200" },
};

const HEALTH_COLORS: Record<string, string> = {
  "on-track": "bg-emerald-500",
  "at-risk": "bg-amber-500",
  critical: "bg-rose-500",
};

const HEALTH_LABELS: Record<string, string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  critical: "Critical",
};

const AVATAR_COLORS: Record<string, string> = {
  AK: "bg-blue-100 text-blue-700",
  SA: "bg-emerald-100 text-emerald-700",
  FN: "bg-amber-100 text-amber-700",
  UT: "bg-purple-100 text-purple-700",
  MN: "bg-rose-100 text-rose-700",
};

export default function ProjectsPage() {
  const { money } = useSettings();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({
    totalProjects: 0,
    activeProjects: 0,
    onTrack: 0,
    atRisk: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [healthFilter, setHealthFilter] = useState("All Health");
  const [currentView, setCurrentView] = useState<"kanban" | "list">("kanban");
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [projForm, setProjForm] = useState({
    id: "",
    name: "",
    clientName: "",
    description: "",
    status: "Planning",
    health: "on-track" as "on-track" | "at-risk" | "critical",
    progress: "15",
    budget: "30000",
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);
      if (healthFilter !== "All Health") params.set("health", healthFilter);

      const res = await fetch(`/api/projects?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data.projects || []);
      if (data.kpi) setKpi(data.kpi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, healthFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleStageChange = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Stage update failed");
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOpenCreate = (defaultStage = "Planning") => {
    setModalMode("create");
    setProjForm({
      id: "",
      name: "",
      clientName: "",
      description: "",
      status: defaultStage,
      health: "on-track",
      progress: "15",
      budget: "30000",
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setProjForm({
      id: p.id,
      name: p.name,
      clientName: p.clientName,
      description: p.description || "",
      status: p.status,
      health: p.health,
      progress: String(p.progress),
      budget: String(p.budget),
      deadline: p.deadline ? p.deadline.slice(0, 10) : "",
    });
    setShowModal(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.name.trim() || !projForm.clientName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projForm),
        });
        if (!res.ok) throw new Error("Failed to create project");
      } else {
        const res = await fetch(`/api/projects/${projForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projForm),
        });
        if (!res.ok) throw new Error("Failed to update project");
      }
      setShowModal(false);
      await fetchProjects();
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
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-5">
      {/* Top Title Bar & Primary Actions */}
      <div className="flex flex-col gap-5 rounded-[24px] border border-slate-200/80 bg-white px-5 py-5 shadow-sm shadow-slate-200/40 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
            <Sparkles className="h-3.5 w-3.5" /> Delivery pipeline
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Projects</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            Keep every delivery moving, see project health at a glance, and give each team a clear next step.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/70 p-1 shadow-sm">
            <button
              onClick={() => setCurrentView("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === "kanban"
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setCurrentView("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === "list"
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenCreate("Planning")}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:bg-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
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

      {/* Row of 6 KPI Metric Cards (Calculated directly from Database) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Total Projects</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalProjects}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-green-50 text-green-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Active</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.activeProjects}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">On Track</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.onTrack}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">At Risk</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.atRisk}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            <CheckCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Completed</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.completed}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Overdue</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.overdue}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-200/30">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, client, or description..."
            className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/70 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"
          >
            <option value="All Statuses">All Statuses</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"
          >
            <option value="All Health">All Health</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="critical">Critical</option>
          </select>

          {(searchQuery || statusFilter !== "All Statuses" || healthFilter !== "All Health") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All Statuses");
                setHealthFilter("All Health");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: KANBAN WORKFLOW BOARD */}
      {currentView === "kanban" && (
        <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((st) => {
            const stageProjects = projects.filter((p) => p.status === st);
            const stageTone = STAGE_TONES[st] || STAGE_TONES.Planning;
            return (
              <div
                key={st}
                className="flex min-h-[245px] flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-200/30"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-1 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${stageTone.dot}`} />
                    <h3 className="text-xs font-extrabold text-slate-900">{st}</h3>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-black ${stageTone.badge}`}>
                    {stageProjects.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="min-h-[150px] flex-1 space-y-2">
                  {stageProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <Link href={`/projects/${proj.id}`} className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                            {proj.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{proj.clientName}</p>
                        </Link>
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${HEALTH_COLORS[proj.health] || "bg-emerald-500"}`}
                          title={`Health: ${HEALTH_LABELS[proj.health] || proj.health}`}
                        />
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2.5">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Progress</span>
                          <span className="font-bold text-slate-700">{proj.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer & Actions */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate">
                          Due {new Date(proj.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <div className="flex items-center gap-1">
                          <select
                            value={proj.status}
                            onChange={(e) => handleStageChange(proj.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[9px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-600 cursor-pointer"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={(e) => handleOpenEdit(proj, e)}
                            className="p-1 hover:text-blue-600 rounded text-slate-400"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(proj.id, e)}
                            className="p-1 hover:text-red-600 rounded text-slate-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageProjects.length === 0 && (
                    <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 text-center">
                      <FolderKanban className={`mb-2 h-5 w-5 ${stageTone.empty}`} />
                      <p className="text-[11px] font-semibold text-slate-500">No projects here yet</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-400">Move a project into {st.toLowerCase()} or create one below.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenCreate(st)}
                  className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LIST VIEW */}
      {currentView === "list" && (
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50">
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Project Name</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Client</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Status</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Health</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Progress</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Budget</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Deadline</th>
                <th className="py-3 px-2 font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <Link href={`/projects/${proj.id}`} className="hover:text-blue-600">
                      {proj.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{proj.clientName}</td>
                  <td className="py-3 px-3">
                    <select
                      value={proj.status}
                      onChange={(e) => handleStageChange(proj.id, e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium cursor-pointer"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${HEALTH_COLORS[proj.health] || "bg-emerald-500"}`} />
                      <span className="capitalize text-slate-600">{HEALTH_LABELS[proj.health] || proj.health}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${proj.progress}%` }} />
                      </div>
                      <span className="font-semibold text-slate-700">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">{money(proj.budget)}</td>
                  <td className="py-3 px-3 text-slate-600">
                    {new Date(proj.deadline).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(proj, e)}
                        className="p-1 hover:text-blue-600 text-slate-400 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        className="p-1 hover:text-red-600 text-slate-400 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Project Modal */}
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
                {modalMode === "create" ? "Create New Project" : "Edit Project"}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={projForm.name}
                  onChange={(e) => setProjForm({ ...projForm, name: e.target.value })}
                  placeholder="e.g. Next-Gen Mobile Store"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={projForm.clientName}
                  onChange={(e) => setProjForm({ ...projForm, clientName: e.target.value })}
                  placeholder="e.g. ABC Technologies"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  placeholder="Sprint goals and scope..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={projForm.status}
                    onChange={(e) => setProjForm({ ...projForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Health</label>
                  <select
                    value={projForm.health}
                    onChange={(e) => setProjForm({ ...projForm, health: e.target.value as "on-track" | "at-risk" | "critical" })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="on-track">On Track</option>
                    <option value="at-risk">At Risk</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    value={projForm.budget}
                    onChange={(e) => setProjForm({ ...projForm, budget: e.target.value })}
                    placeholder="30000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={projForm.progress}
                    onChange={(e) => setProjForm({ ...projForm, progress: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Deadline</label>
                <input
                  type="date"
                  required
                  value={projForm.deadline}
                  onChange={(e) => setProjForm({ ...projForm, deadline: e.target.value })}
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
                  {modalMode === "create" ? "Create Project" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
