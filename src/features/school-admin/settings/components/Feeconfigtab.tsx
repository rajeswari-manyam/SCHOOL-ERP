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
    <div className="space-y-6">
      {/* Fee Heads */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Fee Heads</h2>
          <Button variant="ghost" className="text-indigo-600 font-medium flex items-center gap-1 text-sm">
            + Add Fee Head
          </Button>
        </div>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {["Fee Name", "Code", "Mandatory", "Taxability", "Status", "Action"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeHeads.map((head) => (
              <TableRow key={head.id}>
                <TableCell className="font-medium text-gray-900">{head.feeName}</TableCell>
                <TableCell className="text-gray-600">{head.code}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${head.mandatory ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                    {head.mandatory ? "MANDATORY" : "OPTIONAL"}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{head.taxable ? "Taxable" : "Not Taxable"}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {head.status}
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

      {/* Fee Structure */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Fee Structure</h2>
            <p className="text-sm text-gray-500 mt-0.5">Configure installments and amounts per grade.</p>
          </div>
          <Button
            onClick={onSaveStructure}
            disabled={saving}
            className="rounded-lg text-sm font-medium"
            size="sm"
          >
            Save Structure
          </Button>
        </div>

        {/* Grade Tabs */}
        <div className="flex gap-1 mb-5 border-b border-gray-100">
          {gradeStructures.map((g) => (
            <Button
              key={g.grade}
              variant={selectedGrade === g.grade ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelectGrade(g.grade)}
              className={`rounded-t-lg ${selectedGrade === g.grade ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              {g.grade}
            </Button>
          ))}
        </div>

        {currentGrade && (
          <>
            <Table className="w-full mb-4">
              <TableHeader>
                <TableRow>
                  {["Fee Component", "Amount", "Frequency", "Due Day", "Total Annual"].map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentGrade.components.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium text-gray-900">{comp.name}</TableCell>
                    <TableCell className="text-gray-700">{formatCurrency(comp.amount)}</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">{comp.frequency}</span>
                    </TableCell>
                    <TableCell className="text-gray-700">{comp.dueDay}</TableCell>
                    <TableCell className="font-semibold text-indigo-700">{formatCurrency(comp.totalAnnual)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end border-t border-gray-100 pt-3">
              <div className="text-sm text-gray-500">
                Total {currentGrade.grade} Fees:{" "}
                <span className="text-lg font-bold text-indigo-700">{formatCurrency(currentGrade.totalAnnualFees)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Transport Slabs + Quick Insights */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Transport Fee Slabs</h2>
            <Button variant="ghost" className="text-indigo-600 font-medium flex items-center gap-1 text-sm">
              + Add Slab
            </Button>
          </div>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {["Slab Name", "Range", "Rate (Mo)", "Students"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transportSlabs.map((slab) => (
                <TableRow key={slab.id}>
                  <TableCell className="font-medium text-gray-900">{slab.slabName}</TableCell>
                  <TableCell className="text-gray-700">
                    {slab.rangeFrom}–{slab.rangeTo !== null ? slab.rangeTo : "∞"} km
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(slab.rateMonthly)}</div>
                    <div className="text-xs text-gray-500">{formatCurrency(slab.rateAnnual)} yr</div>
                  </TableCell>
                  <TableCell className="text-gray-700">{slab.studentCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Quick Insights Sidebar */}
        <div className="bg-indigo-700 rounded-xl p-5 text-white">
          <h3 className="font-semibold text-base mb-4">Quick Insights</h3>
          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-lg p-3">
              <p className="text-indigo-200 text-xs">Proj. Annual Revenue</p>
              <p className="text-xl font-bold mt-0.5">{insights.projAnnualRevenue}</p>
            </div>
            <div className="bg-indigo-600 rounded-lg p-3">
              <p className="text-indigo-200 text-xs">Active Fee Alerts</p>
              <p className="text-xl font-bold mt-0.5">{insights.activeGrades} Grades</p>
            </div>
            <div>
              <p className="text-indigo-200 text-xs mb-2">Fee Collection Health</p>
              <div className="w-full bg-indigo-500 rounded-full h-2 mb-1">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: `${insights.collectedPercent}%` }}
                />
              </div>
              <p className="text-xs text-indigo-200">
                {insights.collectedPercent}% Collected · {insights.pendingAmount} Pending
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-indigo-600">
            <p className="text-xs text-indigo-200 font-medium mb-1">ⓘ Configuration Tip</p>
            <p className="text-xs text-indigo-300">
              Changes to Fee Heads will automatically trigger a re-calculation in all assigned Grade Structures.
              Ensure you sync your accounting integration (Tally/Zoho) after saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};