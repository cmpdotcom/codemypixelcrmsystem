"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, FormField, Badge, SaveBar } from "@/components/SettingsUI";

interface ActivityType {
  id: string;
  name: string;
  icon: string;
  color: string;
  requirements: string[];
  active: boolean;
}

const COLOR_CLASSES: Record<string, string> = {
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  cyan: "bg-cyan-500",
  indigo: "bg-indigo-500",
  rose: "bg-rose-500",
  teal: "bg-teal-500",
  slate: "bg-slate-500",
};

export default function ActivityTypesPage() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New activity form
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("📌");
  const [newColor, setNewColor] = useState("blue");
  const [newRequirement, setNewRequirement] = useState("Date");

  const fetchTypes = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/activity-types");
      if (!res.ok) throw new Error("Failed to load activity types");
      const data = await res.json();
      setActivityTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const saveTypesToDb = async (updated: ActivityType[]) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/activity-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to save activity types");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setActivityTypes(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = (id: string) => {
    const next = activityTypes.map((t) => (t.id === id ? { ...t, active: !t.active } : t));
    saveTypesToDb(next);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this activity type?")) return;
    const next = activityTypes.filter((t) => t.id !== id);
    saveTypesToDb(next);
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const id = newName.toLowerCase().replace(/\s+/g, "-");
    const next: ActivityType[] = [
      ...activityTypes,
      {
        id,
        name: newName.trim(),
        icon: newIcon.trim() || "📌",
        color: newColor,
        requirements: [newRequirement],
        active: true,
      },
    ];

    saveTypesToDb(next);
    setNewName("");
    setNewIcon("📌");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading activity types...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Activity Types"
        description="Configure communication activity channels, visual icons, and logging requirements"
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
          <span>Activity types saved to database!</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-slate-500 font-medium">
          {activityTypes.filter((t) => t.active).length} of {activityTypes.length} activity types active
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {activityTypes.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white shadow-2xs ${
                      COLOR_CLASSES[type.color] || "bg-blue-500"
                    }`}
                  >
                    <span>{type.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{type.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{type.color}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(type.id)}
                    className={`relative rounded-full transition-colors shrink-0 cursor-pointer ${
                      type.active ? "bg-blue-600" : "bg-slate-200"
                    }`}
                    style={{ height: "22px", width: "40px" }}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        type.active ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(type.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                    title="Remove type"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Requirements
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {type.requirements.map((req) => (
                    <Badge key={req} label={req} color="blue" />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <span
                className={`text-[10px] font-semibold ${
                  type.active ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {type.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <FormCard title="Add Custom Activity Type" description="Define an additional interaction type for your team">
        <form onSubmit={handleAddType} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Activity Name *">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Technical Workshop"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </FormField>

            <FormField label="Icon Emoji">
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                placeholder="e.g. �️"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </FormField>

            <FormField label="Badge Color">
              <select
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 capitalize focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
              >
                {Object.keys(COLOR_CLASSES).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Primary Requirement">
              <select
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
              >
                {["Date", "Time", "Description", "Related Lead", "Related Client"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add Activity Type
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
