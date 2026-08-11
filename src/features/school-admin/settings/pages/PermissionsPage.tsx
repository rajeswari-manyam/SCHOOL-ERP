import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { PermissionsTab } from "../components/Permissionstab";
import { usePermissions } from "../hooks/useSettings";

const Loader = () => (
  <div className="flex items-center justify-center h-48 sm:h-64">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const PermissionsPage = () => {
  const navigate = useNavigate();
  const goBackToSettings = () => navigate("/schooladmin/settings");
  const permissions = usePermissions();

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBackToSettings} className="hover:text-gray-600 transition-colors">
          Settings
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Permissions</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-rose-100 text-rose-600">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">Permissions</h1>
            <p className="text-xs text-gray-400 truncate">Set module access for different roles</p>
          </div>
        </div>
        <button
          type="button"
          onClick={goBackToSettings}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {permissions.loading ? (
        <Loader />
      ) : (
        <PermissionsTab
          rolePermissions={permissions.rolePermissions}
          selectedRole={permissions.selectedRole}
          onSelectRole={permissions.setSelectedRole}
          onSave={permissions.save}
          saving={permissions.saving}
        />
      )}
    </div>
  );
};

export default PermissionsPage;
