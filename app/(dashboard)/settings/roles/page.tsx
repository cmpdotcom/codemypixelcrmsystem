"use client";

import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, Badge, SaveBar } from "@/components/SettingsUI";

interface Role {
  name: string;
  userCount: number;
  color: "blue" | "green" | "amber" | "purple" | "rose" | "slate";
}

const roles: Role[] = [
  { name: "Super Admin", userCount: 1, color: "purple" },
  { name: "Admin", userCount: 3, color: "blue" },
  { name: "Sales Manager", userCount: 5, color: "blue" },
  { name: "Setter", userCount: 8, color: "amber" },
  { name: "Closer", userCount: 6, color: "green" },
  { name: "Project Manager", userCount: 4, color: "blue" },
  { name: "Developer", userCount: 12, color: "slate" },
  { name: "QA", userCount: 5, color: "rose" },
  { name: "Accountant", userCount: 2, color: "green" },
  { name: "Viewer", userCount: 7, color: "slate" },
];

// Permission matrix for Super Admin role
// true = ✓ (green), false = — (slate)
const permissionMatrix: { module: string; view: boolean; create: boolean; edit: boolean; del: boolean; assign: boolean }[] = [
  { module: "Leads", view: true, create: true, edit: true, del: true, assign: true },
  { module: "Activities", view: true, create: true, edit: true, del: true, assign: true },
  { module: "Deals", view: true, create: true, edit: true, del: true, assign: true },
  { module: "Clients", view: true, create: true, edit: true, del: true, assign: true },
  { module: "Projects", view: true, create: true, edit: true, del: true, assign: true },
  { module: "Payments", view: true, create: true, edit: true, del: true, assign: true },
  { module: "Commissions", view: true, create: true, edit: true, del: false, assign: false },
  { module: "Reports", view: true, create: false, edit: false, del: false, assign: false },
];

const permissionColumns: { key: string; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "del", label: "Delete" },
  { key: "assign", label: "Assign" },
];

function CheckIcon({ allowed }: { allowed: boolean }) {
  if (allowed) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50">
        <svg
          className="w-3.5 h-3.5 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-50">
      <span className="text-slate-300 text-sm font-medium">—</span>
    </span>
  );
}

export default function RolesSettingsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="Roles & Permissions"
        description="Control what each role can access and do"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search roles..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64"
            />
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Role
        </button>
      </div>

      {/* Roles List */}
      <FormCard title="Roles" description="Define roles and their access levels">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roles.map((role) => (
            <div
              key={role.name}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 5.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    {role.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge
                      label={`${role.userCount} users`}
                      color={role.color}
                    />
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 text-[11px] font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-colors">
                Edit Permissions
              </button>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Permission Matrix */}
      <FormCard
        title="Permission Matrix"
        description="Super Admin role permissions across CRM modules"
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                  Module
                </th>
                {permissionColumns.map((col) => (
                  <th
                    key={col.key}
                    className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionMatrix.map((row) => (
                <tr
                  key={row.module}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-semibold text-slate-800">
                      {row.module}
                    </span>
                  </td>
                  {permissionColumns.map((col) => (
                    <td key={col.key} className="px-3 py-3.5 text-center">
                      <div className="flex justify-center">
                        <CheckIcon
                          allowed={row[col.key as keyof typeof row] as boolean}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
