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

interface Stage {
  name: string;
  probability: string;
  color: string;
  requiredFields: string;
  expectedDuration: string;
}

const stageColors: Record<string, string> = {
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  green: "bg-emerald-500",
};

const pipelineStages: Record<string, Stage[]> = {
  "Software Sales": [
    {
      name: "Qualified",
      probability: "10%",
      color: "blue",
      requiredFields: "None",
      expectedDuration: "1 day",
    },
    {
      name: "Discovery",
      probability: "25%",
      color: "cyan",
      requiredFields: "Discovery Date",
      expectedDuration: "3 days",
    },
    {
      name: "Proposal",
      probability: "50%",
      color: "amber",
      requiredFields: "Proposal Amount, Expected Close Date",
      expectedDuration: "5 days",
    },
    {
      name: "Negotiation",
      probability: "70%",
      color: "purple",
      requiredFields: "Negotiation Notes",
      expectedDuration: "7 days",
    },
    {
      name: "Contract Sent",
      probability: "85%",
      color: "indigo",
      requiredFields: "Contract Document",
      expectedDuration: "3 days",
    },
    {
      name: "Won",
      probability: "100%",
      color: "green",
      requiredFields: "Closed Date, Won Reason",
      expectedDuration: "—",
    },
  ],
  "Website Sales": [
    {
      name: "Qualified",
      probability: "10%",
      color: "blue",
      requiredFields: "None",
      expectedDuration: "1 day",
    },
    {
      name: "Meeting",
      probability: "25%",
      color: "cyan",
      requiredFields: "Meeting Date",
      expectedDuration: "2 days",
    },
    {
      name: "Quotation",
      probability: "50%",
      color: "amber",
      requiredFields: "Quotation Amount",
      expectedDuration: "3 days",
    },
    {
      name: "Negotiation",
      probability: "70%",
      color: "purple",
      requiredFields: "Negotiation Notes",
      expectedDuration: "5 days",
    },
    {
      name: "Won",
      probability: "100%",
      color: "green",
      requiredFields: "Closed Date, Won Reason",
      expectedDuration: "—",
    },
  ],
  "ERP Sales": [
    {
      name: "Qualified",
      probability: "10%",
      color: "blue",
      requiredFields: "None",
      expectedDuration: "1 day",
    },
    {
      name: "Requirement Analysis",
      probability: "20%",
      color: "cyan",
      requiredFields: "Requirements Document",
      expectedDuration: "7 days",
    },
    {
      name: "Demo",
      probability: "35%",
      color: "amber",
      requiredFields: "Demo Date",
      expectedDuration: "5 days",
    },
    {
      name: "Proposal",
      probability: "55%",
      color: "purple",
      requiredFields: "Proposal Amount, Expected Close Date",
      expectedDuration: "7 days",
    },
    {
      name: "Negotiation",
      probability: "75%",
      color: "indigo",
      requiredFields: "Negotiation Notes",
      expectedDuration: "10 days",
    },
    {
      name: "Contract",
      probability: "90%",
      color: "slate",
      requiredFields: "Contract Document",
      expectedDuration: "5 days",
    },
    {
      name: "Won",
      probability: "100%",
      color: "green",
      requiredFields: "Closed Date, Won Reason",
      expectedDuration: "—",
    },
  ],
};

const colorOptions = [
  "blue",
  "cyan",
  "amber",
  "purple",
  "indigo",
  "green",
  "slate",
];

const swatchColors: Record<string, string> = {
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  green: "bg-emerald-500",
  slate: "bg-slate-400",
};

export default function DealStagesPage() {
  const [selectedPipeline, setSelectedPipeline] = useState("Software Sales");
  const [selectedColor, setSelectedColor] = useState("blue");

  const stages = pipelineStages[selectedPipeline] || [];

  return (
    <div>
      <SettingsPageHeader
        title="Deal Stages"
        description="Configure stage properties and requirements"
      />

      <div className="mb-5">
        <FormField label="Select Pipeline">
          <Select
            options={["Software Sales", "Website Sales", "ERP Sales"]}
            defaultValue={selectedPipeline}
          />
        </FormField>
      </div>

      <FormCard
        title={`${selectedPipeline} Stages`}
        description="Stages for the selected pipeline"
      >
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left font-semibold text-slate-600 px-2 py-3">
                  Stage Name
                </th>
                <th className="text-left font-semibold text-slate-600 px-2 py-3">
                  Probability
                </th>
                <th className="text-left font-semibold text-slate-600 px-2 py-3">
                  Color
                </th>
                <th className="text-left font-semibold text-slate-600 px-2 py-3">
                  Required Fields
                </th>
                <th className="text-left font-semibold text-slate-600 px-2 py-3">
                  Expected Duration
                </th>
                <th className="text-right font-semibold text-slate-600 px-2 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-2 py-3 font-medium text-slate-800">
                    {stage.name}
                  </td>
                  <td className="px-2 py-3 text-slate-600">
                    {stage.probability}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3 h-3 rounded-full ${swatchColors[stage.color] || "bg-slate-400"}`}
                      />
                      <span className="text-slate-500 capitalize">
                        {stage.color}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-slate-600 max-w-[200px]">
                    {stage.requiredFields}
                  </td>
                  <td className="px-2 py-3 text-slate-600">
                    {stage.expectedDuration}
                  </td>
                  <td className="px-2 py-3 text-right">
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>

      <FormCard
        title="Add New Stage"
        description="Create a new stage for the selected pipeline"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Stage Name">
            <Input placeholder="e.g. Follow-up" />
          </FormField>
          <FormField label="Probability">
            <Select
              options={[
                "5%",
                "10%",
                "15%",
                "20%",
                "25%",
                "30%",
                "40%",
                "50%",
                "60%",
                "70%",
                "75%",
                "80%",
                "85%",
                "90%",
                "95%",
                "100%",
              ]}
              defaultValue="5%"
            />
          </FormField>
          <FormField label="Color">
            <div className="flex items-center gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full transition-all ${swatchColors[color]} ${
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                      : "hover:scale-110"
                  }`}
                  aria-label={color}
                />
              ))}
            </div>
          </FormField>
          <FormField label="Expected Duration">
            <Input placeholder="3 days" />
          </FormField>
        </div>

        <SaveBar />
      </FormCard>
    </div>
  );
}
