"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, FormField, Toggle, SaveBar } from "@/components/SettingsUI";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const DEFAULTS: Record<string, string> = {
  notif_new_lead: "true",
  notif_lead_assigned: "true",
  notif_lead_qualified: "true",
  notif_deal_assigned: "true",
  notif_deal_won: "true",
  notif_deal_lost: "false",
  notif_followup_due: "true",
  notif_followup_overdue: "true",
  notif_task_assigned: "true",
  notif_task_due: "true",
  notif_task_overdue: "false",
  notif_payment_received: "true",
  notif_payment_due: "true",
  notif_project_milestone: "true",
  channel_in_app: "true",
  channel_email: "true",
  channel_whatsapp: "false",
  channel_sms: "false",
  channel_push: "true",
  quiet_hours_enabled: "false",
  quiet_hours_start: "22:00",
  quiet_hours_end: "08:00",
};

export default function NotificationsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/notifications");
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const toggle = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === "true" ? "false" : "true",
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save notification settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading notification settings...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Notification Settings"
        description="Control event notifications, delivery channels, and quiet hour schedules"
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
          <span>Notification preferences saved to database!</span>
        </div>
      )}

      {/* CRM Event Notifications */}
      <FormCard
        title="CRM Event Triggers"
        description="Select which lifecycle events trigger notifications for you"
      >
        <Toggle
          label="New Lead Created"
          description="Notify when a lead enters the CRM"
          checked={formData.notif_new_lead === "true"}
          onChange={() => toggle("notif_new_lead")}
        />
        <Toggle
          label="Lead Assigned"
          description="When a lead is assigned to you"
          checked={formData.notif_lead_assigned === "true"}
          onChange={() => toggle("notif_lead_assigned")}
        />
        <Toggle
          label="Lead Qualified"
          description="When a lead is marked as qualified by a setter"
          checked={formData.notif_lead_qualified === "true"}
          onChange={() => toggle("notif_lead_qualified")}
        />
        <Toggle
          label="Deal Assigned"
          description="When a deal pipeline card is assigned to you"
          checked={formData.notif_deal_assigned === "true"}
          onChange={() => toggle("notif_deal_assigned")}
        />
        <Toggle
          label="Deal Won"
          description="Celebratory alert when a deal reaches Won stage"
          checked={formData.notif_deal_won === "true"}
          onChange={() => toggle("notif_deal_won")}
        />
        <Toggle
          label="Deal Lost"
          description="Alert when a deal is closed as lost"
          checked={formData.notif_deal_lost === "true"}
          onChange={() => toggle("notif_deal_lost")}
        />
        <Toggle
          label="Follow-up Due"
          description="When a scheduled follow-up is due today"
          checked={formData.notif_followup_due === "true"}
          onChange={() => toggle("notif_followup_due")}
        />
        <Toggle
          label="Follow-up Overdue"
          description="Urgent alert when a follow-up passes its deadline"
          checked={formData.notif_followup_overdue === "true"}
          onChange={() => toggle("notif_followup_overdue")}
        />
        <Toggle
          label="Task Assigned"
          description="When a sprint or milestone task is assigned to you"
          checked={formData.notif_task_assigned === "true"}
          onChange={() => toggle("notif_task_assigned")}
        />
        <Toggle
          label="Task Due"
          description="When a task deadline arrives"
          checked={formData.notif_task_due === "true"}
          onChange={() => toggle("notif_task_due")}
        />
        <Toggle
          label="Payment Received"
          description="Accounts collection alert when customer payment arrives"
          checked={formData.notif_payment_received === "true"}
          onChange={() => toggle("notif_payment_received")}
        />
        <Toggle
          label="Project Milestone Completed"
          description="When a project stage or milestone is achieved"
          checked={formData.notif_project_milestone === "true"}
          onChange={() => toggle("notif_project_milestone")}
        />
      </FormCard>

      {/* Notification Channels */}
      <FormCard
        title="Delivery Channels"
        description="Enable preferred notification delivery media"
      >
        <Toggle
          label="In-App Banner & Bell"
          description="Receive instant alerts within the CMP CRM top bar"
          checked={formData.channel_in_app === "true"}
          onChange={() => toggle("channel_in_app")}
        />
        <Toggle
          label="Email Notifications"
          description="Send digest and critical alerts to your verified email"
          checked={formData.channel_email === "true"}
          onChange={() => toggle("channel_email")}
        />
        <Toggle
          label="WhatsApp Notifications"
          description="Direct WhatsApp Business message alerts for urgent leads"
          checked={formData.channel_whatsapp === "true"}
          onChange={() => toggle("channel_whatsapp")}
        />
        <Toggle
          label="SMS Text Alerts"
          description="Urgent OTP and deal alerts via SMS"
          checked={formData.channel_sms === "true"}
          onChange={() => toggle("channel_sms")}
        />
        <Toggle
          label="Mobile & Web Push"
          description="Browser desktop notifications when CRM tab is in background"
          checked={formData.channel_push === "true"}
          onChange={() => toggle("channel_push")}
        />
      </FormCard>

      {/* Quiet Hours */}
      <FormCard
        title="Do Not Disturb / Quiet Hours"
        description="Mute non-urgent sound and push alerts during off-hours"
      >
        <Toggle
          label="Enable Quiet Hours"
          description="Silence notifications automatically between scheduled hours"
          checked={formData.quiet_hours_enabled === "true"}
          onChange={() => toggle("quiet_hours_enabled")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
          <FormField label="Quiet Start Time">
            <input
              type="time"
              value={formData.quiet_hours_start}
              onChange={(e) => setFormData((prev) => ({ ...prev, quiet_hours_start: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </FormField>
          <FormField label="Quiet End Time">
            <input
              type="time"
              value={formData.quiet_hours_end}
              onChange={(e) => setFormData((prev) => ({ ...prev, quiet_hours_end: e.target.value }))}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </FormField>
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
