"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Clock,
  CheckCircle,
  CheckSquare,
  LayoutGrid,
  List,
  Loader2,
  Trash2,
  Edit2,
  AlertCircle,
  AlertTriangle,
  X,
  Lock,
  Sparkles,
} from "lucide-react";

type Priority = "Urgent" | "High" | "Medium" | "Low";
type Status =
  | "Backlog"
  | "Todo"
  | "In Progress"
  | "Code Review"
  | "QA"
  | "Revision"
  | "Done"
  | "Blocked";

interface TaskItem {
  id: string;
  taskNumber: number;
  name: string;
  description: string | null;
  projectName: string;
  module: string | null;
  assignee: string | null;
  priority: Priority;
  status: Status;
  progress: number;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
  tags: string[];
  blocked: boolean;
}

interface KPIStats {
  totalTasks: number;
  inProgress: number;
  done: number;
  blocked: number;
  overdue: number;
  totalEstimatedHours: number;
  totalLoggedHours: number;
}

const COLUMNS: Status[] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Code Review",
  "QA",
  "Revision",
  "Done",
  "Blocked",
];

const COLUMN_TONES: Record<Status, { dot: string; badge: string; empty: string }> = {
  Backlog: { dot: "bg-slate-400", badge: "bg-slate-100 text-slate-600", empty: "text-slate-300" },
  Todo: { dot: "bg-sky-500", badge: "bg-sky-50 text-sky-700", empty: "text-sky-200" },
  "In Progress": { dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700", empty: "text-blue-200" },
  "Code Review": { dot: "bg-violet-500", badge: "bg-violet-50 text-violet-700", empty: "text-violet-200" },
  QA: { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700", empty: "text-amber-200" },
  Revision: { dot: "bg-orange-500", badge: "bg-orange-50 text-orange-700", empty: "text-orange-200" },
  Done: { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", empty: "text-emerald-200" },
  Blocked: { dot: "bg-rose-500", badge: "bg-rose-50 text-rose-700", empty: "text-rose-200" },
};

const PRIORITY_DOT: Record<Priority, string> = {
  Urgent: "bg-red-500",
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-green-500",
};

const PRIORITY_BADGES: Record<Priority, string> = {
  Urgent: "bg-red-50 text-red-600 border border-red-100",
  High: "bg-rose-50 text-rose-600 border border-rose-100",
  Medium: "bg-amber-50 text-amber-600 border border-amber-100",
  Low: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function makeNewTaskForm(status: Status = "Todo") {
  return {
    id: "",
    name: "",
    description: "",
    projectName: "ABC ERP Implementation",
    module: "Core",
    assignee: "John Smith",
    priority: "Medium" as Priority,
    status,
    progress: "0",
    estimatedHours: "8",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({
    totalTasks: 0,
    inProgress: 0,
    done: 0,
    blocked: 0,
    overdue: 0,
    totalEstimatedHours: 0,
    totalLoggedHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [currentView, setCurrentView] = useState<"board" | "list">("board");
  const [error, setError] = useState<string | null>(null);

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [taskForm, setTaskForm] = useState(() => makeNewTaskForm());
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);
      if (priorityFilter !== "All Priorities") params.set("priority", priorityFilter);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
      if (data.kpi) setKpi(data.kpi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, priorityFilter]);

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };
    void loadTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (id: string, nextStatus: Status) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update error");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOpenCreate = (defaultStatus: Status = "Todo") => {
    setModalMode("create");
    setTaskForm(makeNewTaskForm(defaultStatus));
    setShowModal(true);
  };

  const handleOpenEdit = (t: TaskItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setTaskForm({
      id: t.id,
      name: t.name,
      description: t.description || "",
      projectName: t.projectName,
      module: t.module || "Core",
      assignee: t.assignee || "Unassigned",
      priority: t.priority,
      status: t.status,
      progress: String(t.progress),
      estimatedHours: String(t.estimatedHours),
      dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    });
    setShowModal(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.name.trim() || !taskForm.projectName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskForm),
        });
        if (!res.ok) throw new Error("Create failed");
      } else {
        const res = await fetch(`/api/tasks/${taskForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskForm),
        });
        if (!res.ok) throw new Error("Update failed");
      }
      setShowModal(false);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSubmitting(false);
    }
  };

  const hasActiveFilters = Boolean(searchQuery || statusFilter !== "All Statuses" || priorityFilter !== "All Priorities");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading project tasks...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-5">
      {/* Top Title Bar */}
      <div className="flex flex-col gap-5 rounded-[24px] border border-slate-200/80 bg-white px-5 py-5 shadow-sm shadow-slate-200/40 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600"><Sparkles className="h-3.5 w-3.5" /> Team execution</div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Tasks</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">Plan the next move, protect focus, and keep every delivery task moving through the team.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/70 p-1 shadow-sm">
            <button
              onClick={() => setCurrentView("board")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === "board"
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
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
            onClick={() => handleOpenCreate("Todo")}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:bg-blue-800"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
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

      {/* Row of 5 Metric KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Tasks</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalTasks}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">In Progress</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.inProgress}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Completed</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.done}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Blocked</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.blocked}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm shadow-slate-200/30">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Overdue</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.overdue}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-200/30">
        <div className="flex-1 basis-full sm:basis-auto min-w-0 sm:min-w-[260px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, project, assignee, module..."
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
            {COLUMNS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"
          >
            <option value="All Priorities">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(searchQuery || statusFilter !== "All Statuses" || priorityFilter !== "All Priorities") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All Statuses");
                setPriorityFilter("All Priorities");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {currentView === "board" && (
        <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            const columnTone = COLUMN_TONES[col];
            return (
              <div
                key={col}
                className="flex min-h-[260px] flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-200/30"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-1 pb-3">
                  <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${columnTone.dot}`} /><h3 className="text-xs font-extrabold text-slate-900">{col}</h3></div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-black ${columnTone.badge}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Stack */}
                <div className="min-h-[155px] flex-1 space-y-2">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group cursor-pointer rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 transition-all hover:border-blue-200 hover:bg-white hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-[10px] font-semibold text-slate-400">
                          TK-{String(task.taskNumber).padStart(4, "0")}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.priority]}`}
                            title={`Priority: ${task.priority}`}
                          />
                          {task.blocked && <Lock className="w-3 h-3 text-rose-500" />}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                        {task.name}
                      </h4>
                      <p className="mt-1 truncate text-[10px] text-slate-400">{task.projectName}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5"><span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${PRIORITY_BADGES[task.priority]}`}>{task.priority}</span>{task.module && <span className="rounded-md bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 shadow-sm">{task.module}</span>}</div>

                      {/* Progress */}
                      {task.progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Footer & Actions */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[8px] flex items-center justify-center">
                            {getInitials(task.assignee || "UN")}
                          </div>
                          <span className="truncate max-w-[70px]">{task.assignee || "Unassigned"}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as Status)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[9px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-600 cursor-pointer"
                          >
                            {COLUMNS.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <button
                            onClick={(e) => handleOpenEdit(task, e)}
                            className="p-1 hover:text-blue-600 text-slate-400"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(task.id, e)}
                            className="p-1 hover:text-red-600 text-slate-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="flex min-h-[145px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 text-center">
                      <CheckSquare className={`mb-2 h-5 w-5 ${columnTone.empty}`} />
                      <p className="text-[11px] font-semibold text-slate-500">No tasks yet</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-400">Add a task here when it reaches {col.toLowerCase()}.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenCreate(col)}
                  className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
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
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">#</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Task Name</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Project</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Assignee</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Status</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Priority</th>
                <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Due Date</th>
                <th className="py-3 px-2 font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-400"><CheckSquare className="h-6 w-6" /></div>
                      <h3 className="mt-4 text-sm font-extrabold text-slate-800">{hasActiveFilters ? "No matching tasks" : "No data yet"}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {hasActiveFilters ? "Try clearing a filter or searching for a different task." : "Create your first task to begin planning the team’s delivery work."}
                      </p>
                      {hasActiveFilters ? (
                        <button type="button" onClick={() => { setSearchQuery(""); setStatusFilter("All Statuses"); setPriorityFilter("All Priorities"); }} className="mt-4 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Clear filters</button>
                      ) : (
                        <button type="button" onClick={() => handleOpenCreate("Todo")} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"><Plus className="h-3.5 w-3.5" /> Add your first task</button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-medium">
                    TK-{String(task.taskNumber).padStart(4, "0")}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">{task.name}</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{task.projectName}</td>
                  <td className="py-3 px-3 text-slate-700">{task.assignee || "Unassigned"}</td>
                  <td className="py-3 px-3">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as Status)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium cursor-pointer"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${PRIORITY_BADGES[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(task, e)}
                        className="p-1 hover:text-blue-600 text-slate-400 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(task.id, e)}
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

      {/* Add / Edit Task Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "Create New Task" : "Edit Task"}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskForm.name}
                  onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                  placeholder="e.g. Implement Webhook Handler"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={taskForm.projectName}
                  onChange={(e) => setTaskForm({ ...taskForm, projectName: e.target.value })}
                  placeholder="e.g. ABC ERP Implementation"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Implementation criteria and steps..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Column</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as Status })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
                  <select
                    value={taskForm.assignee}
                    onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="John Smith">John Smith (Dev)</option>
                    <option value="Lisa Wang">Lisa Wang (QA)</option>
                    <option value="Ali Khan">Ali Khan</option>
                    <option value="Sara Ahmed">Sara Ahmed</option>
                    <option value="Usman Tariq">Usman Tariq</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={taskForm.estimatedHours}
                    onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
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
                  {modalMode === "create" ? "Create Task" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
