// src/features/auth/pages/OtpPage.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { OtpInput } from "../components/OtpInput";
import { RoleBrandingPanel } from "../components/RoleBrandingPanel";
import { useAuthStore } from "../../../store/authStore";
const PHONE_ROLE_MAP: Record<string, string> = {
  "9000000001": "superadmin",
  "9000000002": "schooladmin",
  "9000000003": "teacher",
  "9000000004": "accountant",
  "9000000005": "parent",
  "9000000006": "student",
};
export default function OtpPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const phone: string = location.state?.phone ?? "";
const roleRedirect = (role?: string): string => {
  switch (role) {
    case "superadmin": return "/superadmin/dashboard";
    case "schooladmin": return "/schooladmin/dashboard";
    case "accountant": return "/accountant/dashboard";
    case "teacher": return "/teacher/dashboard";
    case "student": return "/student/dashboard";
    case "parent": return "/parent/dashboard";
    default: return "/login";
  }
};
 
const handleVerified = () => {
  const cleanedPhone = phone.replace(/\D/g, "").slice(-10);

  console.log("Cleaned:", cleanedPhone);

  const role = PHONE_ROLE_MAP[cleanedPhone];

  console.log("Role:", role);

  if (!role) {
    console.log("No role found for phone:", cleanedPhone);
    navigate("/login");
    return;
  }

  setAuth(
    {
      id: "phone-user",
      name: "Phone User",
      phone: cleanedPhone,
      role: role,
    },
    "dummy-token"
  );

  navigate(roleRedirect(role), { replace: true });
};
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">

            {/* ── Left panel ── */}
            <div className="flex-1 flex flex-col px-6 py-10 sm:px-12">

                {/* Logo */}
                <div className="mb-10">
                    <p className="text-lg font-bold text-gray-900 tracking-tight">SchoolERP</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Manyam Technologies</p>
                </div>

                {/* Centered form area */}
                <div className="flex-1 flex flex-col justify-center max-w-sm">

                    {/* Header */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-pink-600 uppercase tracking-widest mb-1">
                            Parent Portal
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900">OTP Verification</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Enter the code sent to your number
                        </p>
                    </div>

                    {/* OTP component — already has boxes, timer, resend, verify button */}
                    <OtpInput
                        phone={phone}
                        onVerified={handleVerified}
                        onBack={() => navigate("/login")}
                    />

                    {/* Footer */}
                    <div className="flex items-center gap-1.5 mt-6 text-xs text-gray-400">
                        <Shield size={12} />
                        <span>Secure encrypted login by Manyam</span>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mt-10">
                    © 2024 EduCurator Systems. All rights reserved.
                </p>
            </div>

            {/* ── Right branding panel (reuse existing) ── */}
            <RoleBrandingPanel roleId="parent" />
        </div>
    );
}