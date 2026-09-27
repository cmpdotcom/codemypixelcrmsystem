import { AppShell } from "@/components/AppShell";
import { SettingsProvider } from "@/components/SettingsProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <AppShell>{children}</AppShell>
    </SettingsProvider>
  );
}
