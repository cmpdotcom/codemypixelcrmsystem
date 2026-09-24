"use client";

import React, { useState, useEffect } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { notifySettingsSaved } from "@/components/SettingsProvider";
import {
  FormCard,
  FormField,
  Input,
  Select,
  SaveBar,
} from "@/components/SettingsUI";
import { useUploadThing } from "@/lib/uploadthing";
import { DEFAULT_FAVICON, DEFAULT_LOGO } from "@/lib/brand";
import { Loader2, Upload, Trash2, CheckCircle2, Image as ImageIcon } from "lucide-react";

const INDUSTRIES = [
  "Software & Technology",
  "Manufacturing",
  "Healthcare",
  "Education",
  "Real Estate",
  "Finance",
  "E-commerce",
  "Construction",
  "Logistics",
  "Marketing",
  "Other",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

const COUNTRIES = [
  "Bangladesh",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "India",
  "Other",
];

const COLOR_SWATCHES = [
  { name: "blue", value: "#3b82f6" },
  { name: "indigo", value: "#6366f1" },
  { name: "purple", value: "#a855f7" },
  { name: "emerald", value: "#10b981" },
  { name: "rose", value: "#f43f5e" },
  { name: "amber", value: "#f59e0b" },
];

const DEFAULTS: Record<string, string> = {
  company_name: "CodeMyPixel Ltd.",
  company_legalName: "CodeMyPixel Technologies Limited",
  company_registrationNumber: "RJ-123456",
  company_taxNumber: "VAT-987654321",
  company_industry: "Software & Technology",
  company_size: "11-50",
  company_foundedYear: "2020",
  company_officialEmail: "info@codemypixel.com",
  company_supportEmail: "support@codemypixel.com",
  company_salesEmail: "sales@codemypixel.com",
  company_phone: "+880 1234 567890",
  company_website: "https://codemypixel.com",
  company_address: "123 Tech Avenue, Suite 400",
  company_city: "Dhaka",
  company_state: "Dhaka Division",
  company_postalCode: "1212",
  company_country: "Bangladesh",
  company_primaryColor: "blue",
  company_secondaryColor: "indigo",
  company_logoUrl: DEFAULT_LOGO,
  company_faviconUrl: DEFAULT_FAVICON,
  company_emailLogoUrl: DEFAULT_LOGO,
  company_loginLogoUrl: DEFAULT_LOGO,
  company_invoiceLogoUrl: DEFAULT_LOGO,
};

function ColorPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {COLOR_SWATCHES.map((swatch) => (
        <button
          key={swatch.name}
          type="button"
          onClick={() => onSelect(swatch.name)}
          className={`w-7 h-7 rounded-full transition-all cursor-pointer ${
            selected === swatch.name
              ? "ring-2 ring-offset-2 ring-slate-400 scale-110 shadow-sm"
              : "ring-0 hover:scale-110 opacity-80 hover:opacity-100"
          }`}
          style={{ backgroundColor: swatch.value }}
          aria-label={swatch.name}
        />
      ))}
    </div>
  );
}

