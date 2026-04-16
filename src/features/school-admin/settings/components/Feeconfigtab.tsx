import React from "react";
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
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
            + Add Fee Head
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Fee Name", "Code", "Mandatory", "Taxability", "Status", "Action"].map(h => (
                <th key={h} className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wide pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feeHeads.map(head => (
              <tr key={head.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 text-sm font-medium text-gray-900 pr-4">{head.feeName}</td>
                <td className="py-3 text-sm text-gray-600 pr-4">{head.code}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${head.mandatory ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                    {head.mandatory ? "MANDATORY" : "OPTIONAL"}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-600 pr-4">{head.taxable ? "Taxable" : "Not Taxable"}</td>
                <td className="py-3 pr-4">
                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {head.status}
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-gray-400 hover:text-gray-600 text-lg">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fee Structure */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Fee Structure</h2>
            <p className="text-sm text-gray-500 mt-0.5">Configure installments and amounts per grade.</p>
          </div>
          <button
            onClick={onSaveStructure}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            Save Structure
          </button>
        </div>

        {/* Grade Tabs */}
        <div className="flex gap-1 mb-5 border-b border-gray-100">
          {gradeStructures.map(g => (
            <button
              key={g.grade}
              onClick={() => onSelectGrade(g.grade)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${selectedGrade === g.grade
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:text-gray-900"}`}
            >
              {g.grade}
            </button>
          ))}
        </div>

        {currentGrade && (
          <>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Fee Component", "Amount", "Frequency", "Due Day", "Total Annual"].map(h => (
                    <th key={h} className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wide pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentGrade.components.map(comp => (
                  <tr key={comp.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-sm font-medium text-gray-900 pr-4">{comp.name}</td>
                    <td className="py-3 text-sm text-gray-700 pr-4">{formatCurrency(comp.amount)}</td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">{comp.frequency}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-700 pr-4">{comp.dueDay}</td>
                    <td className="py-3 text-sm font-semibold text-indigo-700">{formatCurrency(comp.totalAnnual)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
              + Add Slab
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Slab Name", "Range", "Rate (Mo)", "Students"].map(h => (
                  <th key={h} className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wide pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transportSlabs.map(slab => (
                <tr key={slab.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 text-sm font-medium text-gray-900 pr-4">{slab.slabName}</td>
                  <td className="py-3 text-sm text-gray-700 pr-4">
                    {slab.rangeFrom}–{slab.rangeTo !== null ? slab.rangeTo : "∞"} km
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(slab.rateMonthly)}</div>
                    <div className="text-xs text-gray-500">{formatCurrency(slab.rateAnnual)} yr</div>
                  </td>
                  <td className="py-3 text-sm text-gray-700">{slab.studentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
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