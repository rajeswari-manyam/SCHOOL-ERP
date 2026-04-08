import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const SuperAdminLayout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    {/* Super Admin Sidebar/Nav here */}
    <main className="flex-1 p-6">{children}</main>
  </div>
);

export default SuperAdminLayout;
