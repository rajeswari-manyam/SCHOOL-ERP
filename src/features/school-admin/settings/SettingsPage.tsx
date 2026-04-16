import React from "react";
import { SettingsSidebar, type SettingsTab } from "./components/Settingssidebar";
import { SchoolProfileTab } from "./components/Schoolprofiletab";
import { WhatsAppTab } from "./components/Whatsapptab";
import { AcademicConfigTab } from "./components/Academicconfigtab";
import { FeeConfigTab } from "./components/Feeconfigtab";
import { UserAccountsTab } from "./components/Useraccountstab";
import { PermissionsTab } from "./components/Permissionstab";
import IntegrationsTab from "./components/Integrationstab";
import {
  useSchoolProfile,
  useAcademicConfig,
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Handles the form submission by updating the school settings
 * and closing the form modal
 * @param {any} values - The form values to update the school settings with
 */
/*******  a92ce3aa-2e52-42c3-b761-38151f33458e  *******/  useFeeConfig,
  useUserAccounts,
  usePermissions,
  useWhatsApp,
} from "./hooks/useSettings";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("schoolProfile");

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const schoolProfile = useSchoolProfile();
  const academicConfig = useAcademicConfig();
  const feeConfig = useFeeConfig();
  const userAccounts = useUserAccounts();
  const permissions = usePermissions();
  const whatsapp = useWhatsApp();

  // ── Tab renderer ─────────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case "schoolProfile":
        return schoolProfile.loading || !schoolProfile.profile ? (
          <Loader />
        ) : (
          <SchoolProfileTab
            profile={schoolProfile.profile}
            saving={schoolProfile.saving}
            onSave={schoolProfile.save}
          />
        );

      case "whatsapp":
        return whatsapp.loading ||
          !whatsapp.connection ||
          !whatsapp.notifications ? (
          <Loader />
        ) : (
          <WhatsAppTab
            connection={whatsapp.connection}
            templates={whatsapp.templates}
            notifications={whatsapp.notifications}
            onToggleNotification={whatsapp.toggleNotification}
          />
        );

      case "academicConfig":
        return academicConfig.loading || !academicConfig.workingDays ? (
          <Loader />
        ) : (
          <AcademicConfigTab
            classes={academicConfig.classes}
            workingDays={academicConfig.workingDays}
            saving={academicConfig.saving}
            onSaveWorkingDays={academicConfig.saveWorkingDays}
            onAddClass={academicConfig.addNewClass}
          />
        );

      case "feeConfig":
        return feeConfig.loading || !feeConfig.insights ? (
          <Loader />
        ) : (
          <FeeConfigTab
            feeHeads={feeConfig.feeHeads}
            gradeStructures={feeConfig.gradeStructures}
            transportSlabs={feeConfig.transportSlabs}
            insights={feeConfig.insights}
            selectedGrade={feeConfig.selectedGrade}
            onSelectGrade={feeConfig.setSelectedGrade}
            onSaveStructure={feeConfig.saveStructure}
            saving={feeConfig.saving}
          />
        );

      case "userAccounts":
        return userAccounts.loading ? (
          <Loader />
        ) : (
          <UserAccountsTab
            users={userAccounts.users}
            totalCount={userAccounts.totalCount}
            page={userAccounts.page}
            totalPages={userAccounts.totalPages}
            onSetPage={userAccounts.setPage}
            onAddUser={userAccounts.addUser}
            onDeactivate={userAccounts.deactivateUser}
            onEdit={userAccounts.editUser}
          />
        );

      case "permissions":
        return permissions.loading ? (
          <Loader />
        ) : (
          <PermissionsTab
            rolePermissions={permissions.rolePermissions}
            selectedRole={permissions.selectedRole}
            onSelectRole={permissions.setSelectedRole}
            onSave={permissions.save}
            saving={permissions.saving}
          />
        );

      case "integrations":
        return <IntegrationsTab />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-4">
        <nav className="text-xs text-gray-400 mb-1">
          DASHBOARD &rsaquo; <span className="text-gray-600 font-medium">SETTINGS</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your school&apos;s configuration</p>
      </div>

      {/* Body */}
      <div className="flex gap-6 px-8 pb-12">
        <SettingsSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="flex-1 min-w-0">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

// ─── Loader ───────────────────────────────────────────────────────────────────

const Loader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default SettingsPage;