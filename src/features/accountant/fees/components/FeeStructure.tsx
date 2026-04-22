import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Pencil,
  Trash2,
  BookOpen,
  GraduationCap,
  FlaskConical,
  Bus,
  Library,
  Activity,
  Layers,
  SplitSquareHorizontal,
  Copy,
} from "lucide-react";
import { AddFeeHeadModal } from "./AddFeeStructure";
import { feeHeads, classes, classWiseFees } from "../data/fee.data";
import type { SectionType, ClassType, FeeHead, ClassFee } from "../types/fees.types";
import { formatINR } from "../utils/fee.utils";
import { useState } from "react";

const sections: { label: SectionType; icon: React.ReactNode }[] = [
  { label: "Section A", icon: <Layers className="w-3 h-3" /> },
  { label: "Section B", icon: <SplitSquareHorizontal className="w-3 h-3" /> },
  { label: "Both Same", icon: <Copy className="w-3 h-3" /> },
];

const feeHeadCol = createColumnHelper<FeeHead>();
const classWiseFeeCol = createColumnHelper<ClassFee>();

/* ── Fee Heads columns ── */
const feeHeadColumns: ColumnDef<FeeHead, any>[] = [
  feeHeadCol.accessor("name", {
    header: "Fee Head Name",
    cell: (info) => (
      <span className="text-[13px] font-medium text-slate-800">{info.getValue()}</span>
    ),
  }),
  feeHeadCol.accessor("code", {
    header: "Code",
    cell: (info) => (
      <span className="text-[12px] text-slate-500 font-mono tracking-wide">{info.getValue()}</span>
    ),
  }),
  feeHeadCol.accessor("description", {
    header: "Description",
    cell: (info) => (
      <span className="text-[12px] text-slate-500">{info.getValue()}</span>
    ),
  }),
  feeHeadCol.accessor("mandatory", {
    header: "Mandatory",
    cell: (info) => (
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${info.getValue() ? "bg-emerald-500" : "bg-slate-300"}`} />
        <span className="text-[12px] text-slate-600">{info.getValue() ? "Yes" : "No"}</span>
      </div>
    ),
  }),
  feeHeadCol.accessor("taxable", {
    header: "Taxable",
    cell: (info) => (
      <span className="text-[12px] text-slate-600">{info.getValue() ? "Yes" : "No"}</span>
    ),
  }),
  feeHeadCol.accessor("gst", {
    header: "GST%",
    cell: (info) => (
      <span className="text-[12px] text-slate-600">{info.getValue() ?? "0%"}</span>
    ),
  }),
  feeHeadCol.display({
    id: "status",
    header: "Status",
    cell: () => (
      <span className="text-[11px] font-semibold text-emerald-600 tracking-wide">ACTIVE</span>
    ),
  }),
  feeHeadCol.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex gap-1 items-center">
        <button className="p-1.5 rounded text-slate-400 hover:text-[#3525CD] hover:bg-indigo-50 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
  }),
];

/* ── Class-wise fee columns ── */
const feeHeadMeta: Record<string, { color: string; icon: React.ReactNode }> = {
  "Tuition Fee":     { color: "bg-blue-500",   icon: <BookOpen className="w-3 h-3 text-white" /> },
  "Examination Fee": { color: "bg-amber-500",  icon: <GraduationCap className="w-3 h-3 text-white" /> },
  "Transport Fee":   { color: "bg-green-500",  icon: <Bus className="w-3 h-3 text-white" /> },
  "Activity Fee":    { color: "bg-purple-500", icon: <Activity className="w-3 h-3 text-white" /> },
  "Library Fee":     { color: "bg-pink-500",   icon: <Library className="w-3 h-3 text-white" /> },
  "Lab Fee":         { color: "bg-orange-500", icon: <FlaskConical className="w-3 h-3 text-white" /> },
};

const classWiseFeeColumns: ColumnDef<ClassFee, any>[] = [
  classWiseFeeCol.accessor("feeHead", {
    header: "Fee Head",
    cell: (info) => {
      const name = info.getValue() as string;
      const meta = feeHeadMeta[name] ?? { color: "bg-slate-400", icon: <BookOpen className="w-3 h-3 text-white" /> };
      return (
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center ${meta.color}`}>
            {meta.icon}
          </span>
          <span className="text-[13px] font-medium text-slate-800">{name}</span>
        </div>
      );
    },
  }),
  classWiseFeeCol.accessor("billingCycle", {
    header: "Billing Cycle",
    cell: (info) => (
      <span className="text-[12px] text-slate-500">{info.getValue()}</span>
    ),
  }),
  classWiseFeeCol.accessor("amount", {
    header: "Amount",
    cell: (info) => (
      <span className="text-[13px] font-medium text-slate-800">
        {info.getValue() != null ? formatINR(info.getValue()!) : "Slab-based"}
      </span>
    ),
  }),
  classWiseFeeCol.accessor("dueDate", {
    header: "Due Date",
    cell: (info) => (
      <span className="text-[12px] text-slate-500">{info.getValue()}</span>
    ),
  }),
  classWiseFeeCol.accessor("annualTotal", {
    header: "Annual Total",
    cell: (info) => (
      <span className="text-[13px] font-semibold text-[#3525CD]">
        {info.getValue() != null ? formatINR(info.getValue()!) : "Variable"}
      </span>
    ),
  }),
  classWiseFeeCol.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <button className="text-[#3525CD] text-[12px] font-semibold hover:underline">Edit</button>
    ),
  }),
];

