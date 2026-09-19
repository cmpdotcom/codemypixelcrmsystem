"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Loader2,
  AlertCircle,
  Plug,
  PlugZap,
  X,
  Trash2,
  Settings2,
  Database,
  KeyRound,
  ShieldCheck,
  Flame,
  Upload,
  CreditCard,
  Wallet,
  MessageSquare,
  Phone,
  Mail,
  Smartphone,
  Calendar,
  BarChart3,
  GitBranch,
  Zap,
  MailPlus,
  Globe,
  HardDrive,
  Link2,
  AlertTriangle,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  color: string;
  status: string;
  config: Record<string, string> | null;
  connectedAt: string | null;
  connectedBy: string | null;
}

interface KPIStats {
  total: number;
  connected: number;
  available: number;
  errors: number;
  categories: number;
}

const ICONS: Record<string, typeof Plug> = {
  Database, KeyRound, ShieldCheck, Flame, Upload, CreditCard, Wallet,
  MessageSquare, Phone, Mail, Smartphone, Calendar, BarChart3, GitBranch,
  Zap, MailPlus, Globe, HardDrive, Link2,
};

const COLOR_STYLES: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  rose: "bg-rose-50 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
};

const STATUS_STYLES: Record<string, string> = {
  Connected: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  "Not Connected": "bg-slate-100 text-slate-500 border border-slate-200",
  Error: "bg-rose-50 text-rose-600 border border-rose-100",
};

const CATEGORY_OPTIONS = ["Payments", "Communication", "Storage", "Analytics", "Productivity", "Developer", "Marketing", "Other"];

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({ total: 0, connected: 0, available: 0, errors: 0, categories: 0 });
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [configModal, setConfigModal] = useState<IntegrationItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "", category: "Other" });

  const fetchIntegrations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "All Categories") params.set("category", selectedCategory);
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);

      const res = await fetch(`/api/integrations?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load integrations");
      const data = await res.json();
      setIntegrations(data.integrations || []);
      if (data.kpi) setKpi(data.kpi);
      if (data.categories) setCategories(data.categories);
      if (data.categoryCounts) setCategoryCounts(data.categoryCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, statusFilter]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const toggleConnection = async (item: IntegrationItem) => {
    setTogglingId(item.id);
    setError(null);
    try {
      const res = await fetch(`/api/integrations/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: item.status === "Connected" ? "disconnect" : "connect",
        }),
      });
      if (!res.ok) throw new Error("Failed to update integration");
      await fetchIntegrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this integration from the catalog?")) return;
    try {
      const res = await fetch(`/api/integrations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete integration");
      await fetchIntegrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to add integration");
      }
      setShowAddModal(false);
      setAddForm({ name: "", description: "", category: "Other" });
      await fetchIntegrations();
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
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading integrations...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Integrations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect CMP CRM with payment gateways, communication channels, storage, and developer tools
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Integration</span>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {[
          { label: "Total Integrations", value: kpi.total, sub: "In catalog", icon: Plug, style: "bg-blue-50 text-blue-600" },
          { label: "Connected", value: kpi.connected, sub: "Live and syncing", icon: PlugZap, style: "bg-emerald-50 text-emerald-600" },
          { label: "Available", value: kpi.available, sub: "Ready to connect", icon: Link2, style: "bg-purple-50 text-purple-600" },
          { label: "Errors", value: kpi.errors, sub: "Need attention", icon: AlertTriangle, style: "bg-rose-50 text-rose-500" },
          { label: "Categories", value: kpi.categories, sub: "Integration groups", icon: BarChart3, style: "bg-amber-50 text-amber-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${card.style}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">{card.label}</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{card.value}</h3>
              <p className="text-[10px] text-slate-400">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All Categories", ...categories].map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === "All Categories" ? kpi.total : categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-white border border-blue-500/40 text-blue-600 shadow-2xs"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations by name, description, or category..."
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
            <option value="Connected">Connected</option>
            <option value="Not Connected">Not Connected</option>
            <option value="Error">Error</option>
          </select>

          {(searchQuery || statusFilter !== "All Statuses") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All Statuses");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Integration Cards Grid */}
      {integrations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-12 text-center text-slate-400 text-sm">
          No integrations match your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {integrations.map((item) => {
            const IconComp = (item.icon && ICONS[item.icon]) || Link2;
            const isConnected = item.status === "Connected";
            const isToggling = togglingId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border shadow-sm p-4 transition-all hover:shadow-md ${
                  isConnected ? "border-emerald-100" : "border-slate-100/90"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${COLOR_STYLES[item.color] || COLOR_STYLES.blue}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold ${STATUS_STYLES[item.status] || STATUS_STYLES["Not Connected"]}`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 mt-3">{item.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2 min-h-[32px]">
                  {item.description || "No description provided."}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-100">
                    {item.category}
                  </span>
                  {isConnected && item.connectedAt && (
                    <span className="text-[10px] text-slate-400">
                      since {fmtDate(item.connectedAt)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => toggleConnection(item)}
                    disabled={isToggling}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 ${
                      isConnected
                        ? "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/25"
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isConnected ? (
                      <><X className="w-3.5 h-3.5" /> Disconnect</>
                    ) : (
                      <><PlugZap className="w-3.5 h-3.5" /> Connect</>
                    )}
                  </button>
                  {item.config && Object.keys(item.config).length > 0 && (
                    <button
                      onClick={() => setConfigModal(item)}
                      title="View configuration"
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Remove"
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Config Viewer Modal */}
      {configModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{configModal.name} — Configuration</h3>
                {configModal.connectedBy && (
                  <p className="text-[10px] text-slate-400 mt-0.5">Connected by {configModal.connectedBy}</p>
                )}
              </div>
              <button
                onClick={() => setConfigModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-2">
              {configModal.config && Object.entries(configModal.config).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 bg-slate-50/70 border border-slate-100 rounded-xl px-3 py-2">
                  <span className="text-[11px] font-semibold text-slate-500 capitalize">{k}</span>
                  <span className="text-xs font-bold text-slate-900 text-right">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Custom Integration</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Integration Name *</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Notion, Jira, Linear"
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  placeholder="What does this integration do?"
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add Integration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
