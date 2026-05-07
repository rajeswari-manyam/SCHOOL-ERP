import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Pencil, Trash2, BookOpen, GraduationCap,
  FlaskConical, Bus, Library, Activity,
  Layers, SplitSquareHorizontal, Copy,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { AddFeeHeadModal } from "./AddFeeHeadModal";
import { feeHeads, classes, classWiseFees } from "../data/fee.data";
import type { SectionType, ClassType, FeeHead, ClassFee, FeeStructureProps } from "../types/fees.types";
import { formatINR } from "../../../../utils/formatters";
import { SECTION_LABELS, FEE_HEAD_COLORS } from "../constants/fee.constants";

const sections: { label: SectionType; icon: React.ReactNode }[] = [
  { label: SECTION_LABELS[0], icon: <Layers className="w-3 h-3" /> },
  { label: SECTION_LABELS[1], icon: <SplitSquareHorizontal className="w-3 h-3" /> },
  { label: SECTION_LABELS[2], icon: <Copy className="w-3 h-3" /> },
];

const feeHeadIcons: Record<string, React.ReactNode> = {
  "Tuition Fee":     <BookOpen className="w-3 h-3 text-white" />,
  "Examination Fee": <GraduationCap className="w-3 h-3 text-white" />,
  "Transport Fee":   <Bus className="w-3 h-3 text-white" />,
  "Activity Fee":    <Activity className="w-3 h-3 text-white" />,
  "Library Fee":     <Library className="w-3 h-3 text-white" />,
  "Lab Fee":         <FlaskConical className="w-3 h-3 text-white" />,
};

const feeHeadCol = createColumnHelper<FeeHead>();
const classWiseFeeCol = createColumnHelper<ClassFee>();

/* ════════════════════════════════════════
   MOBILE CARD COMPONENT for FeeHeads
   ════════════════════════════════════════ */
