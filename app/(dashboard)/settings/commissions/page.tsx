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
import { Plus, Pencil, Trash2, ArrowDown, Check } from "lucide-react";

export default function CommissionsPage() {
  const [closerType, setCloserType] = useState("Percentage of Deal");

  return (
    <div>
      <SettingsPageHeader
        title="Commission Rules"
        description="Configure setter and closer commission structures"
      />

      {/* Setter Commission */}
      <FormCard
        title="Setter Commission"
        description="Define how setters earn commissions based on lead milestones"
      >
        <FormField label="Commission Type">
          <Select
            options={["Fixed Rate", "Percentage", "Tiered"]}
            defaultValue="Fixed Rate"
          />
        </FormField>

        <div className="mt-4">
          <div className="overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Trigger
                  </th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Type
                  </th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Amount
                  </th>
                  <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    Qualified Lead
                  </td>
                  <td className="px-4 py-3">
                    <Badge label="Fixed" color="blue" />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">$5</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    Meeting Booked
                  </td>
                  <td className="px-4 py-3">
                    <Badge label="Fixed" color="blue" />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">$10</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    Successful Handoff
                  </td>
                  <td className="px-4 py-3">
                    <Badge label="Fixed" color="blue" />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">$15</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add Trigger
          </button>
        </div>
      </FormCard>

      {/* Closer Commission */}
      <FormCard
        title="Closer Commission"
        description="Define how closers earn commissions based on deal outcomes"
      >
        <FormField label="Commission Type">
          <div className="relative">
            <select
              value={closerType}
              onChange={(e) => setCloserType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none"
            >
              <option value="Percentage of Deal">Percentage of Deal</option>
              <option value="Tiered Percentage">Tiered Percentage</option>
              <option value="Fixed per Deal">Fixed per Deal</option>
            </select>
          </div>
        </FormField>

        {closerType === "Percentage of Deal" && (
          <div className="mt-4 overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Trigger
                  </th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Rate
                  </th>
                  <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    Deal Won
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">5%</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    Payment Received
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    Additional 2%
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {closerType === "Tiered Percentage" && (
          <div className="mt-4 overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Deal Range
                  </th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Commission Rate
                  </th>
                  <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    $0 – $10,000
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">3%</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    $10k – $25k
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">5%</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    $25k – $50k
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">7%</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    $50k+
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">10%</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {closerType === "Fixed per Deal" && (
          <div className="mt-4 overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Trigger
                  </th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Amount
                  </th>
                  <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-xs font-medium text-slate-800">
                    Deal Won
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">$500</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <button className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Tier
        </button>
      </FormCard>

      {/* Commission Approval Workflow */}
      <FormCard
        title="Commission Approval Workflow"
        description="Control the approval process before commissions are paid out"
      >
        <Toggle
          label="Require manager approval"
          description="Commissions must be reviewed and approved by a manager before payout"
          defaultOn
        />
        <Toggle
          label="Require finance approval"
          description="Commissions must be verified by the finance team before payout"
          defaultOn
        />

        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-700 mb-3">
            Approval Flow
          </p>
          <div className="flex flex-col items-center gap-1">
            {[
              { label: "Deal Won", color: "blue" as const },
              { label: "Commission Generated", color: "purple" as const },
              { label: "Manager Review", color: "amber" as const },
              { label: "Approved", color: "green" as const },
              { label: "Finance", color: "amber" as const },
              { label: "Paid", color: "green" as const },
            ].map((step, idx, arr) => (
              <div key={step.label} className="flex flex-col items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {step.label}
                  </span>
                  <Badge label={step.label} color={step.color} />
                </div>
                {idx < arr.length - 1 && (
                  <ArrowDown className="w-4 h-4 text-slate-300 my-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-700 mb-3">
            Status Pills
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge label="Pending" color="slate" />
            <Badge label="Under Review" color="amber" />
            <Badge label="Approved" color="green" />
            <Badge label="Rejected" color="rose" />
            <Badge label="Paid" color="blue" />
          </div>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
