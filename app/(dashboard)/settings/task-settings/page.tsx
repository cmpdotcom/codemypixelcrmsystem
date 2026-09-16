"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Select,
  Toggle,
  SaveBar,
} from "@/components/SettingsUI";

interface TaskStatus {
  label: string;
  color: string;
}

interface TaskPriority {
  label: string;
  color: string;
  description: string;
}

export default function TaskSettingsPage() {
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [priorities, setPriorities] = useState<TaskPriority[]>([]);
  const [defaultAssignee, setDefaultAssignee] = useState("Unassigned");
  const [defaultPriority, setDefaultPriority] = useState("Medium");
  const [defaultDueOffset, setDefaultDueOffset] = useState("1 week");
  const [autoCreateFromDeals, setAutoCreateFromDeals] = useState(true);

  const [newStatusName, setNewStatusName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/task-settings");
      if (!res.ok) throw new Error("Failed to load task settings");
      const data = await res.json();
      setStatuses(data.statuses || []);
      setPriorities(data.priorities || []);
      setDefaultAssignee(data.defaultAssignee || "Unassigned");
      setDefaultPriority(data.defaultPriority || "Medium");
      setDefaultDueOffset(data.defaultDueOffset || "1 week");
      setAutoCreateFromDeals(data.autoCreateFromDeals === "true" || data.autoCreateFromDeals === true);
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
      const res = await fetch("/api/settings/task-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statuses,
          priorities,
          defaultAssignee,
          defaultPriority,
          defaultDueOffset,
          autoCreateFromDeals: String(autoCreateFromDeals),
        }),
      });
      if (!res.ok) throw new Error("Failed to save task settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  };

  const addStatus = () => {
    const trimmed = newStatusName.trim();
    if (trimmed && !statuses.some((s) => s.label.toLowerCase() === trimmed.toLowerCase())) {
      setStatuses([
        ...statuses,
        { label: trimmed, color: "bg-blue-50 text-blue-600 border-blue-200" },
      ]);
      setNewStatusName("");
    }
  };

  const removeStatus = (label: string) => {
    setStatuses(statuses.filter((s) => s.label !== label));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading task settings...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Task Settings"
        description="Configure sprint task workflow columns, urgency priority levels, and default rules"
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
          <span>Task settings saved to database!</span>
        </div>
      )}

      {/* Task Statuses */}
      <FormCard
        title="Kanban Task Statuses"
        description="Progressive execution states tracked on sprint tasks"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {statuses.map((status) => (
            <span
              key={status.label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${status.color}`}
            >
              <span>{status.label}</span>
              <button
                type="button"
                onClick={() => removeStatus(status.label)}
                className="hover:opacity-70 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={newStatusName}
            onChange={(e) => setNewStatusName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStatus()}
            placeholder="Add task status..."
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

      {/* Task Priorities */}
      <FormCard
        title="Task Urgency Levels"
        description="Standardized SLA priorities for dev and project tasks"
      >
        <div className="space-y-1">
          {priorities.map((priority) => (
            <div
              key={priority.label}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${priority.color}`} />
              <span className="text-xs font-semibold text-slate-700 w-24">{priority.label}</span>
              <span className="text-xs text-slate-500">{priority.description}</span>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Task Defaults */}
      <FormCard
        title="Default Assignment & Generation"
        description="Default field values applied when creating tasks or auto-generating from won deals"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Default Assignee">
            <Select
              options={["Unassigned", "Current User", "Project Manager"]}
              value={defaultAssignee}
              onChange={(v) => setDefaultAssignee(v)}
            />
          </FormField>
          <FormField label="Default Priority">
            <Select
              options={["Low", "Medium", "High", "Urgent"]}
              value={defaultPriority}
              onChange={(v) => setDefaultPriority(v)}
            />
          </FormField>
          <FormField label="Default Due Date Offset">
            <Select
              options={["1 day", "3 days", "1 week", "2 weeks", "1 month"]}
              value={defaultDueOffset}
              onChange={(v) => setDefaultDueOffset(v)}
            />
          </FormField>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          <Toggle
            label="Auto-create tasks from deals"
            description="Automatically generate delivery onboarding tasks when a deal is moved to Won"
            checked={autoCreateFromDeals}
            onChange={(checked) => setAutoCreateFromDeals(checked)}
          />
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
