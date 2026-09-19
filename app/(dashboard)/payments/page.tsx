"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
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
  Banknote,
  Wallet,
  CalendarClock,
  TrendingUp,
  Landmark,
  Smartphone,
  Receipt,
  Download,
} from "lucide-react";
import { downloadInvoicePdf, type InvoiceBranding } from "@/lib/invoice";

interface PaymentItem {
  id: string;
  payNumber: number;
  invoiceNumber: string;
  label: string;
  description: string | null;
  clientName: string;
  dealTitle: string | null;
  amount: number;
  status: string;
  method: string | null;
  dueDate: string;
  paidAt: string | null;
  deal: { id: string; title: string; dealNumber: number; stage: string } | null;
}

interface KPIStats {
  totalPayments: number;
  totalCollected: number;
  collectedThisMonth: number;
  pendingCount: number;
  pendingAmount: number;
  overdueCount: number;
  overdueAmount: number;
  paidCount: number;
}

interface ClientOption {
  id: string;
  company: string;
}

interface DealOption {
  id: string;
  title: string;
  company: string;
}

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Pending: "bg-blue-50 text-blue-600 border border-blue-100",
  Partial: "bg-amber-50 text-amber-600 border border-amber-100",
  Overdue: "bg-rose-50 text-rose-600 border border-rose-100",
  Refunded: "bg-slate-100 text-slate-500 border border-slate-200",
};

