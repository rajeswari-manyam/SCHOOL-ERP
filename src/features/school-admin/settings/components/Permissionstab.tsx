import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { RolePermission, ModulePermission } from "../types/settings.types";
import { PERMISSION_LABELS, ALL_PERMISSIONS, ROLE_OPTIONS } from "../utils/Settings.utils";

interface Props {
  rolePermissions: RolePermission[];
  selectedRole: string;
  onSelectRole: (role: string) => void;
  onSave: (permissions: ModulePermission[]) => void;
  saving: boolean;
}

export const PermissionsTab: React.FC<Props> = ({
  rolePermissions, selectedRole, onSelectRole, onSave, saving,
}) => {
  const current = rolePermissions.find(r => r.role === selectedRole);
  const [localPerms, setLocalPerms] = useState<ModulePermission[]>(current?.permissions ?? []);

  React.useEffect(() => {
    setLocalPerms(current?.permissions ?? []);
  }, [selectedRole, current]);

  const toggle = (perm: ModulePermission) => {
    setLocalPerms(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="w-full space-y-5 sm:space-y-8">

      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-blue-500/30">
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Permissions</h2>
        <p className="text-blue-100 text-sm sm:text-base mt-1.5">
          Configure module access per role and manage user capabilities
        </p>
      </div>

      {/* ── Role selector grid ── */}
      {/* 2 cols on mobile → 4 cols on md+ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {ROLE_OPTIONS.map((role) => {
          const rp = rolePermissions.find((r) => r.role === role);
          const isActive = selectedRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onSelectRole(role)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                active:scale-95 sm:hover:scale-105
                ${isActive
                  ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
            >
              <p className={`text-xs sm:text-sm font-bold truncate ${isActive ? "text-blue-600" : "text-gray-900"}`}>
                {role}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                {rp?.userCount ?? 0} users
              </p>
              <p className={`text-[11px] sm:text-xs font-semibold mt-1.5 ${isActive ? "text-indigo-600" : "text-blue-500"}`}>
                {rp?.permissions.length ?? 0} permissions
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Permissions editor ── */}
      {current && (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border-2 border-blue-200 p-4 sm:p-6 lg:p-8 shadow-lg shadow-blue-100/50">

          {/* Header: title + save button */}
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-snug">
              {selectedRole}{" "}
              <span className="text-blue-600">Module Permissions</span>
            </h3>
            <Button
              onClick={() => onSave(localPerms)}
              disabled={saving}
              className="flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600
                text-white rounded-xl text-sm font-bold
                hover:shadow-lg hover:shadow-blue-500/40
                disabled:opacity-60 disabled:cursor-not-allowed
                active:scale-95 transition-all duration-200"
            >
              {saving ? "Saving…" : "Save Permissions"}
            </Button>
          </div>

          {/* Permission checkboxes: 1 col → 2 cols on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {ALL_PERMISSIONS.map((perm) => {
              const checked = localPerms.includes(perm);
              return (
                <label
                  key={perm}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer
                    transition-all duration-200 select-none
                    active:scale-[0.98]
                    ${checked
                      ? "border-blue-300 bg-blue-50"
                      : "border-blue-100 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                >
                  <Checkbox
                    checked={checked}
                    onChange={() => toggle(perm)}
                    className="flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
                    {PERMISSION_LABELS[perm]}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};