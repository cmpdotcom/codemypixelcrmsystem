"use client";

import { Star, Users, X } from "lucide-react";

export interface PickerPerson {
  id: string;
  name: string;
  role?: string;
}

export interface PickerTeam {
  id: string;
  name: string;
  department: string;
  memberCount: number;
}

export interface PickerSelection {
  userId?: string;
  teamId?: string;
  isLead: boolean;
}

// Choose individual people and/or whole teams for one project role (Developer, Tester, DevOps).
export function AssigneePicker({
  label,
  hint,
  people,
  teams,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  people: PickerPerson[];
  teams: PickerTeam[];
  value: PickerSelection[];
  onChange: (value: PickerSelection[]) => void;
}) {
  const isSelected = (option: string) =>
    value.some((item) => (option.startsWith("u:") ? item.userId === option.slice(2) : item.teamId === option.slice(2)));

  const add = (option: string) => {
    if (!option || isSelected(option)) return;
    const entry = option.startsWith("u:") ? { userId: option.slice(2), isLead: false } : { teamId: option.slice(2), isLead: false };
    onChange([...value, entry]);
  };

  const labelFor = (item: PickerSelection) => {
    if (item.userId) return people.find((person) => person.id === item.userId)?.name || "Unknown user";
    const team = teams.find((entry) => entry.id === item.teamId);
    return team ? `${team.name} (${team.memberCount} members)` : "Unknown team";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[11px] font-semibold text-slate-700">{label}</label>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, index) => (
            <span
              key={item.userId || item.teamId}
              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold ${
                item.teamId ? "border-purple-200 bg-purple-50 text-purple-700" : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              {item.teamId && <Users className="h-3 w-3" />}
              {labelFor(item)}
              <button
                type="button"
                title={item.isLead ? "Lead (click to unset)" : "Make lead"}
                onClick={() => onChange(value.map((entry, i) => (i === index ? { ...entry, isLead: !entry.isLead } : entry)))}
                className={`cursor-pointer ${item.isLead ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
              >
                <Star className="h-3 w-3" fill={item.isLead ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                title="Remove"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="cursor-pointer text-slate-400 hover:text-rose-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <select
        value=""
        onChange={(event) => add(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">+ Add a person or team…</option>
        <optgroup label="People">
          {people.length === 0 && <option disabled>No active users with this role yet</option>}
          {people.map((person) => (
            <option key={person.id} value={`u:${person.id}`} disabled={isSelected(`u:${person.id}`)}>
              {person.name}{person.role ? ` · ${person.role}` : ""}
            </option>
          ))}
        </optgroup>
        <optgroup label="Teams">
          {teams.length === 0 && <option disabled>No teams yet — create one in Settings → Teams</option>}
          {teams.map((team) => (
            <option key={team.id} value={`t:${team.id}`} disabled={isSelected(`t:${team.id}`)}>
              {team.name} · {team.department} · {team.memberCount} members
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
