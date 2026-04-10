// src/features/auth/pages/LoginPage.tsx
import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RoleCredentials } from "../components/RoleCredentials";
import { RoleBrandingPanel } from "../components/RoleBrandingPanel";
import { LoginLogo } from "../components/LoginLogo";
import type { RoleId } from "../components/RoleBrandingPanel";

export const TEST_ROLES = [
  { id: "superadmin" as RoleId, label: "Super admin", color: "#4f46e5", bgColor: "#eef2ff", textColor: "#3730a3", email: "superadmin@manyam.in", phone: "+91 90000 00001", password: "Super@123", otp: "112233" },
  { id: "schooladmin" as RoleId, label: "School admin", color: "#0891b2", bgColor: "#ecfeff", textColor: "#164e63", email: "schooladmin@demo.school", phone: "+91 90000 00002", password: "School@123", otp: "223344" },
  { id: "teacher" as RoleId, label: "Teacher", color: "#059669", bgColor: "#ecfdf5", textColor: "#065f46", email: "ravi.kumar@demo.school", phone: "+91 90000 00003", password: "Teacher@123", otp: "334455" },
  { id: "accountant" as RoleId, label: "Accountant", color: "#d97706", bgColor: "#fffbeb", textColor: "#78350f", email: "priya.sharma@demo.school", phone: "+91 90000 00004", password: "Accounts@123", otp: "445566" },
  { id: "parent" as RoleId, label: "Parent", color: "#db2777", bgColor: "#fdf2f8", textColor: "#831843", email: "suresh.reddy@parent.in", phone: "+91 90000 00005", password: "Parent@123", otp: "556677" },
  { id: "student" as RoleId, label: "Student", color: "#7c3aed", bgColor: "#f5f3ff", textColor: "#4c1d95", email: "anjali.reddy@student.in", phone: "+91 90000 00006", password: "Student@123", otp: "667788" },
];

const LoginPage = () => {
  const [activeRoleId, setActiveRoleId] = useState<RoleId>("superadmin");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
        <div className="w-full max-w-md mx-auto">
          <LoginLogo size="full" />

          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          {/* ✅ No onPhoneSend prop — LoginForm navigates to /otp itself */}
          <LoginForm />

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <a href="/contact-support" className="text-indigo-600 hover:underline font-medium">
              Contact support
            </a>
          </p>

          <RoleCredentials
            roles={TEST_ROLES}
            onRoleChange={(id) => setActiveRoleId(id as RoleId)}
          />
        </div>
      </div>

      <RoleBrandingPanel roleId={activeRoleId} />
    </div>
  );
};

export default LoginPage;