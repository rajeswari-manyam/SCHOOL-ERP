import { useMemo } from "react";
import type{ StaffMember, TabKey } from "../types/staff.types";

interface Props {
  staff: StaffMember[];
  activeTab: TabKey;
  search: string;
  roleFilter: string;
  statusFilter: string;
}

export const useStaffFilter = ({
  staff,
  activeTab,
  search,
  roleFilter,
  statusFilter,
}: Props) => {
  return useMemo(() => {
    let base =
      activeTab === "teachers"
        ? staff.filter((s) => s.isTeaching)
        : activeTab === "non-teaching"
        ? staff.filter((s) => !s.isTeaching)
        : staff;

    if (search) {
      base = base.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.phone.includes(search)
      );
    }

    if (roleFilter !== "All Roles") {
      base = base.filter((s) => s.role === roleFilter);
    }

    if (statusFilter !== "All Status") {
      base = base.filter((s) => s.status === statusFilter);
    }

    return base;
  }, [staff, activeTab, search, roleFilter, statusFilter]);
};