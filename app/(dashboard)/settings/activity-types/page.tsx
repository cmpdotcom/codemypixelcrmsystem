"use client";

import { useState } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Input,
  Select,
  Toggle,
  SaveBar,
  Badge,
} from "@/components/SettingsUI";

interface ActivityType {
  id: string;
  name: string;
  icon: string;
  color: string;
  requirements: string[];
  active: boolean;
}

const initialActivityTypes: ActivityType[] = [
  {
    id: "call",
    name: "Call",
    icon: "📞",
    color: "green",
    requirements: ["Date", "Description"],
    active: true,
  },
  {
    id: "email",
    name: "Email",
    icon: "✉️",
    color: "blue",
    requirements: ["Date", "Description"],
    active: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💬",
    color: "green",
    requirements: ["Date"],
    active: true,
  },
  {
    id: "meeting",
    name: "Meeting",
    icon: "🗓️",
    color: "purple",
    requirements: ["Date", "Time", "Description"],
    active: true,
  },
  {
    id: "note",
    name: "Note",
    icon: "📝",
    color: "amber",
    requirements: ["Description"],
    active: true,
  },
  {
    id: "sms",
    name: "SMS",
    icon: "📱",
    color: "cyan",
    requirements: ["Date"],
    active: true,
  },
  {
    id: "demo",
    name: "Demo",
    icon: "🎯",
    color: "indigo",
    requirements: ["Date", "Time", "Related Lead"],
    active: true,
  },
  {
    id: "task",
    name: "Task",
    icon: "✅",
    color: "rose",
    requirements: ["Date", "Description"],
    active: true,
  },
  {
    id: "site-visit",
    name: "Site Visit",
    icon: "🏗️",
    color: "teal",
    requirements: ["Date", "Related Client"],
    active: true,
  },
  {
    id: "video-call",
    name: "Video Call",
    icon: "🎥",
    color: "slate",
    requirements: ["Date", "Time", "Description"],
    active: true,
  },
];

const colorClasses: Record<string, string> = {
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  cyan: "bg-cyan-500",
  indigo: "bg-indigo-500",
  rose: "bg-rose-500",
  teal: "bg-teal-500",
  slate: "bg-slate-500",
};

const requirementColors: Record<string, "slate" | "blue"> = {
  Date: "blue",
  Time: "slate",
  Description: "slate",
  "Related Lead": "slate",
  "Related Client": "slate",
};

export default function ActivityTypesPage() {
  const [activityTypes, setActivityTypes] = useState(initialActivityTypes);

  const toggleActive = (id: string) => {
    setActivityTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  return (
    <div>
      <SettingsPageHeader
        title="Activity Types"
        description="Configure activity types for your CRM"
      />

      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-slate-500">
          {activityTypes.length} activity types configured
        </p>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors">
          <span className="text-sm leading-none">+</span> Add Activity Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {activityTypes.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    colorClasses[type.color]
                  }`}
                >
                  <span>{type.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {type.name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {type.color}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleActive(type.id)}
                className={`relative rounded-full transition-colors shrink-0 ${
                  type.active ? "bg-blue-600" : "bg-slate-200"
                }`}
                style={{ height: "22px", width: "40px" }}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                    type.active ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                Requirements
              </p>
              <div className="flex flex-wrap gap-1.5">
                {type.requirements.map((req) => (
                  <Badge
                    key={req}
                    label={req}
                    color={requirementColors[req] || "slate"}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <span
                className={`text-[10px] font-semibold ${
                  type.active ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {type.active ? "Active" : "Inactive"}
              </span>
              <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <FormCard title="Add New Activity Type" description="Create a custom activity type">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Activity Name">
            <Input placeholder="e.g. Follow-up Call" />
          </FormField>
          <FormField label="Icon (emoji)">
            <Input placeholder="e.g. 📞" />
          </FormField>
          <FormField label="Color" hint="Used for the activity icon background">
            <Select
              options={[
                "green",
                "blue",
                "purple",
                "amber",
                "cyan",
                "indigo",
                "rose",
                "teal",
                "slate",
              ]}
              defaultValue="blue"
            />
          </FormField>
          <FormField label="Default Requirements" hint="Fields required when logging this activity">
            <Select
              options={["Date", "Time", "Description", "Related Lead", "Related Client"]}
              defaultValue="Date"
            />
          </FormField>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
