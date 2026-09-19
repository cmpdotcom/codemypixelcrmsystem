import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SettingsProvider } from "@/components/SettingsProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <div className="flex h-screen overflow-hidden bg-[#f4f7fc]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </SettingsProvider>
  );
}
