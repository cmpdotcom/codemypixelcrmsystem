"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Search,
  ChevronDown,
  Phone,
  Mail,
  Calendar,
  Clock,
  Plus,
  Check,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Video,
  Loader2,
  Trash2,
  Edit2,
  X,
} from "lucide-react";

interface FollowUpItem {
  id: string;
  fuNumber: number;
  subjectTitle: string;
  subjectDesc: string | null;
  company: string;
  contact: string | null;
  relatedRef: string | null;
  type: string;
  assigneeName: string | null;
  dueDate: string;
  dueTime: string | null;
  status: string;
  priority: string;
  completed: boolean;
}

interface KPIStats {
  totalFollowUps: number;
  dueToday: number;
  upcoming: number;
  overdue: number;
  completed: number;
}

const TYPE_ICONS: Record<string, { icon: typeof Phone; style: string }> = {
  Call: { icon: Phone, style: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  Email: { icon: Mail, style: "bg-blue-50 text-blue-600 border border-blue-100" },
  Meeting: { icon: Video, style: "bg-purple-50 text-purple-600 border border-purple-100" },
  WhatsApp: { icon: Phone, style: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
};

const STATUS_STYLES: Record<string, string> = {
  "Due Today": "bg-rose-50 text-rose-600 border border-rose-100",
  Upcoming: "bg-blue-50 text-blue-600 border border-blue-100",
  Overdue: "bg-amber-50 text-amber-600 border border-amber-100",
  Completed: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-rose-50 text-rose-600 border border-rose-100",
  Urgent: "bg-red-50 text-red-600 border border-red-100",
  Medium: "bg-amber-50 text-amber-600 border border-amber-100",
  Low: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({
    All: 0,
    Today: 0,
    Upcoming: 0,
    Overdue: 0,
    Completed: 0,
  });
  const [kpi, setKpi] = useState<KPIStats>({
    totalFollowUps: 0,
    dueToday: 0,
    upcoming: 0,
    overdue: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [fuForm, setFuForm] = useState({
    id: "",
    subjectTitle: "",
    subjectDesc: "",
    company: "",
    contact: "",
    relatedRef: "Lead",
    type: "Call",
    assigneeName: "Ali Khan",
    dueDate: new Date().toISOString().slice(0, 10),
    dueTime: "11:00 AM",
    priority: "Medium",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchFollowUps = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set("tab", selectedTab);
      if (searchQuery) params.set("search", searchQuery);
      if (typeFilter !== "All Types") params.set("type", typeFilter);
      if (assigneeFilter !== "All Assignees") params.set("assignee", assigneeFilter);
      if (priorityFilter !== "All Priorities") params.set("priority", priorityFilter);

      const res = await fetch(`/api/follow-ups?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load follow-ups");
      const data = await res.json();
      setFollowUps(data.followUps || []);
      if (data.kpi) setKpi(data.kpi);
      if (data.tabCounts) setTabCounts(data.tabCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [selectedTab, searchQuery, typeFilter, assigneeFilter, priorityFilter]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const toggleTaskCompletion = async (item: FollowUpItem) => {
    try {
      const res = await fetch(`/api/follow-ups/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !item.completed }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchFollowUps();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle completion");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this follow-up?")) return;
    try {
      const res = await fetch(`/api/follow-ups/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete follow-up");
      await fetchFollowUps();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setFuForm({
      id: "",
      subjectTitle: "",
      subjectDesc: "",
      company: "",
      contact: "",
      relatedRef: "Lead",
      type: "Call",
      assigneeName: "Ali Khan",
      dueDate: new Date().toISOString().slice(0, 10),
      dueTime: "11:00 AM",
      priority: "Medium",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: FollowUpItem) => {
    setModalMode("edit");
    setFuForm({
      id: item.id,
      subjectTitle: item.subjectTitle,
      subjectDesc: item.subjectDesc || "",
      company: item.company,
      contact: item.contact || "",
      relatedRef: item.relatedRef || "Lead",
      type: item.type,
      assigneeName: item.assigneeName || "Ali Khan",
      dueDate: item.dueDate ? item.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      dueTime: item.dueTime || "11:00 AM",
      priority: item.priority,
    });
    setShowModal(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuForm.subjectTitle.trim() || !fuForm.company.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/follow-ups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fuForm),
        });
        if (!res.ok) throw new Error("Failed to create follow-up");
      } else {
        const res = await fetch(`/api/follow-ups/${fuForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fuForm),
        });
        if (!res.ok) throw new Error("Failed to update follow-up");
      }
      setShowModal(false);
      await fetchFollowUps();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading follow-ups...</span>
      </div>
    );
  }

  // Today's tasks for right checklist
  const todayFollowUps = followUps.filter((f) => {
    const due = new Date(f.dueDate);
    const now = new Date();
    return (
      due.getDate() === now.getDate() &&
      due.getMonth() === now.getMonth() &&
      due.getFullYear() === now.getFullYear()
    );
  });

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Follow-Ups</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Never miss an opportunity. Keep track of scheduled touches, calls, meetings, and client check-ins
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Follow-up</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Follow-Ups</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalFollowUps}</h3>
            <p className="text-[10px] text-slate-400">Database records</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Due Today</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.dueToday}</h3>
            <p className="text-[10px] text-rose-600 font-semibold">Action required today</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Upcoming</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.upcoming}</h3>
            <p className="text-[10px] text-blue-600 font-semibold">Next 7 days</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Overdue</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.overdue}</h3>
            <p className="text-[10px] text-amber-600 font-semibold">Missed schedule</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Completed</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.completed}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Closed successfully</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { name: "All", count: tabCounts.All || 0, badgeBg: "bg-blue-600 text-white" },
          { name: "Today", count: tabCounts.Today || 0, badgeBg: "bg-rose-100 text-rose-600" },
          { name: "Upcoming", count: tabCounts.Upcoming || 0, badgeBg: "bg-blue-100 text-blue-600" },
          { name: "Overdue", count: tabCounts.Overdue || 0, badgeBg: "bg-amber-100 text-amber-700" },
          { name: "Completed", count: tabCounts.Completed || 0, badgeBg: "bg-emerald-100 text-emerald-700" },
        ].map((tab) => {
          const isActive = selectedTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setSelectedTab(tab.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-white border border-blue-500/40 text-blue-600 shadow-2xs"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{tab.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? "bg-blue-600 text-white" : tab.badgeBg}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* Left: Search + Table */}
        <div className="flex-1 min-w-0 space-y-4 w-full">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[260px] relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search follow-ups by subject, company, contact..."
                className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="Meeting">Meeting</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {(searchQuery || typeFilter !== "All Types" || priorityFilter !== "All Priorities") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("All Types");
                    setPriorityFilter("All Priorities");
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="py-3 px-3 w-8">Done</th>
                    <th className="py-3 px-2 font-medium">#</th>
                    <th className="py-3 px-3 font-medium">Subject</th>
                    <th className="py-3 px-3 font-medium">Company</th>
                    <th className="py-3 px-3 font-medium">Type</th>
                    <th className="py-3 px-3 font-medium">Assignee</th>
                    <th className="py-3 px-3 font-medium">Due Date</th>
                    <th className="py-3 px-3 font-medium">Status</th>
                    <th className="py-3 px-2 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {followUps.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-slate-400">
                        No follow-ups match your criteria.
                      </td>
                    </tr>
                  ) : (
                    followUps.map((item) => {
                      const typeConfig = TYPE_ICONS[item.type] || TYPE_ICONS["Call"];
                      const TypeIcon = typeConfig.icon;
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            item.completed ? "opacity-60 bg-slate-50/30" : ""
                          }`}
                        >
                          <td className="py-3 px-3">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleTaskCompletion(item)}
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                            />
                          </td>
                          <td className="py-3 px-2 text-slate-400 font-medium">
                            FU-{String(item.fuNumber).padStart(4, "0")}
                          </td>
                          <td className="py-3 px-3">
                            <p className={`font-bold leading-tight ${item.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                              {item.subjectTitle}
                            </p>
                            {item.subjectDesc && (
                              <p className="text-[10px] text-slate-400 truncate max-w-xs">{item.subjectDesc}</p>
                            )}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700">
                            {item.company}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`p-1 rounded-md ${typeConfig.style}`}>
                                <TypeIcon className="w-3 h-3" />
                              </span>
                              <span className="text-slate-600">{item.type}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-medium">{item.assigneeName || "Unassigned"}</td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-slate-800">
                              {new Date(item.dueDate).toLocaleDateString()}
                            </p>
                            <p className="text-[10px] text-slate-400">{item.dueTime || "11:00 AM"}</p>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLES[item.status] || "bg-slate-100 text-slate-600"}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-1 hover:text-blue-600 text-slate-400 rounded cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1 hover:text-red-600 text-slate-400 rounded cursor-pointer"
                                title="Delete"
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
        </div>

        {/* Right Side: Today's Action Checklist */}
        <div className="w-full xl:w-[360px] shrink-0 bg-white rounded-2xl border border-slate-100/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s Follow-Ups</h3>
              <p className="text-[11px] text-slate-400">Quick complete items due today</p>
            </div>
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {todayFollowUps.filter((f) => f.completed).length} / {todayFollowUps.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {todayFollowUps.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8 italic">No follow-ups due today</p>
            ) : (
              todayFollowUps.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleTaskCompletion(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    item.completed
                      ? "border-emerald-200 bg-emerald-50/30 opacity-70"
                      : "border-slate-200/80 hover:border-blue-300 bg-slate-50/50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                      item.completed
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold leading-tight ${item.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {item.subjectTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.company}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <Clock className="w-2.5 h-2.5" />
                        {item.dueTime || "11:00 AM"}
                      </span>
                      <span>•</span>
                      <span>{item.type}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Follow-up Modal */}
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
                {modalMode === "create" ? "Schedule New Follow-Up" : "Edit Follow-Up"}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Objective *</label>
                <input
                  type="text"
                  required
                  value={fuForm.subjectTitle}
                  onChange={(e) => setFuForm({ ...fuForm, subjectTitle: e.target.value })}
                  placeholder="e.g. Discuss revised proposal terms"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details / Notes</label>
                <textarea
                  value={fuForm.subjectDesc}
                  onChange={(e) => setFuForm({ ...fuForm, subjectDesc: e.target.value })}
                  placeholder="Notes about what to cover..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Account *</label>
                  <input
                    type="text"
                    required
                    value={fuForm.company}
                    onChange={(e) => setFuForm({ ...fuForm, company: e.target.value })}
                    placeholder="e.g. ABC Technologies"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={fuForm.contact}
                    onChange={(e) => setFuForm({ ...fuForm, contact: e.target.value })}
                    placeholder="e.g. John Carter"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Channel Type</label>
                  <select
                    value={fuForm.type}
                    onChange={(e) => setFuForm({ ...fuForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={fuForm.priority}
                    onChange={(e) => setFuForm({ ...fuForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={fuForm.dueDate}
                    onChange={(e) => setFuForm({ ...fuForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={fuForm.dueTime}
                    onChange={(e) => setFuForm({ ...fuForm, dueTime: e.target.value })}
                    placeholder="11:00 AM"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
                <select
                  value={fuForm.assigneeName}
                  onChange={(e) => setFuForm({ ...fuForm, assigneeName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Ali Khan">Ali Khan</option>
                  <option value="Fatima Noor">Fatima Noor</option>
                  <option value="Sara Ahmed">Sara Ahmed</option>
                  <option value="Usman Tariq">Usman Tariq</option>
                </select>
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
                  {modalMode === "create" ? "Schedule Follow-Up" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
