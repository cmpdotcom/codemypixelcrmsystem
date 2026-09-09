"use client";

import { useState } from "react";
import { Repeat, Scale, Hand } from "lucide-react";
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

const countries = [
  { name: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Germany", flag: "🇩🇪" },
];

export default function LeadAssignmentPage() {
  const [selectedMode, setSelectedMode] = useState("round-robin");
  const [geoEnabled, setGeoEnabled] = useState(false);

  return (
    <div>
      <SettingsPageHeader
        title="Lead Assignment"
        description="Configure how leads are distributed to setters"
      />

      <FormCard
        title="Assignment Mode"
        description="Choose how new leads are distributed to your setters."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-blue-500"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  {mode.title}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>
      </FormCard>

      <FormCard
        title="Assignment Rules"
        description="Set defaults and limits for lead assignment."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Default Setter" hint="Primary setter for new leads">
            <Select
              options={["Ali Khan", "Rahim Hasan", "Karim Ahmed"]}
              defaultValue="Ali Khan"
            />
          </FormField>
          <FormField
            label="Fallback Setter"
            hint="Used when the default setter is unavailable"
          >
            <Select
              options={["None", "Ali Khan", "Rahim Hasan", "Karim Ahmed"]}
              defaultValue="None"
            />
          </FormField>
          <FormField
            label="Max Leads per Setter"
            hint="Maximum active leads a setter can hold"
          >
            <Input defaultValue="50" />
          </FormField>
          <FormField
            label="Auto-assign Delay"
            hint="Wait time before a lead is auto-assigned"
          >
            <Select
              options={[
                "Immediate",
                "5 minutes",
                "15 minutes",
                "30 minutes",
                "1 hour",
              ]}
              defaultValue="Immediate"
            />
          </FormField>
        </div>
      </FormCard>

      <FormCard
        title="Geographic Assignment"
        description="Route leads to setters based on their location."
      >
        <div onClick={() => setGeoEnabled(!geoEnabled)} className="cursor-pointer">
          <Toggle
            label="Enable geographic assignment"
            description="Assign leads to setters based on the lead's country"
            defaultOn={geoEnabled}
          />
        </div>

        {geoEnabled && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700 mb-3">
              Country → Setter Mapping
            </p>
            <div className="space-y-3">
              {countries.map((country) => (
                <div
                  key={country.name}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-xs font-medium text-slate-700 w-32 shrink-0">
                    {country.name}
                  </span>
                  <div className="flex-1">
                    <Select
                      options={["None", "Ali Khan", "Rahim Hasan", "Karim Ahmed"]}
                      defaultValue="Ali Khan"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              + Add Country Mapping
            </button>
          </div>
        )}
      </FormCard>

      <SaveBar />
    </div>
  );
}