function FeeHeadMobileCard({ feeHead }: { feeHead: FeeHead }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-slate-800">{feeHead.name}</p>
          <p className="text-[11px] text-slate-400 font-mono">{feeHead.code}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-semibold text-emerald-600">ACTIVE</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div>
              <span className="text-slate-400">Description:</span>
              <p className="text-slate-700">{feeHead.description}</p>
            </div>
            <div>
              <span className="text-slate-400">Mandatory:</span>
              <p className="text-slate-700 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${feeHead.mandatory ? "bg-emerald-500" : "bg-slate-300"}`} />
                {feeHead.mandatory ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Taxable:</span>
              <p className="text-slate-700">{feeHead.taxable ? "Yes" : "No"}</p>
            </div>
            <div>
              <span className="text-slate-400">GST%:</span>
              <p className="text-slate-700">{feeHead.gst ?? "0%"}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex-1 py-1.5 rounded text-[12px] font-medium text-[#3525CD] bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1">
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button className="flex-1 py-1.5 rounded text-[12px] font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   MOBILE CARD COMPONENT for ClassWiseFees
   ════════════════════════════════════════ */
function ClassFeeMobileCard({ fee }: { fee: ClassFee }) {
  const color = FEE_HEAD_COLORS[fee.feeHead] ?? "bg-slate-400";
  const icon = feeHeadIcons[fee.feeHead] ?? <BookOpen className="w-3 h-3 text-white" />;
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className={`w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center ${color}`}>
          {icon}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-slate-800">{fee.feeHead}</p>
          <p className="text-[11px] text-slate-400">{fee.billingCycle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <div className="bg-slate-50 rounded p-2">
          <span className="text-slate-400 block">Amount</span>
          <span className="text-[13px] font-medium text-slate-800">
            {fee.amount != null ? formatINR(fee.amount) : "Slab-based"}
          </span>
        </div>
        <div className="bg-slate-50 rounded p-2">
          <span className="text-slate-400 block">Due Date</span>
          <span className="text-slate-700">{fee.dueDate}</span>
        </div>
        <div className="bg-indigo-50 rounded p-2 col-span-2">
          <span className="text-[#3525CD]/70 block text-[11px]">Annual Total</span>
          <span className="text-[14px] font-bold text-[#3525CD]">
            {fee.annualTotal != null ? formatINR(fee.annualTotal) : "Variable"}
          </span>
        </div>
      </div>
      <button className="w-full py-1.5 rounded text-[12px] font-semibold text-[#3525CD] bg-indigo-50 hover:bg-indigo-100 transition-colors">
        Edit Fee
      </button>
    </div>
  );
}

/* ════════════════════════════════════════
   DESKTOP TABLE (unchanged)
   ════════════════════════════════════════ */
const feeHeadColumns: ColumnDef<FeeHead, any>[] = [
  feeHeadCol.accessor("name", {
    header: "Fee Head Name",
    cell: (info) => <span className="text-[13px] font-medium text-slate-800">{info.getValue()}</span>,
  }),
  feeHeadCol.accessor("code", {
    header: "Code",
    cell: (info) => <span className="text-[12px] text-slate-500 font-mono tracking-wide">{info.getValue()}</span>,
  }),
  feeHeadCol.accessor("description", {
    header: "Description",
    cell: (info) => <span className="text-[12px] text-slate-500">{info.getValue()}</span>,
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
    cell: (info) => <span className="text-[12px] text-slate-600">{info.getValue() ? "Yes" : "No"}</span>,
  }),
  feeHeadCol.accessor("gst", {
    header: "GST%",
    cell: (info) => <span className="text-[12px] text-slate-600">{info.getValue() ?? "0%"}</span>,
  }),
  feeHeadCol.display({
    id: "status",
    header: "Status",
    cell: () => <span className="text-[11px] font-semibold text-emerald-600 tracking-wide">ACTIVE</span>,
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

const classWiseFeeColumns: ColumnDef<ClassFee, any>[] = [
  classWiseFeeCol.accessor("feeHead", {
    header: "Fee Head",
    cell: (info) => {
      const name = info.getValue() as string;
      const color = FEE_HEAD_COLORS[name] ?? "bg-slate-400";
      const icon = feeHeadIcons[name] ?? <BookOpen className="w-3 h-3 text-white" />;
      return (
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center ${color}`}>
            {icon}
          </span>
          <span className="text-[13px] font-medium text-slate-800">{name}</span>
        </div>
      );
    },
  }),
  classWiseFeeCol.accessor("billingCycle", {
    header: "Billing Cycle",
    cell: (info) => <span className="text-[12px] text-slate-500">{info.getValue()}</span>,
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
    cell: (info) => <span className="text-[12px] text-slate-500">{info.getValue()}</span>,
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
    cell: () => <button className="text-[#3525CD] text-[12px] font-semibold hover:underline">Edit</button>,
  }),
];

function DataTable<T>({ data, columns }: { data: T[]; columns: ColumnDef<T, any>[] }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="overflow-x-auto hidden md:block">
      <table className="w-full text-sm border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-slate-100">
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap bg-white">
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

/* ════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════ */
export const FeeStructure = ({ showModal, setShowModal }: FeeStructureProps) => {
  const [activeClass, setActiveClass] = useState<ClassType>("Class 10");
  const [activeSection, setActiveSection] = useState<SectionType>("Both Same");

  const totalAnnual = useMemo(
    () => classWiseFees.reduce((sum, f) => sum + (f.annualTotal ?? 0), 0),
    []
  );

  return (
    <div className="px-3 md:px-5 pt-4 pb-10 space-y-6 font-sans">
      {showModal && <AddFeeHeadModal onClose={() => setShowModal(false)} />}

      {/* ── Fee Heads ── */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-4 md:px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Fee Heads</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-[#3525CD] text-[11px] font-semibold">
              {feeHeads.length} configured
            </span>
          </div>
        </div>

        {/* Desktop Table */}
        <DataTable data={feeHeads as FeeHead[]} columns={feeHeadColumns} />

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2 p-3">
          {feeHeads.map((feeHead) => (
            <FeeHeadMobileCard key={feeHead.code} feeHead={feeHead} />
          ))}
        </div>

        <div className="px-4 md:px-5 py-3 border-t border-slate-100">
          <button
            onClick={() => setShowModal(true)}
            className="text-[#3525CD] text-[12px] font-medium hover:underline flex items-center gap-1"
          >
            + Add Fee Head
          </button>
        </div>
      </div>

      {/* ── Class-wise Fee ── */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 md:px-5 pt-4 pb-3">
          <h3 className="text-[13px] font-semibold text-slate-700">Class-wise Fee Structure</h3>
          <div className="flex items-center gap-1 flex-wrap">
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

        {/* Class Tabs - Horizontal scroll on mobile */}
        <div className="flex gap-0 px-4 md:px-5 border-b border-slate-100 overflow-x-auto scrollbar-hide">
          {classes.map((cls) => {
            const isActive = activeClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`relative inline-flex items-center gap-1.5 px-3 md:px-4 py-2 text-[12px] font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                  isActive ? "text-[#3525CD]" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {isActive && <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />}
                {cls}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3525CD] rounded-t" />}
              </button>
            );
          })}
        </div>

        {/* Desktop Table */}
        <DataTable data={classWiseFees} columns={classWiseFeeColumns} />

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2 p-3">
          {classWiseFees.map((fee) => (
            <ClassFeeMobileCard key={`${fee.feeHead}-${fee.billingCycle}`} fee={fee} />
          ))}
        </div>

        <div className="flex justify-between items-center mx-3 md:mx-5 mb-4 mt-2 px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-[13px] font-semibold text-slate-700">Total Annual Fee</span>
          <span className="text-[13px] font-bold text-red-600">{formatINR(totalAnnual)}</span>
        </div>
      </div>
    </div>
  );
};