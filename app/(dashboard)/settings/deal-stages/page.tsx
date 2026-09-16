"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, FormField, SaveBar } from "@/components/SettingsUI";

interface Stage {
  name: string;
  probability: string;
  color: string;
  requiredFields: string;
  expectedDuration: string;
}

const COLOR_OPTIONS = ["blue", "cyan", "amber", "purple", "indigo", "green", "slate"];

const SWATCH_COLORS: Record<string, string> = {
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  green: "bg-emerald-500",
  slate: "bg-slate-400",
};

export default function DealStagesPage() {
  const [stageMap, setStageMap] = useState<Record<string, Stage[]>>({});
  const [selectedPipeline, setSelectedPipeline] = useState("Software Sales");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New stage form state
  const [newStageName, setNewStageName] = useState("");
  const [newStageProbability, setNewStageProbability] = useState("20%");
  const [newStageColor, setNewStageColor] = useState("blue");
  const [newStageDuration, setNewStageDuration] = useState("3 days");
  const [newStageReq, setNewStageReq] = useState("None");

  const fetchStages = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/deal-stages");
      if (!res.ok) throw new Error("Failed to load stages");
      const data = await res.json();
      setStageMap(data);
      const pipelines = Object.keys(data);
      if (pipelines.length > 0 && !data[selectedPipeline]) {
        setSelectedPipeline(pipelines[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading");
    } finally {
      setLoading(false);
    }
  }, [selectedPipeline]);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const stages = stageMap[selectedPipeline] || [];

  const handleSaveToDb = async (updatedMap: Record<string, Stage[]>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/deal-stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMap),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setStageMap(updatedMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveStage = (idx: number) => {
    const updated = {
      ...stageMap,
      [selectedPipeline]: stages.filter((_, i) => i !== idx),
    };
    handleSaveToDb(updated);
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage: Stage = {
      name: newStageName.trim(),
      probability: newStageProbability,
      color: newStageColor,
      expectedDuration: newStageDuration.trim() || "3 days",
      requiredFields: newStageReq.trim() || "None",
    };

    const updated = {
      ...stageMap,
      [selectedPipeline]: [...stages, newStage],
    };

    handleSaveToDb(updated);
    setNewStageName("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading deal stages...</span>
      </div>
    );
  }

  const pipelineNames = Object.keys(stageMap);

  return (
    <div>
      <SettingsPageHeader
        title="Deal Stages"
        description="Configure stage criteria, win probabilities, and exit criteria for deal stages"
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
          <span>Deal stages updated in database!</span>
        </div>
      )}

      <div className="mb-5 max-w-sm">
        <FormField label="Select Pipeline">
          <select
            value={selectedPipeline}
            onChange={(e) => setSelectedPipeline(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-2xs cursor-pointer"
          >
            {pipelineNames.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormCard
        title={`${selectedPipeline} Stages`}
        description="Active progression stages for the selected pipeline"
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50">
                <th className="text-left font-semibold text-slate-600 px-6 py-3">Stage Name</th>
                <th className="text-left font-semibold text-slate-600 px-3 py-3">Probability</th>
                <th className="text-left font-semibold text-slate-600 px-3 py-3">Color</th>
                <th className="text-left font-semibold text-slate-600 px-3 py-3">Required Fields</th>
                <th className="text-left font-semibold text-slate-600 px-3 py-3">Expected Duration</th>
                <th className="text-right font-semibold text-slate-600 px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No stages found. Add a stage below.
                  </td>
                </tr>
              ) : (
                stages.map((stage, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-slate-800">{stage.name}</td>
                    <td className="px-3 py-3.5 text-slate-600 font-medium">{stage.probability}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded-full ${SWATCH_COLORS[stage.color] || "bg-slate-400"}`} />
                        <span className="text-slate-500 capitalize">{stage.color}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600 max-w-[200px] truncate">{stage.requiredFields}</td>
                    <td className="px-3 py-3.5 text-slate-600">{stage.expectedDuration}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveStage(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Delete stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </FormCard>

      <FormCard
        title="Add New Stage"
        description={`Create an additional deal progression stage for ${selectedPipeline}`}
      >
        <form onSubmit={handleAddStage} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Stage Name *">
              <input
                type="text"
                required
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="e.g. Executive Presentation"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </FormField>

            <FormField label="Win Probability">
              <select
                value={newStageProbability}
                onChange={(e) => setNewStageProbability(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
              >
                {["5%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Badge Color">
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewStageColor(color)}
                    className={`w-6 h-6 rounded-full transition-all cursor-pointer ${SWATCH_COLORS[color]} ${
                      newStageColor === color ? "ring-2 ring-offset-2 ring-slate-400 scale-110 shadow-sm" : "hover:scale-110 opacity-80 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </FormField>

            <FormField label="Expected Duration">
              <input
                type="text"
                value={newStageDuration}
                onChange={(e) => setNewStageDuration(e.target.value)}
                placeholder="e.g. 5 days"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </FormField>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add Stage to Pipeline
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
