"use client";

import { Plus } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Select,
  Toggle,
  SaveBar,
} from "@/components/SettingsUI";

const taskStatuses = [
  { label: "Backlog", color: "bg-slate-100 text-slate-600 border-slate-200" },
  { label: "Todo", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { label: "In Progress", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  { label: "Code Review", color: "bg-violet-50 text-violet-600 border-violet-200" },
  { label: "QA", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { label: "Revision", color: "bg-orange-50 text-orange-600 border-orange-200" },
  { label: "Done", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { label: "Blocked", color: "bg-rose-50 text-rose-600 border-rose-200" },
];

const taskPriorities = [
  {
    label: "Low",
    color: "bg-emerald-500",
    description: "No urgency",
  },
  {
    label: "Medium",
    color: "bg-amber-500",
    description: "Normal priority",
  },
  {
    label: "High",
    color: "bg-orange-500",
    description: "Important",
  },
  {
    label: "Urgent",
    color: "bg-red-500",
    description: "Critical - immediate action",
  },
];

export default function TaskSettingsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="Task Settings"
        description="Configure task statuses and priorities"
      />

      {/* Task Statuses */}
      <FormCard
        title="Task Statuses"
        description="Kanban-style statuses tasks move through"
      >
        <div className="flex flex-wrap gap-2">
          {taskStatuses.map((status) => (
            <span
              key={status.label}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${status.color}`}
            >
              {status.label}
            </span>
          ))}
        </div>
        <button className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-dashed border-slate-300 hover:border-blue-400 rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Status
        </button>
      </FormCard>

      {/* Task Priorities */}
      <FormCard
        title="Task Priorities"
        description="Priority levels available when creating tasks"
      >
        <div className="space-y-1">
          {taskPriorities.map((priority) => (
            <div
              key={priority.label}
              className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${priority.color}`}
              />
              <span className="text-xs font-semibold text-slate-700 w-20">
                {priority.label}
              </span>
              <span className="text-xs text-slate-500">
                {priority.description}
              </span>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Task Defaults */}
      <FormCard
        title="Task Defaults"
        description="Default values applied when creating new tasks"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Default Assignee">
            <Select
              options={["Unassigned", "Current User", "Project Manager"]}
              defaultValue="Unassigned"
            />
          </FormField>
          <FormField label="Default Priority">
            <Select
              options={["Low", "Medium", "High", "Urgent"]}
              defaultValue="Medium"
            />
          </FormField>
          <FormField label="Default Due Date Offset">
            <Select
              options={["1 day", "3 days", "1 week", "2 weeks", "1 month"]}
              defaultValue="1 week"
            />
          </FormField>
        </div>
        <div className="mt-2">
          <Toggle
            label="Auto-create tasks from deals"
            description="Automatically generate tasks when a deal reaches a won stage"
            defaultOn
          />
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
