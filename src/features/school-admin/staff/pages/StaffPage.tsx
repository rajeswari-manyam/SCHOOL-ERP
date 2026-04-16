import { useMemo } from "react";
import type{ TabKey } from "../types/staff.types";
import { useStaffStore } from "../store/usestore";
import { StatsCards } from "../components/StatCards";
import { StaffTabs } from "../components/StaffTabs";
import { StaffFilters } from "../components/StaffFilter";
import { StaffTable } from "../components/StaffTable";
import { LeaveRequestsTab } from "../components/LeaveRequistTable";
import { AddStaffModal } from "../components/AddStaffModal";
import { Button } from "../../../../components/ui/button";

const buildTabs = (teachers: number, nonTeaching: number, leavePending: number) => [
  { key: "all"           as TabKey, label: "All Staff" },
  { key: "teachers"      as TabKey, label: "Teachers",     count: teachers },
  { key: "non-teaching"  as TabKey, label: "Non-Teaching", count: nonTeaching },
  { key: "leave-requests"as TabKey, label: "Leave Requests", count: leavePending },
];

export default function StaffManagementPage() {
  const {
    activeTab, search, roleFilter, statusFilter, showModal,
    staffData, stats,
    setActiveTab, setSearch, setRoleFilter, setStatusFilter, setShowModal,
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

      <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between">
        <div>
   <div className="text-xs text-slate-400 flex items-center gap-1">
  <span>School</span>
  <span>/</span>
  <span>Staff</span>
</div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Staff</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">2023-24 Academic Year</span>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 gap-2"
          >
            <span className="text-base leading-none">+</span> Add Staff Member
          </Button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
        <StatsCards stats={stats} />
        <StaffTabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />

        {activeTab === "leave-requests" ? (
          <LeaveRequestsTab staff={staffData} />
        ) : (
          <>
            <StaffFilters
              search={search}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              onSearch={setSearch}
              onRoleChange={setRoleFilter}
              onStatusChange={setStatusFilter}
            />
            <StaffTable staff={filteredStaff} total={staffData.length} />
          </>
        )}
      </div>
    </div>
  );
}