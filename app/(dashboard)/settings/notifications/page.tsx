"use client";

import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Input,
  Toggle,
  SaveBar,
} from "@/components/SettingsUI";

export default function NotificationsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="Notification Settings"
        description="Control how and when you receive notifications"
      />

      {/* CRM Notifications */}
      <FormCard
        title="CRM Notifications"
        description="Choose which CRM events trigger notifications"
      >
        <Toggle label="New Lead" description="When a new lead is created" defaultOn />
        <Toggle
          label="Lead Assigned"
          description="When a lead is assigned to you"
          defaultOn
        />
        <Toggle
          label="Lead Qualified"
          description="When a lead is marked as qualified"
          defaultOn
        />
        <Toggle
          label="Deal Assigned"
          description="When a deal is assigned to you"
          defaultOn
        />
        <Toggle label="Deal Won" description="When a deal is won" defaultOn />
        <Toggle label="Deal Lost" description="When a deal is lost" />
        <Toggle
          label="Follow-up Due"
          description="When a follow-up is scheduled for today"
          defaultOn
        />
        <Toggle
          label="Follow-up Overdue"
          description="When a follow-up is past due"
          defaultOn
        />
        <Toggle
          label="Task Assigned"
          description="When a task is assigned to you"
          defaultOn
        />
        <Toggle label="Task Due" description="When a task is due today" defaultOn />
        <Toggle label="Task Overdue" description="When a task is past due" />
        <Toggle
          label="Payment Received"
          description="When a payment is received"
          defaultOn
        />
        <Toggle
          label="Payment Due"
          description="When a payment is due soon"
          defaultOn
        />
        <Toggle
          label="Project Milestone"
          description="When a project milestone is reached"
          defaultOn
        />
      </FormCard>

      {/* Notification Channels */}
      <FormCard
        title="Notification Channels"
        description="Select where you want to receive notifications"
      >
        <Toggle
          label="In-App"
          description="Receive notifications within the CRM application"
          defaultOn
        />
        <Toggle
          label="Email"
          description="Receive notifications via email"
          defaultOn
        />
        <Toggle
          label="WhatsApp"
          description="Receive notifications via WhatsApp"
        />
        <Toggle label="SMS" description="Receive notifications via SMS" />
        <Toggle
          label="Push"
          description="Receive push notifications on your devices"
          defaultOn
        />
      </FormCard>

      {/* Quiet Hours */}
      <FormCard
        title="Quiet Hours"
        description="Pause non-urgent notifications during specific hours"
      >
        <Toggle
          label="Enable quiet hours"
          description="Mute notifications during your specified quiet hours"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField label="Start time">
            <Input type="time" defaultValue="22:00" />
          </FormField>
          <FormField label="End time">
            <Input type="time" defaultValue="08:00" />
          </FormField>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
