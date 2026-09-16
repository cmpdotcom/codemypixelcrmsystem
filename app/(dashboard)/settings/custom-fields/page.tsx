"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, FormField, Badge, Toggle } from "@/components/SettingsUI";

interface CustomField {
  id: string;
  name: string;
  module: "Lead" | "Deal" | "Client" | "Project" | "Task";
  type: string;
  required: boolean;
  options?: string;
}

const MODULE_OPTIONS: CustomField["module"][] = ["Lead", "Deal", "Client", "Project", "Task"];
const TYPE_OPTIONS = [
  "Text",
  "Number",
  "Currency",
  "Date",
  "Date & Time",
  "Dropdown",
  "Multi-select",
  "Checkbox",
  "Radio",
  "URL",
  "Email",
  "Phone",
  "Long Text",
  "File",
];

const MODULE_BADGE_COLORS: Record<string, "blue" | "green" | "purple" | "amber" | "rose"> = {
  Lead: "blue",
  Deal: "green",
  Client: "purple",
  Project: "amber",
  Task: "rose",
};

export default function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New field state
  const [newName, setNewName] = useState("");
  const [newModule, setNewModule] = useState<CustomField["module"]>("Lead");
  const [newType, setNewType] = useState("Text");
  const [newRequired, setNewRequired] = useState(false);
  const [newOptions, setNewOptions] = useState("");

  const fetchFields = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/custom-fields");
      if (!res.ok) throw new Error("Failed to load custom fields");
      const data = await res.json();
      setFields(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const saveFieldsToDb = async (updated: CustomField[]) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/custom-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setFields(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this custom field?")) return;
    const next = fields.filter((f) => f.id !== id);
    saveFieldsToDb(next);
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const id = `cf-${Date.now()}`;
    const next: CustomField[] = [
      ...fields,
      {
        id,
        name: newName.trim(),
        module: newModule,
        type: newType,
        required: newRequired,
        options: newOptions.trim(),
      },
    ];

    saveFieldsToDb(next);
    setNewName("");
    setNewOptions("");
    setNewRequired(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading custom fields...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Custom Fields"
        description="Extend CRM records with custom data attributes, required validations, and select options"
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
          <span>Custom fields saved to database!</span>
        </div>
      )}

      {/* Existing Fields Table */}
      <FormCard
        title="Configured Custom Fields"
        description="Attributes currently active across leads, deals, clients, projects, and tasks"
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50">
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-6 py-2.5">
                  Field Name
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-3 py-2.5">
                  Module
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-3 py-2.5">
                  Type
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-3 py-2.5">
                  Required
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-3 py-2.5">
                  Options
                </th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-6 py-2.5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-slate-400">
                    No custom fields configured yet. Add your first field below.
                  </td>
                </tr>
              ) : (
                fields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-xs font-semibold text-slate-800">
                      {field.name}
                    </td>
                    <td className="px-3 py-3">
                      <Badge label={field.module} color={MODULE_BADGE_COLORS[field.module] || "blue"} />
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 font-medium">
                      {field.type}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">
                      {field.required ? (
                        <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">Required</span>
                      ) : (
                        <span className="text-slate-400">Optional</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500 max-w-xs truncate">
                      {field.options || "—"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(field.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                        title="Delete custom field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </FormCard>

      {/* Add New Field */}
      <FormCard
        title="Add New Custom Field"
        description="Define a new attribute with validation constraints"
      >
        <form onSubmit={handleAddField} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Field Name *">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Preferred Language"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </FormField>

            <FormField label="Target CRM Module">
              <select
                value={newModule}
                onChange={(e) => setNewModule(e.target.value as CustomField["module"])}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
              >
                {MODULE_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Field Type">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Options List"
              hint="Comma-separated for Dropdown, Multi-select, or Radio types"
            >
              <input
                type="text"
                value={newOptions}
                onChange={(e) => setNewOptions(e.target.value)}
                placeholder="Option 1, Option 2, Option 3"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </FormField>
          </div>

          <div className="pt-2">
            <Toggle
              label="Required Field"
              description="Make this field mandatory when creating or modifying records"
              checked={newRequired}
              onChange={(checked) => setNewRequired(checked)}
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Create Custom Field
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
