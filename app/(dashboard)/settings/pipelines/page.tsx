"use client";

import { useState } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Input,
  SaveBar,
  Badge,
} from "@/components/SettingsUI";

interface Stage {
  name: string;
  color: string;
}

interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

const stageColors: Record<string, string> = {
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  green: "bg-emerald-500",
  slate: "bg-slate-400",
};

const initialPipelines: Pipeline[] = [
  {
    id: "software-sales",
    name: "Software Sales",
    stages: [
      { name: "Qualified", color: "blue" },
      { name: "Discovery", color: "cyan" },
      { name: "Proposal", color: "amber" },
      { name: "Negotiation", color: "purple" },
      { name: "Contract Sent", color: "indigo" },
      { name: "Won", color: "green" },
    ],
  },
  {
    id: "website-sales",
    name: "Website Sales",
    stages: [
      { name: "Qualified", color: "blue" },
      { name: "Meeting", color: "cyan" },
      { name: "Quotation", color: "amber" },
      { name: "Negotiation", color: "purple" },
      { name: "Won", color: "green" },
    ],
  },
  {
    id: "erp-sales",
    name: "ERP Sales",
    stages: [
      { name: "Qualified", color: "blue" },
      { name: "Requirement Analysis", color: "cyan" },
      { name: "Demo", color: "amber" },
      { name: "Proposal", color: "purple" },
      { name: "Negotiation", color: "indigo" },
      { name: "Contract", color: "slate" },
      { name: "Won", color: "green" },
    ],
  },
];

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(initialPipelines);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState("");

  const handleAddPipeline = () => {
    if (!newPipelineName.trim()) return;
    setPipelines([
      ...pipelines,
      {
        id: newPipelineName.toLowerCase().replace(/\s+/g, "-"),
        name: newPipelineName,
        stages: [{ name: "New Stage", color: "slate" }],
      },
    ]);
    setNewPipelineName("");
    setShowAddForm(false);
  };

  const handleDeletePipeline = (id: string) => {
    setPipelines(pipelines.filter((p) => p.id !== id));
  };

  return (
    <div>
      <SettingsPageHeader
        title="Deal Pipelines"
        description="Manage your sales pipelines and stages"
      />

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
        >
          + Add Pipeline
        </button>
      </div>

      {showAddForm && (
        <FormCard title="New Pipeline" description="Create a new sales pipeline">
          <FormField label="Pipeline Name">
            <Input
              placeholder="e.g. Consulting Sales"
              defaultValue={newPipelineName}
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPipeline}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
            >
              Create Pipeline
            </button>
          </div>
        </FormCard>
      )}

      <div className="space-y-4">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {pipeline.name}
                </h3>
                <Badge
                  label={`${pipeline.stages.length} stages`}
                  color="blue"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePipeline(pipeline.id)}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {pipeline.stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                    <span
                      className={`w-2 h-2 rounded-full ${stageColors[stage.color]}`}
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {stage.name}
                    </span>
                  </div>
                  {idx < pipeline.stages.length - 1 && (
                    <svg
                      className="w-3.5 h-3.5 text-slate-300 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SaveBar />
    </div>
  );
}
