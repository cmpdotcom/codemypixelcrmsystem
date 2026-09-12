"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Plus,
  Download,
  CalendarDays,
  MoreHorizontal,
  Check,
  Video,
  MessageSquare,
  Sliders,
  Sprout,
  Building2,
  FileText,
  X,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
  Inbox,
  Search,
} from "lucide-react";

// --- Types ---

interface Activity {
  id: string;
  activityNumber: number;
  type: string;
  direction: string | null;
  title: string;
  description: string | null;
  company: string | null;
  contact: string | null;
  leadId: string | null;
  performedBy: string | null;
  status: string;
  scheduledAt: Date | null;
  createdAt: string;
  updatedAt: string;
}

interface ActivityStats {
  total: number;
  calls: number;
  emails: number;
  whatsapp: number;
  meetings: number;
  notes: number;
}

const ACTIVITY_TYPES = ["Call", "Email", "WhatsApp", "Meeting", "Note", "Task", "SMS", "Other"];
const STATUSES = ["Completed", "Scheduled", "Pending", "Cancelled"];
const DIRECTIONS: Record<string, string> = {
  Call: "Outbound",
  Email: "Sent",
  WhatsApp: "Outbound",
  Meeting: "Online (Zoom)",
  Note: "Internal",
  Task: "Internal",
  SMS: "Outbound",
  Other: "Internal",
};

