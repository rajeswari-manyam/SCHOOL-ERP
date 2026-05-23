import { useMemo } from "react";
import type { TabKey } from "../types/staff.types";
import { useStaffStore } from "../store/usestore";
import { StatsCards } from "../components/StatCards";
import { StaffTabs } from "../components/StaffTabs";
import { StaffFilters } from "../components/StaffFilter";
import { StaffTable } from "../components/StaffTable";
import { LeaveRequestsTab } from "../components/LeaveRequistTable";
import { AddStaffModal } from "../components/AddStaffModal";
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
    setActiveTab,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setShowModal,
    getFilteredStaff,
  } = useStaffStore();

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

        {activeTab === "leave-requests" ? (
          <div className="w-full overflow-x-auto">
            <LeaveRequestsTab staff={staffData} />
          </div>
        ) : (
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
              <StaffTable staff={filteredStaff} total={staffData.length} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}