function ImageUploader({
  label,
  value,
  onChange,
  aspect = "square",
  fallback,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  aspect?: "square" | "wide";
  fallback?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing("companyImage", {
    onClientUploadComplete: (res) => {
      setUploading(false);
      if (res && res[0]) {
        const fileUrl = (res[0] as { ufsUrl?: string; url?: string }).ufsUrl || res[0].url;
        onChange(fileUrl);
      }
    },
    onUploadError: (err) => {
      setUploading(false);
      setError(err.message || "Upload failed");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      await startUpload([file]);
    } catch {
      setUploading(false);
      setError("Failed to upload image");
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <div
          className={`relative rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs ${
            aspect === "wide" ? "w-28 h-16" : "w-16 h-16"
          }`}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : value || fallback ? (
            <>
              <img
                src={value || fallback}
                alt={label}
                className={`w-full h-full object-contain p-1 ${value ? "" : "opacity-90"}`}
              />
              {!value && (
                <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold bg-slate-800/70 text-white px-1 py-px rounded">
                  default
                </span>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="w-5 h-5" />
              <span className="text-[9px] font-semibold mt-0.5">{label}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200/90 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>{value ? "Change" : "Upload"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

export default function CompanyProfilePage() {
  const [formData, setFormData] = useState<Record<string, string>>({ ...DEFAULTS });
  const [initialFormData, setInitialFormData] = useState<Record<string, string>>({ ...DEFAULTS });
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
              if (typeof data[key] === "string" && data[key].trim()) merged[key] = data[key];
            }
            setInitialFormData(merged);
            return merged;
          });
        }
      } catch {
        /* fallback to defaults */
      } finally {
        setLoading(false);
      }
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
        body: JSON.stringify({
          ...formData,
          // Mirror shared fields into the general_* namespace used by General Settings
          companyName: formData.company_name,
          companyEmail: formData.company_officialEmail,
          companyPhone: formData.company_phone,
          companyWebsite: formData.company_website,
          industry: formData.company_industry,
          country: formData.company_country,
        }),
      });
      if (!res.ok) throw new Error("Failed to save company settings");
      setInitialFormData({ ...formData });
      notifySettingsSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...initialFormData });
    setSaved(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading company profile...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Company Profile"
        description="Configure your company information, branding, and assets"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Company profile updated successfully!</span>
        </div>
      )}

      {/* Form Section 1: Company Identity */}
      <FormCard
        title="Company Identity"
        description="Legal identity and basic company details"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Company Name">
            <Input
              placeholder="CodeMyPixel Ltd."
              value={formData.company_name}
              onChange={set("company_name")}
            />
          </FormField>

          <FormField label="Legal Name">
            <Input
              placeholder="CodeMyPixel Technologies Limited"
              value={formData.company_legalName}
              onChange={set("company_legalName")}
            />
          </FormField>

          <FormField label="Primary Company Logo" hint="Uploaded to UploadThing, 4MB max">
            <ImageUploader
              label="Logo"
              value={formData.company_logoUrl}
              onChange={set("company_logoUrl")}
              fallback={DEFAULT_LOGO}
            />
          </FormField>

          <FormField label="Favicon" hint="Small icon for browser tabs">
            <ImageUploader
              label="Favicon"
              value={formData.company_faviconUrl}
              onChange={set("company_faviconUrl")}
              fallback={DEFAULT_FAVICON}
            />
          </FormField>

          <FormField label="Registration Number">
            <Input
              placeholder="RJ-123456"
              value={formData.company_registrationNumber}
              onChange={set("company_registrationNumber")}
            />
          </FormField>

          <FormField label="Tax / VAT Number">
            <Input
              placeholder="VAT-987654321"
              value={formData.company_taxNumber}
              onChange={set("company_taxNumber")}
            />
          </FormField>

          <FormField label="Industry">
            <Select
              options={INDUSTRIES}
              value={formData.company_industry}
              onChange={set("company_industry")}
            />
          </FormField>

          <FormField label="Company Size">
            <Select
              options={COMPANY_SIZES}
              value={formData.company_size}
              onChange={set("company_size")}
            />
          </FormField>

          <FormField label="Founded Year">
            <Input
              placeholder="2020"
              value={formData.company_foundedYear}
              onChange={set("company_foundedYear")}
            />
          </FormField>
        </div>
      </FormCard>

      {/* Form Section 2: Contact Information */}
      <FormCard
        title="Contact Information"
        description="Email addresses, phone, and web presence"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Official Email">
            <Input
              type="email"
              placeholder="info@codemypixel.com"
              value={formData.company_officialEmail}
              onChange={set("company_officialEmail")}
            />
          </FormField>

          <FormField label="Support Email">
            <Input
              type="email"
              placeholder="support@codemypixel.com"
              value={formData.company_supportEmail}
              onChange={set("company_supportEmail")}
            />
          </FormField>

          <FormField label="Sales Email">
            <Input
              type="email"
              placeholder="sales@codemypixel.com"
              value={formData.company_salesEmail}
              onChange={set("company_salesEmail")}
            />
          </FormField>

          <FormField label="Phone">
            <Input
              placeholder="+880 1234 567890"
              value={formData.company_phone}
              onChange={set("company_phone")}
            />
          </FormField>

          <FormField label="Website">
            <Input
              placeholder="https://codemypixel.com"
              value={formData.company_website}
              onChange={set("company_website")}
            />
          </FormField>
        </div>
      </FormCard>

      {/* Form Section 3: Address */}
      <FormCard
        title="Address"
        description="Primary business headquarters location"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Street Address">
            <Input
              placeholder="123 Tech Avenue, Suite 400"
              value={formData.company_address}
              onChange={set("company_address")}
            />
          </FormField>

          <FormField label="City">
            <Input
              placeholder="Dhaka"
              value={formData.company_city}
              onChange={set("company_city")}
            />
          </FormField>

          <FormField label="State / Region">
            <Input
              placeholder="Dhaka Division"
              value={formData.company_state}
              onChange={set("company_state")}
            />
          </FormField>

          <FormField label="Postal Code">
            <Input
              placeholder="1212"
              value={formData.company_postalCode}
              onChange={set("company_postalCode")}
            />
          </FormField>

          <FormField label="Country">
            <Select
              options={COUNTRIES}
              value={formData.company_country}
              onChange={set("company_country")}
            />
          </FormField>
        </div>
      </FormCard>

      {/* Form Section 4: Branding */}
      <FormCard
        title="Branding & Visual Assets"
        description="Brand colors and logos used throughout your CRM application"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-4">
          <FormField label="Primary Theme Color">
            <ColorPicker
              selected={formData.company_primaryColor}
              onSelect={set("company_primaryColor")}
            />
          </FormField>

          <FormField label="Secondary Accent Color">
            <ColorPicker
              selected={formData.company_secondaryColor}
              onSelect={set("company_secondaryColor")}
            />
          </FormField>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">Header & Navigation Logo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Main brand logo used in sidebar and top navigation
              </p>
            </div>
            <ImageUploader
              label="Nav Logo"
              aspect="wide"
              value={formData.company_logoUrl}
              onChange={set("company_logoUrl")}
              fallback={DEFAULT_LOGO}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">Email Template Logo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Logo used in outgoing transactional and marketing emails
              </p>
            </div>
            <ImageUploader
              label="Email"
              aspect="wide"
              value={formData.company_emailLogoUrl}
              onChange={set("company_emailLogoUrl")}
              fallback={DEFAULT_LOGO}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">Login & Auth Page Logo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Prominently displayed on login, signup, and reset screens
              </p>
            </div>
            <ImageUploader
              label="Login"
              aspect="wide"
              value={formData.company_loginLogoUrl}
              onChange={set("company_loginLogoUrl")}
              fallback={DEFAULT_LOGO}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
            <div>
              <p className="text-xs font-semibold text-slate-800">Invoice & Receipt Logo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Printed on billing invoices, receipts, and PDF exports
              </p>
            </div>
            <ImageUploader
              label="Invoice"
              aspect="wide"
              value={formData.company_invoiceLogoUrl}
              onChange={set("company_invoiceLogoUrl")}
              fallback={DEFAULT_LOGO}
            />
          </div>
        </div>
      </FormCard>

      <SaveBar
        saving={saving}
        saved={saved}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
