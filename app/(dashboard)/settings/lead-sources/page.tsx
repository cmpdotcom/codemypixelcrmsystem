"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Loader2, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { Badge } from "@/components/SettingsUI";

interface LeadSource {
  name: string;
  description: string;
  active: boolean;
  count: number;
}

export default function LeadSourcesPage() {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newSource, setNewSource] = useState({ name: "", description: "" });

  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/lead-sources");
      if (!res.ok) throw new Error("Failed to load lead sources");
      const data = await res.json();
      setSources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading sources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const saveSourcesToDb = async (updated: LeadSource[]) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/lead-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: updated.map(({ name, description, active }) => ({
            name,
            description,
            active,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  };

  const toggleSource = (name: string) => {
    const next = sources.map((s) =>
      s.name === name ? { ...s, active: !s.active } : s
    );
    setSources(next);
    saveSourcesToDb(next);
  };

  const handleDeleteSource = (name: string) => {
    if (!confirm(`Remove "${name}" source?`)) return;
    const next = sources.filter((s) => s.name !== name);
    setSources(next);
    saveSourcesToDb(next);
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name.trim()) return;
    const next = [
      ...sources,
      {
        name: newSource.name.trim(),
        description: newSource.description.trim() || "Custom lead source",
        active: true,
        count: 0,
      },
    ];
    setSources(next);
    saveSourcesToDb(next);
    setNewSource({ name: "", description: "" });
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading lead sources...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Lead Sources"
        description="Configure acquisition channels and track lead volume by source"
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
          <span>Lead sources saved to database!</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-slate-500 font-medium">
          {sources.filter((s) => s.active).length} of {sources.length} sources active
        </span>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <div
            key={source.name}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-900">{source.name}</h4>
              <div className="flex items-center gap-1.5">
                <Badge label={`${source.count} leads in DB`} color="slate" />
                <button
                  type="button"
                  onClick={() => handleDeleteSource(source.name)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                  title="Remove source"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4 flex-1">
              {source.description}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span
                className={`text-[10px] font-semibold ${
                  source.active ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {source.active ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                onClick={() => toggleSource(source.name)}
                className={`relative rounded-full transition-colors shrink-0 cursor-pointer ${
                  source.active ? "bg-blue-600" : "bg-slate-200"
                }`}
                style={{ height: "22px", width: "40px" }}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                    source.active ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Source Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Lead Source</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Source Name *</label>
                <input
                  type="text"
                  required
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  placeholder="e.g. TikTok Campaigns"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newSource.description}
                  onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                  placeholder="Channel details..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Add Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
