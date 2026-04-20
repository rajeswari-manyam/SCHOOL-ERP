import type { StaffMember } from "../types/staff.types";
import { StatusBadge } from "./Statusbadge";
import { SubjectPill } from "./SubjectPill";
import { Button } from "../../../../components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../components/ui/table";

import { StaffAvatar } from "./StaffAvathar";


interface Props {
  staff: StaffMember[];
  total: number;
}

const COLUMNS = ["Name & Contact", "Role", "Classes / Subjects", "Status", "Leave Bal.", "Actions"];

export const StaffTable = ({ staff, total }: Props) => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
    <Table>
      <TableHeader>
        <TableRow>
          {COLUMNS.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="py-12 text-center text-slate-400">
              No staff members found
            </TableCell>
          </TableRow>
        ) : (
          staff.map((s) => (
            <TableRow key={s.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <StaffAvatar initials={s.initials} status={s.status} />
                  <div>
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.phone}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-slate-600">{s.role}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {s.subjects.length > 0
                    ? s.subjects.map((sub) => <SubjectPill key={sub} label={sub} />)
                    : <span className="text-slate-400 text-xs">—</span>}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={s.status} />
              </TableCell>
              <TableCell>
                <span className={`font-semibold ${s.leaveBalance <= 3 ? "text-amber-600" : "text-slate-700"}`}>
                  {s.leaveBalance} days
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>

    {/* Pagination */}
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
      <p className="text-xs text-slate-400">
        {staff.length} of {total} staff members
      </p>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" disabled>Previous</Button>
        <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 h-7 w-7 p-0">1</Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </div>
  </div>
);