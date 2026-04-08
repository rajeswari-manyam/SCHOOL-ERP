import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
    <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
      {children}
    </div>
  </div>
);

export default AuthLayout;
