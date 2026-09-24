"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, FormField, Badge, SaveBar } from "@/components/SettingsUI";

interface LeadStatus {
  name: string;
  color: string;
  count: number;
}

const COLOR_OPTIONS = [
  "blue",
  "purple",
  "amber",
  "cyan",
  "green",
  "indigo",
  "teal",
  "slate",
  "rose",
  "red",
];

const dotColors: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  cyan: "bg-cyan-500",
  green: "bg-emerald-500",
  indigo: "bg-indigo-500",
  teal: "bg-teal-500",
  slate: "bg-slate-500",
  rose: "bg-rose-500",
  red: "bg-red-500",
};

export default function LeadSettingsPage() {
  const [statuses, setStatuses] = useState<LeadStatus[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [newIndustry, setNewIndustry] = useState("");
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusColor, setNewStatusColor] = useState("blue");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/leads");
      if (!res.ok) throw new Error("Failed to load lead settings");
      const data = await res.json();
      setStatuses(data.statuses || []);
      setIndustries(data.industries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const addIndustry = () => {
    const trimmed = newIndustry.trim();
    if (trimmed && !industries.includes(trimmed)) {
      setIndustries([...industries, trimmed]);
      setNewIndustry("");
      setSaved(false);
    }
  };

  const removeIndustry = (industry: string) => {
    setIndustries(industries.filter((i) => i !== industry));
    setSaved(false);
  };

  const addStatus = () => {
    const trimmed = newStatusName.trim();
    if (trimmed && !statuses.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setStatuses([
        ...statuses,
        { name: trimmed, color: newStatusColor, count: 0 },
      ]);
      setNewStatusName("");
      setSaved(false);
    }
  };

  const removeStatus = (name: string) => {
    setStatuses(statuses.filter((s) => s.name !== name));
    setSaved(false);
  };

  const updateStatusColor = (name: string, color: string) => {
    setStatuses((current) =>
      current.map((status) =>
        status.name === name ? { ...status, color } : status
      )
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statuses: statuses.map((s) => ({ name: s.name, color: s.color })),
          industries,
        }),
      });
      if (!res.ok) throw new Error("Failed to save lead settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await fetchSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading lead settings...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Lead Settings"
        description="Configure lead lifecycle statuses and industry classifications"
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
          <span>Lead settings saved to database successfully!</span>
        </div>
      )}

      <FormCard
        title="Lead Statuses"
        description="Live pipeline statuses tracked against leads in your database"
      >
        <div className="space-y-2">
          {statuses.map((status) => (
            <div
              key={status.name}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full shrink-0 ${dotColors[status.color] || "bg-blue-500"}`} />
                <span className="text-xs font-semibold text-slate-800">{status.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge label={`${status.count} leads in DB`} color="slate" />
                <select
                  aria-label={`Color for ${status.name}`}
                  value={status.color}
                  onChange={(event) => updateStatusColor(status.name, event.target.value)}
                  className="px-2 py-1 text-[11px] capitalize text-slate-600 bg-white border border-slate-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {COLOR_OPTIONS.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeStatus(status.name)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                  title="Remove status"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Status Form */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <input
            type="text"
            value={newStatusName}
            onChange={(e) => setNewStatusName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStatus()}
            placeholder="New status name..."
            className="flex-1 min-w-[200px] px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          <select
            value={newStatusColor}
            onChange={(e) => setNewStatusColor(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 capitalize focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
          >
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addStatus}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Status
          </button>
        </div>
      </FormCard>

      <FormCard
        title="Lead Industries"
        description="Categorize and segment leads by industry verticals"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {industries.map((industry) => (
            <span
              key={industry}
              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-medium text-slate-700 transition-colors"
            >
              {industry}
              <button
                type="button"
                onClick={() => removeIndustry(industry)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-slate-300 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <FormField label="Add Industry">
          <div className="flex gap-2">
            <input
              type="text"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIndustry()}
              placeholder="e.g. Telecommunications"
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            <button
              type="button"
              onClick={addIndustry}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors whitespace-nowrap cursor-pointer"
            >
              Add
            </button>
          </div>
        </FormField>
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
