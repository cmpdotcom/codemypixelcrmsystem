"use client";

import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  FormField,
  Input,
  Select,
  SaveBar,
} from "@/components/SettingsUI";

export default function GeneralSettingsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="General Settings"
        description="Configure basic CRM behavior and preferences"
      />

      <FormCard
        title="Company Basics"
        description="Core information about your organization"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Company Name">
            <Input placeholder="AmarSolution Ltd." />
          </FormField>
          <FormField label="Company Email">
            <Input type="email" placeholder="info@amarsolution.com" />
          </FormField>
          <FormField label="Company Phone">
            <Input placeholder="+880 1234 567890" />
          </FormField>
          <FormField label="Website">
            <Input placeholder="https://amarsolution.com" />
          </FormField>
          <FormField label="Industry">
            <Select
              options={[
                "Software & Technology",
                "Manufacturing",
                "Healthcare",
                "Education",
                "Real Estate",
                "Finance",
                "E-commerce",
                "Construction",
                "Logistics",
                "Marketing",
                "Other",
              ]}
            />
          </FormField>
          <FormField label="Country">
            <Select
              options={[
                "Bangladesh",
                "USA",
                "UK",
                "Canada",
                "Australia",
                "India",
                "Other",
              ]}
            />
          </FormField>
          <FormField label="Timezone">
            <Select
              options={[
                "Asia/Dhaka",
                "America/New_York",
                "Europe/London",
                "America/Los_Angeles",
                "Asia/Kolkata",
                "Asia/Dubai",
              ]}
            />
          </FormField>
          <FormField label="Currency">
            <Select
              options={[
                "BDT (৳)",
                "USD ($)",
                "EUR (€)",
                "GBP (£)",
                "INR (₹)",
                "AUD (A$)",
              ]}
            />
          </FormField>
          <FormField label="Date Format">
            <Select
              options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
            />
          </FormField>
          <FormField label="Time Format">
            <Select options={["12-hour", "24-hour"]} />
          </FormField>
          <FormField label="Language">
            <Select
              options={["English", "Bengali", "Hindi", "Arabic", "Spanish"]}
            />
          </FormField>
        </div>
      </FormCard>

      <FormCard
        title="CRM Preferences"
        description="Default views and pagination across the CRM"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Default Landing Page">
            <Select
              options={["Dashboard", "Leads", "Deals", "Activities", "Clients"]}
            />
          </FormField>
          <FormField label="Default Lead View">
            <Select options={["Kanban", "List", "Table"]} />
          </FormField>
          <FormField label="Default Deal View">
            <Select options={["Kanban", "List", "Table"]} />
          </FormField>
          <FormField label="Default Pagination">
            <Select options={["10", "25", "50", "100"]} />
          </FormField>
        </div>
      </FormCard>

      <SaveBar />
    </div>
  );
}
