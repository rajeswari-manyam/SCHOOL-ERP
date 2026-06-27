import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatINR as formatCurrency } from "../../../../../utils/formatters";
import type { SalaryConfig, SalaryTableProps } from "../../types/payroll.types";

const columnHelper = createColumnHelper<SalaryConfig>();

export const SalaryTable = ({ data, onEdit, onDelete }: SalaryTableProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Staff Name",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-semibold">
            {info.row.original.initials}
          </div>
          <span className="text-sm font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => <span className="text-sm text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("basic", {
      header: "Basic",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("hra", {
      header: "HRA",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("transport", {
      header: "Transport",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("other", {
      header: "Other",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("pfPercentage", {
      header: "PF %",
      cell: (info) => (
        <span className="text-sm text-blue-600">{info.getValue()}%</span>
      ),
    }),
    columnHelper.accessor("professionalTax", {
      header: "Prof. Tax",
      cell: (info) => <span className="text-sm text-gray-700">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("gross", {
      header: "Gross",
      cell: (info) => <span className="text-sm font-medium text-gray-900">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("net", {
      header: () => <span className="text-[#3525CD]">Net</span>,
      cell: (info) => (
        <span className="text-sm font-semibold text-[#3525CD]">
          {formatCurrency(info.getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(row.original)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="p-1.5 hover:bg-red-50 rounded text-gray-300 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();

  return (
    <div>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto no-scrollbar">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-400">
                  No salary records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3 p-2">
        {data.map((staff) => {
          const isExpanded = expandedCard === staff.id;
          
          return (
            <div
              key={staff.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Card Header */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50"
                onClick={() => toggleCard(staff.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {staff.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{staff.name}</div>
                    <div className="text-[11px] text-gray-500">{staff.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-[#3525CD]">
                    {formatCurrency(staff.net)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Always Visible: Quick Stats */}
              <div className="px-3 pb-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-gray-500">Basic</div>
                    <div className="text-xs font-medium text-gray-700">{formatCurrency(staff.basic)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-gray-500">Gross</div>
                    <div className="text-xs font-medium text-gray-900">{formatCurrency(staff.gross)}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-blue-600">PF {staff.pfPercentage}%</div>
                    <div className="text-xs font-medium text-blue-700">
                      {formatCurrency((staff.basic * staff.pfPercentage) / 100)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <div className="pt-3 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="text-gray-500 block">HRA</span>
                        <span className="font-medium text-gray-700">{formatCurrency(staff.hra)}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="text-gray-500 block">Transport</span>
                        <span className="font-medium text-gray-700">{formatCurrency(staff.transport)}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="text-gray-500 block">Other</span>
                        <span className="font-medium text-gray-700">{formatCurrency(staff.other)}</span>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2">
                        <span className="text-gray-500 block">Prof. Tax</span>
                        <span className="font-medium text-red-600">{formatCurrency(staff.professionalTax)}</span>
                      </div>
                    </div>

                    {/* Net Salary Highlight */}
                    <div className="bg-[#F5F3FF] rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-500">Net Salary</div>
                        <div className="text-base font-bold text-[#3525CD]">{formatCurrency(staff.net)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(staff)}
                          className="px-3 py-2 rounded-lg bg-[#3525CD] text-white text-xs font-medium flex items-center gap-1.5 active:bg-[#2a1fb5]"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(staff.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 active:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-400 bg-white rounded-xl border border-gray-200">
            No salary records found.
          </div>
        )}
      </div>
    </div>
  );
};