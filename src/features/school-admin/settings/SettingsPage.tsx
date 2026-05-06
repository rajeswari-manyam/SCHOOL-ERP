import React from "react";
import { Building2, MessageSquare, Calendar, Banknote, Users, Shield, ChevronRight } from "lucide-react";
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
      building: <Building2 className="w-6 h-6" />,
      message: <MessageSquare className="w-6 h-6" />,
      calendar: <Calendar className="w-6 h-6" />,
      banknote: <Banknote className="w-6 h-6" />,
      users: <Users className="w-6 h-6" />,
      shield: <Shield className="w-6 h-6" />,
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
              <ChevronRight className="w-4 h-4 text-blue-600" />
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