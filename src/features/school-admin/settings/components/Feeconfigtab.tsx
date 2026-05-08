import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { FeeHead, GradeFeeStructure, TransportSlab, FeeQuickInsights } from "../types/settings.types";
import { formatCurrency } from "../utils/Settings.utils";

interface Props {
  feeHeads: FeeHead[];
  gradeStructures: GradeFeeStructure[];
  transportSlabs: TransportSlab[];
  insights: FeeQuickInsights;
  selectedGrade: string;
  onSelectGrade: (g: string) => void;
  onSaveStructure: () => void;
  saving: boolean;
}

export const FeeConfigTab: React.FC<Props> = ({
  feeHeads, gradeStructures, transportSlabs, insights,
  selectedGrade, onSelectGrade, onSaveStructure, saving,
}) => {
  const currentGrade = gradeStructures.find(g => g.grade === selectedGrade);

  return (
    <div className="w-full space-y-4 sm:space-y-6">

      {/* ── Fee Heads ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Fee Heads</h2>
          <Button variant="ghost" className="text-indigo-600 font-medium flex items-center gap-1 text-sm px-0 sm:px-3">
            + Add Fee Head
          </Button>
        </div>

        {/* Mobile cards (< sm) */}
        <div className="sm:hidden space-y-2">
          {feeHeads.map((head) => (
            <div key={head.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{head.feeName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{head.code} · {head.taxable ? "Taxable" : "Not Taxable"}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${head.mandatory ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                    {head.mandatory ? "MANDATORY" : "OPTIONAL"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" /> {head.status}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1">
                ⋮
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop table (≥ sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="w-full min-w-[480px]">
            <TableHeader>
              <TableRow>
                {["Fee Name", "Code", "Mandatory", "Taxability", "Status", "Action"].map((h) => (
                  <TableHead key={h} className="whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeHeads.map((head) => (
                <TableRow key={head.id}>
                  <TableCell className="font-medium text-gray-900">{head.feeName}</TableCell>
                  <TableCell className="text-gray-600">{head.code}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap
                      ${head.mandatory ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                      {head.mandatory ? "MANDATORY" : "OPTIONAL"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 whitespace-nowrap">
                    {head.taxable ? "Taxable" : "Not Taxable"}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-gray-700 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" /> {head.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      ⋮
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Fee Structure ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Fee Structure</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Configure installments and amounts per grade.</p>
          </div>
          <Button
            onClick={onSaveStructure}
            disabled={saving}
            className="flex-shrink-0 rounded-lg text-sm font-medium active:scale-95 transition-all
              disabled:opacity-60 disabled:cursor-not-allowed"
            size="sm"
          >
            {saving ? "Saving…" : "Save Structure"}
          </Button>
        </div>

        {/* Grade tabs — scrollable row on mobile */}
        <div className="flex gap-1 mb-5 border-b border-gray-100 overflow-x-auto pb-px scrollbar-none">
          {gradeStructures.map((g) => (
            <Button
              key={g.grade}
              variant={selectedGrade === g.grade ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelectGrade(g.grade)}
              className={`flex-shrink-0 rounded-t-lg text-xs sm:text-sm
                ${selectedGrade === g.grade
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {g.grade}
            </Button>
          ))}
        </div>

        {currentGrade && (
          <>
            {/* Mobile cards (< sm) */}
            <div className="sm:hidden space-y-2 mb-4">
              {currentGrade.components.map((comp) => (
                <div key={comp.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{comp.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatCurrency(comp.amount)} ·{" "}
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[11px]">{comp.frequency}</span>
                      {" "}· Due day {comp.dueDay}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">Annual</p>
                    <p className="text-sm font-bold text-indigo-700">{formatCurrency(comp.totalAnnual)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table (≥ sm) */}
            <div className="hidden sm:block overflow-x-auto mb-4">
              <Table className="w-full min-w-[440px]">
                <TableHeader>
                  <TableRow>
                    {["Fee Component", "Amount", "Frequency", "Due Day", "Total Annual"].map((h) => (
                      <TableHead key={h} className="whitespace-nowrap">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGrade.components.map((comp) => (
                    <TableRow key={comp.id}>
                      <TableCell className="font-medium text-gray-900">{comp.name}</TableCell>
                      <TableCell className="text-gray-700 tabular-nums">{formatCurrency(comp.amount)}</TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs whitespace-nowrap">
                          {comp.frequency}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">{comp.dueDay}</TableCell>
                      <TableCell className="font-semibold text-indigo-700 tabular-nums">
                        {formatCurrency(comp.totalAnnual)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-3">
              <p className="text-xs sm:text-sm text-gray-500">
                Total {currentGrade.grade} Fees:{" "}
                <span className="text-base sm:text-lg font-bold text-indigo-700 tabular-nums">
                  {formatCurrency(currentGrade.totalAnnualFees)}
                </span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Transport Slabs + Quick Insights ── */}
      {/* 1 col stacked on mobile → 3 col (2+1) on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Transport slabs — spans 2 of 3 cols on lg */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Transport Fee Slabs</h2>
            <Button variant="ghost" className="text-indigo-600 font-medium flex items-center gap-1 text-sm px-0 sm:px-3">
              + Add Slab
            </Button>
          </div>

          {/* Mobile cards (< sm) */}
          <div className="sm:hidden space-y-2">
            {transportSlabs.map((slab) => (
              <div key={slab.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{slab.slabName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {slab.rangeFrom}–{slab.rangeTo !== null ? slab.rangeTo : "∞"} km · {slab.studentCount} students
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(slab.rateMonthly)}<span className="text-xs font-normal text-gray-400">/mo</span></p>
                  <p className="text-xs text-gray-400 tabular-nums">{formatCurrency(slab.rateAnnual)}/yr</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table (≥ sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <Table className="w-full min-w-[360px]">
              <TableHeader>
                <TableRow>
                  {["Slab Name", "Range", "Rate (Mo)", "Students"].map((h) => (
                    <TableHead key={h} className="whitespace-nowrap">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportSlabs.map((slab) => (
                  <TableRow key={slab.id}>
                    <TableCell className="font-medium text-gray-900">{slab.slabName}</TableCell>
                    <TableCell className="text-gray-700 whitespace-nowrap tabular-nums">
                      {slab.rangeFrom}–{slab.rangeTo !== null ? slab.rangeTo : "∞"} km
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(slab.rateMonthly)}</p>
                      <p className="text-xs text-gray-500 tabular-nums">{formatCurrency(slab.rateAnnual)} yr</p>
                    </TableCell>
                    <TableCell className="text-gray-700">{slab.studentCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Quick Insights sidebar */}
        <div className="bg-indigo-700 rounded-xl p-4 sm:p-5 text-white">
          <h3 className="font-semibold text-sm sm:text-base mb-4">Quick Insights</h3>

          <div className="space-y-3">
            <div className="bg-indigo-600 rounded-lg p-3">
              <p className="text-indigo-200 text-xs">Proj. Annual Revenue</p>
              <p className="text-lg sm:text-xl font-bold mt-0.5 tabular-nums">{insights.projAnnualRevenue}</p>
            </div>
            <div className="bg-indigo-600 rounded-lg p-3">
              <p className="text-indigo-200 text-xs">Active Fee Alerts</p>
              <p className="text-lg sm:text-xl font-bold mt-0.5">{insights.activeGrades} Grades</p>
            </div>
            <div>
              <p className="text-indigo-200 text-xs mb-2">Fee Collection Health</p>
              <div className="w-full bg-indigo-500 rounded-full h-2 mb-1">
                <div
                  className="bg-white h-2 rounded-full transition-all"
                  style={{ width: `${insights.collectedPercent}%` }}
                />
              </div>
              <p className="text-xs text-indigo-200 tabular-nums">
                {insights.collectedPercent}% Collected · {insights.pendingAmount} Pending
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-indigo-600">
            <p className="text-xs text-indigo-200 font-medium mb-1">ⓘ Configuration Tip</p>
            <p className="text-xs text-indigo-300 leading-relaxed">
              Changes to Fee Heads will automatically trigger a re-calculation in all assigned Grade Structures.
              Ensure you sync your accounting integration (Tally/Zoho) after saving.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};