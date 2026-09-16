"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ArrowDown, Check, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Select,
  Toggle,
  SaveBar,
  Badge,
} from "@/components/SettingsUI";

interface SetterTrigger {
  trigger: string;
  type: string;
  amount: string;
}

interface CloserPercentageTrigger {
  trigger: string;
  rate: string;
}

interface CloserTieredTrigger {
  range: string;
  rate: string;
}

interface CloserFixedTrigger {
  trigger: string;
  amount: string;
}

export default function CommissionsPage() {
  const [setterType, setSetterType] = useState("Fixed Rate");
  const [setterTriggers, setSetterTriggers] = useState<SetterTrigger[]>([]);
  const [closerType, setCloserType] = useState("Percentage of Deal");
  const [closerPctTriggers, setCloserPctTriggers] = useState<CloserPercentageTrigger[]>([]);
  const [closerTieredTriggers, setCloserTieredTriggers] = useState<CloserTieredTrigger[]>([]);
  const [closerFixedTriggers, setCloserFixedTriggers] = useState<CloserFixedTrigger[]>([]);
  const [requireManager, setRequireManager] = useState(true);
  const [requireFinance, setRequireFinance] = useState(true);

  // New trigger states
  const [newSetterTrigger, setNewSetterTrigger] = useState("");
  const [newSetterAmount, setNewSetterAmount] = useState("$20");
  const [newTierRange, setNewTierRange] = useState("");
  const [newTierRate, setNewTierRate] = useState("6%");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/commissions");
      if (!res.ok) throw new Error("Failed to load commissions");
      const data = await res.json();
      setSetterType(data.setterType || "Fixed Rate");
      setSetterTriggers(data.setterTriggers || []);
      setCloserType(data.closerType || "Percentage of Deal");
      setCloserPctTriggers(data.closerPercentageTriggers || []);
      setCloserTieredTriggers(data.closerTieredTriggers || []);
      setCloserFixedTriggers(data.closerFixedTriggers || []);
      setRequireManager(data.requireManagerApproval === "true" || data.requireManagerApproval === true);
      setRequireFinance(data.requireFinanceApproval === "true" || data.requireFinanceApproval === true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setterType,
          setterTriggers,
          closerType,
          closerPercentageTriggers: closerPctTriggers,
          closerTieredTriggers,
          closerFixedTriggers,
          requireManagerApproval: String(requireManager),
          requireFinanceApproval: String(requireFinance),
        }),
      });
      if (!res.ok) throw new Error("Failed to save commission rules");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  };

  const addSetterTrigger = () => {
    if (!newSetterTrigger.trim()) return;
    setSetterTriggers([
      ...setterTriggers,
      { trigger: newSetterTrigger.trim(), type: "Fixed", amount: newSetterAmount.trim() || "$10" },
    ]);
    setNewSetterTrigger("");
  };

  const removeSetterTrigger = (idx: number) => {
    setSetterTriggers(setterTriggers.filter((_, i) => i !== idx));
  };

  const addTieredTrigger = () => {
    if (!newTierRange.trim()) return;
    setCloserTieredTriggers([
      ...closerTieredTriggers,
      { range: newTierRange.trim(), rate: newTierRate.trim() || "5%" },
    ]);
    setNewTierRange("");
  };

  const removeTieredTrigger = (idx: number) => {
    setCloserTieredTriggers(closerTieredTriggers.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading commission settings...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Commission Rules"
        description="Configure setter qualification rewards, closer tiered structures, and payout approval gates"
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

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Commission configuration saved to database!</span>
        </div>
      )}

      {/* Setter Commission */}
      <FormCard
        title="Setter Commission Rules"
        description="Lead qualification and milestone handoff earnings for setters"
      >
        <FormField label="Commission Type">
          <Select
            options={["Fixed Rate", "Percentage", "Tiered"]}
            value={setterType}
            onChange={(v) => setSetterType(v)}
          />
        </FormField>

        <div className="mt-4">
          <div className="overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Trigger Milestone</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Structure</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Amount</th>
                  <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {setterTriggers.map((st, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-xs font-medium text-slate-800">{st.trigger}</td>
                    <td className="px-4 py-3"><Badge label={st.type} color="blue" /></td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{st.amount}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeSetterTrigger(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 mt-3 pt-2">
            <input
              type="text"
              value={newSetterTrigger}
              onChange={(e) => setNewSetterTrigger(e.target.value)}
              placeholder="Milestone trigger (e.g. Discovery Completed)..."
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <input
              type="text"
              value={newSetterAmount}
              onChange={(e) => setNewSetterAmount(e.target.value)}
              placeholder="$ Amount"
              className="w-24 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={addSetterTrigger}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>
      </FormCard>

      {/* Closer Commission */}
      <FormCard
        title="Closer Commission Structures"
        description="Deal-closing incentives based on contract value and collections"
      >
        <FormField label="Calculation Method">
          <Select
            options={["Percentage of Deal", "Tiered Percentage", "Fixed per Deal"]}
            value={closerType}
            onChange={(v) => setCloserType(v)}
          />
        </FormField>

        {closerType === "Percentage of Deal" && (
          <div className="mt-4 overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Deal Trigger</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Commission Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {closerPctTriggers.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-xs font-medium text-slate-800">{c.trigger}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{c.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {closerType === "Tiered Percentage" && (
          <div className="mt-4">
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Deal Value Tier</th>
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Commission Rate</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {closerTieredTriggers.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-xs font-medium text-slate-800">{t.range}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-700">{t.rate}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeTieredTrigger(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 mt-3 pt-2">
              <input
                type="text"
                value={newTierRange}
                onChange={(e) => setNewTierRange(e.target.value)}
                placeholder="Tier range (e.g. $50k – $100k)..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="text"
                value={newTierRate}
                onChange={(e) => setNewTierRate(e.target.value)}
                placeholder="Rate %"
                className="w-24 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={addTieredTrigger}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                + Tier
              </button>
            </div>
          </div>
        )}

        {closerType === "Fixed per Deal" && (
          <div className="mt-4 overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Trigger</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Fixed Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {closerFixedTriggers.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-xs font-medium text-slate-800">{f.trigger}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{f.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormCard>

      {/* Approval Workflow */}
      <FormCard
        title="Commission Payout Approval Workflow"
        description="Gate financial payouts with multi-step review stages"
      >
        <Toggle
          label="Require Sales Manager Approval"
          description="Commissions must be verified by manager before finance review"
          checked={requireManager}
          onChange={(checked) => setRequireManager(checked)}
        />
        <div className="pt-2">
          <Toggle
            label="Require Finance Verification"
            description="Accounts team verifies collections and executes payout disbursement"
            checked={requireFinance}
            onChange={(checked) => setRequireFinance(checked)}
          />
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-3">Live Payout Pipeline</p>
          <div className="flex flex-col items-center gap-1 max-w-xs mx-auto">
            {[
              { label: "Deal Won", color: "blue" as const },
              { label: "Commission Generated", color: "purple" as const },
              { label: "Manager Review", color: "amber" as const },
              { label: "Finance Approval", color: "green" as const },
              { label: "Paid to Rep", color: "blue" as const },
            ].map((step, idx, arr) => (
              <div key={step.label} className="flex flex-col items-center w-full">
                <div className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs w-full">
                  <span className="text-xs font-semibold text-slate-800">{step.label}</span>
                  <Badge label={`Step ${idx + 1}`} color={step.color} />
                </div>
                {idx < arr.length - 1 && <ArrowDown className="w-3.5 h-3.5 text-slate-300 my-0.5" />}
              </div>
            ))}
          </div>
        </div>
      </FormCard>

      <SaveBar
        saving={saving}
        saved={saved}
        onSave={handleSave}
        onCancel={fetchSettings}
      />
    </div>
  );
}
