"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  Trash2,
  Edit2,
  X,
  DollarSign,
  Trophy,
  Wallet,
  CalendarClock,
  TrendingUp,
  BadgeCheck,
  PauseCircle,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

interface CommissionItem {
  id: string;
  commNumber: number;
  memberName: string;
  memberRole: string;
  dealTitle: string | null;
  clientName: string | null;
  basis: string | null;
  rate: number;
  dealValue: number;
  amount: number;
  status: string;
  period: string | null;
  earnedAt: string;
  paidAt: string | null;
  deal: { id: string; title: string; dealNumber: number; value: number; stage: string } | null;
}

interface KPIStats {
  totalCommissions: number;
  totalEarned: number;
  paidOut: number;
  pendingAmount: number;
  pendingCount: number;
  approvedAmount: number;
  earnedThisMonth: number;
}

interface MemberStat {
  memberName: string;
  memberRole: string;
  totalEarned: number;
  paidOut: number;
  pending: number;
  count: number;
}

interface DealOption {
  id: string;
  title: string;
  company: string;
  value: number;
  closer: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Approved: "bg-blue-50 text-blue-600 border border-blue-100",
  Pending: "bg-amber-50 text-amber-600 border border-amber-100",
  "On Hold": "bg-slate-100 text-slate-500 border border-slate-200",
};

