import { useState } from "react";
import { Loader2, AlertCircle, Check, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { usePayslip } from "./hooks/usePayslip";
import CurrentSalaryCard from "./components/CurrentSalaryCard";
import PayslipPdfPreview from "./components/PayslipPdfPreview";
import SalaryHistoryTable from "./components/SalaryHistoryTable";
import AnnualSummaryCard from "./components/AnnualSummaryCard";

const PayslipPage = () => {
  const {
    loading,
    error,
    currentPayslip,
    payslips,
    hasMonthMatch,
    annualSummary,
    monthLabel,
    goToPrevMonth,
    goToNextMonth,
    downloadPayslip,
    sendToWhatsApp,
    downloadAnnualStatement,
    retry,
  } = usePayslip();

  const [dlMsg, setDlMsg] = useState(false);
  const [waMsg, setWaMsg] = useState(false);
  const [annualDlMsg, setAnnualDlMsg] = useState(false);
  const [historyDlMsg, setHistoryDlMsg] = useState<string | null>(null);

  const handleDownload = () => {
    downloadPayslip();
    setDlMsg(true);
    setTimeout(() => setDlMsg(false), 3000);
  };

  const handleWhatsApp = () => {
    sendToWhatsApp();
    setWaMsg(true);
    setTimeout(() => setWaMsg(false), 3000);
  };

  const handleAnnualDownload = () => {
    downloadAnnualStatement();
    setAnnualDlMsg(true);
    setTimeout(() => setAnnualDlMsg(false), 3000);
  };

  const handleHistoryDownload = (id: string) => {
    setHistoryDlMsg(id);
    setTimeout(() => setHistoryDlMsg(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 min-h-full p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <Loader2 size={28} className="text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500 font-semibold">Loading payslips…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payslip</h1>
          <p className="text-sm text-gray-500 mt-0.5">Anjali Verma · Employee ID TCH-2024-047</p>
        </div>

        {/* Toast notifications */}
        <div className="flex flex-col gap-2">
          {dlMsg && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <Check size={14} className="text-current" strokeWidth={2.5} />
              PDF download started!
            </div>
          )}
          {waMsg && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <Check size={14} className="text-current" strokeWidth={2.5} />
              Sent to WhatsApp!
            </div>
          )}
          {annualDlMsg && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <Check size={14} className="text-current" strokeWidth={2.5} />
              Annual statement downloading!
            </div>
          )}
          {historyDlMsg && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <Check size={14} className="text-current" strokeWidth={2.5} />
              Payslip PDF downloading!
            </div>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 mb-5">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-red-700">{error}</span>
          </div>
          <button
            onClick={retry}
            className="flex items-center gap-1.5 text-sm font-bold text-red-700 hover:text-red-900 transition-colors"
          >
            <RefreshCw size={14} className="text-current" strokeWidth={2} />
            Retry
          </button>
        </div>
      )}

      {/* Month navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3.5 mb-5">
        <button
          onClick={goToPrevMonth}
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ChevronLeft size={16} className="text-current" strokeWidth={2.5} />
          Prev
        </button>

        <div className="text-center">
          <p className="text-base font-extrabold text-gray-900">{monthLabel}</p>
          <p className="text-[11px] text-gray-400">Salary Period</p>
        </div>

        <button
          onClick={goToNextMonth}
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Next
          <ChevronRight size={16} className="text-current" strokeWidth={2.5} />
        </button>
      </div>

      {/* No data state */}
      {!currentPayslip && payslips.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-white rounded-xl border border-gray-200 shadow-sm mb-5">
          <p className="text-sm font-semibold text-gray-400">No payslip data available</p>
        </div>
      )}

      {/* No match for this month */}
      {!hasMonthMatch && payslips.length > 0 && (
        <div className="flex items-center justify-center bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-5">
          <p className="text-sm font-semibold text-amber-700">
            No payslip data for {monthLabel} — showing latest available
          </p>
        </div>
      )}

      {/* Current month salary card */}
      {currentPayslip && (
        <>
          <div className="mb-5">
            <CurrentSalaryCard
              payslip={currentPayslip}
              onDownload={handleDownload}
              onWhatsApp={handleWhatsApp}
            />
          </div>

          {/* Payslip PDF preview card */}
          <div className="mb-5">
            <PayslipPdfPreview payslip={currentPayslip} />
          </div>
        </>
      )}

      {/* Salary history table */}
      <div className="mb-5">
        <SalaryHistoryTable
          payslips={payslips}
          onDownload={(p) => handleHistoryDownload(p.id)}
        />
      </div>

      {/* Annual summary card */}
      <AnnualSummaryCard summary={annualSummary} onDownload={handleAnnualDownload} />
    </div>
  );
};

export default PayslipPage;
