import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Building2, MessageSquare, Calendar, Banknote, Users, Shield, ChevronRight, X } from "lucide-react";
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
  useDepartments,
  useWorkingDays,
  useHolidays,
  useLeaveAllocations,
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

// ── Settings Modal ─────────────────────────────────────────────────────────────

interface SettingsModalProps {
  activeTab: SettingsTab;
  activeCard: (typeof SETTINGS_CARDS)[number];
  onClose: () => void;
  children: React.ReactNode;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ activeCard, onClose, children }) => {
  // Close on Escape key
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while modal open
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Modal header */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${activeCard.color}`}>
              {ICON_MAP[activeCard.icon]}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                {activeCard.title}
              </h2>
              <p className="text-xs text-gray-400 truncate hidden sm:block">{activeCard.description}</p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab | null>(null);
  const location = useLocation();

  useEffect(() => {
    const openTab = (location.state as { openTab?: SettingsTab } | null)?.openTab;
    if (openTab) setActiveTab(openTab);
  }, [location.state]);

  // Data hooks
  const schoolProfile = useSchoolProfile();
  const academicConfig = useAcademicConfig();
  const departments = useDepartments();
  const workingDays = useWorkingDays();
  const holidaysData = useHolidays();
  const leaveAllocations = useLeaveAllocations();
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
        return academicConfig.loading ? <Loader /> : (
          <AcademicConfigTab
            classes={academicConfig.classes}
            academicYears={academicConfig.academicYears}
            departments={departments.departments}
            departmentsSaving={departments.saving}
            workingDays={workingDays.workingDays}
            workingDaysSaving={workingDays.saving}
            onAddClass={academicConfig.addNewClass}
            onCreateAcademicYear={academicConfig.createAcademicYear}
            onAddDepartment={departments.addDepartment}
            onBulkAddDepartments={departments.bulkAddDepartments}
            onEditDepartment={departments.editDepartment}
            onDeleteDepartment={departments.removeDepartment}
            onCreateWorkingDay={workingDays.createWorkingDay}
            onUpdateWorkingDay={workingDays.updateWorkingDay}
            onDeleteWorkingDay={workingDays.removeWorkingDay}
            holidays={holidaysData.holidays}
            holidaysSaving={holidaysData.saving}
            onCreateHoliday={holidaysData.createHoliday}
            onBulkAddHolidays={holidaysData.bulkAddHolidays}
            onUpdateHoliday={holidaysData.updateHoliday}
            onDeleteHoliday={holidaysData.removeHoliday}
            leaveAllocations={leaveAllocations.allocations}
            leaveAllocationsSaving={leaveAllocations.saving}
            onCreateLeaveAllocations={leaveAllocations.createAllocations}
            onUpdateLeaveAllocation={leaveAllocations.updateAllocation}
            onDeleteLeaveAllocation={leaveAllocations.removeAllocation}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {SETTINGS_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveTab(card.id)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 lg:p-6
                flex flex-col gap-3 sm:gap-4
                transition-all duration-200 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                hover:shadow-md hover:border-gray-200 active:scale-[0.98]"
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
                <span className="text-xs font-semibold text-blue-600">Configure</span>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* ── Modal ── */}
      {activeTab && activeCard && (
        <SettingsModal
          activeTab={activeTab}
          activeCard={activeCard}
          onClose={() => setActiveTab(null)}
        >
          {renderTab()}
        </SettingsModal>
      )}
    </div>
  );
};

export default SettingsPage;