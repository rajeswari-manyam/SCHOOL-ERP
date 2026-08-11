import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ── Timetable hooks ──────────────────────────────────────────────────────────
import {
  useTimetablePage,
  useClassList,
  useSectionsByClass,
  useDeleteTimetable,
} from "./hooks/useTimetable";

// ── Types ────────────────────────────────────────────────────────────────────
import type { DayOfWeek } from "./types/timetable.types";

// ── Components ───────────────────────────────────────────────────────────────
import WeeklyTimetableGrid from "./components/Weeklytimetablegrid";
import FreeTeachersPanel from "./components/FreeTeachersPanel";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { fetchAllWorkingDays } from "@/services/working-days.api";
import type { WorkingDayRecord } from "@/services/working-days.api";

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

// State handed back via navigate(path, { state }) when returning from the
// Add Period page, so the page lands on the same class/section instead of
// resetting to the defaults.
interface TimetableReturnState {
  activeClass?: { id: string; label: string };
  activeSection?: { id: string; label: string };
}

const TimetablePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnState = (location.state as TimetableReturnState | null) ?? {};

  const { activeYear, years } = useAcademicYears();
  const academicYearId = activeYear?.id ?? String(new Date().getFullYear());
  const academicYearOptions = (years ?? []).map((y: any) => ({
    id: y.id,
    label: y.yearName ?? y.year ?? y.name ?? y.academic_year ?? y.id,
  }));

  // Store selected class and section as { id: UUID, label: string }
  const [activeClass,   setActiveClass]   = useState(returnState.activeClass   ?? { id: "", label: "" });
  const [activeSection, setActiveSection] = useState(returnState.activeSection ?? { id: "", label: "" });
  const [classInitialised,   setClassInitialised]   = useState(!!returnState.activeClass);
  const [sectionInitialised, setSectionInitialised] = useState(!!returnState.activeSection);
  const [workingDays, setWorkingDays] = useState<WorkingDayRecord[]>([]);

  useEffect(() => {
    fetchAllWorkingDays().then(setWorkingDays).catch(() => {});
  }, []);

  const activeWD = workingDays.find((wd) => wd.academicYearId === academicYearId);
  const activeWDSelectedDays = activeWD?.selected_days;

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: classTabsData,   isLoading: classTabsLoading }  = useClassList();
  const { data: sectionTabsData, isLoading: sectionTabsLoading } = useSectionsByClass(activeClass.id);
  const { data, isLoading } = useTimetablePage(
    activeClass.id, activeClass.label,
    activeSection.id, activeSection.label,
    academicYearId,
  );
  // Auto-select first class on load
  useEffect(() => {
    const tabs = classTabsData ?? [];
    if (!classInitialised && tabs.length > 0) {
      setActiveClass({ id: tabs[0].id, label: tabs[0].label });
      setClassInitialised(true);
      setSectionInitialised(false); // reset so section auto-selects for new class
    }
  }, [classTabsData, classInitialised]);

  // Auto-select first section when class changes or sections load
  useEffect(() => {
    const sections = sectionTabsData ?? [];
    if (!sectionInitialised && sections.length > 0) {
      setActiveSection({ id: sections[0].id, label: sections[0].label });
      setSectionInitialised(true);
    }
  }, [sectionTabsData, sectionInitialised]);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const { mutate: deleteTimetable, isPending: isDeletingTimetable } = useDeleteTimetable();

  const goToAddPeriod = () =>
    navigate("/schooladmin/timetable/add-period", {
      state: {
        defaultClass: activeClass.id ? activeClass : undefined,
        defaultSection: activeSection.id ? activeSection : undefined,
      },
    });

  const [deletePeriodTarget, setDeletePeriodTarget] = useState<{
    id: string; day: DayOfWeek; periodNo: number; subject: string; teacherName: string;
  } | null>(null);
  const { classTabs = [], classTimetable } = data ?? {};
  const headingClass   = classTimetable?.classLabel ?? activeClass.label;
  const headingSection = classTimetable?.section    ?? activeSection.label;
  const selectedClassId = activeClass.id;

  return (
    <div className="min-h-screen ">
      <div className="px-3 sm:px-4 py-3">

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">Timetable</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {academicYearOptions.find(y => y.id === academicYearId)?.label ?? new Date().getFullYear()} Academic Year
            </p>
          </div>

          {/* Action buttons + class dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Class dropdown in header */}
            {classTabsLoading ? (
              <div className="h-10 w-36 rounded-xl bg-gray-100 animate-pulse" />
            ) : (
              <select
                value={selectedClassId}
                onChange={(e) => {
                  const tab = (classTabsData ?? classTabs).find((t) => t.id === e.target.value);
                  setActiveClass({ id: e.target.value, label: tab?.label ?? e.target.value });
                  setActiveSection({ id: "", label: "" });
                  setSectionInitialised(false);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 h-9 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-indigo-500"
              >
                {(classTabsData ?? classTabs).map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            )}
            <button
              onClick={goToAddPeriod}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 h-9 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Plus size={13} /> Add Period
            </button>
          </div>
        </div>

        {/* Section sub-tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
          {sectionTabsLoading ? (
            <div className="flex gap-1 p-3 overflow-x-auto">
              {[1,2,3].map((i) => (
                <div key={i} className="h-8 w-16 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (sectionTabsData ?? []).length === 0 ? null : (
            <div className="flex overflow-x-auto border-b border-gray-100 px-2">
              {(sectionTabsData ?? []).map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection({ id: sec.id, label: sec.label })}
                  className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeSection.id === sec.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  Section {sec.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weekly grid + Free Teachers panel */}
        <div className="mb-5 flex gap-5 items-start flex-col xl:flex-row">
          {/* Grid */}
          <div className="flex-1 min-w-0 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-52 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Loading timetable…
                </div>
              </div>
            ) : !activeSection.id ? (
              <div className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm gap-2">
                <p className="text-sm text-gray-400">Select a section to view the timetable.</p>
              </div>
            ) : !classTimetable || classTimetable.slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm gap-3">
                <p className="text-sm text-gray-400">No timetable found for {headingClass} – {headingSection}.</p>
                <button
                  onClick={goToAddPeriod}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                >
                  + Add the first period
                </button>
              </div>
            ) : (
              <div className="bg-white">
                <WeeklyTimetableGrid
                  timetable={classTimetable}
                  onEditCell={goToAddPeriod}
                  onEditPeriod={goToAddPeriod}
                  onDeletePeriod={(id, day, periodNo, subject, teacherName) =>
                    setDeletePeriodTarget({ id, day, periodNo, subject, teacherName })
                  }
                  workingDays={activeWDSelectedDays}
                />
              </div>
            )}
          </div>

          {/* Free Teachers panel — sidebar on xl, stacked on smaller */}
          <div className="w-full xl:w-72 xl:shrink-0">
            <FreeTeachersPanel />
          </div>
        </div>
      </div>

      {/* ── Delete Period Confirm Modal ─────────────────────────────── */}
      {deletePeriodTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <h3 className="text-lg font-black text-slate-900 mb-2">Delete Period</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {deletePeriodTarget.subject} ({deletePeriodTarget.teacherName})
              </span>{" "}
              on period {deletePeriodTarget.periodNo}? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletePeriodTarget(null)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Guard against sending an empty/unresolved id — this can
                  // only happen if the getalltimetable id-backfill lookup
                  // missed (e.g. that call failed for this page load); fail
                  // clearly instead of firing a doomed request that 404s.
                  if (!deletePeriodTarget.id) {
                    toast.error("Couldn't identify this period — please refresh the page and try again.");
                    return;
                  }
                  deleteTimetable(deletePeriodTarget.id, { onSuccess: () => setDeletePeriodTarget(null) });
                }}
                disabled={isDeletingTimetable}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeletingTimetable && <Loader2 size={14} className="animate-spin" />}
                {isDeletingTimetable ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
