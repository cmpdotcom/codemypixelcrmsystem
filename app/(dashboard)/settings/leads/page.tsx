"use client";

import { useState } from "react";
import { GripVertical, Plus, X } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Badge,
  SaveBar,
} from "@/components/SettingsUI";

interface LeadStatus {
  name: string;
  color: string;
  count: number;
}

const dotColors: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  cyan: "bg-cyan-500",
  green: "bg-emerald-500",
  indigo: "bg-indigo-500",
  teal: "bg-teal-500",
  slate: "bg-slate-500",
  rose: "bg-rose-500",
  red: "bg-red-500",
};

const initialStatuses: LeadStatus[] = [
  { name: "New", color: "blue", count: 124 },
  { name: "Assigned", color: "purple", count: 38 },
  { name: "Contacting", color: "amber", count: 22 },
  { name: "Connected", color: "cyan", count: 15 },
  { name: "Qualified", color: "green", count: 9 },
  { name: "Meeting Booked", color: "indigo", count: 6 },
  { name: "Handoff", color: "teal", count: 4 },
  { name: "Nurture", color: "slate", count: 18 },
  { name: "Not Interested", color: "rose", count: 11 },
  { name: "Lost", color: "red", count: 7 },
  { name: "Invalid", color: "slate", count: 3 },
];

const initialIndustries = [
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

export default function LeadSettingsPage() {
  const [statuses] = useState<LeadStatus[]>(initialStatuses);
  const [industries, setIndustries] = useState<string[]>(initialIndustries);
  const [newIndustry, setNewIndustry] = useState("");

  const addIndustry = () => {
    const trimmed = newIndustry.trim();
    if (trimmed && !industries.includes(trimmed)) {
      setIndustries([...industries, trimmed]);
      setNewIndustry("");
    }
  };

  const removeIndustry = (industry: string) => {
    setIndustries(industries.filter((i) => i !== industry));
  };

  return (
    <div>
      <SettingsPageHeader
        title="Lead Settings"
        description="Configure lead statuses and behavior"
      />

      <FormCard
        title="Lead Statuses"
        description="Drag to reorder. These statuses track leads through your pipeline."
      >
        <div className="space-y-1">
          {statuses.map((status) => (
            <div
              key={status.name}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColors[status.color]}`}
              />
              <span className="text-xs font-semibold text-slate-800 flex-1">
                {status.name}
              </span>
              <Badge label={`${status.count} leads`} color="slate" />
            </div>
          ))}
        </div>

        <button className="mt-4 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Status
        </button>
      </FormCard>

      <FormCard
        title="Lead Industries"
        description="Tag leads by industry for better segmentation and reporting."
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {industries.map((industry) => (
            <span
              key={industry}
              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-700 transition-colors"
            >
              {industry}
              <button
                onClick={() => removeIndustry(industry)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-slate-300 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <FormField label="Add Industry">
          <div className="flex gap-2">
            <input
              type="text"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIndustry()}
              placeholder="Enter industry name"
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            <button
              onClick={addIndustry}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </FormField>
      </FormCard>

      <SaveBar />
    </div>
  );
}
