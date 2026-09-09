import { SettingsSidebar } from "@/components/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full overflow-hidden">
      <SettingsSidebar />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full pb-12">
          {children}
        </div>
      </div>
    </div>
  );
}
