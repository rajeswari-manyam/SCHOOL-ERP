import { useState } from "react";
import { usePayslip } from "./hooks/usePayslip";
import CurrentSalaryCard from "./components/CurrentSalaryCard";
import PayslipPdfPreview from "./components/PayslipPdfPreview";
import SalaryHistoryTable from "./components/SalaryHistoryTable";
import AnnualSummaryCard from "./components/AnnualSummaryCard";

const PayslipPage = () => {
  const {
    current,
    history,
    canPrev,
    canNext,
    goNext,
    goPrev,
    waMsg,
    dlMsg,
    handleDownload,
    handleWhatsApp,
  } = usePayslip();

  const [annualDlMsg, setAnnualDlMsg] = useState(false);
  const [historyDlMsg, setHistoryDlMsg] = useState<string | null>(null);

  const handleAnnualDownload = () => {
    setAnnualDlMsg(true);
    setTimeout(() => setAnnualDlMsg(false), 3000);
  };

  const handleHistoryDownload = (id: string) => {
    setHistoryDlMsg(id);
    setTimeout(() => setHistoryDlMsg(null), 3000);
  };

  return (
    <div className="flex flex-col gap-0 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Payslip</h1>
          <p className="text-sm text-gray-400 mt-0.5">Anjali Verma · Employee ID TCH-2024-047</p>
        </div>

        {/* Toast notifications */}
        <div className="flex flex-col gap-2">
          {dlMsg && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              PDF download started!
            </div>
          )}
          {waMsg && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Sent to WhatsApp!
            </div>
          )}
          {annualDlMsg && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Annual statement downloading!
            </div>
          )}
          {historyDlMsg && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Payslip PDF downloading!
            </div>
          )}
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3.5 mb-5">
        <button
          onClick={goPrev}
          disabled={!canPrev}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
            canPrev
              ? "text-indigo-600 hover:text-indigo-800"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Prev
        </button>

        <div className="text-center">
          <p className="text-base font-extrabold text-gray-900">{current.monthLabel}</p>
          <p className="text-[11px] text-gray-400">Salary Period</p>
        </div>

        <button
          onClick={goNext}
          disabled={!canNext}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
            canNext
              ? "text-indigo-600 hover:text-indigo-800"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* Current month salary card */}
      <div className="mb-5">
        <CurrentSalaryCard
          payslip={current}
          onDownload={handleDownload}
          onWhatsApp={handleWhatsApp}
        />
      </div>

      {/* Payslip PDF preview card */}
      <div className="mb-5">
        <PayslipPdfPreview payslip={current} />
      </div>

      {/* Salary history table */}
      <div className="mb-5">
        <SalaryHistoryTable
          payslips={history}
          onDownload={(p) => handleHistoryDownload(p.id)}
        />
      </div>

      {/* Annual summary card */}
      <AnnualSummaryCard onDownload={handleAnnualDownload} />
    </div>
  );
};

export default PayslipPage;
