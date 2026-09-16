"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Select,
  Toggle,
  SaveBar,
  Badge,
} from "@/components/SettingsUI";

interface FollowUpType {
  name: string;
  icon: string;
}

const DEFAULT_TYPES: FollowUpType[] = [
  { name: "Call", icon: "📞" },
  { name: "Email", icon: "✉️" },
  { name: "WhatsApp", icon: "💬" },
  { name: "Meeting", icon: "🗓️" },
  { name: "SMS", icon: "📱" },
  { name: "Visit", icon: "🏗️" },
  { name: "Video Call", icon: "🎥" },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  followup_remind_before: "true",
  followup_remind_time: "30 minutes",
  followup_notify_overdue: "true",
  followup_overdue_delay: "1 hour",
  followup_escalate_manager: "true",
  followup_escalate_after: "1 day",
};

export default function FollowUpSettingsPage() {
  const [types, setTypes] = useState<FollowUpType[]>(DEFAULT_TYPES);
  const [formData, setFormData] = useState<Record<string, string>>({ ...DEFAULT_SETTINGS });
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeIcon, setNewTypeIcon] = useState("📌");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => {
            const merged = { ...prev };
            for (const k of Object.keys(DEFAULT_SETTINGS)) {
              if (data[k] !== undefined) merged[k] = data[k];
            }
            return merged;
          });

          if (data["followup_types_list"]) {
            try {
              setTypes(JSON.parse(data["followup_types_list"]));
            } catch {
              /* fallback */
            }
          }
        }
      } catch {
        /* fallback */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const payload = {
        ...formData,
        followup_types_list: JSON.stringify(types),
      };
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save follow-up settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleAddType = () => {
    if (!newTypeName.trim()) return;
    setTypes([...types, { name: newTypeName.trim(), icon: newTypeIcon.trim() || "📌" }]);
    setNewTypeName("");
    setNewTypeIcon("📌");
  };

  const handleRemoveType = (name: string) => {
    setTypes(types.filter((t) => t.name !== name));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading follow-up settings...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Follow-Up Settings"
        description="Configure follow-up channels, reminder rules, and SLA escalation triggers"
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
          <span>Follow-up configuration saved to database!</span>
        </div>
      )}

      <FormCard
        title="Follow-Up Types"
        description="Manage the communication channels available for scheduling follow-ups"
      >
        <div className="space-y-1.5 mb-4">
          {types.map((type) => (
            <div
              key={type.name}
              className="flex items-center justify-between py-2 px-3 bg-slate-50/50 hover:bg-slate-50 rounded-lg border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{type.icon}</span>
                <p className="text-xs font-semibold text-slate-800">{type.name}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveType(type.name)}
                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <input
            type="text"
            value={newTypeIcon}
            onChange={(e) => setNewTypeIcon(e.target.value)}
            placeholder="Emoji"
            className="w-16 px-3 py-1.5 text-xs text-center border border-slate-200 rounded-lg"
          />
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="e.g. Lunch Meeting"
            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
          />
          <button
            type="button"
            onClick={handleAddType}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
          >
            Add Type
          </button>
        </div>
      </FormCard>

      <FormCard
        title="Reminder & Escalation Rules"
        description="Automated notifications for upcoming and overdue interactions"
      >
        <Toggle
          label="Send reminder before follow-up"
          description="Notify the assigned user before a follow-up is due"
          checked={formData.followup_remind_before === "true"}
          onChange={(v) => setFormData((prev) => ({ ...prev, followup_remind_before: String(v) }))}
        />
        <div className="py-3 border-b border-slate-100">
          <FormField label="Default reminder time">
            <Select
              options={["15 minutes", "30 minutes", "1 hour", "2 hours", "1 day"]}
              value={formData.followup_remind_time}
              onChange={(v) => setFormData((prev) => ({ ...prev, followup_remind_time: v }))}
            />
          </FormField>
        </div>

        <Toggle
          label="Notify setter on overdue"
          description="Alert the user when a follow-up becomes overdue"
          checked={formData.followup_notify_overdue === "true"}
          onChange={(v) => setFormData((prev) => ({ ...prev, followup_notify_overdue: String(v) }))}
        />
        <div className="py-3 border-b border-slate-100">
          <FormField label="Overdue notification delay">
            <Select
              options={["1 hour", "2 hours", "4 hours", "1 day"]}
              value={formData.followup_overdue_delay}
              onChange={(v) => setFormData((prev) => ({ ...prev, followup_overdue_delay: v }))}
            />
          </FormField>
        </div>

        <Toggle
          label="Escalate to manager"
          description="Escalate overdue follow-ups to the team manager after SLA breach"
          checked={formData.followup_escalate_manager === "true"}
          onChange={(v) => setFormData((prev) => ({ ...prev, followup_escalate_manager: String(v) }))}
        />
        <div className="py-3">
          <FormField label="Escalate after">
            <Select
              options={["1 day", "2 days", "3 days", "1 week"]}
              value={formData.followup_escalate_after}
              onChange={(v) => setFormData((prev) => ({ ...prev, followup_escalate_after: v }))}
            />
          </FormField>
        </div>
      </FormCard>

      <SaveBar
        saving={saving}
        saved={saved}
        onSave={handleSave}
        onCancel={() => setFormData({ ...DEFAULT_SETTINGS })}
      />
    </div>
  );
}
