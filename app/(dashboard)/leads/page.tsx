"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Link as LinkIcon,
  Search,
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
  X,
  Target,
  Inbox,
  ShieldCheck,
  Trophy,
  Filter,
  Columns,
  MapPin,
  Trash2,
  Edit3,
  Check,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Paperclip,
  Send,
  Clock,
  Video,
  File as FileIcon,
  Copy,
  Check as CheckIcon,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
    </svg>
  );
}

// --- Style helpers for badges ---
const sourceStyles: Record<string, string> = {
  LinkedIn: "bg-blue-50 text-blue-600 border border-blue-100",
  Website: "bg-sky-50 text-sky-600 border border-sky-100",
  Referral: "bg-amber-50 text-amber-600 border border-amber-100",
  Instagram: "bg-pink-50 text-pink-500 border border-pink-100",
  "Cold Call": "bg-slate-100 text-slate-600 border border-slate-200",
  "Google Ads": "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Facebook: "bg-blue-50 text-blue-600 border border-blue-100",
  WhatsApp: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

const statusStyles: Record<string, string> = {
  New: "bg-rose-50 text-rose-500 border border-rose-100",
  Contacted: "bg-blue-50 text-blue-600 border border-blue-100",
  Qualified: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Meeting: "bg-amber-50 text-amber-600 border border-amber-100",
  "Not Interested": "bg-red-50 text-red-500 border border-red-100",
  Nurture: "bg-purple-50 text-purple-600 border border-purple-100",
  Proposal: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  Converted: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Lost: "bg-slate-100 text-slate-500 border border-slate-200",
};

const statusColorStyles: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 border border-blue-100",
  purple: "bg-purple-50 text-purple-600 border border-purple-100",
  amber: "bg-amber-50 text-amber-600 border border-amber-100",
  cyan: "bg-cyan-50 text-cyan-600 border border-cyan-100",
  green: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  indigo: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  teal: "bg-teal-50 text-teal-600 border border-teal-100",
  slate: "bg-slate-100 text-slate-500 border border-slate-200",
  rose: "bg-rose-50 text-rose-500 border border-rose-100",
  red: "bg-red-50 text-red-500 border border-red-100",
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-slate-100 text-slate-700",
  "bg-purple-100 text-purple-700",
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarBg(name: string) {
  const hash = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return avatarColors[hash % avatarColors.length];
}

type LeadImportField =
  | "name" | "firstName" | "lastName" | "company" | "email" | "phone" | "location" | "linkedin"
  | "source" | "service" | "status" | "setter" | "budget" | "timeline"
  | "companySize" | "industry" | "nextFollowUp" | "notes";

interface LeadCsvData {
  headers: { key: string; label: string }[];
  rows: Record<string, string>[];
}

const leadImportFields: { key: LeadImportField; label: string; required?: boolean }[] = [
  { key: "name", label: "Full Name (CRM)" },
  { key: "firstName", label: "First Name (combine)" },
  { key: "lastName", label: "Last Name (combine)" },
  { key: "company", label: "Company", required: true },
  { key: "email", label: "Email", required: true },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "source", label: "Source" },
  { key: "service", label: "Service" },
  { key: "status", label: "Status" },
  { key: "setter", label: "Assigned Setter" },
  { key: "budget", label: "Budget" },
  { key: "timeline", label: "Timeline" },
  { key: "companySize", label: "Company Size" },
  { key: "industry", label: "Industry" },
  { key: "nextFollowUp", label: "Next Follow-up" },
  { key: "notes", label: "Notes" },
];

const leadImportAliases: Record<LeadImportField, string[]> = {
  name: ["name", "fullname", "full name", "contactname", "leadname"],
  firstName: ["firstname", "first name", "givenname", "given name"],
  lastName: ["lastname", "last name", "surname", "familyname", "family name"],
  company: ["company", "companyname", "business", "organization"],
  email: ["email", "emailaddress", "mail"],
  phone: ["phone", "phonenumber", "mobile", "telephone"],
  location: ["location", "city", "address", "country"],
  linkedin: ["linkedin", "linkedinurl", "linkedinprofile"],
  source: ["source", "leadsource", "channel"],
  service: ["service", "product", "projecttype"],
  status: ["status", "leadstatus", "stage"],
  setter: ["setter", "assignedsetter", "owner", "assignee"],
  budget: ["budget", "dealvalue", "value"],
  timeline: ["timeline", "timeframe", "duration"],
  companySize: ["companysize", "employees", "sizeofcompany"],
  industry: ["industry", "vertical", "sector"],
  nextFollowUp: ["nextfollowup", "followupdate", "followup", "nextcontact"],
  notes: ["notes", "note", "comments", "description"],
};

function normalizeImportHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseLeadCsv(contents: string): LeadCsvData {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < contents.length; index += 1) {
    const character = contents[index];
    const nextCharacter = contents[index + 1];
    if (character === '"' && quoted && nextCharacter === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return { headers: [], rows: [] };
  const headers = rows[0].map((label, index) => ({
    key: `${normalizeImportHeader(label) || "column"}${index}`,
    label: label || `Column ${index + 1}`,
  }));
  return {
    headers,
    rows: rows.slice(1).map((values) => Object.fromEntries(
      headers.map((header, index) => [header.key, values[index] || ""])
    )),
  };
}

function createImportMapping(headers: LeadCsvData["headers"]) {
  const mapping: Partial<Record<LeadImportField, string>> = {};
  for (const field of leadImportFields) {
    const match = headers.find((header) =>
      leadImportAliases[field.key].includes(normalizeImportHeader(header.label))
    );
    if (match) mapping[field.key] = match.key;
  }
  return mapping;
}

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(date: Date | string | null) {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

interface Lead {
  id: string;
  leadNumber: number;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  source: string;
  service: string | null;
  status: string;
  setter: string | null;
  setterImg: string | null;
  budget: string | null;
  timeline: string | null;
  companySize: string | null;
  industry: string | null;
  lastContact: Date | null;
  nextFollowUp: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface LeadActivity {
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
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LeadFile {
  id: string;
  leadId: string;
  fileName: string;
  fileSize: number;
  fileType: string | null;
  fileUrl: string;
  uploadedBy: string | null;
  createdAt: string;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  notInterested: number;
  lost: number;
  nurture: number;
  meeting: number;
  proposal: number;
  converted: number;
}

interface LeadSettings {
  statuses: { name: string; color: string; count: number }[];
  industries: string[];
}

const SOURCES = ["LinkedIn", "Website", "Referral", "Instagram", "Cold Call", "Google Ads", "Facebook", "WhatsApp"];
const STATUSES = ["New", "Contacted", "Qualified", "Meeting", "Proposal", "Not Interested", "Nurture", "Converted", "Lost"];
const SERVICES = ["Custom ERP", "Website", "Mobile App", "CRM", "ERP", "Dashboard", "E-commerce", "Other"];
const SETTERS = ["Ali Khan", "Fatima Noor", "Usman Tariq", "Sara Ahmed"];

export default function LeadsPageWrapper() {
  return (
    <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading...</div>}>
      <LeadsPage />
    </React.Suspense>
  );
}

function LeadsPage() {
  const [activeTab, setActiveTab] = useState("All Leads");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [setterFilter, setSetterFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ completed: 0, total: 0 });
  const [importPreview, setImportPreview] = useState<LeadCsvData | null>(null);
  const [importMapping, setImportMapping] = useState<Partial<Record<LeadImportField, string>>>({});
  const [importResult, setImportResult] = useState<string | null>(null);
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    contact: true,
    source: true,
    service: true,
    setter: true,
    created: true,
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [detailsTab, setDetailsTab] = useState("Overview");

  // Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const { pageSize: defaultPageSize, loaded: settingsLoaded } = useSettings();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leadSettings, setLeadSettings] = useState<LeadSettings>({ statuses: [], industries: [] });

  useEffect(() => {
    fetch("/api/settings/leads")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load lead options"))))
      .then((data: LeadSettings) => setLeadSettings({
        statuses: Array.isArray(data.statuses) ? data.statuses : [],
        industries: Array.isArray(data.industries) ? data.industries : [],
      }))
      .catch(() => setError("Lead options could not be loaded. Default options are being used."));
  }, []);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Inline edit state
  const [inlineEdit, setInlineEdit] = useState<{ id: string; field: string; value: string } | null>(null);

  // Activities state
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [activityForm, setActivityForm] = useState({ type: "Note", title: "", description: "" });
  const [activityLoading, setActivityLoading] = useState(false);

  // Files state
  const [files, setFiles] = useState<LeadFile[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  // Copy-to-clipboard state
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    }).catch(() => {});
  };

  const fetchActivities = useCallback(async (leadId: string) => {
    try {
      const res = await fetch(`/api/activities?leadId=${leadId}&pageSize=100`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch { /* ignore */ }
  }, []);

  const fetchFiles = useCallback(async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/files`);
      if (res.ok) setFiles(await res.json());
    } catch { /* ignore */ }
  }, []);

  // Fetch activities and files when selected lead changes
  useEffect(() => {
    if (selectedLead) {
      fetchActivities(selectedLead.id);
      fetchFiles(selectedLead.id);
    } else {
      setActivities([]);
      setFiles([]);
    }
  }, [selectedLead, fetchActivities, fetchFiles]);

  const addActivity = async () => {
    if (!selectedLead || !activityForm.title.trim()) return;
    setActivityLoading(true);
    try {
      const res = await fetch(`/api/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...activityForm,
          leadId: selectedLead.id,
          company: selectedLead.company,
          contact: selectedLead.name,
          status: "Completed",
        }),
      });
      if (res.ok) {
        const newActivity = await res.json();
        setActivities((prev) => [newActivity, ...prev]);
        setActivityForm({ type: "Note", title: "", description: "" });
      }
    } catch { /* ignore */ }
    setActivityLoading(false);
  };

  const deleteActivity = async (activityId: string) => {
    if (!selectedLead) return;
    try {
      await fetch(`/api/activities/${activityId}`, { method: "DELETE" });
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
    } catch { /* ignore */ }
  };

  const addFile = async () => {
    if (!selectedLead || !fileUrl.trim() || !fileName.trim()) return;
    setFileLoading(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, fileUrl, fileSize: 0, fileType: "link" }),
      });
      if (res.ok) {
        const newFile = await res.json();
        setFiles((prev) => [newFile, ...prev]);
        setFileUrl("");
        setFileName("");
      }
    } catch { /* ignore */ }
    setFileLoading(false);
  };

  const deleteFile = async (fileId: string) => {
    if (!selectedLead) return;
    try {
      await fetch(`/api/leads/${selectedLead.id}/files?fileId=${fileId}`, { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch { /* ignore */ }
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (searchQuery) params.set("search", searchQuery);
      if (activeTab !== "All Leads") params.set("status", activeTab);
      if (sourceFilter) params.set("source", sourceFilter);
      if (setterFilter) params.set("setter", setterFilter);
      const res = await fetch(`/api/leads?${params}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data.leads);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setStats(data.stats);
      setSelectedLead((current) => {
        if (data.leads.length === 0) return null;
        const refreshedSelection = current && data.leads.find((lead: Lead) => lead.id === current.id);
        return refreshedSelection || data.leads[0];
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, activeTab, sourceFilter, setterFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Auto-select lead from URL query param (e.g. /leads?lead=xxx)
  const searchParams = useSearchParams();
  useEffect(() => {
    const leadId = searchParams.get("lead");
    if (leadId && leads.length > 0 && selectedLead?.id !== leadId) {
      const lead = leads.find((l) => l.id === leadId);
      if (lead) {
        setSelectedLead(lead);
        setDetailsTab("Activities");
      } else {
        // Lead might be on another page — fetch it directly
        fetch(`/api/leads/${leadId}`)
          .then((res) => res.ok ? res.json() : null)
          .then((data) => { if (data) { setSelectedLead(data); setDetailsTab("Activities"); } })
          .catch(() => {});
      }
    }
  }, [searchParams, leads, selectedLead]);

  // Reset to page 1 when search/tab changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTab, sourceFilter, setterFilter]);

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      setSelectedRows(leads.map((r) => r.id));
      setSelectAll(true);
    }
  };

  // Clear selection when page changes
  useEffect(() => {
    setSelectedRows([]);
    setSelectAll(false);
  }, [page]);

  // --- CRUD operations ---
  const createLead = async (formData: Record<string, string>) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create lead");
    }
    return res.json();
  };

  const importLeads = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError(null);
    setImportResult(null);
    try {
      const preview = parseLeadCsv(await file.text());
      if (preview.rows.length === 0) throw new Error("CSV must include a header row and at least one data row");
      setImportPreview(preview);
      setImportMapping(createImportMapping(preview.headers));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to import leads");
    }
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    const requiredFields = leadImportFields.filter((field) => field.required);
    const hasNameMapping = Boolean(importMapping.name || (importMapping.firstName && importMapping.lastName));
    const missingField = requiredFields.find((field) => field.key === "name" ? !hasNameMapping : !importMapping[field.key]);
    if (missingField) {
      setError(`Please map Full Name, or map both First Name and Last Name.`);
      return;
    }

    setImporting(true);
    setError(null);
    try {
      const validRows = importPreview.rows.filter((row) => {
        const name = importMapping.name
          ? row[importMapping.name]
          : [importMapping.firstName ? row[importMapping.firstName] : "", importMapping.lastName ? row[importMapping.lastName] : ""].filter(Boolean).join(" ");
        const company = importMapping.company ? row[importMapping.company] : "";
        const email = importMapping.email ? row[importMapping.email] : "";
        return Boolean(name?.trim() && company?.trim() && email?.match(/^\S+@\S+\.\S+$/));
      });
      if (validRows.length === 0) throw new Error("No valid rows found. Check the required field mappings and email values.");

      setImportProgress({ completed: 0, total: validRows.length });
      for (const [index, row] of validRows.entries()) {
        const value = (field: LeadImportField) => {
          const column = importMapping[field];
          return column ? row[column]?.trim() || "" : "";
        };
        await createLead({
          name: value("name") || [value("firstName"), value("lastName")].filter(Boolean).join(" "),
          company: value("company"),
          email: value("email"),
          phone: value("phone"),
          location: value("location"),
          linkedin: value("linkedin"),
          source: value("source") || "Website",
          service: value("service"),
          status: value("status") || "New",
          setter: value("setter"),
          budget: value("budget"),
          timeline: value("timeline"),
          companySize: value("companySize"),
          industry: value("industry"),
          nextFollowUp: value("nextFollowUp"),
          notes: value("notes"),
        });
        setImportProgress({ completed: index + 1, total: validRows.length });
      }
      await fetchLeads();
      setImportResult(`Imported ${validRows.length} of ${importPreview.rows.length} rows successfully${validRows.length < importPreview.rows.length ? `; skipped ${importPreview.rows.length - validRows.length} invalid rows` : ""}.`);
      setImportPreview(null);
      setImportMapping({});
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to import leads");
    } finally {
      setImporting(false);
      setImportProgress({ completed: 0, total: 0 });
    }
  };

  const updateLead = async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update lead");
    return res.json();
  };

  const deleteLead = async (id: string) => {
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete lead");
    return res.json();
  };

  const bulkAction = async (action: string, ids: string[], status?: string) => {
    const res = await fetch("/api/leads/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids, status }),
    });
    if (!res.ok) throw new Error("Bulk action failed");
    return res.json();
  };

  const handleInlineSave = async (id: string, field: string, value: string) => {
    setInlineEdit(null);
    try {
      const updatedLead = await updateLead(id, { [field]: value });
      setSelectedLead((current) => current?.id === id ? { ...current, ...updatedLead } : current);
      await fetchLeads();
    } catch {
      setError("Failed to save changes");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedRows.length} selected leads? This cannot be undone.`)) return;
    try {
      await bulkAction("delete", selectedRows);
      setSelectedRows([]);
      setShowBulkActions(false);
      await fetchLeads();
    } catch {
      setError("Failed to delete leads");
    }
  };

  const handleBulkStatus = async (status: string) => {
    try {
      await bulkAction("updateStatus", selectedRows, status);
      setSelectedRows([]);
      setShowBulkActions(false);
      await fetchLeads();
    } catch {
      setError("Failed to update leads");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    try {
      await deleteLead(id);
      if (selectedLead?.id === id) setSelectedLead(null);
      await fetchLeads();
    } catch {
      setError("Failed to delete lead");
    }
  };

  // KPI cards
  const kpiStats = stats ? [
    { title: "Total Leads", value: stats.total.toLocaleString(), change: "↑ 12%", subtext: "vs last month", icon: Target, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
    { title: "New Leads", value: stats.new.toLocaleString(), change: "↑ 18%", subtext: "This month", icon: Inbox, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
    { title: "Contacted", value: stats.contacted.toLocaleString(), change: "↑ 14%", subtext: "This month", icon: Phone, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
    { title: "Qualified", value: stats.qualified.toLocaleString(), change: "↑ 22%", subtext: "This month", icon: ShieldCheck, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
    { title: "Converted", value: stats.converted.toLocaleString(), change: "↑ 30%", subtext: "This month", icon: Trophy, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
  ] : [];

  const tabs = [
    { label: "All Leads", count: stats?.total ?? 0 },
    ...(leadSettings.statuses.length ? leadSettings.statuses : STATUSES.map((name) => ({ name, count: 0, color: "blue" }))).map((status) => ({
      label: status.name,
      count: status.count,
    })),
  ];
  const statusOptions = leadSettings.statuses.length ? leadSettings.statuses.map((status) => status.name) : STATUSES;
  const industryOptions = leadSettings.industries.length ? leadSettings.industries : [];
  const getStatusStyle = (status: string) =>
    statusStyles[status] ||
    statusColorStyles[leadSettings.statuses.find((item) => item.name === status)?.color || "blue"];

  return (
    <>
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-12">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => { setError(null); fetchLeads(); }}
              className="text-red-700 hover:text-red-900 font-semibold underline underline-offset-2 cursor-pointer"
            >
              Retry
            </button>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {importResult && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{importResult}</span>
            <button onClick={() => setImportResult(null)} className="ml-auto text-emerald-500 hover:text-emerald-700 cursor-pointer">×</button>
          </div>
        )}

        {/* Top Title Bar & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Leads
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage, track and convert your leads into valuable clients.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              ref={importInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={importLeads}
              className="hidden"
            />
            <button
              onClick={() => importInputRef.current?.click()}
              disabled={importing}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-slate-500" />}
              <span>{importing ? "Importing..." : "Import CSV"}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Row of 5 Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {kpiStats.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex items-center gap-3.5"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 leading-tight">{kpi.title}</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.value}</h3>
                  <div className="flex items-center gap-1 text-[10px] mt-0.5">
                    <span className="font-bold text-emerald-600">{kpi.change}</span>
                    <span className="text-slate-400">{kpi.subtext}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bulk Actions Bar */}
        {selectedRows.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Check className="w-4 h-4" />
              <span>{selectedRows.length} lead{selectedRows.length > 1 ? "s" : ""} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => { if (e.target.value) handleBulkStatus(e.target.value); e.target.value = ""; }}
                className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-1.5 rounded-lg cursor-pointer"
                defaultValue=""
              >
                <option value="">Change Status...</option>
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button
                onClick={handleBulkDelete}
                className="bg-white border border-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
              <button
                onClick={() => { setSelectedRows([]); setSelectAll(false); }}
                className="text-slate-500 hover:text-slate-700 text-xs font-semibold px-2"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Main 2-Column Workspace Layout - flex with animated right panel width */}
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          {/* Left/Center Leads Table Container - flex-1 grows to fill, shrinks when right panel opens */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
            {/* Category Status Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 overflow-x-auto custom-scrollbar">
              <div className="flex items-center gap-1 pb-1 sm:pb-0">
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(tab.label)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.label
                        ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === tab.label ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar + Columns & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads by name, company, email or phone..."
                  className="block w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                <button onClick={() => setShowColumns((visible) => !visible)} className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Columns className="w-3.5 h-3.5 text-slate-400" />
                  <span>Columns</span>
                </button>
                {showColumns && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                    {Object.entries(visibleColumns).map(([column, visible]) => (
                      <label key={column} className="flex items-center gap-2 py-1 text-xs capitalize text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={() => setVisibleColumns((current) => ({ ...current, [column]: !current[column as keyof typeof current] }))}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {column}
                      </label>
                    ))}
                  </div>
                )}
                </div>
                <button onClick={() => setShowFilters((visible) => !visible)} className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <option value="">All Sources</option>
                  {SOURCES.map((source) => <option key={source} value={source}>{source}</option>)}
                </select>
                <select value={setterFilter} onChange={(event) => setSetterFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <option value="">All Setters</option>
                  {SETTERS.map((setter) => <option key={setter} value={setter}>{setter}</option>)}
                </select>
                {(sourceFilter || setterFilter) && (
                  <button onClick={() => { setSourceFilter(""); setSetterFilter(""); }} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Clear filters</button>
                )}
              </div>
            )}

            {/* Leads Table */}
            <div className="overflow-x-auto pt-2 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <span className="ml-2 text-sm text-slate-500">Loading leads...</span>
                </div>
              ) : leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Inbox className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-sm font-semibold text-slate-600">No leads found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or add a new lead.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Lead
                  </button>
                </div>
              ) : (
                <table className="w-full min-w-[820px] text-xs text-left table-fixed">
                  <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
                    <tr>
                      <th className="py-3 px-3 w-10">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-2 w-16 font-medium">#</th>
                      <th className="py-3 px-3 w-44 font-medium">Name / Company</th>
                      {visibleColumns.contact && <th className="py-3 px-3 w-40 font-medium">Contact</th>}
                      {visibleColumns.source && <th className="py-3 px-3 w-24 font-medium">Source</th>}
                      {visibleColumns.service && <th className="py-3 px-3 w-24 font-medium">Service</th>}
                      <th className="py-3 px-3 w-28 font-medium">Status</th>
                      {visibleColumns.setter && <th className="py-3 px-3 w-28 font-medium">Setter</th>}
                      {visibleColumns.created && <th className="py-3 px-3 w-24 font-medium">Created</th>}
                      <th className="py-3 px-2 w-20 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {leads.map((lead) => {
                      const isSelected = selectedRows.includes(lead.id);
                      const isDetailActive = selectedLead?.id === lead.id;
                      const leadId = `LD-${String(lead.leadNumber).padStart(5, "0")}`;

                      return (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            isDetailActive ? "bg-blue-50/40" : isSelected ? "bg-blue-50/20" : ""
                          }`}
                        >
                          <td className="py-3 px-3" onClick={(e) => toggleSelectRow(lead.id, e)}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-2 font-medium text-slate-500 whitespace-nowrap">{leadId}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${getAvatarBg(lead.name)}`}>
                                {getInitials(lead.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 leading-tight truncate">{lead.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{lead.company}</p>
                              </div>
                            </div>
                          </td>
                          {visibleColumns.contact && <td className="py-3 px-3">
                            <div className="min-w-0">
                              <p className="text-slate-700 font-medium truncate">{lead.email}</p>
                              <p className="text-[10px] text-slate-400 truncate">{lead.phone || "—"}</p>
                            </div>
                          </td>}
                          {visibleColumns.source && <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${sourceStyles[lead.source] || sourceStyles["Website"]}`}>
                              {lead.source}
                            </span>
                          </td>}
                          {visibleColumns.service && <td className="py-3 px-3 text-slate-700 font-medium">
                            <span className="truncate block">{lead.service || "—"}</span>
                          </td>}
                          <td className="py-3 px-3">
                            {/* Inline-editable status */}
                            {inlineEdit?.id === lead.id && inlineEdit.field === "status" ? (
                              <select
                                autoFocus
                                value={inlineEdit.value}
                                onChange={(e) => handleInlineSave(lead.id, "status", e.target.value)}
                                onBlur={() => setInlineEdit(null)}
                                className="text-[10px] font-bold border border-blue-300 rounded px-1 py-0.5 cursor-pointer"
                              >
                                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                              </select>
                            ) : (
                              <span
                                onClick={(e) => { e.stopPropagation(); setInlineEdit({ id: lead.id, field: "status", value: lead.status }); }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer hover:opacity-80 whitespace-nowrap ${getStatusStyle(lead.status)}`}
                                title="Click to edit status"
                              >
                                {lead.status}
                              </span>
                            )}
                          </td>
                          {visibleColumns.setter && <td className="py-3 px-3">
                            {lead.setter ? (
                              <div className="flex items-center gap-2 min-w-0">
                                {lead.setterImg ? (
                                  <img src={lead.setterImg} alt={lead.setter} className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0" />
                                ) : (
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${getAvatarBg(lead.setter)}`}>
                                    {getInitials(lead.setter)}
                                  </div>
                                )}
                                <span className="font-medium text-slate-800 truncate">{lead.setter}</span>
                              </div>
                            ) : <span className="text-slate-400">—</span>}
                          </td>}
                          {visibleColumns.created && <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{formatDate(lead.createdAt)}</td>}
                          <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => { setEditingLead(lead); setShowEditModal(true); }}
                                className="p-1 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Delete"
                              >
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

            {/* Table Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-800">{total === 0 ? 0 : (page - 1) * pageSize + 1}</span> to{" "}
                <span className="font-bold text-slate-800">{Math.min(page * pageSize, total)}</span> of{" "}
                <span className="font-bold text-slate-800">{total}</span> leads
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        page === pageNum ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 cursor-pointer shadow-2xs"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Detail Panel - always in DOM, width + opacity animates */}
          <div
            className={`shrink-0 self-stretch overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              selectedLead
                ? "xl:w-[340px] opacity-100"
                : "xl:w-0 opacity-0"
            }`}
          >
            <div className="w-[340px] h-full min-h-[620px] bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4 flex flex-col">
              {selectedLead && (
                <>
                  {/* Header: ID, Status, Close */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-slate-900">
                        LD-{String(selectedLead.leadNumber).padStart(5, "0")}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusStyle(selectedLead.status)}`}>
                        {selectedLead.status}
                      </span>
                    </div>
                  </div>

              {/* Panel Tabs */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 border-b border-slate-100">
                {["Overview", "Activities", "Notes", "Files"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailsTab(tab)}
                    className={`pb-2 transition-colors relative cursor-pointer ${
                      detailsTab === tab ? "text-blue-600 font-bold" : "hover:text-slate-900"
                    }`}
                  >
                    {tab}
                    {detailsTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                ))}
              </div>

              {/* Lead Profile Banner - always visible */}
              <div className="flex items-start justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${getAvatarBg(selectedLead.name)}`}>
                    {getInitials(selectedLead.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{selectedLead.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedLead.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setEditingLead(selectedLead); setShowEditModal(true); }}
                  className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              {/* Contact Icons Row - always visible, with copy-to-clipboard */}
              <div className="space-y-2 py-1 text-xs">
                {/* Email */}
                <div className="flex items-center justify-between text-slate-600 group">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{selectedLead.email}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedLead.email, "email")}
                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                    title="Copy email"
                  >
                    {copiedField === "email" ? <CheckIcon className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between text-slate-600 group">
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{selectedLead.phone || "—"}</span>
                  </div>
                  {selectedLead.phone && (
                    <button
                      onClick={() => copyToClipboard(selectedLead.phone!, "phone")}
                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                      title="Copy phone"
                    >
                      {copiedField === "phone" ? <CheckIcon className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center justify-between text-slate-600 group">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{selectedLead.location || "—"}</span>
                  </div>
                  {selectedLead.location && (
                    <button
                      onClick={() => copyToClipboard(selectedLead.location!, "location")}
                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                      title="Copy location"
                    >
                      {copiedField === "location" ? <CheckIcon className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {/* LinkedIn */}
                {selectedLead.linkedin && (
                  <div className="flex items-center justify-between text-slate-600 group">
                    <div className="flex items-center gap-2 min-w-0">
                      <LinkedinIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-medium text-blue-600 hover:underline cursor-pointer truncate">{selectedLead.linkedin}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedLead.linkedin!, "linkedin")}
                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                      title="Copy LinkedIn"
                    >
                      {copiedField === "linkedin" ? <CheckIcon className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>

              {/* ============ OVERVIEW TAB ============ */}
              {detailsTab === "Overview" && (
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs overflow-y-auto flex-1 custom-scrollbar pr-1">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Source</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sourceStyles[selectedLead.source] || sourceStyles["Website"]}`}>
                      {selectedLead.source}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Service</span>
                    <span className="font-semibold text-slate-800">{selectedLead.service || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Budget</span>
                    <span className="font-semibold text-slate-800">{selectedLead.budget || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Timeline</span>
                    <span className="font-semibold text-slate-800">{selectedLead.timeline || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Company Size</span>
                    <span className="font-semibold text-slate-800">{selectedLead.companySize || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Industry</span>
                    <span className="font-semibold text-slate-800">{selectedLead.industry || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Setter</span>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      {selectedLead.setterImg ? (
                        <img src={selectedLead.setterImg} alt={selectedLead.setter || ""} className="w-4 h-4 rounded-full object-cover" />
                      ) : (
                        selectedLead.setter && <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${getAvatarBg(selectedLead.setter)}`}>{getInitials(selectedLead.setter)}</div>
                      )}
                      <span>{selectedLead.setter || "—"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Created</span>
                    <span className="text-slate-600 font-medium">{formatDateTime(selectedLead.createdAt)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Last Contact</span>
                    <span className="text-slate-600 font-medium">{formatDateTime(selectedLead.lastContact)}</span>
                  </div>
                  <div className="flex justify-between py-1 items-center">
                    <span className="text-slate-400">Next Follow-up</span>
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/70 px-2 py-0.5 rounded text-[11px] font-bold">
                      {formatDate(selectedLead.nextFollowUp)}
                    </span>
                  </div>
                  <div className="pt-2 mt-1 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">All CRM fields</p>
                    <div className="space-y-2">
                      {[
                        ["Full Name", selectedLead.name],
                        ["Company", selectedLead.company],
                        ["Email", selectedLead.email],
                        ["Phone", selectedLead.phone],
                        ["Location", selectedLead.location],
                        ["LinkedIn", selectedLead.linkedin],
                        ["Source", selectedLead.source],
                        ["Service", selectedLead.service],
                        ["Status", selectedLead.status],
                        ["Assigned Setter", selectedLead.setter],
                        ["Budget", selectedLead.budget],
                        ["Timeline", selectedLead.timeline],
                        ["Company Size", selectedLead.companySize],
                        ["Industry", selectedLead.industry],
                        ["Notes", selectedLead.notes],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-3 border-b border-slate-50 pb-1.5">
                          <span className="text-slate-400 shrink-0">{label}</span>
                          <span className="text-right font-semibold text-slate-800 break-words">{value || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============ ACTIVITIES TAB ============ */}
              {detailsTab === "Activities" && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  {/* Add Activity Form */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={activityForm.type}
                        onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                        className="text-[11px] font-semibold border border-slate-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="Call">📞 Call</option>
                        <option value="Email">✉️ Email</option>
                        <option value="Meeting">📅 Meeting</option>
                        <option value="WhatsApp">💬 WhatsApp</option>
                        <option value="Note">📝 Note</option>
                        <option value="Other">📌 Other</option>
                      </select>
                      <input
                        type="text"
                        value={activityForm.title}
                        onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                        placeholder="Activity title..."
                        className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        onKeyDown={(e) => e.key === "Enter" && addActivity()}
                      />
                    </div>
                    <input
                      type="text"
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      placeholder="Description (optional)..."
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                    <button
                      onClick={addActivity}
                      disabled={!activityForm.title.trim() || activityLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {activityLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Add Activity
                    </button>
                  </div>

                  {/* Activity Timeline */}
                  {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-500">No activities yet</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Add your first interaction above.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((act) => {
                        const iconMap: Record<string, { icon: typeof Phone; bg: string }> = {
                          Call: { icon: Phone, bg: "bg-emerald-50 text-emerald-500" },
                          Email: { icon: Mail, bg: "bg-blue-50 text-blue-500" },
                          Meeting: { icon: Calendar, bg: "bg-purple-50 text-purple-500" },
                          WhatsApp: { icon: MessageCircle, bg: "bg-green-50 text-green-500" },
                          Note: { icon: FileText, bg: "bg-amber-50 text-amber-500" },
                          Other: { icon: MoreHorizontal, bg: "bg-slate-100 text-slate-500" },
                        };
                        const config = iconMap[act.type] || iconMap["Other"];
                        const Icon = config.icon;
                        return (
                          <div key={act.id} className="flex items-start gap-2.5 group">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.bg}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-xs font-semibold text-slate-800 truncate">{act.title}</p>
                                <button
                                  onClick={() => deleteActivity(act.id)}
                                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              {act.description && (
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{act.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-400">{formatDateTime(act.createdAt)}</span>
                                {act.performedBy && <span className="text-[10px] text-slate-400">• {act.performedBy}</span>}
                                {act.status && (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    act.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                    act.status === "Scheduled" ? "bg-sky-50 text-sky-600" :
                                    act.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                    "bg-slate-50 text-slate-500"
                                  }`}>{act.status}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ============ NOTES TAB ============ */}
              {detailsTab === "Notes" && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Notes</h4>
                  <textarea
                    key={selectedLead.id}
                    defaultValue={selectedLead.notes || ""}
                    onBlur={(e) => updateLead(selectedLead.id, { notes: e.target.value })
                      .then((updatedLead) => setSelectedLead((current) => current?.id === selectedLead.id ? { ...current, ...updatedLead } : current))
                      .catch(() => setError("Failed to save notes"))}
                    placeholder="Add notes about this lead..."
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" /> Notes save automatically when you click away.
                  </p>
                </div>
              )}

              {/* ============ FILES TAB ============ */}
              {detailsTab === "Files" && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  {/* Add File Form */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="File name (e.g. proposal.pdf)..."
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                    <input
                      type="text"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="File URL (https://...)..."
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                    <button
                      onClick={addFile}
                      disabled={!fileName.trim() || !fileUrl.trim() || fileLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {fileLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Paperclip className="w-3 h-3" />}
                      Attach File
                    </button>
                  </div>

                  {/* File List */}
                  {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Paperclip className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-500">No files attached</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Attach a file by adding its name and URL above.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-2.5 group">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <FileIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{file.fileName}</p>
                            <p className="text-[10px] text-slate-400">{formatDateTime(file.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 cursor-pointer"
                              title="Open"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Delete button - always visible */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Lead
                </button>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {importPreview && (
        <LeadImportModal
          preview={importPreview}
          mapping={importMapping}
          importing={importing}
          importProgress={importProgress}
          onMappingChange={(field, column) => setImportMapping((current) => ({ ...current, [field]: column || undefined }))}
          onClose={() => { if (!importing) { setImportPreview(null); setImportMapping({}); } }}
          onImport={confirmImport}
        />
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <LeadModal
          mode="add"
          statusOptions={statusOptions}
          industryOptions={industryOptions}
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            await createLead(data);
            setShowAddModal(false);
            await fetchLeads();
          }}
        />
      )}

      {/* Edit Lead Modal */}
      {showEditModal && editingLead && (
        <LeadModal
          mode="edit"
          lead={editingLead}
          statusOptions={statusOptions}
          industryOptions={industryOptions}
          onClose={() => { setShowEditModal(false); setEditingLead(null); }}
          onSave={async (data) => {
            await updateLead(editingLead.id, data);
            setShowEditModal(false);
            setEditingLead(null);
            await fetchLeads();
          }}
        />
      )}

      {/* Custom Scrollbars */}
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

function LeadImportModal({
  preview,
  mapping,
  importing,
  importProgress,
  onMappingChange,
  onClose,
  onImport,
}: {
  preview: LeadCsvData;
  mapping: Partial<Record<LeadImportField, string>>;
  importing: boolean;
  importProgress: { completed: number; total: number };
  onMappingChange: (field: LeadImportField, column: string) => void;
  onClose: () => void;
  onImport: () => void;
}) {
  const mappedCount = Object.values(mapping).filter(Boolean).length;
  const mappedColumns = new Set(Object.values(mapping).filter(Boolean));
  const unmappedHeaders = preview.headers.filter((header) => !mappedColumns.has(header.key));
  const progressPercent = importProgress.total ? Math.round((importProgress.completed / importProgress.total) * 100) : 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col" onClick={(event) => event.stopPropagation()}>
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Review CSV Import</h3>
            <p className="text-xs text-slate-500 mt-1">Map uploaded columns to CRM fields before importing.</p>
          </div>
          <button onClick={onClose} disabled={importing} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
            {importing && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Importing rows</span>
                  <span>{importProgress.completed} of {importProgress.total}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                  <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="text-[11px] text-blue-600">{progressPercent}% complete. Please keep this window open.</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">CRM field mapping</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Choose “Do not import” for fields you do not want to add.</p>
                </div>
                <span className="text-[10px] font-semibold text-blue-600">{mappedCount} mapped</span>
              </div>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                {leadImportFields.map((field) => (
                  <div key={field.key} className="flex items-center gap-3 px-3 py-2.5">
                    <label className="w-36 shrink-0 text-xs font-semibold text-slate-700">
                      {field.label}{field.required && <span className="text-red-500"> *</span>}
                    </label>
                    <select
                      value={mapping[field.key] || ""}
                      onChange={(event) => onMappingChange(field.key, event.target.value)}
                      className="flex-1 min-w-0 text-xs border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                      <option value="">Do not import</option>
                      {preview.headers.map((header) => <option key={header.key} value={header.key}>{header.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">CSV columns not mapped</h4>
                    <p className="text-[11px] text-amber-700 mt-1">These columns will not be saved to the CRM unless you map them above.</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700">{unmappedHeaders.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {unmappedHeaders.length ? unmappedHeaders.map((header) => (
                    <span key={header.key} className="rounded-md border border-amber-200 bg-white px-2 py-1 text-[10px] font-medium text-amber-800">{header.label}</span>
                  )) : <span className="text-[11px] text-emerald-700">Every CSV column is mapped.</span>}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Uploaded data preview</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Showing the first {Math.min(preview.rows.length, 5)} of {preview.rows.length} rows.</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{preview.headers.length} columns</span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-auto max-h-[520px]">
                <table className="min-w-full text-[11px] text-left">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>{preview.headers.map((header) => <th key={header.key} className="px-3 py-2 font-semibold text-slate-500 whitespace-nowrap">{header.label}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {preview.rows.slice(0, 5).map((row, index) => (
                      <tr key={index}>{preview.headers.map((header) => <td key={header.key} className="px-3 py-2 text-slate-600 max-w-40 truncate whitespace-nowrap">{row[header.key] || "—"}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400"><span className="text-red-500">*</span> Full Name (or First + Last Name), Company, and Email are required.</p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} disabled={importing} className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50">Cancel</button>
            <button onClick={onImport} disabled={importing} className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50">
              {importing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {importing ? `Importing ${importProgress.completed}/${importProgress.total}` : `Import ${preview.rows.length} rows`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Lead Modal Component (Add / Edit) ---
function LeadModal({
  mode,
  lead,
  statusOptions,
  industryOptions,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  lead?: Lead | null;
  statusOptions: string[];
  industryOptions: string[];
  onClose: () => void;
  onSave: (data: Record<string, string>) => Promise<void>;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({
    name: lead?.name || "",
    company: lead?.company || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    location: lead?.location || "",
    linkedin: lead?.linkedin || "",
    source: lead?.source || "Website",
    service: lead?.service || "",
    status: lead?.status || statusOptions[0] || "New",
    setter: lead?.setter || "",
    budget: lead?.budget || "",
    timeline: lead?.timeline || "",
    companySize: lead?.companySize || "",
    industry: lead?.industry || "",
    nextFollowUp: lead?.nextFollowUp ? new Date(lead.nextFollowUp).toISOString().slice(0, 10) : "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave(formData);
    } catch {
      setErrors({ form: "Failed to save lead. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const field = (name: string, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">{label}</label>
      <input
        type={type}
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        placeholder={placeholder}
        className={`w-full text-xs border rounded-xl px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all ${
          errors[name] ? "border-red-300 bg-red-50/30" : "border-slate-200"
        }`}
      />
      {errors[name] && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{errors[name]}</p>}
    </div>
  );

  const selectField = (name: string, label: string, options: string[]) => (
    <div>
      <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">{label}</label>
      <select
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className="w-full text-xs border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all cursor-pointer"
      >
        <option value="">Select {label}...</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with gradient accent */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-3xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${mode === "add" ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"}`}>
                {mode === "add" ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {mode === "add" ? "Add New Lead" : "Edit Lead"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === "add" ? "Fill in the details to create a new lead." : `Editing LD-${String(lead?.leadNumber).padStart(5, "0")}`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.form}
            </div>
          )}

          {/* Section: Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Contact Information</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("name", "Full Name *", "text", "John Carter")}
              {field("company", "Company *", "text", "ABC Technologies")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("email", "Email *", "email", "john@abc.com")}
              {field("phone", "Phone", "tel", "+1 415 823 4567")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("location", "Location", "text", "San Francisco, USA")}
              {field("linkedin", "LinkedIn", "text", "linkedin.com/in/johncarter")}
            </div>
          </div>

          {/* Section: Lead Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 pt-2">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Lead Details</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {selectField("source", "Source", SOURCES)}
              {selectField("service", "Service", SERVICES)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {selectField("status", "Status", statusOptions)}
              {selectField("setter", "Assigned Setter", SETTERS)}
            </div>
          </div>

          {/* Section: Project Requirements */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 pt-2">
              <div className="w-1 h-4 bg-purple-500 rounded-full" />
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Project Requirements</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("budget", "Budget", "text", "$20,000 – $50,000")}
              {field("timeline", "Timeline", "text", "1 – 3 months")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("companySize", "Company Size", "text", "50–200 employees")}
              {industryOptions.length > 0
                ? selectField("industry", "Industry", industryOptions)
                : field("industry", "Industry", "text", "Manufacturing")}
            </div>
          </div>

          {/* Section: Follow-up */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 pt-2">
              <div className="w-1 h-4 bg-amber-500 rounded-full" />
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Follow-up</h4>
            </div>
            {field("nextFollowUp", "Next Follow-up Date", "date")}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 sticky bottom-0 bg-white -mx-6 px-6 -mb-5 pb-5">
            <p className="text-[10px] text-slate-400">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-blue-500/20"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                {mode === "add" ? "Create Lead" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
