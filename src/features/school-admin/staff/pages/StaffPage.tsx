import { useEffect, useMemo } from "react";
import type { TabKey } from "../types/staff.types";
import { useStaffStore } from "../store/usestore";
import { StatsCards } from "../components/StatCards";
import { StaffTabs } from "../components/StaffTabs";
import { StaffFilters } from "../components/StaffFilter";
import { StaffTable } from "../components/StaffTable";
import { LeaveRequestsTab } from "../components/LeaveRequistTable";
import { AddStaffModal } from "../components/AddStaffModal";
import { EditStaffModal } from "../components/EditStaffModal";
import { Button } from "../../../../components/ui/button";

const buildTabs = (
  teachers: number,
  nonTeaching: number,
  leavePending: number
) => [
  { key: "all" as TabKey, label: "All Staff" },
  { key: "teachers" as TabKey, label: "Teachers", count: teachers },
  { key: "non-teaching" as TabKey, label: "Non-Teaching", count: nonTeaching },
  {
    key: "leave-requests" as TabKey,
    label: "Leave Requests",
    count: leavePending,
  },
];

export default function StaffManagementPage() {
  const {
    activeTab,
    search,
    roleFilter,
    statusFilter,
    showModal,
    staffData,
    stats,
    loading,
    error,
    setActiveTab,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setShowModal,
    getFilteredStaff,
    loadStaff,
    editStaffMember,
    setEditStaffMember,
  } = useStaffStore();

  useEffect(() => {
    loadStaff();
  }, []);

  const filteredStaff = useMemo(
    () => getFilteredStaff(),
    [getFilteredStaff, activeTab, search, roleFilter, statusFilter, staffData]
  );

  const tabs = useMemo(
    () => buildTabs(stats.teachers, stats.nonTeaching, stats.leavePending),
    [stats]
  );

  return (
    <div className="min-h-screen bg-[#F7F8FB] font-sans">
      {showModal && <AddStaffModal onClose={() => setShowModal(false)} />}
      {editStaffMember && (
        <EditStaffModal staff={editStaffMember} onClose={() => setEditStaffMember(null)} />
      )}

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
        {/* Left: breadcrumb + title */}
        <div className="min-w-0">
          <div className="text-xs text-slate-400 flex items-center gap-1 truncate">
            <span>School</span>
            <span>/</span>
            <span>Staff</span>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight truncate">
            Staff
          </h1>
        </div>

        {/* Right: academic year label + CTA */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Hide academic year label on very small screens to save space */}
          <span className="hidden sm:inline text-sm text-slate-400 whitespace-nowrap">
            2023-24 Academic Year
          </span>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 gap-1.5 text-sm px-3 sm:px-4 py-2 whitespace-nowrap"
          >
            <span className="text-base leading-none">+</span>
            {/* Shorten label on mobile */}
            <span className="hidden sm:inline">Add Staff Member</span>
            <span className="sm:hidden">Add Staff</span>
          </Button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Stats cards — scroll horizontally on mobile if needed */}
        <div className="w-full overflow-x-auto">
          <StatsCards stats={stats} />
        </div>

        {/* Tabs — scroll horizontally on mobile */}
        <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <StaffTabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />
        </div>

        {staffData.length > 0 && (
          <details className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs">
            <summary className="cursor-pointer font-semibold text-blue-700">Raw API Response ({staffData.length} records)</summary>
            <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap text-blue-900">
              {JSON.stringify(staffData[0], null, 2)}
            </pre>
          </details>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadStaff}
              className="rounded-lg bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!error && loading && (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!error && !loading && activeTab === "leave-requests" ? (
          <div className="w-full overflow-x-auto">
            <LeaveRequestsTab staff={staffData} />
          </div>
        ) : !error && !loading ? (
          <>
            {/* Filters stack vertically on mobile, row on larger screens */}
            <StaffFilters
              search={search}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              onSearch={setSearch}
              onRoleChange={setRoleFilter}
              onStatusChange={setStatusFilter}
            />
            {/* Table scrolls horizontally on mobile */}
            <div className="w-full overflow-x-auto">
              <StaffTable staff={filteredStaff} total={staffData.length} onEdit={setEditStaffMember} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}