// components/Concessions.tsx

import { StatCard } from "@/components/ui/statcard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import typography from "@/styles/typography";

interface Concession {
  id: string;
  studentName: string;
  studentInitials: string;
  studentId: string;
  class: string;
  type: string;
  typeColor: string;
  amount: string;
  amountUnit?: string;
  reason: string;
  approvedBy: string;
  status: "ACTIVE" | "PENDING";
}

const concessionsData: Concession[] = [
  {
    id: "1",
    studentName: "Ravi Kumar",
    studentInitials: "RK",
    studentId: "2024098",
    class: "10A",
    type: "Sibling Discount",
    typeColor: "bg-purple-100 text-purple-700",
    amount: "Rs. 1,000",
    amountUnit: "/mo",
    reason: "2nd child in school",
    approvedBy: "Principal",
    status: "ACTIVE",
  },
  {
    id: "2",
    studentName: "Priya Devi",
    studentInitials: "PD",
    studentId: "2024056",
    class: "9B",
    type: "Merit Scholarship",
    typeColor: "bg-amber-100 text-amber-700",
    amount: "50%",
    amountUnit: " tuition",
    reason: "Rank 1 in class",
    approvedBy: "Principal",
    status: "ACTIVE",
  },
  {
    id: "3",
    studentName: "Suresh M",
    studentInitials: "SM",
    studentId: "2024034",
    class: "7A",
    type: "Financial Aid",
    typeColor: "bg-blue-100 text-blue-700",
    amount: "Rs. 500",
    amountUnit: "/mo",
    reason: "Economic hardship",
    approvedBy: "Principal",
    status: "ACTIVE",
  },
  {
    id: "4",
    studentName: "Anitha K",
    studentInitials: "AK",
    studentId: "2024012",
    class: "8B",
    type: "Staff Ward",
    typeColor: "bg-pink-100 text-pink-700",
    amount: "100%",
    amountUnit: " tuition",
    reason: "Father is teacher",
    approvedBy: "Principal",
    status: "ACTIVE",
  },
  {
    id: "5",
    studentName: "Kiran R",
    studentInitials: "KR",
    studentId: "2024089",
    class: "6A",
    type: "Sibling Discount",
    typeColor: "bg-purple-100 text-purple-700",
    amount: "Rs. 1,000",
    amountUnit: "/mo",
    reason: "3rd child",
    approvedBy: "Principal",
    status: "ACTIVE",
  },
  {
    id: "6",
    studentName: "Venkat T",
    studentInitials: "VT",
    studentId: "2024078",
    class: "10B",
    type: "Sports Quota",
    typeColor: "bg-orange-100 text-orange-700",
    amount: "Rs. 2,000",
    amountUnit: "/mo",
    reason: "State-level athlete",
    approvedBy: "Principal",
    status: "PENDING",
  },
];

interface ConcessionsProps {
  onAddConcession: () => void;
}

export function Concessions({ onAddConcession }: ConcessionsProps) {
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 pt-4">
        <StatCard
          label="TOTAL CONCESSIONS"
          value={<span className="text-gray-900 font-semibold text-base md:text-lg">12 students</span>}
          icon={<div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">👥</div>}
        />
        <StatCard
          label="MONTHLY AMOUNT"
          value={<span className="text-gray-900 font-semibold text-base md:text-lg">Rs. 8,500</span>}
          icon={<div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">💰</div>}
        />
        <StatCard
          label="ANNUAL CONCESSION"
          value={<span className="text-gray-900 font-semibold text-base md:text-lg">Rs. 1,02,000</span>}
          icon={<div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">📊</div>}
        />
      </div>

      {/* View Audit Log Link */}
      <div className="px-5 flex justify-end">
        <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View Audit Log <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-5 flex flex-col sm:flex-row justify-end gap-2">
        <Button variant="outline" size="sm" className="text-xs h-9 gap-2 w-full sm:w-auto uppercase font-bold">
          <span>📤</span> Export Report
        </Button>
        <Button
          size="sm"
          className="text-xs h-9 bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-2 w-full sm:w-auto uppercase font-bold"
          onClick={onAddConcession}
        >
          <span>+</span> Add Concession
        </Button>
      </div>

      {/* Table */}
      <div className="px-0 sm:px-5 pb-5">
        <div className="bg-white rounded-none sm:rounded-lg border-y sm:border border-gray-200 overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className={`${typography.body.xs} font-medium text-gray-500 text-left px-4 py-3`}>
                  STUDENT
                </th>
                <th className={`${typography.body.xs} font-medium text-gray-500 text-left px-4 py-3`}>
                  CLASS
                </th>
                <th className={`${typography.body.xs} font-medium text-gray-500 text-left px-4 py-3`}>
                  TYPE
                </th>
                <th className={`${typography.body.xs} font-medium text-gray-500 text-left px-4 py-3`}>
                  AMOUNT / %
                </th>
                <th className={`${typography.body.xs} font-medium text-gray-500 text-left px-4 py-3`}>
                  REASON
                </th>
                <th className={`${typography.body.xs} font-medium text-gray-500 text-left px-4 py-3`}>
                  APPROVED BY
                </th>
                <th className={`${typography.body.xs} font-medium text-gray-500 text-left px-4 py-3`}>
                  STATUS
                </th>
                <th className={`${typography.body.xs} font-medium text-gray-500 text-left px-4 py-3`}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {concessionsData.map((concession) => (
                <tr key={concession.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                        {concession.studentInitials}
                      </div>
                      <span className={`${typography.body.small} font-medium text-gray-900`}>
                        {concession.studentName}
                      </span>
                    </div>
                  </td>
                  <td className={`${typography.body.small} text-gray-600 px-4 py-3`}>
                    {concession.class}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${typography.body.xs} px-2.5 py-1 rounded-full font-medium ${concession.typeColor}`}>
                      {concession.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${typography.body.small} font-semibold text-gray-900`}>
                      {concession.amount}
                    </span>
                    {concession.amountUnit && (
                      <span className={`${typography.body.xs} text-gray-500`}>
                        {concession.amountUnit}
                      </span>
                    )}
                  </td>
                  <td className={`${typography.body.small} text-gray-600 px-4 py-3`}>
                    {concession.reason}
                  </td>
                  <td className={`${typography.body.small} text-gray-600 px-4 py-3`}>
                    {concession.approvedBy}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`${typography.body.xs} px-2.5 py-1 rounded-full font-medium ${
                        concession.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {concession.status === "ACTIVE" ? "● ACTIVE" : "● PENDING"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span className={`${typography.body.xs} text-gray-500`}>
              Showing 6 of 12 registered concessions
            </span>
            <div className="flex gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50">
                ‹
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white text-xs">
                1
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs">
                2
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Concession Policy Review Banner */}
      <div className="mx-0 sm:mx-5 mb-5 bg-gradient-to-r from-[#1e1b4b] to-[#312e81] rounded-none sm:rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className={`${typography.heading.h6} text-white font-semibold mb-1 uppercase tracking-tight`}>
            Concession Policy Review
          </h3>
          <p className={`${typography.body.small} text-gray-300 max-w-xl`}>
            The 2024-25 academic session's concession policies were last updated on March 15th. 
            All pending requests must be processed by the end of the current month.
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-white text-gray-900 hover:bg-gray-100 border-0 h-9 px-4 w-full md:w-auto uppercase font-bold text-xs"
        >
          View Guide
        </Button>
      </div>
    </div>
  );
}