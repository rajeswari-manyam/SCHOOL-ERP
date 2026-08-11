import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSetupStatus } from "@/features/school-admin/dashboard/hooks/useSetupStatus";
import { AcademicConfigTab } from "../components/Academicconfigtab";
import {
  useAcademicConfig,
  useDepartments,
  useWorkingDays,
  useHolidays,
  useLeaveAllocations,
} from "../hooks/useSettings";

const Loader = () => (
  <div className="flex items-center justify-center h-48 sm:h-64">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AcademicConfigPage = () => {
  const navigate = useNavigate();
  const goBackToSettings = () => navigate("/schooladmin/settings");

  const { data: setupData } = useSetupStatus();
  const setupStatusList = setupData?.items ?? [];
  const academicConfigDone = setupStatusList.find(s => s.id === 'settings')?.done ?? false;

  const academicConfig = useAcademicConfig();
  const departments = useDepartments();
  const workingDays = useWorkingDays();
  const holidaysData = useHolidays();
  const leaveAllocations = useLeaveAllocations();

  const handleNext = () => {
    navigate('/schooladmin/staff', { state: { fromWizard: true, stepId: 'staff' } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBackToSettings} className="hover:text-gray-600 transition-colors">
          Settings
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Academic Configuration</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">Academic Configuration</h1>
            <p className="text-xs text-gray-400 truncate">Set working days, classes, and academic years</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {academicConfigDone && (
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </span>
          )}
          <button
            type="button"
            onClick={goBackToSettings}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {academicConfig.loading ? (
        <Loader />
      ) : (
        <AcademicConfigTab
          classes={academicConfig.classes}
          academicYears={academicConfig.academicYears}
          departments={departments.departments}
          departmentsSaving={departments.saving}
          workingDays={workingDays.workingDays}
          workingDaysSaving={workingDays.saving}
          onAddClass={academicConfig.addNewClass}
          onCreateAcademicYear={academicConfig.createAcademicYear}
          onUpdateAcademicYear={academicConfig.updateAcademicYear}
          onDeleteAcademicYear={academicConfig.deleteAcademicYear}
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
      )}

      {/* Wizard Next button */}
      <div className="flex items-center justify-end gap-3 pt-1">
        {academicConfigDone ? (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            Next: Add Staff
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs text-gray-400 italic">Complete academic configuration to proceed</span>
        )}
      </div>
    </div>
  );
};

export default AcademicConfigPage;
