"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, SaveBar } from "@/components/SettingsUI";

interface ClientStatus {
  label: string;
  color: string;
}

const COLOR_MAP: Record<string, string> = {
  Prospect: "bg-slate-400",
  Active: "bg-emerald-500",
  Inactive: "bg-amber-500",
  VIP: "bg-purple-500",
  "At Risk": "bg-rose-500",
  Churned: "bg-red-500",
};

export default function ClientSettingsPage() {
  const [clientTypes, setClientTypes] = useState<string[]>([]);
  const [clientStatuses, setClientStatuses] = useState<ClientStatus[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [companySizes, setCompanySizes] = useState<string[]>([]);

  const [newType, setNewType] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [newStatusLabel, setNewStatusLabel] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/client-settings");
      if (!res.ok) throw new Error("Failed to load client settings");
      const data = await res.json();
      setClientTypes(data.clientTypes || []);
      setClientStatuses(data.clientStatuses || []);
      setIndustries(data.industries || []);
      setCompanySizes(data.companySizes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/client-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientTypes,
          clientStatuses,
          industries,
          companySizes,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const addType = () => {
    const trimmed = newType.trim();
    if (trimmed && !clientTypes.includes(trimmed)) {
      setClientTypes([...clientTypes, trimmed]);
      setNewType("");
    }
  };

  const removeType = (type: string) => {
    setClientTypes(clientTypes.filter((t) => t !== type));
  };

  const addIndustry = () => {
    const trimmed = newIndustry.trim();
    if (trimmed && !industries.includes(trimmed)) {
      setIndustries([...industries, trimmed]);
      setNewIndustry("");
    }
  };

  const removeIndustry = (ind: string) => {
    setIndustries(industries.filter((i) => i !== ind));
  };

  const addStatus = () => {
    const trimmed = newStatusLabel.trim();
    if (trimmed && !clientStatuses.some((s) => s.label.toLowerCase() === trimmed.toLowerCase())) {
      setClientStatuses([...clientStatuses, { label: trimmed, color: "bg-blue-500" }]);
      setNewStatusLabel("");
    }
  };

  const removeStatus = (label: string) => {
    setClientStatuses(clientStatuses.filter((s) => s.label !== label));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading client settings...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Client Settings"
        description="Configure client classification types, relationship statuses, and company segmentation"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Client settings saved to database!</span>
        </div>
      )}

      {/* Client Types */}
      <FormCard
        title="Client Types"
        description="Define categorization segments for clients you serve"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {clientTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              {type}
              <button
                type="button"
                onClick={() => removeType(type)}
                className="ml-0.5 w-4 h-4 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addType()}
            placeholder="Add client type..."
            className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          <button
            type="button"
            onClick={addType}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Type
          </button>
        </div>
      </FormCard>

      {/* Client Statuses */}
      <FormCard
        title="Client Relationship Statuses"
        description="Track relationship health and engagement stages"
      >
        <div className="space-y-2 mb-4">
          {clientStatuses.map((status) => (
            <div
              key={status.label}
              className="flex items-center justify-between py-2 px-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${COLOR_MAP[status.label] || status.color || "bg-blue-500"}`} />
                <span className="text-xs font-semibold text-slate-700">{status.label}</span>
              </div>
              <button
                type="button"
                onClick={() => removeStatus(status.label)}
                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={newStatusLabel}
            onChange={(e) => setNewStatusLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStatus()}
            placeholder="Add relationship status..."
            className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          <button
            type="button"
            onClick={addStatus}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Status
          </button>
        </div>
      </FormCard>

      {/* Industries */}
      <FormCard
        title="Industries"
        description="Vertical industries for client qualification and targeted marketing"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {industries.map((industry) => (
            <span
              key={industry}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              {industry}
              <button
                type="button"
                onClick={() => removeIndustry(industry)}
                className="ml-0.5 w-4 h-4 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newIndustry}
            onChange={(e) => setNewIndustry(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addIndustry()}
            placeholder="Add an industry..."
            className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          <button
            type="button"
            onClick={addIndustry}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Industry
          </button>
        </div>
      </FormCard>

      {/* Company Sizes */}
      <FormCard
        title="Company Sizes"
        description="Headcount ranges used to qualify and tier accounts"
      >
        <div className="flex flex-wrap gap-2">
          {companySizes.map((size) => (
            <span
              key={size}
              className="inline-flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              {size} employees
            </span>
          ))}
        </div>
      </FormCard>

      <SaveBar
        saving={saving}
        saved={saved}
        onSave={handleSave}
        onCancel={fetchSettings}
      />
    </div>
  );
}
