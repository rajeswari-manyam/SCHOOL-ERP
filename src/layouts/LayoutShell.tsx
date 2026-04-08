import { useUIStore } from "@/store/uiStore";


export const LayoutShell = ({
  sidebar,
  topbar,
  children,
}: {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
}) => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  return (
    <div className="flex min-h-screen">
      {sidebarOpen && <div className="hidden md:block">{sidebar}</div>}
      <div className="flex-1 flex flex-col">
        {topbar}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};
