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
import ResultsPage          from "../school-admin/results/ResultsPage";
import AcademicYearSetupWizard from "../school-admin/academic-year-setup/AcademicYearSetupWizard";

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
        <Route path="results"    element={<ResultsPage />} />
        <Route path="settings"    element={<SettingsPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}