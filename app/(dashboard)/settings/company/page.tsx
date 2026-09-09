"use client";

import { useState } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Input,
  Select,
  SaveBar,
} from "@/components/SettingsUI";

const COLOR_SWATCHES = [
  { name: "blue", value: "#3b82f6" },
  { name: "indigo", value: "#6366f1" },
  { name: "purple", value: "#a855f7" },
  { name: "emerald", value: "#10b981" },
  { name: "rose", value: "#f43f5e" },
  { name: "amber", value: "#f59e0b" },
];

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
          className={`w-7 h-7 rounded-full transition-all ${
            selected === swatch.name
              ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
              : "ring-0 hover:scale-110"
          }`}
          style={{ backgroundColor: swatch.value }}
          aria-label={swatch.name}
        />
      ))}
    </div>
  );
}

function LogoUploadBox({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] font-semibold text-slate-400">
        {label}
      </div>
      <button
        type="button"
        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        Upload
      </button>
    </div>
  );
}

export default function CompanyProfilePage() {
  const [primaryColor, setPrimaryColor] = useState("blue");
  const [secondaryColor, setSecondaryColor] = useState("indigo");

  return (
    <div>
      <SettingsPageHeader
        title="Company Profile"
        description="Configure your company information and branding"
      />

      <FormCard
        title="Company Identity"
        description="Legal identity and basic company details"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Company Name">
            <Input placeholder="AmarSolution Ltd." />
          </FormField>
          <FormField label="Legal Name">
            <Input placeholder="AmarSolution Limited" />
          </FormField>
          <FormField label="Company Logo">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] font-semibold text-slate-400">
                [Logo]
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Change Logo
              </button>
            </div>
          </FormField>
          <FormField label="Favicon">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] font-semibold text-slate-400">
                [Favicon]
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Change Favicon
              </button>
            </div>
          </FormField>
          <FormField label="Registration Number">
            <Input placeholder="RJ-123456" />
          </FormField>
          <FormField label="Tax/VAT Number">
            <Input placeholder="VAT-987654321" />
          </FormField>
          <FormField label="Industry">
            <Select
              options={[
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
              ]}
            />
          </FormField>
          <FormField label="Company Size">
            <Select options={["1-10", "11-50", "51-200", "201-500", "500+"]} />
          </FormField>
          <FormField label="Founded Year">
            <Input placeholder="2015" />
          </FormField>
        </div>
      </FormCard>

      <FormCard
        title="Contact Information"
        description="Email addresses and phone for different teams"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Official Email">
            <Input type="email" placeholder="info@amarsolution.com" />
          </FormField>
          <FormField label="Support Email">
            <Input type="email" placeholder="support@amarsolution.com" />
          </FormField>
          <FormField label="Sales Email">
            <Input type="email" placeholder="sales@amarsolution.com" />
          </FormField>
          <FormField label="Phone">
            <Input placeholder="+880 1234 567890" />
          </FormField>
          <FormField label="Website">
            <Input placeholder="https://amarsolution.com" />
          </FormField>
        </div>
      </FormCard>

      <FormCard
        title="Address"
        description="Primary business location"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Address">
            <Input placeholder="123 Main Street, Suite 100" />
          </FormField>
          <FormField label="City">
            <Input placeholder="Dhaka" />
          </FormField>
          <FormField label="State/Region">
            <Input placeholder="Dhaka Division" />
          </FormField>
          <FormField label="Postal Code">
            <Input placeholder="1000" />
          </FormField>
          <FormField label="Country">
            <Select
              options={[
                "Bangladesh",
                "USA",
                "UK",
                "Canada",
                "Australia",
                "India",
                "Other",
              ]}
            />
          </FormField>
        </div>
      </FormCard>

      <FormCard
        title="Branding"
        description="Colors and logos used across your CRM"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Primary Color">
            <ColorPicker
              selected={primaryColor}
              onSelect={setPrimaryColor}
            />
          </FormField>
          <FormField label="Secondary Color">
            <ColorPicker
              selected={secondaryColor}
              onSelect={setSecondaryColor}
            />
          </FormField>
        </div>

        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">Logo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Main brand logo used in the header
              </p>
            </div>
            <LogoUploadBox label="Logo" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">Email Logo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Logo used in transactional emails
              </p>
            </div>
            <LogoUploadBox label="Email" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Login Page Logo
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Logo shown on the login screen
              </p>
            </div>
            <LogoUploadBox label="Login" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Invoice Logo
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Logo printed on invoices and receipts
              </p>
            </div>
            <LogoUploadBox label="Invoice" />
          </div>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
