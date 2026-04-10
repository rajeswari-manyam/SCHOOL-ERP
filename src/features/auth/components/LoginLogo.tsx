// src/features/auth/components/LoginLogo.tsx

import { Layers } from "lucide-react";

interface LoginLogoProps {
  size?: "full" | "mini";
}

export const LoginLogo = ({ size = "full" }: LoginLogoProps) => {
  if (size === "mini") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900">SchoolERP</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-3">
        <Layers className="w-7 h-7 text-white" />
      </div>
      <span className="text-lg font-bold text-gray-900">SchoolERP</span>
      <span className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">
        Manyam Technologies
      </span>
    </div>
  );
};