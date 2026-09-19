"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users2,
  Handshake,
  Gem,
  Clock,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Plus,
  Download,
  Building2,
  MapPin,
  Globe,
  Trash2,
  Edit2,
  Loader2,
  X,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

interface ClientItem {
  id: string;
  clientNumber: number;
  company: string;
  tagline: string | null;
  location: string | null;
  address: string | null;
  website: string | null;
  email: string;
  phone: string | null;
  industry: string | null;
  companySize: string | null;
  status: string;
  contactName: string | null;
  contactRole: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  revenue: number;
  outstanding: number;
  projectsCount: number;
  clientSince: string;
  lastActivity: string | null;
  notes: string | null;
}

interface KPIStats {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  pendingPayments: number;
}

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Inactive: "bg-rose-50 text-rose-500 border border-rose-100",
  Prospect: "bg-blue-50 text-blue-600 border border-blue-100",
  VIP: "bg-purple-50 text-purple-600 border border-purple-100",
  "At Risk": "bg-amber-50 text-amber-600 border border-amber-100",
  Churned: "bg-red-50 text-red-600 border border-red-100",
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function ClientsPage() {
  const { money, pageSize: defaultPageSize, loaded: settingsLoaded } = useSettings();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);
  const [kpi, setKpi] = useState<KPIStats>({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const pageSizeInitialized = React.useRef(false);
  useEffect(() => {
    if (!pageSizeInitialized.current && settingsLoaded) {
      setPageSize(defaultPageSize);
      pageSizeInitialized.current = true;
    }
  }, [defaultPageSize, settingsLoaded]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [clientForm, setClientForm] = useState({
    id: "",
    company: "",
    tagline: "",
    email: "",
    phone: "",
    website: "",
    location: "USA",
    address: "",
    industry: "Technology",
    companySize: "50–200 employees",
    status: "Active",
    contactName: "",
    contactRole: "CEO",
    revenue: "50000",
    outstanding: "10000",
    projectsCount: "1",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      if (searchQuery) params.set("search", searchQuery);
      if (industryFilter !== "All Industries") params.set("industry", industryFilter);
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);

      const res = await fetch(`/api/clients?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load clients");
      const data = await res.json();
      setClients(data.clients || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      if (data.kpi) setKpi(data.kpi);

      if (data.clients && data.clients.length > 0) {
        setSelectedClient((prev) => {
          if (prev) {
            const found = data.clients.find((c: ClientItem) => c.id === prev.id);
            return found || data.clients[0];
          }
          return data.clients[0];
        });
      } else {
        setSelectedClient(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, industryFilter, statusFilter]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    }).catch(() => {});
  };

  const handleDeleteClient = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this client?")) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete client");
      await fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setClientForm({
      id: "",
      company: "",
      tagline: "",
      email: "",
      phone: "",
      website: "",
      location: "San Francisco, USA",
      address: "",
      industry: "Technology",
      companySize: "50–200 employees",
      status: "Active",
      contactName: "",
      contactRole: "CEO",
      revenue: "50000",
      outstanding: "10000",
      projectsCount: "1",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: ClientItem) => {
    setModalMode("edit");
    setClientForm({
      id: c.id,
      company: c.company,
      tagline: c.tagline || "",
      email: c.email,
      phone: c.phone || "",
      website: c.website || "",
      location: c.location || "USA",
      address: c.address || "",
      industry: c.industry || "Technology",
      companySize: c.companySize || "50–200 employees",
      status: c.status,
      contactName: c.contactName || "",
      contactRole: c.contactRole || "CEO",
      revenue: String(c.revenue),
      outstanding: String(c.outstanding),
      projectsCount: String(c.projectsCount),
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.company.trim() || !clientForm.email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientForm),
        });
        if (!res.ok) throw new Error("Failed to create client");
      } else {
        const res = await fetch(`/api/clients/${clientForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientForm),
        });
        if (!res.ok) throw new Error("Failed to update client");
      }
      setShowModal(false);
      await fetchClients();
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
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading clients...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clients</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your accounts, build strong client relationships, and track portfolio revenues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
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

      {/* Row of 4 KPI Metric Cards (Calculated directly from Database) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Clients</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalClients}</h3>
            <p className="text-[10px] text-slate-400">Database accounts</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Active Clients</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.activeClients}</h3>
            <p className="text-[10px] text-amber-600 font-semibold">With ongoing engagement</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Revenue</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{money(kpi.totalRevenue)}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">From all clients</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Pending Receivables</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{money(kpi.pendingPayments)}</h3>
            <p className="text-[10px] text-rose-500 font-semibold">Outstanding invoices</p>
          </div>
        </div>
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
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search clients by company, email, contact..."
                className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={industryFilter}
                onChange={(e) => { setIndustryFilter(e.target.value); setPage(1); }}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
              >
                <option value="All Industries">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="IT Services">IT Services</option>
                <option value="Marketing">Marketing</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Logistics">Logistics</option>
                <option value="E-commerce">E-commerce</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
                <option value="VIP">VIP</option>
                <option value="At Risk">At Risk</option>
              </select>

              {(searchQuery || industryFilter !== "All Industries" || statusFilter !== "All Statuses") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIndustryFilter("All Industries");
                    setStatusFilter("All Statuses");
                    setPage(1);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="py-3 px-3 font-medium">#</th>
                    <th className="py-3 px-3 font-medium">Company / Client</th>
                    <th className="py-3 px-3 font-medium">Industry</th>
                    <th className="py-3 px-3 font-medium">Contact Person</th>
                    <th className="py-3 px-3 font-medium">Revenue</th>
                    <th className="py-3 px-3 font-medium">Outstanding</th>
                    <th className="py-3 px-3 font-medium">Status</th>
                    <th className="py-3 px-2 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400">
                        No clients found matching your search.
                      </td>
                    </tr>
                  ) : (
                    clients.map((client, idx) => {
                      const isDetailActive = selectedClient?.id === client.id;
                      return (
                        <tr
                          key={client.id}
                          onClick={() => setSelectedClient(client)}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            isDetailActive ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <td className="py-3 px-3 text-slate-400 font-medium">
                            CL-{String(client.clientNumber).padStart(4, "0")}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs ${
                                  avatarColors[idx % avatarColors.length]
                                }`}
                              >
                                {getInitials(client.company)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 leading-tight truncate">{client.company}</p>
                                <p className="text-[10px] text-slate-400 truncate">{client.location || "Global"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">{client.industry || "General"}</td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-slate-800">{client.contactName || "—"}</p>
                            <p className="text-[10px] text-slate-400">{client.contactRole || ""}</p>
                          </td>
                          <td className="py-3 px-3 font-extrabold text-slate-900">
                            {money(client.revenue)}
                          </td>
                          <td className="py-3 px-3 font-bold text-rose-600">
                            {money(client.outstanding)}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLES[client.status] || "bg-slate-50 text-slate-600"}`}>
                              {client.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(client)}
                                className="p-1 hover:text-blue-600 text-slate-400 rounded cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteClient(client.id, e)}
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

            {/* Pagination */}
            {totalCount > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-800">{(page - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-bold text-slate-800">{Math.min(page * pageSize, totalCount)}</span> of{" "}
                  <span className="font-bold text-slate-800">{totalCount}</span> clients
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs px-2 font-bold text-slate-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Slide Panel */}
        {selectedClient && (
          <div className="w-full xl:w-[380px] shrink-0 bg-white rounded-2xl border border-slate-100/90 shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-700 shadow-2xs">
                  {getInitials(selectedClient.company)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">{selectedClient.company}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedClient.industry}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLES[selectedClient.status] || "bg-slate-50 text-slate-600"}`}>
                {selectedClient.status}
              </span>
            </div>

            {/* Contact details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{selectedClient.email}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedClient.email, "email")}
                  className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                >
                  {copiedField === "email" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {selectedClient.phone && (
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{selectedClient.phone}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedClient.phone!, "phone")}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                  >
                    {copiedField === "phone" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}

              {selectedClient.website && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a
                    href={`https://${selectedClient.website.replace(/^https?:\/\//, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {selectedClient.website}
                  </a>
                </div>
              )}

              {selectedClient.address && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-700 truncate">{selectedClient.address}</span>
                </div>
              )}
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold block">Total Revenue</span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                  {money(selectedClient.revenue)}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold block">Outstanding</span>
                <span className="text-base font-extrabold text-rose-600 mt-0.5 block">
                  {money(selectedClient.outstanding)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(selectedClient)}
                className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Client</span>
              </button>
              <button
                onClick={() => handleDeleteClient(selectedClient.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Delete Client"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Client Modal */}
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
                {modalMode === "create" ? "Add New Client" : `Edit: ${clientForm.company}`}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={clientForm.company}
                  onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="contact@acme.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    placeholder="+1 415 823 4567"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={clientForm.contactName}
                    onChange={(e) => setClientForm({ ...clientForm, contactName: e.target.value })}
                    placeholder="e.g. John Carter"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Role</label>
                  <input
                    type="text"
                    value={clientForm.contactRole}
                    onChange={(e) => setClientForm({ ...clientForm, contactRole: e.target.value })}
                    placeholder="CEO / Managing Director"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                  <select
                    value={clientForm.industry}
                    onChange={(e) => setClientForm({ ...clientForm, industry: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {["Technology", "IT Services", "Marketing", "Manufacturing", "Finance", "Healthcare", "Education", "Real Estate", "Logistics", "E-commerce"].map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {["Active", "Inactive", "Prospect", "VIP", "At Risk"].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Revenue ($)</label>
                  <input
                    type="number"
                    value={clientForm.revenue}
                    onChange={(e) => setClientForm({ ...clientForm, revenue: e.target.value })}
                    placeholder="50000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Outstanding ($)</label>
                  <input
                    type="number"
                    value={clientForm.outstanding}
                    onChange={(e) => setClientForm({ ...clientForm, outstanding: e.target.value })}
                    placeholder="10000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Website</label>
                <input
                  type="text"
                  value={clientForm.website}
                  onChange={(e) => setClientForm({ ...clientForm, website: e.target.value })}
                  placeholder="www.company.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  placeholder="Street address, city, country"
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
                  {modalMode === "create" ? "Create Client" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
