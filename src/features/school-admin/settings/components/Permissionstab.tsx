import React, { useState } from "react";
import type { RolePermission, ModulePermission, UserRole } from "../types/settings.types";
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
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Permissions</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure module access per role</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {ROLE_OPTIONS.map(role => {
          const rp = rolePermissions.find(r => r.role === role);
          return (
            <button
              key={role}
              onClick={() => onSelectRole(role)}
              className={`p-4 rounded-xl border text-left transition-colors ${selectedRole === role
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-indigo-300"}`}
            >
              <p className="text-sm font-semibold text-gray-900">{role}</p>
              <p className="text-xs text-gray-500 mt-0.5">{rp?.userCount ?? 0} users</p>
              <p className="text-xs text-indigo-600 mt-1">{rp?.permissions.length ?? 0} permissions</p>
            </button>
          );
        })}
      </div>

      {current && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">{selectedRole} — Module Permissions</h3>
            <button
              onClick={() => onSave(localPerms)}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Permissions"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ALL_PERMISSIONS.map(perm => (
              <label key={perm} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPerms.includes(perm)}
                  onChange={() => toggle(perm)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm text-gray-800">{PERMISSION_LABELS[perm]}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};