import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TabKey, StaffMember } from "../types/staff.types";
import type { LeaveBalanceResponse } from "@/services/staff.api";
import { getStaffLeaveBalance } from "@/services/staff.api";
import { useStaffStore, filterStaff } from "../store/usestore";
import { useUIStore } from "@/store/uiStore";
import { StatsCards } from "../components/StatCards";
import { StaffTabs } from "../components/StaffTabs";
import { StaffFilters } from "../components/StaffFilter";
import { StaffTable } from "../components/StaffTable";
import { EditStaffModal } from "../components/EditStaffModal";
import { Button } from "../../../../components/ui/button";
import { StaffDetailModal } from "../components/StaffDetailModal";
import { SetupProgressBanner } from "@/features/school-admin/dashboard/components/SetupProgressBanner";

const buildTabs = (staffData: StaffMember[]) => {
  const teachers = staffData.filter(s => s.isTeaching).length;
  const nonTeaching = staffData.filter(s => !s.isTeaching).length;
  return [
    { key: "all" as TabKey, label: "All Staff", count: staffData.length },
    { key: "teachers" as TabKey, label: "Teachers", count: teachers },
    { key: "non-teaching" as TabKey, label: "Non-Teaching", count: nonTeaching },
  ];
};

export default function StaffManagementPage() {

  const navigate = useNavigate();

  const {
    activeTab,
    search,
    roleFilter,
    statusFilter,
    selectedStaffId,
    staffData,
    stats,
    loading,
    error,
    setActiveTab,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setSelectedStaffId,
    loadStaff,
    editStaffMember,
    setEditStaffMember,
    deleteStaff,
  } = useStaffStore();

  const academicYearId = useUIStore((s) => s.academicYearId);

  const [viewStaffId, setViewStaffId] = useState<string | null>(null);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceResponse | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    loadStaff();
  }, [academicYearId]);

  useEffect(() => {
    if (!selectedStaffId || !academicYearId) {
      setLeaveBalance(null);
      setBalanceLoading(false);
      return;
    }
    setBalanceLoading(true);
    getStaffLeaveBalance(selectedStaffId, academicYearId)
      .then(setLeaveBalance)
      .finally(() => setBalanceLoading(false));
  }, [selectedStaffId, academicYearId]);

  const filteredStaff = useMemo(
    () => filterStaff(staffData, activeTab, search, roleFilter, statusFilter, selectedStaffId),
    [staffData, activeTab, search, roleFilter, statusFilter, selectedStaffId]
  );

  const tabs = useMemo(
    () => buildTabs(staffData),
    [staffData]
  );

  return (
    <div className="space-y-0">
      {editStaffMember && (
        <EditStaffModal staff={editStaffMember} onClose={() => setEditStaffMember(null)} />
      )}
      {viewStaffId && (
        <StaffDetailModal staffId={viewStaffId} onClose={() => setViewStaffId(null)} />
      )}

      {/* ── Top bar ── */}
      <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: breadcrumb + title with count */}
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-1">
            <span>School</span>
            <span className="text-indigo-500">›</span>
            <span className="text-indigo-600">Staff</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-semibold text-gray-900 leading-none">Staff</h1>
            <span className="text-sm font-semibold text-gray-400">{staffData.length} staff members</span>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => navigate("/schooladmin/staff/import")}
            variant="outline"
            className="gap-1.5 text-xs px-3 h-9 whitespace-nowrap rounded-xl"
          >
            <span className="text-sm leading-none font-bold">⇅</span>
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button
            onClick={() => navigate("/schooladmin/staff/add")}
            className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm gap-1.5 text-xs px-3 h-9 whitespace-nowrap rounded-xl"
          >
            <span className="text-sm leading-none font-bold">+</span>
            <span className="hidden sm:inline">Add Staff Member</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-3 sm:px-4 py-3 space-y-4">
        {/* Stats cards — scroll horizontally on mobile if needed */}
        <div className="w-full overflow-x-auto">
          <StatsCards
            stats={stats}
            leaveBalance={leaveBalance ? {
              totalAllocated: leaveBalance.total_allocated,
              totalUsed: leaveBalance.total_used,
              totalBalance: leaveBalance.total_balance,
            } : null}
            selectedStaffName={selectedStaffId ? staffData.find(s => s.id === selectedStaffId)?.name : undefined}
            loading={balanceLoading}
          />
        </div>

        <SetupProgressBanner />

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

        {!error && !loading && (
          <>
            {/* Filters stack vertically on mobile, row on larger screens */}
            <StaffFilters
              search={search}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              selectedStaffId={selectedStaffId}
              staffList={staffData.map(s => ({ id: s.id, name: s.name }))}
              onSearch={setSearch}
              onRoleChange={setRoleFilter}
              onStatusChange={setStatusFilter}
              onStaffChange={setSelectedStaffId}
            />
            {/* Table scrolls horizontally on mobile */}
            <div className="w-full overflow-x-auto">
              <StaffTable staff={filteredStaff} total={staffData.length} onEdit={setEditStaffMember} onView={(s) => setViewStaffId(s.id)} onDelete={deleteStaff} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
