import { SettingsMobileNav, SettingsSidebar } from "@/components/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <SettingsSidebar />
      <SettingsMobileNav />
      <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto w-full pb-12">
          {children}
        </div>
      </div>
    </div>
  );
}
