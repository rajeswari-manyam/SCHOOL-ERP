import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { TransportSlab, TransportStudent } from "../types/fees.types";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Props = {
  students: TransportStudent[];
  slabs: TransportSlab[];
  search: string;
  onSearchChange: (val: string) => void;
  pendingSlabs: Record<string, string>;
  onSlabChange: (studentId: string, slabId: string) => void;
  onSaveStudentSlab: (studentId: string) => void;
};

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export function StudentSlabAssignment({
  students,
  slabs,
  search,
  onSearchChange,
  pendingSlabs,
  onSlabChange,
  onSaveStudentSlab,
}: Props) {
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.cls.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Section header */}
      <div className="px-5 pt-4 pb-2 border-t border-gray-100">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
          Student Slab Assignment
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Assign transport slab per student based on their distance
        </p>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <div className="relative w-64">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            fill="none"
            viewBox="0 0 16 16"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search students..."
            className="w-full h-8 border border-gray-200 rounded-lg pl-8 pr-3 text-xs focus:outline-none focus:border-[#3525CD] text-gray-800 placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Students table */}
      <div className="overflow-x-auto no-scrollbar">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Current Slab</TableHead>
              <TableHead>Change Slab</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((st) => {
              const key = st.id;
              const selectedSlabId = pendingSlabs[key] ?? st.slabId;
              const currentSlab = slabs.find((s) => s.id === st.slabId);

              return (
                <TableRow key={st.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 text-[#3525CD] flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                        {initials(st.name)}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-800">{st.name}</div>
                        <div className="text-[11px] text-gray-400">ID: {st.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{st.cls}</TableCell>
                  <TableCell>{st.distance} km</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-[#3525CD]">
                      {currentSlab?.name ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <select
                      value={selectedSlabId}
                      onChange={(e) =>
                        onSlabChange(st.id, e.target.value)
                      }
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#3525CD] bg-white"
                    >
                      {slabs.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 text-[#3525CD] border-indigo-200 hover:bg-indigo-50"
                      onClick={() => onSaveStudentSlab(st.id)}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}