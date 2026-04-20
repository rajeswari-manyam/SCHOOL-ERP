import type { StaffMember } from "../types/staff.types";

import { StaffAvatar } from "./StaffAvathar";
import { StatusBadge } from "./Statusbadge";

const StaffRow = ({ staff }: { staff: StaffMember }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 flex items-center gap-3">
        <StaffAvatar initials={staff.initials} status={staff.status} />
        <div>
          <p className="font-medium">{staff.name}</p>
          <p className="text-xs text-gray-400">{staff.phone}</p>
        </div>
      </td>

      <td className="px-4 py-3">{staff.role}</td>

      <td className="px-4 py-3">
        {staff.subjects.join(", ") || "-"}
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={staff.status} />
      </td>

      <td className="px-4 py-3 font-semibold">
        {staff.leaveBalance} days
      </td>

      <td className="px-4 py-3">
        <button className="text-indigo-600 text-xs">Edit</button>
      </td>
    </tr>
  );
};

export default StaffRow;