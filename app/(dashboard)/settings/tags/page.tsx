"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, FormField } from "@/components/SettingsUI";

interface TagItem {
  name: string;
  color: string;
  count: number;
  applicable?: string[];
}

const COLOR_MAP: Record<string, string> = {
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-emerald-100 text-emerald-700",
  teal: "bg-teal-100 text-teal-700",
  cyan: "bg-cyan-100 text-cyan-700",
  blue: "bg-blue-100 text-blue-700",
  indigo: "bg-indigo-100 text-indigo-700",
  purple: "bg-purple-100 text-purple-700",
  rose: "bg-rose-100 text-rose-700",
  slate: "bg-slate-100 text-slate-700",
};

const COLOR_OPTIONS = [
  "red",
  "orange",
  "amber",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "rose",
  "slate",
];

const APPLICABLE_MODULES = ["Leads", "Deals", "Clients", "Projects", "Tasks"];

export default function TagsSettingsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New tag state
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("blue");
  const [selectedModules, setSelectedModules] = useState<string[]>(["Leads", "Deals"]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/tags");
      if (!res.ok) throw new Error("Failed to load tags");
      const data = await res.json();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const saveTagsToDb = async (updated: TagItem[]) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setTags(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  };

  const removeTag = (name: string) => {
    const next = tags.filter((t) => t.name !== name);
    saveTagsToDb(next);
  };

  const toggleModule = (mod: string) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    if (tags.some((t) => t.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      setError("Tag with this name already exists");
      return;
    }

    const next: TagItem[] = [
      ...tags,
      {
        name: newTagName.trim(),
        color: newTagColor,
        count: 0,
        applicable: selectedModules,
      },
    ];

    saveTagsToDb(next);
    setNewTagName("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading tags...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Tags"
        description="Manage organizational tags applied across leads, deals, clients, projects, and tasks"
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
          <span>Tags updated in database!</span>
        </div>
      )}

      {/* Tag Cloud */}
      <FormCard
        title="All Global Tags"
        description="Click the X to delete any tag from database"
      >
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.name}
              className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-semibold ${
                COLOR_MAP[tag.color] || "bg-slate-100 text-slate-700"
              }`}
            >
              <span>{tag.name}</span>
              <span className="text-[10px] opacity-70 font-medium">×{tag.count}</span>
              <button
                type="button"
                onClick={() => removeTag(tag.name)}
                className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer"
                title={`Delete tag ${tag.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </FormCard>

      {/* Add Tag */}
      <FormCard
        title="Add New Tag"
        description="Create a custom global tag with target module assignment"
      >
        <form onSubmit={handleAddTag} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tag Name *">
              <input
                type="text"
                required
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g. VIP Account"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </FormField>

            <FormField label="Color Badge">
              <select
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 capitalize focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
              >
                {COLOR_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Applicable CRM Modules
            </label>
            <div className="flex flex-wrap gap-2">
              {APPLICABLE_MODULES.map((mod) => {
                const isSelected = selectedModules.includes(mod);
                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => toggleModule(mod)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {mod}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Create Tag
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
