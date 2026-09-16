"use client";

import React, { useState, useEffect } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Input,
  Select,
  SaveBar,
} from "@/components/SettingsUI";
import { Loader2 } from "lucide-react";

const INDUSTRIES = ["Software & Technology", "Manufacturing", "Healthcare", "Education", "Real Estate", "Finance", "E-commerce", "Construction", "Logistics", "Marketing", "Other"];
const COUNTRIES = ["Bangladesh", "USA", "UK", "Canada", "Australia", "India", "Other"];
const TIMEZONES = ["Asia/Dhaka", "America/New_York", "Europe/London", "America/Los_Angeles", "Asia/Kolkata", "Asia/Dubai"];
const CURRENCIES = ["BDT (৳)", "USD ($)", "EUR (€)", "GBP (£)", "INR (₹)", "AUD (A$)"];
const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
const TIME_FORMATS = ["12-hour", "24-hour"];
const LANGUAGES = ["English", "Bengali", "Hindi", "Arabic", "Spanish"];
const LANDING_PAGES = ["Dashboard", "Leads", "Deals", "Activities", "Clients"];
const LEAD_VIEWS = ["Kanban", "List", "Table"];
const DEAL_VIEWS = ["Kanban", "List", "Table"];
const PAGE_SIZES = ["10", "25", "50", "100"];

const DEFAULTS: Record<string, string> = {
  companyName: "AmarSolution Ltd.",
  companyEmail: "info@amarsolution.com",
  companyPhone: "+880 1234 567890",
  companyWebsite: "https://amarsolution.com",
  industry: "Software & Technology",
  country: "Bangladesh",
  timezone: "Asia/Dhaka",
  currency: "BDT (৳)",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12-hour",
  language: "English",
  landingPage: "Dashboard",
  leadView: "List",
  dealView: "Kanban",
  pageSize: "10",
};

export default function GeneralSettingsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({ ...DEFAULTS });
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
            for (const key of Object.keys(DEFAULTS)) {
              if (data[key] !== undefined) merged[key] = data[key];
            }
            return merged;
          });
        }
      } catch { /* use defaults */ }
      setLoading(false);
    };
    load();
  }, []);

  const set = (key: string) => (v: string) => {
    setFormData((prev) => ({ ...prev, [key]: v }));
    setSaved(false);
  };

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
      if (!res.ok) throw new Error("Failed to save settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...DEFAULTS });
    setSaved(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading settings...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="General Settings"
        description="Configure basic CRM behavior and preferences"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-5">
          {error}
        </div>
      )}

      <FormCard
        title="Company Basics"
        description="Core information about your organization"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Company Name">
            <Input placeholder="AmarSolution Ltd." value={formData.companyName} onChange={set("companyName")} />
          </FormField>
          <FormField label="Company Email">
            <Input type="email" placeholder="info@amarsolution.com" value={formData.companyEmail} onChange={set("companyEmail")} />
          </FormField>
          <FormField label="Company Phone">
            <Input placeholder="+880 1234 567890" value={formData.companyPhone} onChange={set("companyPhone")} />
          </FormField>
          <FormField label="Website">
            <Input placeholder="https://amarsolution.com" value={formData.companyWebsite} onChange={set("companyWebsite")} />
          </FormField>
          <FormField label="Industry">
            <Select options={INDUSTRIES} value={formData.industry} onChange={set("industry")} />
          </FormField>
          <FormField label="Country">
            <Select options={COUNTRIES} value={formData.country} onChange={set("country")} />
          </FormField>
          <FormField label="Timezone">
            <Select options={TIMEZONES} value={formData.timezone} onChange={set("timezone")} />
          </FormField>
          <FormField label="Currency">
            <Select options={CURRENCIES} value={formData.currency} onChange={set("currency")} />
          </FormField>
          <FormField label="Date Format">
            <Select options={DATE_FORMATS} value={formData.dateFormat} onChange={set("dateFormat")} />
          </FormField>
          <FormField label="Time Format">
            <Select options={TIME_FORMATS} value={formData.timeFormat} onChange={set("timeFormat")} />
          </FormField>
          <FormField label="Language">
            <Select options={LANGUAGES} value={formData.language} onChange={set("language")} />
          </FormField>
        </div>
      </FormCard>

      <FormCard
        title="CRM Preferences"
        description="Default views and pagination across the CRM"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Default Landing Page">
            <Select options={LANDING_PAGES} value={formData.landingPage} onChange={set("landingPage")} />
          </FormField>
          <FormField label="Default Lead View">
            <Select options={LEAD_VIEWS} value={formData.leadView} onChange={set("leadView")} />
          </FormField>
          <FormField label="Default Deal View">
            <Select options={DEAL_VIEWS} value={formData.dealView} onChange={set("dealView")} />
          </FormField>
          <FormField label="Default Pagination">
            <Select options={PAGE_SIZES} value={formData.pageSize} onChange={set("pageSize")} />
          </FormField>
        </div>
      </FormCard>

      <SaveBar saving={saving} saved={saved} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
