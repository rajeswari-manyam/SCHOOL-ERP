import React from "react";
import { Building2, MessageSquare, Calendar, Banknote, Users, Shield, ChevronRight, ArrowLeft } from "lucide-react";
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

// ── Settings card config ───────────────────────────────────────────────────────

const SETTINGS_CARDS: {
  id: SettingsTab;
  title: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  { id: "schoolProfile",   title: "School Profile",           description: "Manage school name, board, and principal details",        icon: "building",  color: "bg-indigo-100 text-indigo-600" },
  { id: "whatsapp",        title: "WhatsApp & Notifications", description: "Configure message templates and alert settings",           icon: "message",   color: "bg-green-100 text-green-600"   },
  { id: "academicConfig",  title: "Academic Configuration",   description: "Set working days, classes, and academic years",            icon: "calendar",  color: "bg-blue-100 text-blue-600"     },
  { id: "feeConfig",       title: "Fee Configuration",        description: "Manage fee heads, structures, and transport slabs",        icon: "banknote",  color: "bg-emerald-100 text-emerald-600"},
  { id: "userAccounts",    title: "User Accounts",            description: "Create and manage staff login credentials",                icon: "users",     color: "bg-amber-100 text-amber-600"   },
  { id: "permissions",     title: "Permissions",              description: "Set module access for different roles",                    icon: "shield",    color: "bg-rose-100 text-rose-600"     },
];

// ── Icon map ───────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  building:  <Building2  className="w-5 h-5 sm:w-6 sm:h-6" />,
  message:   <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
  calendar:  <Calendar   className="w-5 h-5 sm:w-6 sm:h-6" />,
  banknote:  <Banknote   className="w-5 h-5 sm:w-6 sm:h-6" />,
  users:     <Users      className="w-5 h-5 sm:w-6 sm:h-6" />,
  shield:    <Shield     className="w-5 h-5 sm:w-6 sm:h-6" />,
};

// ── Loader ─────────────────────────────────────────────────────────────────────

const Loader: React.FC = () => (
  <div className="flex items-center justify-center h-48 sm:h-64">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ── Main page ──────────────────────────────────────────────────────────────────

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab | null>(null);

  // Data hooks
  const schoolProfile = useSchoolProfile();
  const academicConfig = useAcademicConfig();
  const feeConfig = useFeeConfig();
  const userAccounts = useUserAccounts();
  const permissions = usePermissions();
  const whatsapp = useWhatsApp();

  const activeCard = SETTINGS_CARDS.find(c => c.id === activeTab);

  // ── Tab renderer ────────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case "schoolProfile":
        return schoolProfile.loading || !schoolProfile.profile ? <Loader /> : (
          <SchoolProfileTab
            profile={schoolProfile.profile}
            saving={schoolProfile.saving}
            onSave={schoolProfile.save}
          />
        );
      case "whatsapp":
        return whatsapp.loading || !whatsapp.connection || !whatsapp.notifications ? <Loader /> : (
          <WhatsAppTab
            connection={whatsapp.connection}
            templates={whatsapp.templates}
            notifications={whatsapp.notifications}
            onToggleNotification={whatsapp.toggleNotification}
          />
        );
      case "academicConfig":
        return academicConfig.loading || !academicConfig.workingDays ? <Loader /> : (
          <AcademicConfigTab
            classes={academicConfig.classes}
            workingDays={academicConfig.workingDays}
            academicYears={academicConfig.academicYears}
            saving={academicConfig.saving}
            onSaveWorkingDays={academicConfig.saveWorkingDays}
            onAddClass={academicConfig.addNewClass}
            onCreateAcademicYear={academicConfig.createAcademicYear}
          />
        );
      case "feeConfig":
        return feeConfig.loading || !feeConfig.insights ? <Loader /> : (
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
        return userAccounts.loading ? <Loader /> : (
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
        return permissions.loading ? <Loader /> : (
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ── Page header ── */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Configure and manage your school's operational preferences
          </p>
        </div>

        {/* ── Settings cards grid ── */}
        {/* 1 col on xs, 2 on sm, 3 on xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {SETTINGS_CARDS.map((card) => {
            const isActive = activeTab === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveTab(card.id)}
                className={`w-full text-left bg-white rounded-2xl border shadow-sm p-4 sm:p-5 lg:p-6
                  flex flex-col gap-3 sm:gap-4
                  transition-all duration-200 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                  active:scale-[0.98]
                  ${isActive
                    ? "border-indigo-300 shadow-indigo-100 shadow-md ring-1 ring-indigo-200"
                    : "border-gray-100 hover:shadow-md hover:border-gray-200"
                  }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
                  {ICON_MAP[card.icon]}
                </div>

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{card.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{card.description}</p>
                </div>

                {/* Configure link */}
                <div className="mt-auto flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isActive ? "text-indigo-700" : "text-blue-600"}`}>
                    {isActive ? "Active" : "Configure"}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-indigo-600 translate-x-0.5" : "text-blue-600"}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active tab content panel ── */}
        {activeTab && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 lg:p-8">

            {/* Panel header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                {activeCard && (
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${activeCard.color}`}>
                    {ICON_MAP[activeCard.icon]}
                  </div>
                )}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {activeCard?.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab(null)}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs sm:text-sm text-gray-500
                  hover:text-gray-800 font-medium transition-colors
                  px-3 py-1.5 rounded-lg hover:bg-gray-100 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Settings
              </button>
            </div>

            {renderTab()}
          </div>
        )}

        {/* ── Empty state when no tab selected ── */}
        {!activeTab && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Select a settings category above to get started</p>
            <p className="text-xs text-gray-400 mt-1">All changes are saved automatically per section</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsPage;