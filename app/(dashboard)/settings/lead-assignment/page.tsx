"use client";

import React, { useState, useEffect } from "react";
import { Repeat, Scale, Hand, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Input,
  Select,
  Toggle,
  SaveBar,
} from "@/components/SettingsUI";

interface AssignmentMode {
  id: string;
  title: string;
  description: string;
  icon: typeof Repeat;
}

const modes: AssignmentMode[] = [
  {
    id: "round-robin",
    title: "Round Robin",
    description: "Distribute leads equally in rotation among setters",
    icon: Repeat,
  },
  {
    id: "load-based",
    title: "Load Based",
    description: "Assign to the setter with the fewest active leads",
    icon: Scale,
  },
  {
    id: "manual",
    title: "Manual Assignment",
    description: "Manager chooses the setter for each lead",
    icon: Hand,
  },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  lead_assign_mode: "round-robin",
  lead_default_setter: "Ali Khan",
  lead_fallback_setter: "None",
  lead_max_per_setter: "50",
  lead_auto_delay: "Immediate",
  lead_geo_enabled: "false",
};

export default function LeadAssignmentPage() {
  const [formData, setFormData] = useState<Record<string, string>>({ ...DEFAULT_SETTINGS });
  const [setters, setSetters] = useState<string[]>(["Ali Khan", "Sara Ahmed", "Fatima Noor", "Usman Tariq"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [settingsRes, usersRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/users"),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setFormData((prev) => {
            const merged = { ...prev };
            for (const k of Object.keys(DEFAULT_SETTINGS)) {
              if (data[k] !== undefined) merged[k] = data[k];
            }
            return merged;
          });
        }

        if (usersRes.ok) {
          const users = await usersRes.json();
          if (Array.isArray(users) && users.length > 0) {
            setSetters(users.map((u: { name: string }) => u.name));
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
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save assignment rules");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const selectedMode = formData.lead_assign_mode;
  const isGeo = formData.lead_geo_enabled === "true";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading assignment rules...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Lead Assignment"
        description="Configure automated lead routing and setter distribution rules"
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
          <span>Assignment configuration saved to database!</span>
        </div>
      )}

      <FormCard
        title="Assignment Mode"
        description="Choose how incoming leads are distributed to your team"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, lead_assign_mode: mode.id }))}
                className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? "border-blue-500" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{mode.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{mode.description}</p>
              </button>
            );
          })}
        </div>
      </FormCard>

      <FormCard
        title="Assignment Rules"
        description="Configure default setter, fallback setter, and threshold limits"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Default Setter" hint="Primary assignee for newly created leads">
            <Select
              options={setters}
              value={formData.lead_default_setter}
              onChange={(v) => setFormData((prev) => ({ ...prev, lead_default_setter: v }))}
            />
          </FormField>

          <FormField label="Fallback Setter" hint="Used if primary assignee reaches cap">
            <Select
              options={["None", ...setters]}
              value={formData.lead_fallback_setter}
              onChange={(v) => setFormData((prev) => ({ ...prev, lead_fallback_setter: v }))}
            />
          </FormField>

          <FormField label="Max Active Leads per Setter" hint="Workload cap before rerouting">
            <Input
              value={formData.lead_max_per_setter}
              onChange={(v) => setFormData((prev) => ({ ...prev, lead_max_per_setter: v }))}
              placeholder="50"
            />
          </FormField>

          <FormField label="Auto-assign Delay" hint="Wait time before rule triggers">
            <Select
              options={["Immediate", "5 minutes", "15 minutes", "30 minutes", "1 hour"]}
              value={formData.lead_auto_delay}
              onChange={(v) => setFormData((prev) => ({ ...prev, lead_auto_delay: v }))}
            />
          </FormField>
        </div>
      </FormCard>

      <FormCard
        title="Geographic Routing"
        description="Direct leads to dedicated territory setters by location"
      >
        <Toggle
          label="Enable geographic routing"
          description="Route incoming leads according to country of origin"
          checked={isGeo}
          onChange={(checked) =>
            setFormData((prev) => ({ ...prev, lead_geo_enabled: String(checked) }))
          }
        />
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