const iconConfig: Record<string, { icon: typeof Phone; color: string; bg: string }> = {
  Call: { icon: Phone, color: "text-emerald-500", bg: "bg-emerald-50" },
  Email: { icon: Mail, color: "text-blue-500", bg: "bg-blue-50" },
  WhatsApp: { icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  Meeting: { icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
  Note: { icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
  Task: { icon: CheckSquare, color: "text-rose-500", bg: "bg-rose-50" },
  SMS: { icon: MessageSquare, color: "text-sky-500", bg: "bg-sky-50" },
  Other: { icon: Sliders, color: "text-indigo-500", bg: "bg-indigo-50" },
};

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Scheduled: "bg-sky-50 text-sky-600 border border-sky-100",
  Pending: "bg-amber-50 text-amber-600 border border-amber-100",
  Cancelled: "bg-red-50 text-red-600 border border-red-100",
};

function formatDateTime(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    ", " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarBg(name: string) {
  const colors = ["bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600", "bg-purple-100 text-purple-600", "bg-amber-100 text-amber-600", "bg-rose-100 text-rose-600", "bg-indigo-100 text-indigo-600"];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

// --- Activities Page Component ---

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState("All Activities");
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({ total: 0, calls: 0, emails: 0, whatsapp: 0, meetings: 0, notes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [presetType, setPresetType] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/activities?stats=true");
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ }
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      if (search) params.set("search", search);
      const typeMap: Record<string, string> = {
        "Calls": "Call", "Emails": "Email", "WhatsApp": "WhatsApp",
        "Meetings": "Meeting", "Notes": "Note",
      };
      if (typeMap[activeTab]) params.set("type", typeMap[activeTab]);
      const res = await fetch(`/api/activities?${params}`);
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      setActivities(data.activities || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, activeTab]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectAll) { setSelectedRows([]); setSelectAll(false); }
    else { setSelectedRows(activities.map((a) => a.id)); setSelectAll(true); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this activity?")) return;
    try {
      await fetch(`/api/activities/${id}`, { method: "DELETE" });
      setActivities((prev) => prev.filter((a) => a.id !== id));
      fetchStats();
    } catch { /* ignore */ }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedRows.length} activities?`)) return;
    try {
      await fetch("/api/activities/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRows, action: "delete" }),
      });
      setSelectedRows([]);
      setSelectAll(false);
      fetchActivities();
      fetchStats();
    } catch { /* ignore */ }
  };

  const handleBulkStatus = async (status: string) => {
    try {
      await fetch("/api/activities/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRows, action: "status", status }),
      });
      setSelectedRows([]);
      setSelectAll(false);
      fetchActivities();
    } catch { /* ignore */ }
  };

  const openLogModal = (type?: string) => {
    setPresetType(type || null);
    setShowLogModal(true);
  };

  const tabs = [
    { label: "All Activities", count: stats.total },
    { label: "Calls", count: stats.calls },
    { label: "Emails", count: stats.emails },
    { label: "WhatsApp", count: stats.whatsapp },
    { label: "Meetings", count: stats.meetings },
    { label: "Notes", count: stats.notes },
  ];

  const kpiCards = [
    { title: "Total Activities", value: stats.total, icon: Phone, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
    { title: "Calls", value: stats.calls, icon: Phone, iconColor: "text-blue-500", iconBg: "bg-blue-50" },
    { title: "Emails", value: stats.emails, icon: Mail, iconColor: "text-rose-500", iconBg: "bg-rose-50" },
    { title: "WhatsApp", value: stats.whatsapp, icon: MessageCircle, iconColor: "text-emerald-500", iconBg: "bg-emerald-50" },
    { title: "Meetings", value: stats.meetings, icon: Calendar, iconColor: "text-pink-500", iconBg: "bg-pink-50" },
    { title: "Notes", value: stats.notes, icon: FileText, iconColor: "text-purple-500", iconBg: "bg-purple-50" },
  ];

  return (
    <>
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-12">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Activities</h2>
            <p className="text-xs text-slate-500 mt-1">Track all communications and interactions in one place.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openLogModal()}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Activity</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>
            <div className="flex items-center gap-2">
              <button onClick={fetchActivities} className="text-red-600 font-bold hover:text-red-800 cursor-pointer">Retry</button>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 leading-tight">{kpi.title}</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.value.toLocaleString()}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main 2-Column Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Tabs, Search, Filters & Activities Table */}
          <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.label}
                    onClick={() => { setActiveTab(tab.label); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.label ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === tab.label ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search activities by title, company, contact..."
                  className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
                />
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedRows.length > 0 && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                <span className="text-xs font-semibold text-blue-700">{selectedRows.length} selected</span>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => { if (e.target.value) handleBulkStatus(e.target.value); e.target.value = ""; }}
                    className="text-xs border border-blue-200 bg-white rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                    defaultValue=""
                  >
                    <option value="">Change Status...</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={handleBulkDelete} className="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer transition-colors flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                  <button onClick={() => { setSelectedRows([]); setSelectAll(false); }} className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer px-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="overflow-x-auto pt-2 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <span className="ml-2 text-sm text-slate-500">Loading activities...</span>
                </div>
              ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Inbox className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-sm font-semibold text-slate-600">No activities found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or log a new activity.</p>
                  <button onClick={() => openLogModal()} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Log Activity
                  </button>
                </div>
              ) : (
                <table className="w-full min-w-[760px] text-xs text-left table-fixed">
                  <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
                    <tr>
                      <th className="py-3 px-3 w-10">
                        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                      </th>
                      <th className="py-3 px-2 w-20 font-medium">#</th>
                      <th className="py-3 px-3 w-40 font-medium">Activity</th>
                      <th className="py-3 px-3 w-36 font-medium">Related To</th>
                      <th className="py-3 px-3 w-40 font-medium">Description</th>
                      <th className="py-3 px-3 w-28 font-medium">User</th>
                      <th className="py-3 px-3 w-28 font-medium">Date & Time</th>
                      <th className="py-3 px-3 w-24 font-medium">Status</th>
                      <th className="py-3 px-2 w-16 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activities.map((row) => {
                      const config = iconConfig[row.type] || iconConfig["Other"];
                      const Icon = config.icon;
                      const isSelected = selectedRows.includes(row.id);
                      return (
                        <tr key={row.id} className={`hover:bg-slate-50/70 transition-colors ${isSelected ? "bg-blue-50/30" : ""}`}>
                          <td className="py-3 px-3">
                            <input type="checkbox" checked={isSelected} onChange={() => toggleSelectRow(row.id)} className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                          </td>
                          <td className="py-3 px-2 font-medium text-slate-500 whitespace-nowrap">AC-{String(row.activityNumber).padStart(5, "0")}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">{row.type}</p>
                                <p className="text-[10px] text-slate-400 truncate">{row.direction || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 flex items-center gap-1 truncate">
                                <Building2 className="w-3 h-3 text-blue-500 shrink-0" />
                                <span className="truncate">{row.company || "—"}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">{row.contact || ""}</p>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            <p className="truncate">{row.title}</p>
                          </td>
                          <td className="py-3 px-3">
                            {row.performedBy ? (
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${getAvatarBg(row.performedBy)}`}>
                                  {getInitials(row.performedBy)}
                                </div>
                                <span className="font-medium text-slate-800 truncate">{row.performedBy}</span>
                              </div>
                            ) : <span className="text-slate-400">—</span>}
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            <p className="font-medium text-slate-800 whitespace-nowrap">{formatDate(row.createdAt)}</p>
                            <p className="text-[10px] text-slate-400 whitespace-nowrap">{formatTime(row.createdAt)}</p>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${statusStyles[row.status] || statusStyles["Completed"]}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex items-center justify-center gap-0.5">
                              <button onClick={() => handleDelete(row.id)} className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {!loading && activities.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-800">{(page - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-bold text-slate-800">{Math.min(page * pageSize, total)}</span> of{" "}
                  <span className="font-bold text-slate-800">{total}</span> activities
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
                    return (
                      <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${page === pageNum ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}>
                        {pageNum}
                      </button>
                    );
                  })}
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 cursor-pointer shadow-2xs">
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            )}
          </div>

          {/* Right Column: Quick Log + Calendar + Today + Quote */}
          <div className="xl:col-span-4 space-y-5">
            {/* Quick Log Activity Grid */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3.5">Quick Log Activity</h3>
              <div className="grid grid-cols-4 gap-2.5">
                {ACTIVITY_TYPES.map((label) => {
                  const config = iconConfig[label];
                  const Icon = config.icon;
                  return (
                    <button
                      key={label}
                      onClick={() => openLogModal(label)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 group-hover:scale-105 transition-transform ${config.bg} ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mini Calendar Card */}
            <MiniCalendar activities={activities} />

            {/* Today's Activities Card */}
            <TodayActivitiesCard activities={activities} />

            {/* Today Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Today's Summary</h3>
                <CalendarDays className="w-4 h-4 text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-blue-500">Today's Activities</p>
                  <p className="text-2xl font-extrabold text-blue-700 mt-1">{activities.filter(a => new Date(a.createdAt).toDateString() === new Date().toDateString()).length}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-amber-500">Pending</p>
                  <p className="text-2xl font-extrabold text-amber-700 mt-1">{activities.filter(a => a.status === "Pending").length}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-emerald-500">Completed</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">{activities.filter(a => a.status === "Completed").length}</p>
                </div>
                <div className="bg-sky-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-sky-500">Scheduled</p>
                  <p className="text-2xl font-extrabold text-sky-700 mt-1">{activities.filter(a => a.status === "Scheduled").length}</p>
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-gradient-to-br from-[#eaf3ff] via-[#f1f5fe] to-[#f8f0ff] rounded-2xl border border-blue-100/70 p-4 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-700 italic leading-snug font-medium">
                  &ldquo;Every interaction is an opportunity to build a stronger relationship.&rdquo;
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">— CMP CRM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Activity Modal */}
      {showLogModal && (
        <LogActivityModal
          presetType={presetType}
          onClose={() => { setShowLogModal(false); setPresetType(null); }}
          onSave={async (data) => {
            try {
              const res = await fetch("/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (!res.ok) throw new Error("Failed to create activity");
              setShowLogModal(false);
              setPresetType(null);
              fetchActivities();
              fetchStats();
            } catch (err) {
              throw err;
            }
          }}
        />
      )}

      {/* Scrollbar styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `,
      }} />
    </>
  );
}

// --- Mini Calendar Component ---

function MiniCalendar({ activities }: { activities: Activity[] }) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Build calendar days array
  const days: { day: number; current: boolean; date: Date }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, current: false, date: new Date(year, month - 1, prevMonthDays - i) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, current: true, date: new Date(year, month, d) });
  }
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, current: false, date: new Date(year, month + 1, d) });
  }

  // Count activities per day
  const getActivityCount = (date: Date) => {
    return activities.filter(a => new Date(a.createdAt).toDateString() === date.toDateString()).length;
  };
  const getMeetingCount = (date: Date) => {
    return activities.filter(a => a.type === "Meeting" && new Date(a.createdAt).toDateString() === date.toDateString()).length;
  };

  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">{monthName}</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setViewDate(new Date())} className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
            Today
          </button>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Header */}
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <span key={d}>{d}</span>)}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-slate-700">
        {days.map((d, i) => {
          const actCount = getActivityCount(d.date);
          const meetCount = getMeetingCount(d.date);
          return (
            <span
              key={i}
              className={`py-1 relative ${!d.current ? "text-slate-300" : ""} ${isToday(d.date) ? "" : ""}`}
            >
              {isToday(d.date) ? (
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center shadow-xs">
                  {d.day}
                </span>
              ) : (
                d.day
              )}
              {actCount > 0 && d.current && (
                <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
              )}
              {meetCount > 0 && d.current && (
                <span className="w-1 h-1 rounded-full bg-emerald-500 absolute bottom-0.5 left-[40%]" />
              )}
            </span>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-4 mt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Activities</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Meetings</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

// --- Today's Activities Card Component ---

function TodayActivitiesCard({ activities }: { activities: Activity[] }) {
  const todayActivities = activities.filter(a => new Date(a.createdAt).toDateString() === new Date().toDateString());

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">Today's Activities</h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{todayActivities.length}</span>
      </div>

      {todayActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CalendarDays className="w-7 h-7 text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-500">No activities today</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Log a new activity to get started.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar">
          {todayActivities.map((act) => {
            const config = iconConfig[act.type] || iconConfig["Other"];
            const Icon = config.icon;
            return (
              <div key={act.id} className="flex items-center gap-2.5 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-[10px] text-slate-400 font-medium shrink-0 w-14">
                  {formatTime(act.createdAt)}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{act.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{act.company || act.contact || act.type}</p>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${statusStyles[act.status] || statusStyles["Completed"]}`}>
                  {act.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Log Activity Modal ---

function LogActivityModal({
  presetType,
  onClose,
  onSave,
}: {
  presetType: string | null;
  onClose: () => void;
  onSave: (data: Record<string, string>) => Promise<void>;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({
    type: presetType || "Call",
    title: "",
    description: "",
    company: "",
    contact: "",
    performedBy: "",
    status: "Completed",
    direction: DIRECTIONS[presetType || "Call"] || "Outbound",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave(formData);
    } catch {
      setErrors({ form: "Failed to save activity. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-3xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm bg-blue-50 text-blue-600">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">Log New Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">Record a new interaction or task.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{errors.form}
            </div>
          )}

          {/* Activity Type Selector — visual buttons */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Activity Type</label>
            <div className="grid grid-cols-4 gap-2">
              {ACTIVITY_TYPES.map((t) => {
                const config = iconConfig[t];
                const Icon = config.icon;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t, direction: DIRECTIONS[t] || "Internal" })}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                      formData.type === t ? "border-blue-400 bg-blue-50 shadow-sm" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 ${config.bg} ${config.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Discussed project requirements"
              className={`w-full text-xs border rounded-xl px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all ${
                errors.title ? "border-red-300 bg-red-50/30" : "border-slate-200"
              }`}
            />
            {errors.title && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details about this activity..."
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all resize-none min-h-[80px]"
            />
          </div>

          {/* Company + Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Company</label>
              <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="ABC Technologies" className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Contact</label>
              <input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} placeholder="John Carter" className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all" />
            </div>
          </div>

          {/* Performed By + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Performed By</label>
              <input type="text" value={formData.performedBy} onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })} placeholder="Your name" className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full text-xs border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all cursor-pointer">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-blue-500/20">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Log Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
