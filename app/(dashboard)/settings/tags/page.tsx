"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Input,
  Select,
  SaveBar,
} from "@/components/SettingsUI";

const colorMap: Record<string, string> = {
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-emerald-100 text-emerald-700",
  teal: "bg-teal-100 text-teal-700",
  cyan: "bg-cyan-100 text-cyan-700",
  blue: "bg-blue-100 text-blue-700",
  indigo: "bg-indigo-100 text-indigo-700",
  purple: "bg-purple-100 text-purple-700",
  rose: "bg-rose-100 text-rose-700",
  slate: "bg-slate-100 text-slate-700",
};

const applicableOptions = ["Leads", "Deals", "Clients", "Projects", "Tasks"];

export default function TagsSettingsPage() {
  const [tags, setTags] = useState([
    { name: "Hot Lead", color: "red", count: 24 },
    { name: "Enterprise", color: "purple", count: 36 },
    { name: "VIP", color: "amber", count: 25 },
    { name: "High Budget", color: "green", count: 18 },
    { name: "Urgent", color: "rose", count: 31 },
    { name: "International", color: "blue", count: 12 },
    { name: "Returning Client", color: "teal", count: 9 },
    { name: "Potential", color: "indigo", count: 21 },
    { name: "At Risk", color: "orange", count: 7 },
    { name: "Newsletter", color: "slate", count: 14 },
    { name: "Cold", color: "cyan", count: 6 },
    { name: "Referral", color: "green", count: 11 },
  ]);
  const [selected, setSelected] = useState<string[]>([...applicableOptions]);

  const removeTag = (name: string) => {
    setTags(tags.filter((t) => t.name !== name));
  };

  const toggleApplicable = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const usageRows = [
    { tag: "Hot Lead", color: "red", leads: 24, deals: 12, clients: 5, projects: 0 },
    { tag: "Enterprise", color: "purple", leads: 8, deals: 15, clients: 10, projects: 3 },
    { tag: "VIP", color: "amber", leads: 5, deals: 8, clients: 12, projects: 0 },
    { tag: "Urgent", color: "rose", leads: 15, deals: 6, clients: 2, projects: 8 },
  ];

  return (
    <div>
      <SettingsPageHeader
        title="Tags"
        description="Manage global tags for leads, deals, clients, and projects"
      />

      <div className="flex justify-end mb-4">
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Tag
        </button>
      </div>

      <FormCard title="All Tags" description="Tag cloud of all global tags currently in use">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.name}
              className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-semibold ${colorMap[tag.color]}`}
            >
              {tag.name}
              <span className="text-[10px] opacity-70 font-medium">×{tag.count}</span>
              <button
                onClick={() => removeTag(tag.name)}
                className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                aria-label={`Remove ${tag.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </FormCard>

      <FormCard title="Add New Tag" description="Create a new global tag and choose where it applies">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Tag Name">
            <Input placeholder="Enter tag name" />
          </FormField>
          <FormField label="Color">
            <Select
              options={[
                "Red",
                "Orange",
                "Amber",
                "Green",
                "Teal",
                "Cyan",
                "Blue",
                "Indigo",
                "Purple",
                "Rose",
                "Slate",
              ]}
              defaultValue="Blue"
            />
          </FormField>
        </div>
        <FormField label="Applicable to" hint="Select where this tag can be applied">
          <div className="flex flex-wrap gap-2">
            {applicableOptions.map((opt) => {
              const active = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleApplicable(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </FormField>
        <FormField label="Description">
          <Input placeholder="Optional description" />
        </FormField>
      </FormCard>

      <FormCard title="Tag Usage" description="Breakdown of how each tag is used across modules">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="pb-2 pr-4 font-semibold">Tag</th>
                <th className="pb-2 px-3 font-semibold text-center">Leads</th>
                <th className="pb-2 px-3 font-semibold text-center">Deals</th>
                <th className="pb-2 px-3 font-semibold text-center">Clients</th>
                <th className="pb-2 px-3 font-semibold text-center">Projects</th>
                <th className="pb-2 pl-3 font-semibold text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {usageRows.map((row) => {
                const total = row.leads + row.deals + row.clients + row.projects;
                return (
                  <tr
                    key={row.tag}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${colorMap[row.color]}`}
                      >
                        {row.tag}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-700">{row.leads}</td>
                    <td className="py-2.5 px-3 text-center text-slate-700">{row.deals}</td>
                    <td className="py-2.5 px-3 text-center text-slate-700">{row.clients}</td>
                    <td className="py-2.5 px-3 text-center text-slate-700">{row.projects}</td>
                    <td className="py-2.5 pl-3 text-center font-semibold text-slate-900">
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