const METHOD_ICONS: Record<string, { icon: typeof Banknote; style: string }> = {
  "Bank Transfer": { icon: Landmark, style: "bg-blue-50 text-blue-600 border border-blue-100" },
  "Credit Card": { icon: CreditCard, style: "bg-purple-50 text-purple-600 border border-purple-100" },
  Stripe: { icon: Smartphone, style: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
  PayPal: { icon: Wallet, style: "bg-sky-50 text-sky-600 border border-sky-100" },
  Cash: { icon: Banknote, style: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  Cheque: { icon: Receipt, style: "bg-amber-50 text-amber-600 border border-amber-100" },
};

const fmt = (n: number) => `$${n.toLocaleString()}`;
const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [clientFilter, setClientFilter] = useState("All Clients");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    All: 0,
    Paid: 0,
    Pending: 0,
    Partial: 0,
    Overdue: 0,
    Refunded: 0,
  });
  const [kpi, setKpi] = useState<KPIStats>({
    totalPayments: 0,
    totalCollected: 0,
    collectedThisMonth: 0,
    pendingCount: 0,
    pendingAmount: 0,
    overdueCount: 0,
    overdueAmount: 0,
    paidCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [payForm, setPayForm] = useState({
    id: "",
    label: "",
    description: "",
    clientName: "",
    dealTitle: "",
    amount: "",
    status: "Pending",
    method: "Bank Transfer",
    dueDate: new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [dealOptions, setDealOptions] = useState<DealOption[]>([]);
  const [branding, setBranding] = useState<InvoiceBranding>({ companyName: "CodeMyPixel Ltd." });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTab !== "All") params.set("status", selectedTab);
      if (searchQuery) params.set("search", searchQuery);
      if (methodFilter !== "All Methods") params.set("method", methodFilter);
      if (clientFilter !== "All Clients") params.set("client", clientFilter);

      const res = await fetch(`/api/payments?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load payments");
      const data = await res.json();
      setPayments(data.payments || []);
      if (data.kpi) setKpi(data.kpi);
      if (data.statusCounts) setStatusCounts(data.statusCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [selectedTab, searchQuery, methodFilter, clientFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Load client & deal options for the modal dropdowns
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [clientsRes, dealsRes] = await Promise.all([
          fetch("/api/clients?pageSize=100"),
          fetch("/api/deals"),
        ]);
        if (clientsRes.ok) {
          const data = await clientsRes.json();
          setClientOptions(
            (data.clients || []).map((c: { id: string; company: string }) => ({
              id: c.id,
              company: c.company,
            }))
          );
        }
        if (dealsRes.ok) {
          const data = await dealsRes.json();
          setDealOptions(
            (data.deals || []).map((d: { id: string; title: string; company: string }) => ({
              id: d.id,
              title: d.title,
              company: d.company,
            }))
          );
        }
      } catch {
        // Dropdown options are best-effort
      }
    };
    loadOptions();

    // Load company branding for invoice PDFs
    const loadBranding = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) return;
        const s = await res.json();
        setBranding({
          companyName: s.company_name || "CodeMyPixel Ltd.",
          companyEmail: s.company_officialEmail || undefined,
          companyPhone: s.company_phone || undefined,
          companyAddress:
            [s.company_address, s.company_city, s.company_country].filter(Boolean).join(", ") ||
            undefined,
          logoUrl: s.company_invoiceLogoUrl || s.company_logoUrl || undefined,
        });
      } catch {
        // Branding is best-effort; fall back to defaults
      }
    };
    loadBranding();
  }, []);

  const handleDownloadInvoice = async (item: PaymentItem) => {
    setDownloadingId(item.id);
    try {
      await downloadInvoicePdf(item, branding);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate invoice PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const markAsPaid = async (item: PaymentItem) => {
    try {
      const res = await fetch(`/api/payments/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Paid" }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as paid");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;
    try {
      const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete payment");
      await fetchPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setPayForm({
      id: "",
      label: "",
      description: "",
      clientName: "",
      dealTitle: "",
      amount: "",
      status: "Pending",
      method: "Bank Transfer",
      dueDate: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: PaymentItem) => {
    setModalMode("edit");
    setPayForm({
      id: item.id,
      label: item.label,
      description: item.description || "",
      clientName: item.clientName,
      dealTitle: item.dealTitle || "",
      amount: String(item.amount),
      status: item.status,
      method: item.method || "Bank Transfer",
      dueDate: item.dueDate ? item.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.label.trim() || !payForm.clientName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...payForm,
        clientId: clientOptions.find((c) => c.company === payForm.clientName)?.id || null,
        dealId: dealOptions.find((d) => d.title === payForm.dealTitle)?.id || null,
      };
      if (modalMode === "create") {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to record payment");
      } else {
        const res = await fetch(`/api/payments/${payForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update payment");
      }
      setShowModal(false);
      await fetchPayments();
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
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading payments...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Payments</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track invoices, collections, pending receivables, and overdue balances across all clients
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
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
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Collected</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.totalCollected)}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">{kpi.paidCount} paid invoices</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">This Month</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.collectedThisMonth)}</h3>
            <p className="text-[10px] text-blue-600 font-semibold">Collected this month</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Pending</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.pendingAmount)}</h3>
            <p className="text-[10px] text-amber-600 font-semibold">{kpi.pendingCount} awaiting payment</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Overdue</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{fmt(kpi.overdueAmount)}</h3>
            <p className="text-[10px] text-rose-600 font-semibold">{kpi.overdueCount} past due date</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Invoices</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalPayments}</h3>
            <p className="text-[10px] text-slate-400">Database records</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { name: "All", count: statusCounts.All || 0, badgeBg: "bg-blue-600 text-white" },
          { name: "Paid", count: statusCounts.Paid || 0, badgeBg: "bg-emerald-100 text-emerald-700" },
          { name: "Pending", count: statusCounts.Pending || 0, badgeBg: "bg-blue-100 text-blue-600" },
          { name: "Partial", count: statusCounts.Partial || 0, badgeBg: "bg-amber-100 text-amber-700" },
          { name: "Overdue", count: statusCounts.Overdue || 0, badgeBg: "bg-rose-100 text-rose-600" },
          { name: "Refunded", count: statusCounts.Refunded || 0, badgeBg: "bg-slate-100 text-slate-500" },
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
            placeholder="Search by invoice #, client, deal, or label..."
            className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Methods">All Methods</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Stripe">Stripe</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Clients">All Clients</option>
            {clientOptions.map((c) => (
              <option key={c.id} value={c.company}>
                {c.company}
              </option>
            ))}
          </select>

          {(searchQuery || methodFilter !== "All Methods" || clientFilter !== "All Clients") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setMethodFilter("All Methods");
                setClientFilter("All Clients");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="py-3 px-3 font-medium">Invoice</th>
                <th className="py-3 px-3 font-medium">Client</th>
                <th className="py-3 px-3 font-medium">Deal</th>
                <th className="py-3 px-3 font-medium">Method</th>
                <th className="py-3 px-3 font-medium">Due Date</th>
                <th className="py-3 px-3 font-medium">Paid On</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium text-right">Amount</th>
                <th className="py-3 px-2 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No payments match your criteria.
                  </td>
                </tr>
              ) : (
                payments.map((item) => {
                  const methodConfig = METHOD_ICONS[item.method || "Bank Transfer"] || METHOD_ICONS["Bank Transfer"];
                  const MethodIcon = methodConfig.icon;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900 leading-tight">{item.invoiceNumber}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[160px]">{item.label}</p>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{item.clientName}</td>
                      <td className="py-3 px-3 text-slate-500 max-w-[180px]">
                        <span className="truncate block">{item.dealTitle || "—"}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${methodConfig.style}`}>
                          <MethodIcon className="w-3 h-3" />
                          {item.method || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock className="w-3 h-3 text-slate-400" />
                          {fmtDate(item.dueDate)}
                        </span>
                      </td>
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
                          <button
                            onClick={() => handleDownloadInvoice(item)}
                            disabled={downloadingId === item.id}
                            title="Download Invoice PDF"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {downloadingId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {item.status !== "Paid" && item.status !== "Refunded" && (
                            <button
                              onClick={() => markAsPaid(item)}
                              title="Mark as Paid"
                              className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record / Edit Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "Record New Payment" : "Edit Payment"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payment Label *</label>
                <input
                  type="text"
                  value={payForm.label}
                  onChange={(e) => setPayForm({ ...payForm, label: e.target.value })}
                  placeholder="e.g. 1st Installment, Final Payment"
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Client *</label>
                  <select
                    value={payForm.clientName}
                    onChange={(e) => setPayForm({ ...payForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                    required
                  >
                    <option value="">Select client...</option>
                    {clientOptions.map((c) => (
                      <option key={c.id} value={c.company}>
                        {c.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Related Deal</label>
                  <select
                    value={payForm.dealTitle}
                    onChange={(e) => setPayForm({ ...payForm, dealTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                  >
                    <option value="">None</option>
                    {dealOptions.map((d) => (
                      <option key={d.id} value={d.title}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={payForm.amount}
                    onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                    placeholder="10000"
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={payForm.dueDate}
                    onChange={(e) => setPayForm({ ...payForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    value={payForm.status}
                    onChange={(e) => setPayForm({ ...payForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Method</label>
                  <select
                    value={payForm.method}
                    onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Stripe">Stripe</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  value={payForm.description}
                  onChange={(e) => setPayForm({ ...payForm, description: e.target.value })}
                  placeholder="Payment notes, milestone reference, invoice memo..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
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
                  <span>{modalMode === "create" ? "Record Payment" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
