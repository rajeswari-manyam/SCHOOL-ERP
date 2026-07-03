import { type ReactNode, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import SchoolAdminLayout from "../../layouts/SchoolAdminLayout";
import { DashboardPage }    from "../school-admin/dashboard/DashboardPage";
import AttendancePage       from "../school-admin/attendance/AttendancePage";
import StaffManagementPage  from "../school-admin/staff/pages/StaffPage";
import StaffProfilePage     from "../school-admin/staff/pages/StaffProfilePage";
import StudentsPage         from "../school-admin/students/StudentsPage";
import StudentProfilePage   from "../school-admin/students/components/StudentProfilePage";
import { AdmissionsPage }   from "../school-admin/admissions/AdmissionsPage";
import { FeesPage as FeeCollectionPage } from "../school-admin/fees";
import { ReportsPage }      from "../school-admin/reports";
import { SettingsPage }     from "./settings";
import TimetablePage        from "../school-admin/timetable/TimetablePage";
import ClassesPage          from "../school-admin/classes/ClassesPage";
import AcademicYearSetupWizard from "../school-admin/academic-year-setup/AcademicYearSetupWizard";

import { useCarryForwardStore } from "@/store/carryForwardStore";
import { getCarryForwardStatus } from "@/services/academicYear.api";

// ── Guard: checks carry-forward status once per session ───────────────────────
// If carry-forward is pending, redirects to the setup wizard.
// Shows a brief loading screen while the check is in-flight.

function CarryForwardGuard({ children }: { children: ReactNode }) {
  const { checked, complete, setStatus } = useCarryForwardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (checked) {
      if (!complete) navigate("/schooladmin/academic-year-setup", { replace: true });
      return;
    }
    getCarryForwardStatus()
      .then((res) => {
        setStatus(res.completed);
        if (!res.completed) {
          navigate("/schooladmin/academic-year-setup", { replace: true });
        }
      })
      .catch(() => {
        // On error assume complete — never block the user.
        setStatus(true);
      });
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

export default function SchoolAdminRouter() {
  return (
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
        <Route path="classes"     element={<ClassesPage />} />
        <Route path="staff"       element={<StaffManagementPage />} />
        <Route path="staff/:id"   element={<StaffProfilePage />} />
        <Route path="attendance"  element={<AttendancePage />} />
        <Route path="students"    element={<StudentsPage />} />
        <Route path="students/:id" element={<StudentProfilePage />} />
        <Route path="timetable"   element={<TimetablePage />} />
        <Route path="fees"        element={<FeeCollectionPage />} />
        <Route path="reports"     element={<ReportsPage />} />
        <Route path="settings"    element={<SettingsPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
