import { type ReactNode, Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import SchoolAdminLayout from "../../layouts/SchoolAdminLayout";

// Every route below is its own lazy chunk — otherwise the very first page a
// school admin sees (the dashboard) has to wait for every other page's code
// (students, staff, timetable, fees, reports, settings, ...) to download too,
// since a static import bundles its module into the same chunk as whatever
// imports it.
const DashboardPage         = lazy(() => import("../school-admin/dashboard/DashboardPage").then(m => ({ default: m.DashboardPage })));
const AttendancePage        = lazy(() => import("../school-admin/attendance/AttendancePage"));
const MarkAttendancePage    = lazy(() => import("../school-admin/attendance/MarkAttendancePage"));
const MarkStaffAttendancePage = lazy(() => import("../school-admin/attendance/MarkStaffAttendancePage"));
const HolidaysPage          = lazy(() => import("../school-admin/attendance/HolidaysPage"));
const AddHolidayPage        = lazy(() => import("../school-admin/attendance/AddHolidayPage"));
const ImportHolidaysExcelPage = lazy(() => import("../school-admin/attendance/ImportHolidaysExcelPage"));
const StaffManagementPage   = lazy(() => import("../school-admin/staff/pages/StaffPage"));
const StaffProfilePage      = lazy(() => import("../school-admin/staff/pages/StaffProfilePage"));
const AddStaffPage          = lazy(() => import("../school-admin/staff/components/AddStaffPage").then(m => ({ default: m.AddStaffPage })));
const ImportStaffExcelPage  = lazy(() => import("../school-admin/staff/components/ImportStaffExcelPage"));
const LeavesPage            = lazy(() => import("../school-admin/staff/pages/LeavesPage"));
const StudentsPage          = lazy(() => import("../school-admin/students/StudentsPage"));
const StudentProfilePage    = lazy(() => import("../school-admin/students/components/StudentProfilePage"));
const AddStudentPage        = lazy(() => import("../school-admin/students/components/AddStudentPage"));
const ImportStudentsExcelPage = lazy(() => import("../school-admin/students/components/ImportStudentsExcelPage"));
const PromoteStudentsPage   = lazy(() => import("../school-admin/students/components/PromoteStudentsPage"));
const AdmissionsPage        = lazy(() => import("../school-admin/admissions/AdmissionsPage").then(m => ({ default: m.AdmissionsPage })));
const AddEnquiryPage        = lazy(() => import("../school-admin/admissions/components/AddEnquiryPage").then(m => ({ default: m.AddEnquiryPage })));
const FeeCollectionPage     = lazy(() => import("../school-admin/fees").then(m => ({ default: m.FeesPage })));
const ReportsPage           = lazy(() => import("../school-admin/reports").then(m => ({ default: m.ReportsPage })));
const GenerateReportPage    = lazy(() => import("../school-admin/reports").then(m => ({ default: m.GenerateReportPage })));
const AttendanceReportPage  = lazy(() => import("../school-admin/reports").then(m => ({ default: m.AttendanceReportPage })));
const StudentReportPage     = lazy(() => import("../school-admin/reports").then(m => ({ default: m.StudentReportPage })));
const FeeCollectionReportPage = lazy(() => import("../school-admin/reports").then(m => ({ default: m.FeeCollectionReportPage })));
const StaffReportPage       = lazy(() => import("../school-admin/reports").then(m => ({ default: m.StaffReportPage })));
const SettingsPage          = lazy(() => import("./settings").then(m => ({ default: m.SettingsPage })));
const SchoolProfilePage     = lazy(() => import("./settings").then(m => ({ default: m.SchoolProfilePage })));
const WhatsAppSettingsPage  = lazy(() => import("./settings").then(m => ({ default: m.WhatsAppSettingsPage })));
const AcademicConfigPage    = lazy(() => import("./settings").then(m => ({ default: m.AcademicConfigPage })));
const FeeConfigPage         = lazy(() => import("./settings").then(m => ({ default: m.FeeConfigPage })));
const UserAccountsPage      = lazy(() => import("./settings").then(m => ({ default: m.UserAccountsPage })));
const PermissionsPage       = lazy(() => import("./settings").then(m => ({ default: m.PermissionsPage })));
const PlanBillingPage       = lazy(() => import("./settings").then(m => ({ default: m.PlanBillingPage })));
const MyProfilePage         = lazy(() => import("./profile/pages/ProfilePage"));
const TimetablePage         = lazy(() => import("../school-admin/timetable/TimetablePage"));
const ExamTimetablePage     = lazy(() => import("../school-admin/timetable/ExamTimetablePage"));
const AddPeriodPage         = lazy(() => import("../school-admin/timetable/components/AddPeriodPage"));
const AddExamTimetablePage  = lazy(() => import("../school-admin/timetable/components/AddExamTimetablePage"));
const ClassesPage           = lazy(() => import("../school-admin/classes/ClassesPage"));
const ResultsPage           = lazy(() => import("../school-admin/results/ResultsPage"));
const SupportTicketPage     = lazy(() => import("../school-admin/support/SupportTicketPage"));
const RaiseTicketPage       = lazy(() => import("../school-admin/support/RaiseTicketPage"));
const AnnouncementsPage     = lazy(() => import("../school-admin/announcements/AnnouncementsPage"));
const AnnouncementFormPage  = lazy(() => import("../school-admin/announcements/AnnouncementFormPage"));
const AcademicYearSetupWizard = lazy(() => import("../school-admin/academic-year-setup/AcademicYearSetupWizard"));

import { useCarryForwardStore } from "@/store/carryForwardStore";
import {
  getAllAcademicYears,
  checkCarryForwardEligibility,
  isCarryForwardCompleted,
} from "@/services/academicYear.api";
import { getPreviousAcademicYear } from "@/components/common/hooks/useAcademicYears";

// ── Guard: checks carry-forward eligibility once per session ──────────────────
// There's no backend status endpoint for this, so eligibility is derived
// locally: fetch the academic years, find the previous one relative to the
// active year, and ask previewCarryForward whether it actually has records to
// copy. "Already run" is tracked in localStorage (see isCarryForwardCompleted).
// A school's first-ever academic year has nothing to carry forward from, so
// the user goes straight to the Dashboard.
// Shows a brief loading screen while the check is in-flight.

function CarryForwardGuard({ children }: { children: ReactNode }) {
  const { checked, complete, setStatus } = useCarryForwardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (checked) {
      if (!complete) navigate("/schooladmin/academic-year-setup", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await getAllAcademicYears();
        const years = res.data ?? [];
        const activeYear = years.find((y) => y.active) ?? years[0] ?? null;
        const previousYear = activeYear ? getPreviousAcademicYear(years, activeYear) : null;

        if (!activeYear || !previousYear || isCarryForwardCompleted(activeYear.id)) {
          setStatus(true);
          return;
        }

        const eligible = await checkCarryForwardEligibility(previousYear.id);
        setStatus(!eligible);
        if (eligible) {
          navigate("/schooladmin/academic-year-setup", { replace: true });
        }
      } catch {
        // On error assume nothing to carry forward — never block the user.
        setStatus(true);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Checking academic year status…</span>
      </div>
    );
  }

  if (!complete) return null; // redirect is in progress

  return <>{children}</>;
}

// ── Router ────────────────────────────────────────────────────────────────────

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

export default function SchoolAdminRouter() {
  return (
    <Suspense fallback={<RouteLoader />}>
    <Routes>
      {/* Setup wizard — full screen, no sidebar layout */}
      <Route path="academic-year-setup" element={<AcademicYearSetupWizard />} />

      {/* All other pages inside the sidebar layout */}
      <Route element={<SchoolAdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            <CarryForwardGuard>
              <DashboardPage />
            </CarryForwardGuard>
          }
        />

        <Route path="admissions"  element={<AdmissionsPage />} />
        <Route path="admissions/add" element={<AddEnquiryPage />} />
        <Route path="classes"     element={<ClassesPage />} />
        <Route path="staff"       element={<StaffManagementPage />} />
        <Route path="staff/add"      element={<AddStaffPage />} />
        <Route path="staff/import" element={<ImportStaffExcelPage />} />
        {/* Old Bulk Add route, replaced by Excel Import — kept as a redirect so stale links/bookmarks still land somewhere valid. */}
        <Route path="staff/bulk-add" element={<Navigate to="/schooladmin/staff/import" replace />} />
        <Route path="staff/leaves" element={<LeavesPage />} />
        <Route path="staff/:id"   element={<StaffProfilePage />} />
        <Route path="attendance"  element={<AttendancePage />} />
        <Route path="attendance/mark" element={<MarkAttendancePage />} />
        <Route path="attendance/mark-staff" element={<MarkStaffAttendancePage />} />
        <Route path="holidays"    element={<HolidaysPage />} />
        <Route path="holidays/add" element={<AddHolidayPage />} />
        <Route path="holidays/import" element={<ImportHolidaysExcelPage />} />
        <Route path="students"    element={<StudentsPage />} />
        <Route path="students/add" element={<AddStudentPage />} />
        <Route path="students/import" element={<ImportStudentsExcelPage />} />
        {/* Old Bulk Add route, replaced by Excel Import — kept as a redirect so stale links/bookmarks still land somewhere valid. */}
        <Route path="students/bulk-add" element={<Navigate to="/schooladmin/students/import" replace />} />
        <Route path="students/promote" element={<PromoteStudentsPage />} />
        <Route path="students/:id" element={<StudentProfilePage />} />
        <Route path="timetable"   element={<TimetablePage />} />
        <Route path="timetable/exams" element={<ExamTimetablePage />} />
        <Route path="timetable/add-period" element={<AddPeriodPage />} />
        <Route path="timetable/add-exam-timetable" element={<AddExamTimetablePage />} />
        <Route path="fees"        element={<FeeCollectionPage />} />
        <Route path="reports"     element={<ReportsPage />} />
        <Route path="reports/generate" element={<GenerateReportPage />} />
        <Route path="reports/attendance" element={<AttendanceReportPage />} />
        <Route path="reports/student" element={<StudentReportPage />} />
        <Route path="reports/fee-collection" element={<FeeCollectionReportPage />} />
        <Route path="reports/staff" element={<StaffReportPage />} />
        <Route path="results"    element={<ResultsPage />} />
        <Route path="support"    element={<SupportTicketPage />} />
        <Route path="support/new" element={<RaiseTicketPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="announcements/new" element={<AnnouncementFormPage />} />
        <Route path="settings"    element={<SettingsPage />} />
        <Route path="settings/school-profile"  element={<SchoolProfilePage />} />
        <Route path="settings/whatsapp"        element={<WhatsAppSettingsPage />} />
        <Route path="settings/academic-config" element={<AcademicConfigPage />} />
        <Route path="settings/fee-config"      element={<FeeConfigPage />} />
        <Route path="settings/user-accounts"   element={<UserAccountsPage />} />
        <Route path="settings/permissions"     element={<PermissionsPage />} />
        <Route path="settings/billing"         element={<PlanBillingPage />} />
        <Route path="profile" element={<MyProfilePage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
    </Suspense>
  );
}