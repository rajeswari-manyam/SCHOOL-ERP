// src/features/auth/components/RoleCredentials.tsx

import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

type Role = {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
};

type CopiedKey = "email" | "phone" | "password" | "otp" | null;

interface RoleCredentialsProps {
  roles: Role[];
  onRoleChange?: (id: string) => void;
}

export const RoleCredentials = ({ roles, onRoleChange }: RoleCredentialsProps) => {
  const [activeRole, setActiveRole] = useState<Role>(roles[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<CopiedKey>(null);

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    setShowPassword(false);
    setCopied(null);
    onRoleChange?.(role.id);
  };

  const handleCopy = (value: string, key: CopiedKey) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const fields: { label: string; value: string; key: CopiedKey }[] = [
    { label: "Email", value: activeRole.email, key: "email" },
    { label: "Phone", value: activeRole.phone, key: "phone" },
    { label: "Password", value: activeRole.password, key: "password" },
    { label: "OTP", value: activeRole.otp, key: "otp" },
  ];

  return (
    <div className="mt-6 pt-5 border-t border-gray-100 w-full max-w-md mx-auto">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">
        Test credentials by role
      </p>

      {/* Role pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => handleRoleChange(role)}
            className={`px-3 py-1 text-[11px] rounded-full border transition-all whitespace-nowrap`}
            style={
              activeRole.id === role.id
                ? { background: role.color, borderColor: role.color, color: "#fff" }
                : { background: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }
            }
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Credential rows */}
      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
        {fields.map(({ label, value, key }, idx) => {
          const isPassword = key === "password";
          const displayValue = isPassword ? (showPassword ? value : "••••••••••") : value;

          return (
            <div
              key={key}
              className={`flex items-center justify-between px-3 py-2 text-xs sm:text-sm ${
                idx !== 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <span className="text-gray-400 w-20 shrink-0">{label}</span>
              <span className="font-mono text-gray-700 flex-1 truncate">{displayValue}</span>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleCopy(value, key)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {copied === key ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};