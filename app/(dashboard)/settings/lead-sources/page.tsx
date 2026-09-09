"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { Badge } from "@/components/SettingsUI";

interface LeadSource {
  name: string;
  description: string;
  active: boolean;
  count: number;
}

const initialSources: LeadSource[] = [
  { name: "Facebook", description: "Social media leads from Facebook ads", active: true, count: 142 },
  { name: "Instagram", description: "Leads from Instagram campaigns", active: true, count: 87 },
  { name: "Google", description: "Google Ads and search leads", active: true, count: 203 },
  { name: "Website", description: "Direct website form submissions", active: true, count: 64 },
  { name: "WhatsApp", description: "Leads from WhatsApp Business", active: true, count: 51 },
  { name: "LinkedIn", description: "Professional leads from LinkedIn", active: false, count: 29 },
  { name: "Referral", description: "Word of mouth referrals", active: true, count: 38 },
  { name: "Cold Call", description: "Outbound cold calls", active: true, count: 76 },
  { name: "Email", description: "Email campaign responses", active: true, count: 44 },
  { name: "Advertisement", description: "Other advertising channels", active: false, count: 19 },
  { name: "Other", description: "Miscellaneous sources", active: true, count: 12 },
];

export default function LeadSourcesPage() {
  const [sources, setSources] = useState<LeadSource[]>(initialSources);

  const toggleSource = (name: string) => {
    setSources(
      sources.map((s) =>
        s.name === name ? { ...s, active: !s.active } : s
      )
    );
  };

  return (
    <div>
      <SettingsPageHeader
        title="Lead Sources"
        description="Configure where your leads come from"
      />

      <div className="flex justify-end mb-5">
        <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <div
            key={source.name}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-900">{source.name}</h4>
              <Badge label={`${source.count} leads`} color="slate" />
            </div>
            <p className="text-xs text-slate-500 mb-4 flex-1">
              {source.description}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span
                className={`text-[10px] font-semibold ${
                  source.active ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {source.active ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => toggleSource(source.name)}
                className={`relative rounded-full transition-colors shrink-0 ${
                  source.active ? "bg-blue-600" : "bg-slate-200"
                }`}
                style={{ height: "22px", width: "40px" }}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                    source.active ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
