"use client";

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

const followUpTypes = [
  { name: "Call", icon: "📞" },
  { name: "Email", icon: "✉️" },
  { name: "WhatsApp", icon: "💬" },
  { name: "Meeting", icon: "🗓️" },
  { name: "SMS", icon: "📱" },
  { name: "Visit", icon: "🏗️" },
  { name: "Video Call", icon: "🎥" },
];

const followUpStatuses = [
  { label: "Upcoming", color: "blue" as const },
  { label: "Due Today", color: "amber" as const },
  { label: "Completed", color: "green" as const },
  { label: "Overdue", color: "rose" as const },
  { label: "Cancelled", color: "slate" as const },
];

const priorityLevels = [
  {
    name: "High",
    dotColor: "bg-red-500",
    description: "Critical follow-ups that require immediate attention",
  },
  {
    name: "Medium",
    dotColor: "bg-amber-500",
    description: "Important follow-ups that should be completed soon",
  },
  {
    name: "Low",
    dotColor: "bg-green-500",
    description: "Routine follow-ups with flexible timing",
  },
];

export default function FollowUpSettingsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="Follow-Up Settings"
        description="Configure follow-up types, statuses, and reminders"
      />

      <FormCard
        title="Follow-Up Types"
        description="Manage the types of follow-ups available in your CRM"
      >
        <div className="space-y-1">
          {followUpTypes.map((type) => (
            <div
              key={type.name}
              className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{type.icon}</span>
                <p className="text-xs font-semibold text-slate-800">
                  {type.name}
                </p>
              </div>
              <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
                Edit
              </button>
            </div>
          ))}
        </div>
        <button className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors">
          <span className="text-sm leading-none">+</span> Add Type
        </button>
      </FormCard>

      <FormCard
        title="Follow-Up Statuses"
        description="Define the statuses a follow-up can move through"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {followUpStatuses.map((status) => (
            <Badge key={status.label} label={status.label} color={status.color} />
          ))}
        </div>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors">
          <span className="text-sm leading-none">+</span> Add Status
        </button>
      </FormCard>

      <FormCard
        title="Priority Levels"
        description="Set priority levels to triage follow-up urgency"
      >
        <div className="space-y-1">
          {priorityLevels.map((level) => (
            <div
              key={level.name}
              className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${level.dotColor}`}
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {level.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {level.description}
                  </p>
                </div>
              </div>
              <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 shrink-0">
                Edit
              </button>
            </div>
          ))}
        </div>
      </FormCard>

      <FormCard
        title="Reminder Rules"
        description="Configure when and how follow-up reminders are sent"
      >
        <Toggle
          label="Send reminder before follow-up"
          description="Notify the assigned user before a follow-up is due"
          defaultOn
        />
        <div className="py-3 border-b border-slate-100">
          <FormField label="Default reminder time">
            <Select
              options={["15 minutes", "30 minutes", "1 hour", "2 hours", "1 day"]}
              defaultValue="30 minutes"
            />
          </FormField>
        </div>
        <Toggle
          label="Notify setter on overdue"
          description="Alert the user when a follow-up becomes overdue"
          defaultOn
        />
        <div className="py-3 border-b border-slate-100">
          <FormField label="Overdue notification delay">
            <Select
              options={["1 hour", "2 hours", "4 hours", "1 day"]}
              defaultValue="1 hour"
            />
          </FormField>
        </div>
        <Toggle
          label="Escalate to manager"
          description="Escalate overdue follow-ups to the team manager"
          defaultOn
        />
        <div className="py-3">
          <FormField label="Escalate after">
            <Select
              options={["1 day", "2 days", "3 days", "1 week"]}
              defaultValue="1 day"
            />
          </FormField>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
