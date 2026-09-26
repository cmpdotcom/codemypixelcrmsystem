"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Code, Loader2, Rocket, ShieldCheck, Star, Trash2, Users } from "lucide-react";
import { AssigneePicker, type PickerPerson, type PickerSelection, type PickerTeam } from "@/components/workflow/AssigneePicker";

interface Assignment {
  id: string;
  role: string;
  isLead: boolean;
  assignedByName: string | null;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; role: { name: string } | null } | null;
  team: { id: string; name: string; department: string; _count: { members: number } } | null;
}

interface Pickers {
  people: { developers: PickerPerson[]; testers: PickerPerson[]; devops: PickerPerson[] };
  teams: PickerTeam[];
}

const ROLES = [
  { role: "Developer", title: "Developers", icon: Code, tone: "bg-blue-50 text-blue-600", pick: "developers" },
  { role: "Tester", title: "Testers / QA", icon: ShieldCheck, tone: "bg-rose-50 text-rose-600", pick: "testers" },
  { role: "DevOps", title: "DevOps", icon: Rocket, tone: "bg-emerald-50 text-emerald-600", pick: "devops" },
] as const;

const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

// Real project team: developers, testers and DevOps (people or whole teams). Managers can change it at any time.
export function ProjectAssignmentsPanel({ projectId }: { projectId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [pickers, setPickers] = useState<Pickers | null>(null);
  const [adding, setAdding] = useState<Record<string, PickerSelection[]>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/assignments`);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Could not load the project team");
      setAssignments(data.assignments);
      setCanManage(data.canManage);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the project team");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/projects/${projectId}/assignments`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) throw new Error(data?.error || "Could not load the project team");
        setAssignments(data.assignments);
        setCanManage(data.canManage);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Could not load the project team"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    if (!canManage || pickers) return;
    fetch("/api/workflow/people")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setPickers(data))
      .catch(() => {});
  }, [canManage, pickers]);

  const save = async (role: string) => {
    const entries = adding[role] || [];
    if (entries.length === 0) return;
    setBusy(role);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignments: entries.map((entry) => ({ ...entry, role })) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Could not assign");
      setAdding({ ...adding, [role]: [] });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not assign");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (assignment: Assignment) => {
    const label = assignment.user ? `${assignment.user.firstName} ${assignment.user.lastName}` : assignment.team?.name;
    if (!confirm(`Remove ${label} as ${assignment.role} from this project?`)) return;
    setBusy(assignment.id);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/assignments?assignmentId=${assignment.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Could not remove");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove");
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-10">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div id="team" className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {ROLES.map(({ role, title, icon: Icon, tone, pick }) => {
        const rows = assignments.filter((assignment) => assignment.role === role);
        return (
          <div key={role} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}><Icon className="h-4 w-4" /></div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              </div>
              <span className="text-xs text-slate-400">{rows.length} assigned</span>
            </div>
            {rows.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 py-4 text-center text-xs text-slate-400">
                No {title.toLowerCase()} assigned yet{canManage ? " — add someone below." : "."}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((assignment) => {
                  const name = assignment.user ? `${assignment.user.firstName} ${assignment.user.lastName}` : assignment.team?.name || "Team";
                  return (
                    <div key={assignment.id} className="flex items-center gap-3 rounded-xl border border-slate-200/80 p-3.5">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${assignment.team ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {assignment.team ? <Users className="h-4 w-4" /> : initials(name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1 truncate text-sm font-semibold text-slate-900">
                          {name}
                          {assignment.isLead && <Star className="h-3 w-3 text-amber-500" fill="currentColor" />}
                        </p>
                        <p className="truncate text-[11px] text-slate-500">
                          {assignment.team
                            ? `Team · ${assignment.team.department} · ${assignment.team._count.members} members`
                            : assignment.user?.role?.name || assignment.user?.email}
                        </p>
                        {assignment.assignedByName && <p className="text-[10px] text-slate-400">by {assignment.assignedByName}</p>}
                      </div>
                      {canManage && (
                        <button
                          onClick={() => remove(assignment)}
                          disabled={busy === assignment.id}
                          title="Remove from project"
                          className="cursor-pointer rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {canManage && pickers && (
              <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <AssigneePicker
                    label={`Add ${title.toLowerCase()}`}
                    people={pickers.people[pick]}
                    teams={pickers.teams}
                    value={adding[role] || []}
                    onChange={(value) => setAdding({ ...adding, [role]: value })}
                  />
                </div>
                <button
                  onClick={() => save(role)}
                  disabled={busy === role || !(adding[role] || []).length}
                  className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy === role && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Assign
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
