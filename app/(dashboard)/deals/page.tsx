"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  Search,
  Plus,
  Box,
  ShoppingBag,
  Trophy,
  X,
  Percent,
  Calendar,
  Kanban,
  List,
  TrendingUp,
  ArrowRight,
  Loader2,
  Trash2,
  Edit2,
  AlertCircle,
  Building2,
  DollarSign,
} from "lucide-react";

interface DealItem {
  id: string;
  dealNumber: number;
  title: string;
  company: string;
  contact: string | null;
  service: string | null;
  value: number;
  stage: string;
  pipeline: string;
  probability: number;
  priority: string;
  closer: string | null;
  expectedCloseDate: string | null;
  createdAt: string;
}

interface KPIStats {
  totalDeals: number;
  pipelineValue: number;
  wonDealsCount: number;
  wonValue: number;
  lostDealsCount: number;
  winRate: string;
}

const STAGES = [
  { id: "qualified", title: "Qualified", headerBg: "bg-blue-50/80 text-blue-700 border-blue-100" },
  { id: "discovery", title: "Discovery", headerBg: "bg-sky-50/80 text-sky-700 border-sky-100" },
  { id: "proposal", title: "Proposal", headerBg: "bg-purple-50/80 text-purple-700 border-purple-100" },
  { id: "negotiation", title: "Negotiation", headerBg: "bg-amber-50/80 text-amber-700 border-amber-100" },
  { id: "contract", title: "Contract Sent", headerBg: "bg-teal-50/80 text-teal-700 border-teal-100" },
  { id: "won", title: "Won", headerBg: "bg-emerald-50/80 text-emerald-700 border-emerald-100" },
];

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-rose-50 text-rose-600 border border-rose-100",
  Urgent: "bg-red-50 text-red-600 border border-red-100",
  Medium: "bg-amber-50 text-amber-600 border border-amber-100",
  Low: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

