import { useEffect, useMemo, useState } from "react";
import type { TabKey, StaffMember } from "../types/staff.types";
import type { LeaveRecord } from "@/services/school-staff.api";
import { useStaffStore, filterStaff } from "../store/usestore";
import { useUIStore } from "@/store/uiStore";
import { StatsCards } from "../components/StatCards";
import { StaffTabs } from "../components/StaffTabs";
import { StaffFilters } from "../components/StaffFilter";
import { StaffTable } from "../components/StaffTable";
import { LeaveRequestsTab } from "../components/LeaveRequistTable";
import { AddStaffModal } from "../components/AddStaffModal";
import { EditStaffModal } from "../components/EditStaffModal";
import BulkAddStaffModal from "../components/BulkAddStaffModal";
import { Button } from "../../../../components/ui/button";
import { StaffDetailModal } from "../components/StaffDetailModal";

const buildTabs = (staffData: StaffMember[], leaveData: LeaveRecord[]) => {
  const teachers = staffData.filter(s => s.isTeaching).length;
  const nonTeaching = staffData.filter(s => !s.isTeaching).length;
  const leavePending = leaveData.filter(l => l.status === "PENDING").length;
  return [
    { key: "all" as TabKey, label: "All Staff", count: staffData.length },
    { key: "teachers" as TabKey, label: "Teachers", count: teachers },
    { key: "non-teaching" as TabKey, label: "Non-Teaching", count: nonTeaching },
    { key: "leave-requests" as TabKey, label: "Leave Requests", count: leavePending },
  ];
};

export default function StaffManagementPage() {

  const {
    activeTab,
    search,
    roleFilter,
    statusFilter,
    showModal,
    staffData,
    leaveData,
    stats,
    loading,
    error,
    setActiveTab,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setShowModal,
    loadStaff,
    editStaffMember,
    setEditStaffMember,
    deleteStaff,
  } = useStaffStore();

  const academicYearId = useUIStore((s) => s.academicYearId);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [viewStaffId, setViewStaffId] = useState<string | null>(null);

  useEffect(() => {
    loadStaff();
  }, [academicYearId]);

  const filteredStaff = useMemo(
    () => filterStaff(staffData, activeTab, search, roleFilter, statusFilter),
    [staffData, activeTab, search, roleFilter, statusFilter]
  );

  const tabs = useMemo(
    () => buildTabs(staffData, leaveData),
    [staffData, leaveData]
  );

  return (
    <div className="space-y-0">
      {showModal && <AddStaffModal onClose={() => setShowModal(false)} />}
      {showBulkModal && <BulkAddStaffModal onClose={() => setShowBulkModal(false)} />}
      {editStaffMember && (
        <EditStaffModal staff={editStaffMember} onClose={() => setEditStaffMember(null)} />
      )}
      {viewStaffId && (
        <StaffDetailModal staffId={viewStaffId} onClose={() => setViewStaffId(null)} />
      )}

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
        {/* Left: breadcrumb + title with count */}
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-1">
            <span>School</span>
            <span className="text-indigo-500">›</span>
            <span className="text-indigo-600">Staff</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none">Staff</h1>
            <span className="text-sm font-semibold text-gray-400">{staffData.length} staff members</span>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setShowBulkModal(true)}
            variant="outline"
            className="gap-1.5 text-sm px-3 sm:px-4 py-2 whitespace-nowrap rounded-xl"
          >
            <span className="text-base leading-none font-bold">⇅</span>
            <span className="hidden sm:inline">Bulk Add</span>
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm gap-1.5 text-sm px-4 py-2 whitespace-nowrap rounded-xl"
          >
            <span className="text-base leading-none font-bold">+</span>
            <span className="hidden sm:inline">Add Staff Member</span>
            <span className="sm:hidden">Add</span>
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
            <LeaveRequestsTab leaves={leaveData} />
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
              <StaffTable staff={filteredStaff} total={staffData.length} onEdit={setEditStaffMember} onView={(s) => setViewStaffId(s.id)} onDelete={deleteStaff} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}