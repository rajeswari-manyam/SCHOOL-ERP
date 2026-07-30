import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthlyPayrollTab } from "../components/payroll/MonthlyPayRollTab";
import { SalaryConfigTab } from "../components/salaryconfig/SalaryConfigTab";
import { PayrollHistoryTab } from "../components/payrollhistory/PayrollHistoryTab";
import { ProcessPayrollModal } from "../common/ProcessPayroll";
import { PayslipModal } from "../components/PayslipModal";
import { usePayroll, useSalaryConfig, usePayrollHistory, useMonthlyPayrollData } from "../hooks/usePayrolls";
import { useUIStore } from "@/store/uiStore";
import type { StaffPayroll } from "../types/payroll.types";

type Tab = "structure" | "monthly" | "history";

const TABS: { id: Tab; label: string }[] = [
  { id: "structure",  label: "Salary Structure"  },
  { id: "monthly",    label: "Monthly Payroll"   },
  { id: "history",    label: "Payroll History"   },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PayrollPage() {
  const [activeTab, setActiveTab]                       = useState<Tab>("monthly");
  const [currentMonth, setCurrentMonth]                 = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [showProcessModal, setShowProcessModal]         = useState(false);
  const [showPayslipModal, setShowPayslipModal]         = useState(false);
  const [selectedPayslipStaff, setSelectedPayslipStaff] = useState<StaffPayroll | null>(null);

  const academicYearName = useUIStore((s) => s.academicYearName);

  const { processPayroll, paySalary, paySelected, getAttendanceDeductions } = usePayroll();

  const {
    staffData, summary, isProcessed, isLoading: monthlyLoading,
    processedDate, processedBy, generatePayslip, deletePayslip, refresh: refreshMonthly,
  } = useMonthlyPayrollData(currentMonth.getMonth() + 1, currentMonth.getFullYear());
  const {
    salaryData, isLoading: salaryLoading, selectedStaff, isEditing,
    openEditModal, closeEditModal, updateSalary, deletePayroll, refresh: refreshSalary,
  } = useSalaryConfig();
  const { history, totalPayrollFY, avgMonthlyPayroll, staffCount } = usePayrollHistory();

  // Auto-refresh monthly data when tab becomes active or month changes
  useEffect(() => {
    if (activeTab === "monthly") refreshMonthly();
  }, [activeTab, currentMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = (dir: -1 | 1) => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  };

  const formattedMonthShort = currentMonth.toLocaleString("default", { month: "short", year: "numeric" });

  const handleProcessPayroll = (data: { paymentMode: string; paymentDate: string; approvalNote?: string }) => {
    processPayroll(data);
    setShowProcessModal(false);
  };

  const handleViewPayslip = (staff: StaffPayroll) => {
    setSelectedPayslipStaff(staff);
    setShowPayslipModal(true);
  };

  const payslipStaff = useMemo(() => {
    if (!selectedPayslipStaff) return null;
    const config = salaryData.find((s) => s.id === selectedPayslipStaff.id);
    return {
      name:            selectedPayslipStaff.name,
      role:            selectedPayslipStaff.role,
      basic:           config?.basic ?? 0,
      hra:             config?.hra ?? 0,
      transport:       config?.transport ?? 0,
      other:           config?.other ?? 0,
      pfPercentage:    config?.pfPercentage ?? 0,
      professionalTax: config?.professionalTax ?? 0,
      gross:           selectedPayslipStaff.gross,
      net:             selectedPayslipStaff.net,
      deductions:      selectedPayslipStaff.deductions,
    };
  }, [selectedPayslipStaff, salaryData]);

  return (
    <div className="min-h-screen bg-[#EFF4FF] -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8">
      {/* ── Page Header ── */}
  <div className="bg-white border-b border-slate-200 mx-4 sm:mx-6 mt-2 sm:mt-3 rounded-2xl px-4 sm:px-6 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-semibold text-slate-900">Payroll Management</h1>
              {academicYearName && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[11px] font-semibold text-[#3525CD] whitespace-nowrap">
                  <BookOpen className="w-3 h-3" />
                  {academicYearName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage staff salaries · individual & bulk salary processing
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Month Navigator */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-1 py-1">
              <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-white transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="text-xs font-semibold text-slate-700 px-2 min-w-[96px] text-center">
                {formattedMonthShort}
              </span>
              <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-white transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            {/* Generate Payroll button — only on Monthly tab when not processed */}
            {activeTab === "monthly" && !isProcessed && (
              <Button
                size="sm"
                className="h-9 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white px-4"
                onClick={() => setShowProcessModal(true)}
              >
                Generate Payroll
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* ── Tab Container ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Tab Nav */}
          <div className="border-b border-slate-100 overflow-x-auto">
            <div className="flex min-w-max">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive ? "text-[#3525CD]" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#3525CD] rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === "structure" && (
              <SalaryConfigTab
                salaryData={salaryData}
                isLoading={salaryLoading}
                isEditing={isEditing}
                selectedStaff={selectedStaff}
                onEdit={openEditModal}
                onClose={closeEditModal}
                onSave={updateSalary}
                onDelete={deletePayroll}
                onRefresh={refreshSalary}
              />
            )}

            {activeTab === "monthly" && (
              <MonthlyPayrollTab
                staffData={staffData}
                summary={summary}
                isProcessed={isProcessed}
                isLoading={monthlyLoading}
                processedDate={processedDate}
                processedBy={processedBy}
                onStartProcessing={() => setShowProcessModal(true)}
                onViewPayslip={handleViewPayslip}
                onGeneratePayslip={generatePayslip}
                onPaySalary={paySalary}
                onPaySelected={paySelected}
                onDeletePayslip={deletePayslip}
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
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showProcessModal && (
        <ProcessPayrollModal
          onClose={() => setShowProcessModal(false)}
          onSubmit={handleProcessPayroll}
          summary={summary}
          attendanceDeductions={getAttendanceDeductions()}
        />
      )}
      {showPayslipModal && payslipStaff && (
        <PayslipModal
          staff={payslipStaff}
          month={formattedMonthShort}
          onClose={() => {
            setShowPayslipModal(false);
            setSelectedPayslipStaff(null);
          }}
        />
      )}
    </div>
  );
}
