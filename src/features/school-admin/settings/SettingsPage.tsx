import React from "react";
import { type SettingsTab } from "./components/Settingssidebar";
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
  useFeeConfig,
  useUserAccounts,
  usePermissions,
  useWhatsApp,
} from "./hooks/useSettings";

// Settings Card Config
const SETTINGS_CARDS: { id: SettingsTab; title: string; description: string; icon: string; color: string }[] = [
  { id: "schoolProfile", title: "School Profile", description: "Manage school name, board, and principal details", icon: "building", color: "bg-indigo-100 text-indigo-600" },
  { id: "whatsapp", title: "WhatsApp & Notifications", description: "Configure message templates and alert settings", icon: "message", color: "bg-green-100 text-green-600" },
  { id: "academicConfig", title: "Academic Configuration", description: "Set working days, classes, and academic years", icon: "calendar", color: "bg-blue-100 text-blue-600" },
  { id: "feeConfig", title: "Fee Configuration", description: "Manage fee heads, structures, and transport slabs", icon: "banknote", color: "bg-emerald-100 text-emerald-600" },
  { id: "userAccounts", title: "User Accounts", description: "Create and manage staff login credentials", icon: "users", color: "bg-amber-100 text-amber-600" },
  { id: "permissions", title: "Permissions", description: "Set module access for different roles", icon: "shield", color: "bg-rose-100 text-rose-600" },
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("schoolProfile");

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const schoolProfile = useSchoolProfile();
  const academicConfig = useAcademicConfig();
  const feeConfig = useFeeConfig();
  const userAccounts = useUserAccounts();
  const permissions = usePermissions();
  const whatsapp = useWhatsApp();

  // ── Icon component ──────────────────────────────────────────────────────────
  const Icon = ({ name, className }: { name: string; className?: string }) => {
    const icons: Record<string, React.JSX.Element> = {
      building: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      message: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      calendar: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      banknote: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      users: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      shield: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    };
    return <div className={className}>{icons[name]}</div>;
  };

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
        return whatsapp.loading || !whatsapp.connection || !whatsapp.notifications ? (
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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* ─── Header ─────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Settings</h1>
        <p className="text-sm text-gray-600 mt-2">Configure and manage your school's operational preferences</p>
      </div>

      {/* ─── Settings Cards Grid ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {SETTINGS_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => setActiveTab(card.id)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-102"
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <Icon name={card.icon} className="w-6 h-6" />
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-sm font-bold text-gray-900">{card.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.description}</p>
            </div>

            {/* Open Arrow */}
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600">Configure</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Active Tab Content ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {SETTINGS_CARDS.find(c => c.id === activeTab)?.title}
          </h2>
          <button
            onClick={() => {}}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Back to Settings
          </button>
        </div>
        
        {renderTab()}
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