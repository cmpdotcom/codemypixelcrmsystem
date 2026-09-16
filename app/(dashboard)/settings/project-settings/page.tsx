"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ChevronRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, SaveBar } from "@/components/SettingsUI";

interface ProjectStatus {
  label: string;
  color: string;
}

interface ProjectTemplate {
  name: string;
  stages: string[];
}

export default function ProjectSettingsPage() {
  const [statuses, setStatuses] = useState<ProjectStatus[]>([]);
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateStages, setNewTemplateStages] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/project-settings");
      if (!res.ok) throw new Error("Failed to load project settings");
      const data = await res.json();
      setStatuses(data.statuses || []);
      setTemplates(data.templates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
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
      const res = await fetch("/api/settings/project-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statuses, templates }),
      });
      if (!res.ok) throw new Error("Failed to save project settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  };

  const addStatus = () => {
    const trimmed = newStatusLabel.trim();
    if (trimmed && !statuses.some((s) => s.label.toLowerCase() === trimmed.toLowerCase())) {
      setStatuses([...statuses, { label: trimmed, color: "bg-blue-500" }]);
      setNewStatusLabel("");
    }
  };

  const removeStatus = (idx: number) => {
    setStatuses(statuses.filter((_, i) => i !== idx));
  };

  const addTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    const stages = newTemplateStages
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setTemplates([
      ...templates,
      {
        name: newTemplateName.trim(),
        stages: stages.length > 0 ? stages : ["Planning", "Execution", "Review", "Deployment"],
      },
    ]);
    setNewTemplateName("");
    setNewTemplateStages("");
  };

  const removeTemplate = (idx: number) => {
    setTemplates(templates.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading project settings...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Project Settings"
        description="Configure project delivery statuses and standardized execution templates"
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
          <span>Project settings saved to database!</span>
        </div>
      )}

      {/* Project Statuses */}
      <FormCard
        title="Project Progression Statuses"
        description="Linear delivery statuses a project moves through"
      >
        <div className="space-y-1 mb-4">
          {statuses.map((status, i) => (
            <div key={status.label}>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-slate-300 w-4">{i + 1}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${status.color || "bg-blue-500"}`} />
                  <span className="text-xs font-semibold text-slate-700">{status.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeStatus(i)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={newStatusLabel}
            onChange={(e) => setNewStatusLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStatus()}
            placeholder="Add delivery status..."
            className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          <button
            type="button"
            onClick={addStatus}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
          >
            Add Status
          </button>
        </div>
      </FormCard>

      {/* Project Templates */}
      <FormCard
        title="Project Stage Templates"
        description="Pre-configured multi-stage workflows for new client projects"
      >
        <div className="space-y-3 mb-5">
          {templates.map((template, idx) => (
            <div
              key={idx}
              className="border border-slate-200/90 rounded-xl p-4 bg-white hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{template.name}</h4>
                  <p className="text-[11px] text-slate-500">{template.stages.length} workflow stages</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeTemplate(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {template.stages.map((stage, i) => (
                  <div key={stage} className="flex items-center gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700">
                      {stage}
                    </span>
                    {i < template.stages.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={addTemplate} className="space-y-3 pt-3 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700">Create New Project Template</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Template name (e.g. Mobile App Sprint)"
              className="px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <input
              type="text"
              value={newTemplateStages}
              onChange={(e) => setNewTemplateStages(e.target.value)}
              placeholder="Stages separated by commas (Design, API, Frontend...)"
              className="px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer"
          >
            + Add Template
          </button>
        </form>
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
