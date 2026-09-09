"use client";

import { Plus, Pencil, ChevronRight } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, SaveBar } from "@/components/SettingsUI";

const projectStatuses = [
  { label: "Not Started", color: "bg-slate-400" },
  { label: "Planning", color: "bg-blue-500" },
  { label: "Requirements", color: "bg-indigo-500" },
  { label: "Design", color: "bg-violet-500" },
  { label: "Development", color: "bg-sky-500" },
  { label: "Internal QA", color: "bg-cyan-500" },
  { label: "Client QA", color: "bg-teal-500" },
  { label: "Revision", color: "bg-amber-500" },
  { label: "Deployment", color: "bg-emerald-500" },
  { label: "Completed", color: "bg-green-600" },
  { label: "On Hold", color: "bg-orange-500" },
  { label: "Cancelled", color: "bg-red-500" },
];

const projectTemplates = [
  {
    name: "Website Project",
    stages: [
      "Requirements",
      "UI/UX",
      "Frontend",
      "Backend",
      "CMS",
      "Testing",
      "Client Review",
      "Deployment",
    ],
  },
  {
    name: "ERP Project",
    stages: [
      "Requirement Analysis",
      "Database",
      "UI/UX",
      "HR Module",
      "CRM Module",
      "Accounting",
      "Inventory",
      "Reports",
      "QA",
      "UAT",
      "Deployment",
      "Training",
    ],
  },
];

export default function ProjectSettingsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="Project Settings"
        description="Configure project workflows and statuses"
      />

      {/* Project Statuses */}
      <FormCard
        title="Project Statuses"
        description="Define the statuses a project moves through"
      >
        <div className="space-y-1">
          {projectStatuses.map((status, i) => (
            <div key={status.label}>
              <div className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-slate-300 w-4">
                    {i + 1}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${status.color}`}
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {status.label}
                  </span>
                </div>
                <button className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
              {i < projectStatuses.length - 1 && (
                <div className="ml-[26px] w-px h-3 bg-slate-200" />
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-dashed border-slate-300 hover:border-blue-400 rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Status
        </button>
      </FormCard>

      {/* Project Templates */}
      <FormCard
        title="Project Templates"
        description="Pre-defined stage workflows for common project types"
      >
        <div className="space-y-4">
          {projectTemplates.map((template) => (
            <div
              key={template.name}
              className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {template.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {template.stages.length} stages
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {template.stages.map((stage, i) => (
                  <div key={stage} className="flex items-center gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700">
                      {stage}
                    </span>
                    {i < template.stages.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-dashed border-slate-300 hover:border-blue-400 rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Template
        </button>
      </FormCard>

      <SaveBar />
    </div>
  );
}
