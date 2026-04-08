import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const SchoolAdminLayout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    {/* School Admin Sidebar/Nav here */}
    <main className="flex-1 p-6">{children}</main>
  </div>
);

export default SchoolAdminLayout;
