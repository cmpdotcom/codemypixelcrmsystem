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
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function CustomFieldsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="Custom Fields"
        description="Add custom fields to your CRM modules"
      />

      <div className="flex justify-end mb-4">
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Custom Field
        </button>
      </div>

      {/* Existing Fields */}
      <FormCard
        title="Existing Fields"
        description="Manage the custom fields across your CRM modules"
      >
        <div className="overflow-hidden border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                  Field Name
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                  Module
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                  Type
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                  Required
                </th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 text-xs font-medium text-slate-800">
                  Estimated Employees
                </td>
                <td className="px-4 py-3">
                  <Badge label="Lead" color="blue" />
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">Number</td>
                <td className="px-4 py-3 text-xs text-slate-500">No</td>
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
                  Budget Range
                </td>
                <td className="px-4 py-3">
                  <Badge label="Lead" color="blue" />
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">Dropdown</td>
                <td className="px-4 py-3 text-xs text-slate-500">Yes</td>
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
                  Preferred Contact
                </td>
                <td className="px-4 py-3">
                  <Badge label="Client" color="purple" />
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">Dropdown</td>
                <td className="px-4 py-3 text-xs text-slate-500">No</td>
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
                  Project Budget
                </td>
                <td className="px-4 py-3">
                  <Badge label="Deal" color="green" />
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">Currency</td>
                <td className="px-4 py-3 text-xs text-slate-500">Yes</td>
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
                  Contract Type
                </td>
                <td className="px-4 py-3">
                  <Badge label="Deal" color="green" />
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">Dropdown</td>
                <td className="px-4 py-3 text-xs text-slate-500">Yes</td>
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
                  Internal Notes
                </td>
                <td className="px-4 py-3">
                  <Badge label="Client" color="purple" />
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">Long Text</td>
                <td className="px-4 py-3 text-xs text-slate-500">No</td>
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
      </FormCard>

      {/* Add New Field */}
      <FormCard
        title="Add New Field"
        description="Create a new custom field for a CRM module"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Field Name">
            <Input placeholder="Enter field name" />
          </FormField>
          <FormField label="Module">
            <Select options={["Lead", "Deal", "Client", "Project", "Task"]} />
          </FormField>
          <FormField label="Field Type">
            <Select
              options={[
                "Text",
                "Number",
                "Currency",
                "Date",
                "Date & Time",
                "Dropdown",
                "Multi-select",
                "Checkbox",
                "Radio",
                "URL",
                "Email",
                "Phone",
                "Long Text",
                "File",
              ]}
            />
          </FormField>
          <FormField label="Default Value">
            <Input placeholder="Enter default value" />
          </FormField>
        </div>

        <div className="mt-1">
          <Toggle
            label="Required"
            description="Make this field mandatory when creating or editing records"
          />
        </div>

        <div className="mt-4">
          <FormField
            label="Options"
            hint="Used for Dropdown, Multi-select, and Radio field types"
          >
            <Input placeholder="Enter options separated by commas" />
          </FormField>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
