"use client";

import { useState } from "react";
import {
  Plus,
  X,
  GripVertical,
  Pencil,
} from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, Input, SaveBar } from "@/components/SettingsUI";

const defaultClientTypes = [
  "Individual",
  "Small Business",
  "Mid-Market",
  "Enterprise",
  "Government",
  "Non-Profit",
];

const clientStatuses = [
  { label: "Prospect", color: "bg-slate-400" },
  { label: "Active", color: "bg-emerald-500" },
  { label: "Inactive", color: "bg-amber-500" },
  { label: "VIP", color: "bg-purple-500" },
  { label: "At Risk", color: "bg-rose-500" },
  { label: "Churned", color: "bg-red-500" },
];

const defaultIndustries = [
  "Technology",
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

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

export default function ClientSettingsPage() {
  const [clientTypes, setClientTypes] = useState(defaultClientTypes);
  const [industries, setIndustries] = useState(defaultIndustries);
  const [newType, setNewType] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  const addType = () => {
    if (newType.trim() && !clientTypes.includes(newType.trim())) {
      setClientTypes([...clientTypes, newType.trim()]);
      setNewType("");
    }
  };

  const removeType = (type: string) => {
    setClientTypes(clientTypes.filter((t) => t !== type));
  };

  const addIndustry = () => {
    if (newIndustry.trim() && !industries.includes(newIndustry.trim())) {
      setIndustries([...industries, newIndustry.trim()]);
      setNewIndustry("");
    }
  };

  const removeIndustry = (industry: string) => {
    setIndustries(industries.filter((i) => i !== industry));
  };

  return (
    <div>
      <SettingsPageHeader
        title="Client Settings"
        description="Configure client types, statuses, and industries"
      />

      {/* Client Types */}
      <FormCard
        title="Client Types"
        description="Define the types of clients you work with"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {clientTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              {type}
              <button
                onClick={() => removeType(type)}
                className="ml-0.5 w-4 h-4 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a client type..."
            defaultValue={newType}
          />
          <button
            onClick={addType}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Type
          </button>
        </div>
      </FormCard>

      {/* Client Statuses */}
      <FormCard
        title="Client Statuses"
        description="Manage the statuses used to track client relationships"
      >
        <div className="space-y-1">
          {clientStatuses.map((status) => (
            <div
              key={status.label}
              className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 cursor-grab" />
                <span
                  className={`w-2.5 h-2.5 rounded-full ${status.color}`}
                />
                <span className="text-xs font-semibold text-slate-700">
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-dashed border-slate-300 hover:border-blue-400 rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Status
        </button>
      </FormCard>

      {/* Industries */}
      <FormCard
        title="Industries"
        description="Industries you serve — used when creating or filtering clients"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {industries.map((industry) => (
            <span
              key={industry}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              {industry}
              <button
                onClick={() => removeIndustry(industry)}
                className="ml-0.5 w-4 h-4 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add an industry..."
            defaultValue={newIndustry}
          />
          <button
            onClick={addIndustry}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Industry
          </button>
        </div>
      </FormCard>

      {/* Company Sizes */}
      <FormCard
        title="Company Sizes"
        description="Employee count ranges used to segment clients"
      >
        <div className="flex flex-wrap gap-2">
          {companySizes.map((size) => (
            <span
              key={size}
              className="inline-flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              {size}
            </span>
          ))}
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
