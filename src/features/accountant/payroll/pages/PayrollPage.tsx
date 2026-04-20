import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import typography from "@/styles/typography";

import { MonthlyPayrollTab } from "../components/payroll/MonthlyPayRollTab";
import { SalaryConfigTab } from "../components/salaryconfig/SalaryConfigTab";
import { PayrollHistoryTab } from "../components/payrollhistory/PayrollHistoryTab";
import { ProcessPayrollModal } from "../common/ProcessPayroll";

import {
  usePayroll,
  useSalaryConfig,
  usePayrollHistory,
} from "../hooks/usePayrolls";

type Tab = "monthly" | "config" | "history";

const TABS: { id: Tab; label: string }[] = [
  { id: "monthly", label: "Monthly Payroll" },
  { id: "config", label: "Salary Config" },
  { id: "history", label: "Payroll History" },
];

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<Tab>("monthly");
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3, 1));
  const [showProcessModal, setShowProcessModal] = useState(false);

  const {
    staffData,
    summary,
    isProcessed,
    processedDate,
    processedBy,
    processPayroll,
    getAttendanceDeductions,
  } = usePayroll();

  const {
    salaryData,
    selectedStaff,
    isEditing,
    openEditModal,
    closeEditModal,
    updateSalary,
  } = useSalaryConfig();

  const { history, totalPayrollFY, avgMonthlyPayroll, staffCount } =
    usePayrollHistory();

  const navigate = (dir: -1 | 1) => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  };

  const formattedMonth = currentMonth.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  const handleProcessPayroll = (data: {
    paymentMode: string;
    paymentDate: string;
    approvalNote?: string;
  }) => {
    processPayroll(data);
    setShowProcessModal(false);
  };

  return (
    <div className="space-y-4 p-3 md:p-6 bg-[#EFF4FF] min-h-screen">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className={typography.heading.h5 + " text-gray-900"}>
            Payroll Management
          </h2>
          <p className={typography.body.xs + " text-gray-500"}>
            Manage staff salary and monthly payouts
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Month Picker */}
          <div className="flex items-center justify-between sm:justify-start px-3 h-9 rounded-full gap-2 bg-white border border-gray-200 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <span className="text-xs font-medium text-gray-900 whitespace-nowrap">
              {formattedMonth}
            </span>

            <button
              onClick={() => navigate(1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {activeTab === "monthly" && !isProcessed && (
            <Button
              size="sm"
              className="h-9 w-full sm:w-auto text-xs bg-[#3525CD] hover:bg-[#2a1fb5]"
              onClick={() => setShowProcessModal(true)}
            >
              Process Payroll
            </Button>
          )}
        </div>
      </div>

      {/* ── Tabs (FIGMA STYLE) ── */}
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-2 whitespace-nowrap transition-colors ${
                isActive ? "text-[#3525CD]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className={typography.body.small}>{tab.label}</span>

              {isActive && (
                <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-[#3525CD] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "monthly" && (
        <MonthlyPayrollTab
          staffData={staffData}
          summary={summary}
          isProcessed={isProcessed}
          processedDate={processedDate}
          processedBy={processedBy}
          onStartProcessing={() => setShowProcessModal(true)}
        />
      )}

      {activeTab === "config" && (
        <SalaryConfigTab
          salaryData={salaryData}
          isEditing={isEditing}
          selectedStaff={selectedStaff}
          onEdit={openEditModal}
          onClose={closeEditModal}
          onSave={updateSalary}
          onAdd={() => openEditModal(null)}
        />
      )}

      {activeTab === "history" && (
        <PayrollHistoryTab
          history={history}
          totalPayrollFY={totalPayrollFY}
          avgMonthlyPayroll={avgMonthlyPayroll}
          staffCount={staffCount}
        />
      )}

      {/* ── Modal ── */}
      {showProcessModal && (
        <ProcessPayrollModal
          onClose={() => setShowProcessModal(false)}
          onSubmit={handleProcessPayroll}
          summary={summary}
          attendanceDeductions={getAttendanceDeductions()}
        />
      )}
    </div>
  );
}