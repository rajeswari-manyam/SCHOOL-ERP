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
    <div>
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30">
        <h2 className="text-3xl font-bold">Permissions</h2>
        <p className="text-blue-100 mt-2">Configure module access per role and manage user capabilities</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {ROLE_OPTIONS.map((role) => {
          const rp = rolePermissions.find((r) => r.role === role);
          return (
            <Button
              key={role}
              variant="outline"
              onClick={() => onSelectRole(role)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 transform hover:scale-105 ${
                selectedRole === role
                  ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/30"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <p className={`text-sm font-bold ${selectedRole === role ? "text-blue-600" : "text-gray-900"}`}>{role}</p>
              <p className="text-xs text-gray-500 mt-1">{rp?.userCount ?? 0} users</p>
              <p className={`text-xs font-semibold mt-2 ${selectedRole === role ? "text-indigo-600" : "text-blue-500"}`}>{rp?.permissions.length ?? 0} permissions</p>
            </Button>
          );
        })}
      </div>

      {current && (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border-2 border-blue-200 p-8 shadow-lg shadow-blue-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{selectedRole} <span className="text-blue-600">Module Permissions</span></h3>
            <Button
              onClick={() => onSave(localPerms)}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {saving ? "Saving…" : "Save Permissions"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ALL_PERMISSIONS.map((perm) => (
              <label key={perm} className="flex items-center gap-3 p-4 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 transform hover:scale-102">
                <Checkbox
                  checked={localPerms.includes(perm)}
                  onChange={() => toggle(perm)}
                />
                <span className="text-sm font-medium text-gray-800">{PERMISSION_LABELS[perm]}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};