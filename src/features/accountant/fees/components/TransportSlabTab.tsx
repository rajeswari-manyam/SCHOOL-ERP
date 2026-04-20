import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { TransportSlab } from "../types/fees.types";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const distanceLabel = (slab: TransportSlab) =>
  slab.to == null ? `${slab.from}+ km` : `${slab.from}–${slab.to} km`;

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Props = {
  slabs: TransportSlab[];
  onEdit: (slab: TransportSlab) => void;
  onDelete: (id: string) => void;
};

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export function TransportSlabsTable({ slabs, onEdit, onDelete }: Props) {
  const totalStudents = slabs.reduce((sum, s) => sum + s.students, 0);
  const totalRevenue = slabs.reduce((sum, s) => sum + s.monthly * s.students, 0);

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div>
          <span className="text-sm font-medium text-gray-800">
            Transport Fee Slabs
          </span>
          <span className="text-xs text-gray-400 ml-2">
            Distance-based fee configuration
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800">
              {totalStudents} students
            </div>
            <div className="text-xs text-gray-400">Total Usage</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-[#3525CD]">
              {formatINR(totalRevenue)}
            </div>
            <div className="text-xs text-gray-400">Monthly Revenue</div>
          </div>
        </div>
      </div>

      {/* Slabs table */}
      <div className="overflow-x-auto no-scrollbar">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-bold uppercase text-gray-400 tracking-wider">Slab</TableHead>
              <TableHead className="text-xs font-bold uppercase text-gray-400 tracking-wider">Distance</TableHead>
              <TableHead className="text-xs font-bold uppercase text-gray-400 tracking-wider">Students</TableHead>
              <TableHead className="text-xs font-bold uppercase text-gray-400 tracking-wider">Monthly Fee</TableHead>
              <TableHead className="text-xs font-bold uppercase text-gray-400 tracking-wider">Revenue</TableHead>
              <TableHead className="text-xs font-bold uppercase text-gray-400 tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slabs.map((slab) => (
              <TableRow key={slab.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-indigo-50 text-[#3525CD] border border-indigo-100">
                    {slab.name}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-700">{distanceLabel(slab)}</TableCell>
                <TableCell className="text-sm text-gray-600 font-medium">{slab.students} <span className="text-[10px] text-gray-400 uppercase">Users</span></TableCell>
                <TableCell className="text-sm font-bold text-gray-900">{formatINR(slab.monthly)}</TableCell>
                <TableCell className="text-sm font-bold text-indigo-700">{formatINR(slab.monthly * slab.students)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all font-bold text-xs uppercase"
                      onClick={() => onEdit(slab)}
                    >
                      Edit
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all font-bold text-xs uppercase"
                      onClick={() => onDelete(slab.id)}
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}