const ROLE_STYLES: Record<string, string> = {
  Closer: "bg-purple-50 text-purple-600 border border-purple-100",
  Setter: "bg-sky-50 text-sky-600 border border-sky-100",
  Developer: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  Manager: "bg-rose-50 text-rose-600 border border-rose-100",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function CommissionsPage() {
  const { money: fmt, formatDate: fmtDate } = useSettings();
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [memberStats, setMemberStats] = useState<MemberStat[]>([]);
  const [memberOptions, setMemberOptions] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [memberFilter, setMemberFilter] = useState("All Members");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    All: 0,
    Pending: 0,
    Approved: 0,
    Paid: 0,
    "On Hold": 0,
  });
  const [kpi, setKpi] = useState<KPIStats>({
    totalCommissions: 0,
    totalEarned: 0,
    paidOut: 0,
    pendingAmount: 0,
    pendingCount: 0,
    approvedAmount: 0,
    earnedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [commForm, setCommForm] = useState({
    id: "",
    memberName: "",
    memberRole: "Closer",
    dealTitle: "",
    basis: "",
    rate: "",
    dealValue: "",
    amount: "",
    status: "Pending",
    earnedAt: new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);
  const [dealOptions, setDealOptions] = useState<DealOption[]>([]);
  const [userOptions, setUserOptions] = useState<string[]>([]);

  const fetchCommissions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTab !== "All") params.set("status", selectedTab);
      if (searchQuery) params.set("search", searchQuery);
      if (roleFilter !== "All Roles") params.set("role", roleFilter);
      if (memberFilter !== "All Members") params.set("member", memberFilter);

      const res = await fetch(`/api/commissions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load commissions");
      const data = await res.json();
      setCommissions(data.commissions || []);
      if (data.kpi) setKpi(data.kpi);
      if (data.statusCounts) setStatusCounts(data.statusCounts);
      if (data.memberStats) setMemberStats(data.memberStats);
      if (data.members) setMemberOptions(data.members);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [selectedTab, searchQuery, roleFilter, memberFilter]);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  // Load deals & users for the modal dropdowns
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [dealsRes, usersRes] = await Promise.all([
          fetch("/api/deals"),
          fetch("/api/users"),
        ]);
        if (dealsRes.ok) {
          const data = await dealsRes.json();
          setDealOptions(
            (data.deals || []).map(
              (d: { id: string; title: string; company: string; value: number; closer: string | null }) => ({
                id: d.id,
                title: d.title,
                company: d.company,
                value: d.value,
                closer: d.closer,
              })
            )
          );
        }
        if (usersRes.ok) {
          const data = await usersRes.json();
          setUserOptions(
            (data.users || data || []).map((u: { name?: string; email?: string }) => u.name || u.email || "")
          );
        }
      } catch {
        // Dropdown options are best-effort
      }
    };
    loadOptions();
  }, []);

  const updateStatus = async (item: CommissionItem, status: string) => {
    try {
      const res = await fetch(`/api/commissions/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchCommissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this commission record?")) return;
    try {
      const res = await fetch(`/api/commissions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete commission");
      await fetchCommissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setCommForm({
      id: "",
      memberName: "",
      memberRole: "Closer",
      dealTitle: "",
      basis: "",
      rate: "",
      dealValue: "",
      amount: "",
      status: "Pending",
      earnedAt: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: CommissionItem) => {
    setModalMode("edit");
    setCommForm({
      id: item.id,
      memberName: item.memberName,
      memberRole: item.memberRole,
      dealTitle: item.dealTitle || "",
      basis: item.basis || "",
      rate: String(item.rate),
      dealValue: String(item.dealValue),
      amount: String(item.amount),
      status: item.status,
      earnedAt: item.earnedAt ? item.earnedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleDealSelect = (dealTitle: string) => {
    const deal = dealOptions.find((d) => d.title === dealTitle);
    if (deal) {
      const rate = parseFloat(commForm.rate) || 10;
      setCommForm({
        ...commForm,
        dealTitle: deal.title,
        dealValue: String(deal.value),
        memberName: commForm.memberName || deal.closer || commForm.memberName,
        rate: commForm.rate || "10",
        amount: commForm.amount || String(Math.round(deal.value * (rate / 100))),
      });
    } else {
      setCommForm({ ...commForm, dealTitle });
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commForm.memberName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...commForm,
        dealId: dealOptions.find((d) => d.title === commForm.dealTitle)?.id || null,
        clientName: dealOptions.find((d) => d.title === commForm.dealTitle)?.company || null,
      };
      if (modalMode === "create") {
        const res = await fetch("/api/commissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create commission");
      } else {
        const res = await fetch(`/api/commissions/${commForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update commission");
      }
      setShowModal(false);
      await fetchCommissions();
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
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading commissions...</span>
      </div>
    );
  }

  const topEarner = memberStats[0];

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Commissions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track team earnings, approve payouts, and manage commission records across closers and setters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Commission</span>
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
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Earned</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.totalEarned)}</h3>
            <p className="text-[10px] text-slate-400">{kpi.totalCommissions} records</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Paid Out</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.paidOut)}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Disbursed to team</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Pending Approval</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.pendingAmount)}</h3>
            <p className="text-[10px] text-amber-600 font-semibold">{kpi.pendingCount} awaiting review</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Approved</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.approvedAmount)}</h3>
            <p className="text-[10px] text-blue-600 font-semibold">Ready for payout</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">This Month</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.earnedThisMonth)}</h3>
            <p className="text-[10px] text-rose-600 font-semibold">Earned this cycle</p>
          </div>
        </div>
      </div>

      {/* Top Earner Spotlight */}
      {topEarner && (
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50/60 to-white rounded-2xl border border-amber-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xs font-extrabold shrink-0">
            {getInitials(topEarner.memberName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Top Earner</p>
            <h3 className="text-sm font-extrabold text-slate-900 truncate">{topEarner.memberName}</h3>
            <p className="text-[11px] text-slate-500">
              {topEarner.memberRole} · {topEarner.count} commission{topEarner.count !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-extrabold text-slate-900">{fmt(topEarner.totalEarned)}</p>
            <p className="text-[10px] text-emerald-600 font-semibold">{fmt(topEarner.paidOut)} paid</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { name: "All", count: statusCounts.All || 0, badgeBg: "bg-blue-600 text-white" },
          { name: "Pending", count: statusCounts.Pending || 0, badgeBg: "bg-amber-100 text-amber-700" },
          { name: "Approved", count: statusCounts.Approved || 0, badgeBg: "bg-blue-100 text-blue-600" },
          { name: "Paid", count: statusCounts.Paid || 0, badgeBg: "bg-emerald-100 text-emerald-700" },
          { name: "On Hold", count: statusCounts["On Hold"] || 0, badgeBg: "bg-slate-100 text-slate-500" },
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

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by member, deal, client, or basis..."
            className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Roles">All Roles</option>
            <option value="Closer">Closer</option>
            <option value="Setter">Setter</option>
            <option value="Developer">Developer</option>
            <option value="Manager">Manager</option>
          </select>

          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Members">All Members</option>
            {memberOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {(searchQuery || roleFilter !== "All Roles" || memberFilter !== "All Members") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("All Roles");
                setMemberFilter("All Members");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="py-3 px-2 font-medium">#</th>
                <th className="py-3 px-3 font-medium">Member</th>
                <th className="py-3 px-3 font-medium">Role</th>
                <th className="py-3 px-3 font-medium">Deal / Basis</th>
                <th className="py-3 px-3 font-medium">Period</th>
                <th className="py-3 px-3 font-medium">Earned</th>
                <th className="py-3 px-3 font-medium">Paid On</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium text-right">Amount</th>
                <th className="py-3 px-2 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    No commissions match your criteria.
                  </td>
                </tr>
              ) : (
                commissions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-2 text-slate-400 font-medium">
                      CM-{String(item.commNumber).padStart(4, "0")}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[9px] font-extrabold shrink-0">
                          {getInitials(item.memberName)}
                        </div>
                        <span className="font-bold text-slate-900 leading-tight">{item.memberName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold ${ROLE_STYLES[item.memberRole] || ROLE_STYLES.Closer}`}>
                        {item.memberRole}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-[220px]">
                      <p className="font-medium text-slate-700 truncate">{item.dealTitle || item.basis || "—"}</p>
                      {item.basis && item.dealTitle && (
                        <p className="text-[10px] text-slate-400 truncate">{item.basis}</p>
                      )}
                      {item.clientName && (
                        <p className="text-[10px] text-slate-400 truncate">{item.clientName}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{item.period || "—"}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{fmtDate(item.earnedAt)}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{fmtDate(item.paidAt)}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold ${STATUS_STYLES[item.status] || STATUS_STYLES.Pending}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      {fmt(item.amount)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-1">
                        {item.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(item, "Approved")}
                            title="Approve"
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <BadgeCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(item.status === "Pending" || item.status === "Approved") && (
                          <button
                            onClick={() => updateStatus(item, "Paid")}
                            title="Mark as Paid"
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {item.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(item, "On Hold")}
                            title="Put On Hold"
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                          >
                            <PauseCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Earnings Summary */}
      {memberStats.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Team Earnings Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {memberStats.map((m) => (
              <div key={m.memberName} className="border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-extrabold shrink-0">
                  {getInitials(m.memberName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{m.memberName}</p>
                  <p className="text-[10px] text-slate-400">{m.memberRole} · {m.count} records</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-emerald-600">{fmt(m.paidOut)} paid</span>
                    {m.pending > 0 && (
                      <span className="text-[10px] font-bold text-amber-600">{fmt(m.pending)} pending</span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-900 shrink-0">{fmt(m.totalEarned)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Commission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "Add Commission" : "Edit Commission"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Team Member *</label>
                  <select
                    value={commForm.memberName}
                    onChange={(e) => setCommForm({ ...commForm, memberName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                    required
                  >
                    <option value="">Select member...</option>
                    {[...new Set([...userOptions, ...memberOptions])].filter(Boolean).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Role</label>
                  <select
                    value={commForm.memberRole}
                    onChange={(e) => setCommForm({ ...commForm, memberRole: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Closer">Closer</option>
                    <option value="Setter">Setter</option>
                    <option value="Developer">Developer</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Related Deal</label>
                <select
                  value={commForm.dealTitle}
                  onChange={(e) => handleDealSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                >
                  <option value="">None / Bonus only</option>
                  {dealOptions.map((d) => (
                    <option key={d.id} value={d.title}>
                      {d.title} — {d.company} ({fmt(d.value)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Basis / Description</label>
                <input
                  type="text"
                  value={commForm.basis}
                  onChange={(e) => setCommForm({ ...commForm, basis: e.target.value })}
                  placeholder="e.g. 10% of deal value, Qualified lead bonus"
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={commForm.rate}
                    onChange={(e) => setCommForm({ ...commForm, rate: e.target.value })}
                    placeholder="10"
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Deal Value ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={commForm.dealValue}
                    onChange={(e) => setCommForm({ ...commForm, dealValue: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={commForm.amount}
                    onChange={(e) => setCommForm({ ...commForm, amount: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    value={commForm.status}
                    onChange={(e) => setCommForm({ ...commForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Earned Date</label>
                  <input
                    type="date"
                    value={commForm.earnedAt}
                    onChange={(e) => setCommForm({ ...commForm, earnedAt: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  <span>{modalMode === "create" ? "Add Commission" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
