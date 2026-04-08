import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const TeacherLayout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    {/* Teacher Sidebar/Nav here */}
    <main className="flex-1 p-6">{children}</main>
  </div>
);

export default TeacherLayout;