const FORECAST_BAR_DATA = [
  { name: "Apr 2025", value: 45000, weighted: 28000 },
  { name: "May 2025", value: 68000, weighted: 42000 },
  { name: "Jun 2025", value: 92000, weighted: 61000 },
  { name: "Jul 2025", value: 54000, weighted: 35000 },
  { name: "Aug 2025", value: 78000, weighted: 52000 },
  { name: "Sep 2025", value: 110000, weighted: 79000 },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({
    totalDeals: 0,
    pipelineValue: 0,
    wonDealsCount: 0,
    wonValue: 0,
    lostDealsCount: 0,
    winRate: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pipelineFilter, setPipelineFilter] = useState("All Pipelines");
  const [closerFilter, setCloserFilter] = useState("All Closers");
  const [currentView, setCurrentView] = useState<"kanban" | "list" | "forecast">("kanban");
  const [error, setError] = useState<string | null>(null);

  // Add / Edit Deal Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [dealForm, setDealForm] = useState({
    id: "",
    title: "",
    company: "",
    contact: "",
    service: "Custom ERP",
    value: "25000",
    stage: "qualified",
    pipeline: "Software Sales",
    probability: "50",
    priority: "Medium",
    closer: "Ali Khan",
    expectedCloseDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDeals = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (pipelineFilter !== "All Pipelines") params.set("pipeline", pipelineFilter);
      if (closerFilter !== "All Closers") params.set("closer", closerFilter);

      const res = await fetch(`/api/deals?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load deals");
      const data = await res.json();
      setDeals(data.deals || []);
      if (data.kpi) setKpi(data.kpi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, pipelineFilter, closerFilter]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Stage change directly from drag / select
  const handleStageChange = async (dealId: string, newStage: string) => {
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) throw new Error("Failed to update stage");
      await fetchDeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDeleteDeal = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this deal?")) return;
    try {
      const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete deal");
      await fetchDeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOpenCreateModal = (defaultStage = "qualified") => {
    setModalMode("create");
    setDealForm({
      id: "",
      title: "",
      company: "",
      contact: "",
      service: "Custom Software",
      value: "20000",
      stage: defaultStage,
      pipeline: "Software Sales",
      probability: "40",
      priority: "Medium",
      closer: "Ali Khan",
      expectedCloseDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (d: DealItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setDealForm({
      id: d.id,
      title: d.title,
      company: d.company,
      contact: d.contact || "",
      service: d.service || "Custom Software",
      value: String(d.value),
      stage: d.stage,
      pipeline: d.pipeline,
      probability: String(d.probability),
      priority: d.priority,
      closer: d.closer || "Ali Khan",
      expectedCloseDate: d.expectedCloseDate ? d.expectedCloseDate.slice(0, 10) : "",
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealForm.title.trim() || !dealForm.company.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealForm),
        });
        if (!res.ok) throw new Error("Failed to create deal");
      } else {
        const res = await fetch(`/api/deals/${dealForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealForm),
        });
        if (!res.ok) throw new Error("Failed to update deal");
      }
      setShowModal(false);
      await fetchDeals();
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
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading CRM deals...</span>
      </div>
    );
  }

  // Group deals by stage for Kanban
  const kanbanStages = STAGES.map((st) => {
    const stageDeals = deals.filter((d) => d.stage === st.id);
    const sumVal = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      ...st,
      count: stageDeals.length,
      valueFormatted: `$${sumVal.toLocaleString()}`,
      deals: stageDeals,
    };
  });

  return (
    <>
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-12">
        {/* Top Title Bar & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Deals</h2>
            <p className="text-xs text-slate-500 mt-1">
              Track, forecast, and manage sales revenue through your pipeline
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-1 flex items-center gap-1 shadow-2xs">
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
              <button
                onClick={() => setCurrentView("forecast")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentView === "forecast"
                    ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Forecast</span>
              </button>
            </div>

            <button
              onClick={() => handleOpenCreateModal("qualified")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deal</span>
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

        {/* 5 Metric KPI Cards (Calculated directly from Database) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total Deals</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalDeals}</h3>
              <p className="text-[10px] text-slate-400">in CRM database</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Pipeline Value</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                ${kpi.pipelineValue.toLocaleString()}
              </h3>
              <p className="text-[10px] text-emerald-600 font-semibold">Active deals</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Won Deals</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.wonDealsCount}</h3>
              <p className="text-[10px] text-amber-600 font-semibold">${kpi.wonValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
              <X className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Lost Deals</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.lostDealsCount}</h3>
              <p className="text-[10px] text-rose-500 font-semibold">Closed Lost</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-sky-50 text-sky-600">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Win Rate</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.winRate}</h3>
              <p className="text-[10px] text-sky-600 font-semibold">Won vs Closed</p>
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
              placeholder="Search deals by title, company, service..."
              className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={pipelineFilter}
              onChange={(e) => setPipelineFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
            >
              <option value="All Pipelines">All Pipelines</option>
              <option value="Software Sales">Software Sales</option>
              <option value="Website Sales">Website Sales</option>
              <option value="ERP Sales">ERP Sales</option>
            </select>

            <select
              value={closerFilter}
              onChange={(e) => setCloserFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
            >
              <option value="All Closers">All Closers</option>
              <option value="Ali Khan">Ali Khan</option>
              <option value="Fatima Noor">Fatima Noor</option>
              <option value="Sara Ahmed">Sara Ahmed</option>
              <option value="Usman Tariq">Usman Tariq</option>
            </select>

            {(searchQuery || pipelineFilter !== "All Pipelines" || closerFilter !== "All Closers") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPipelineFilter("All Pipelines");
                  setCloserFilter("All Closers");
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* VIEW 1: KANBAN BOARD */}
        {currentView === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
            {kanbanStages.map((col) => (
              <div
                key={col.id}
                className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/70 flex flex-col gap-3 min-w-[230px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900">{col.title}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-700">
                      {col.count}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-700">{col.valueFormatted}</span>
                </div>

                {/* Cards Stack */}
                <div className="space-y-2.5 min-h-[120px]">
                  {col.deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                            {deal.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{deal.company}</p>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 shrink-0">
                          {deal.probability}%
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900">
                          ${deal.value.toLocaleString()}
                        </span>

                        {/* Quick stage mover dropdown */}
                        <select
                          value={deal.stage}
                          onChange={(e) => handleStageChange(deal.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 cursor-pointer focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate">{deal.closer || "Unassigned"}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.2 rounded font-bold ${PRIORITY_STYLES[deal.priority] || "bg-slate-50 text-slate-600"}`}>
                            {deal.priority}
                          </span>
                          <button
                            onClick={(e) => handleOpenEditModal(deal, e)}
                            className="p-1 hover:text-blue-600 hover:bg-slate-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteDeal(deal.id, e)}
                            className="p-1 hover:text-red-600 hover:bg-slate-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleOpenCreateModal(col.id)}
                  className="w-full py-1.5 bg-white hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-medium text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Deal</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: LIST VIEW */}
        {currentView === "list" && (
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-5 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                  <th className="py-3 px-4 font-semibold text-slate-500 uppercase">Deal Title</th>
                  <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Company</th>
                  <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Value</th>
                  <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Stage</th>
                  <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Priority</th>
                  <th className="py-3 px-3 font-semibold text-slate-500 uppercase">Closer</th>
                  <th className="py-3 px-3 font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{deal.title}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{deal.company}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      ${deal.value.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 capitalize">
                      <select
                        value={deal.stage}
                        onChange={(e) => handleStageChange(deal.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 cursor-pointer font-medium"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${PRIORITY_STYLES[deal.priority] || "bg-slate-50 text-slate-600"}`}>
                        {deal.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{deal.closer || "—"}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleOpenEditModal(deal, e)}
                          className="p-1 hover:text-blue-600 text-slate-400 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteDeal(deal.id, e)}
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

        {/* VIEW 3: FORECAST VIEW */}
        {currentView === "forecast" && (
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Revenue Forecast</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Weighted deal projections based on stage probabilities
              </p>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FORECAST_BAR_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <RechartsTooltip formatter={(val?: any) => [`$${Number(val || 0).toLocaleString()}`, ""]} />
                  <Bar dataKey="value" name="Total Pipeline" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="weighted" name="Weighted Forecast" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Deal Modal */}
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
                {modalMode === "create" ? "Add New Deal" : "Edit Deal"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  placeholder="e.g. Enterprise ERP Overhaul"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={dealForm.company}
                    onChange={(e) => setDealForm({ ...dealForm, company: e.target.value })}
                    placeholder="e.g. ABC Technologies"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={dealForm.contact}
                    onChange={(e) => setDealForm({ ...dealForm, contact: e.target.value })}
                    placeholder="e.g. John Carter"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Value ($) *</label>
                  <input
                    type="number"
                    required
                    value={dealForm.value}
                    onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                    placeholder="25000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stage</label>
                  <select
                    value={dealForm.stage}
                    onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Closer</label>
                  <select
                    value={dealForm.closer}
                    onChange={(e) => setDealForm({ ...dealForm, closer: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Ali Khan">Ali Khan</option>
                    <option value="Fatima Noor">Fatima Noor</option>
                    <option value="Sara Ahmed">Sara Ahmed</option>
                    <option value="Usman Tariq">Usman Tariq</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={dealForm.priority}
                    onChange={(e) => setDealForm({ ...dealForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Close Date</label>
                <input
                  type="date"
                  value={dealForm.expectedCloseDate}
                  onChange={(e) => setDealForm({ ...dealForm, expectedCloseDate: e.target.value })}
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
                  {modalMode === "create" ? "Create Deal" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