/* ── Generic table ── */
function DataTable<T>({ data, columns }: { data: T[]; columns: ColumnDef<T, any>[] }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-slate-100">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap bg-white"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Props ── */
interface FeeStructureProps {
  showModal: boolean;          // ✅ controlled by parent
  setShowModal: (v: boolean) => void;
}

/* ── Main ── */
export const FeeStructure = ({ showModal, setShowModal }: FeeStructureProps) => {
  const [activeClass, setActiveClass] = useState<ClassType>("Class 10");
  const [activeSection, setActiveSection] = useState<SectionType>("Both Same");

  const totalAnnual = useMemo(
    () => classWiseFees.reduce((sum, f) => sum + (f.annualTotal ?? 0), 0),
    []
  );

  return (
    <div className="px-5 pt-4 pb-10 space-y-6 font-sans">
      {/* Modal — opens from both top header button AND bottom "+ Add Fee Head" link */}
      {showModal && <AddFeeHeadModal onClose={() => setShowModal(false)} />}

      {/* ── Fee Heads block ── */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              Fee Heads
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-[#3525CD] text-[11px] font-semibold">
              {feeHeads.length} configured
            </span>
          </div>
        </div>

        <DataTable data={feeHeads as FeeHead[]} columns={feeHeadColumns} />

        <div className="px-5 py-3 border-t border-slate-100">
          <button
            onClick={() => setShowModal(true)} // ✅ same modal, via props
            className="text-[#3525CD] text-[12px] font-medium hover:underline flex items-center gap-1"
          >
            + Add Fee Head
          </button>
        </div>
      </div>

      {/* ── Class-wise Fee block ── */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h3 className="text-[13px] font-semibold text-slate-700">
            Class-wise Fee Structure
          </h3>

          {/* Section toggle */}
          <div className="flex items-center gap-1">
            {sections.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActiveSection(label)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                  activeSection === label
                    ? "bg-[#3525CD] text-white border-[#3525CD]"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Class tabs */}
        <div className="flex gap-0 px-5 border-b border-slate-100">
          {classes.map((cls) => {
            const isActive = activeClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`relative inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold transition-colors whitespace-nowrap ${
                  isActive ? "text-[#3525CD]" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {isActive && <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />}
                {cls}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3525CD] rounded-t" />
                )}
              </button>
            );
          })}
        </div>

        <DataTable data={classWiseFees} columns={classWiseFeeColumns} />

        <div className="flex justify-between items-center mx-5 mb-4 mt-2 px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-[13px] font-semibold text-slate-700">Total Annual Fee</span>
          <span className="text-[13px] font-bold text-red-600">{formatINR(totalAnnual)}</span>
        </div>
      </div>
    </div>
  );
};