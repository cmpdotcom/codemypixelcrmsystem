"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, Badge } from "@/components/SettingsUI";
import { CRM_MODULES, normalizePermissions, type PermissionSet } from "@/lib/permissions";
import {
  Shield,
  Plus,
  Search,
  Check,
  X,
  Loader2,
  Trash2,
  Edit2,
  AlertCircle,
  Save,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string | null;
  color: "blue" | "green" | "amber" | "purple" | "rose" | "slate";
  userCount: number;
  permissions?: Record<string, PermissionSet>;
}

const MODULES = [...CRM_MODULES];

const PERMISSION_COLUMNS: { key: "view" | "create" | "edit" | "del" | "assign"; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "del", label: "Delete" },
  { key: "assign", label: "Assign" },
];

const COLOR_OPTIONS: Role["color"][] = ["purple", "blue", "green", "amber", "rose", "slate"];

export default function RolesSettingsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<
    Record<string, PermissionSet>
  >({});
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [roleForm, setRoleForm] = useState({ id: "", name: "", description: "", color: "blue" as Role["color"] });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data: Role[] = await res.json();
      setRoles(data);
      if (data.length > 0) {
        // default select super admin or first
        setSelectedRole((prev) => {
          if (prev) {
            const found = data.find((r) => r.id === prev.id);
            return found || data[0];
          }
          return data[0];
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (selectedRole) {
      setEditingPermissions(normalizePermissions(selectedRole.permissions, selectedRole.name));
    }
  }, [selectedRole]);

  const togglePermission = (module: string, key: "view" | "create" | "edit" | "del" | "assign") => {
    setEditingPermissions((prev) => {
      const currentMod = prev[module] || { view: false, create: false, edit: false, del: false, assign: false };
      if (key === "view" && currentMod.view) {
        return { ...prev, [module]: { view: false, create: false, edit: false, del: false, assign: false } };
      }
      return {
        ...prev,
        [module]: {
          ...currentMod,
          ...(key !== "view" && !currentMod.view ? { view: true } : {}),
          [key]: !currentMod[key],
        },
      };
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSavingPermissions(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/roles/${selectedRole.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: editingPermissions }),
      });
      if (!res.ok) throw new Error("Failed to save permissions");
      const updated = await res.json();
      setSuccess(`Permissions updated for ${selectedRole.name}!`);
      setTimeout(() => setSuccess(null), 3000);
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? { ...r, permissions: updated.permissions } : r)));
      setSelectedRole((prev) => (prev ? { ...prev, permissions: updated.permissions } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSavingPermissions(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setRoleForm({ id: "", name: "", description: "", color: "blue" });
    setShowModal(true);
  };

  const handleOpenEditModal = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setRoleForm({
      id: role.id,
      name: role.name,
      description: role.description || "",
      color: role.color,
    });
    setShowModal(true);
  };

  const handleDeleteRole = async (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete role "${role.name}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/roles/${role.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete role");
      setSuccess(`Role "${role.name}" deleted.`);
      setTimeout(() => setSuccess(null), 3000);
      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;
    setFormSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: roleForm.name,
            description: roleForm.description,
            color: roleForm.color,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create role");
      } else {
        const res = await fetch(`/api/roles/${roleForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: roleForm.name,
            description: roleForm.description,
            color: roleForm.color,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update role");
      }
      setShowModal(false);
      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading roles & permissions...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Roles & Permissions"
        description="Define organizational roles and configure fine-grained module access"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64 shadow-2xs"
          />
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Role
        </button>
      </div>

      {/* Roles List */}
      <FormCard title="Roles" description="Click any role to inspect or edit its module permissions below">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredRoles.map((role) => {
            const isSelected = selectedRole?.id === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{role.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge label={`${role.userCount} users`} color={role.color} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEditModal(role, e)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-white transition-colors cursor-pointer"
                    title="Edit role info"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteRole(role, e)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white transition-colors cursor-pointer"
                    title="Delete role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </FormCard>

      {/* Permission Matrix */}
      {selectedRole && (
        <FormCard
          title={`Permission Matrix: ${selectedRole.name}`}
          description={`Toggle checkboxes to configure which actions the ${selectedRole.name} role can perform`}
        >
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    CRM Module
                  </th>
                  {PERMISSION_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MODULES.map((module) => {
                  const perms = editingPermissions[module] || {
                    view: false,
                    create: false,
                    edit: false,
                    del: false,
                    assign: false,
                  };
                  return (
                    <tr key={module} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-semibold text-slate-800">{module}</span>
                      </td>
                      {PERMISSION_COLUMNS.map((col) => {
                        const allowed = perms[col.key];
                        return (
                          <td key={col.key} className="px-3 py-3.5 text-center">
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() => togglePermission(module, col.key)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                  allowed
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200/80 hover:bg-emerald-100"
                                    : "bg-slate-50 text-slate-300 border border-slate-200/70 hover:bg-slate-100 hover:text-slate-400"
                                }`}
                                title={`Toggle ${col.label} on ${module}`}
                              >
                                {allowed ? <Check className="w-4 h-4 stroke-[2.5]" /> : <span className="text-sm">—</span>}
                              </button>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              Changes apply to all users assigned to <span className="font-semibold text-slate-700">{selectedRole.name}</span>.
            </p>
            <button
              onClick={handleSavePermissions}
              disabled={savingPermissions}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              {savingPermissions ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Permissions
            </button>
          </div>
        </FormCard>
      )}

      {/* Add / Edit Role Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "Add New Role" : `Edit Role: ${roleForm.name}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Name *</label>
                <input
                  type="text"
                  required
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="e.g. Sales Specialist"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="Role description..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Color</label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setRoleForm({ ...roleForm, color: c })}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded-md border capitalize cursor-pointer transition-all ${
                        roleForm.color === c
                          ? "ring-2 ring-blue-500 ring-offset-1 border-blue-400"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Badge label={c} color={c} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {formSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                  {modalMode === "create" ? "Create Role" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
