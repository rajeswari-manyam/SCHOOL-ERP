import { useState } from "react";
import {
  Loader2, AlertCircle, Check, RefreshCw,
  TrendingUp, Wallet, ArrowDownCircle, Calendar,
} from "lucide-react";
import { usePayslip } from "./hooks/usePayslip";
import CurrentSalaryCard from "./components/CurrentSalaryCard";
import SalaryHistoryTable from "./components/SalaryHistoryTable";
import AnnualSummaryCard from "./components/AnnualSummaryCard";
import MonthPickerDropdown from "./components/MonthPickerDropdown";

const inr = (n: number | undefined | null) => "₹" + (n ?? 0).toLocaleString("en-IN");

const STATUS_BADGE: Record<string, string> = {
  PAID:       "bg-emerald-100 text-emerald-700 border border-emerald-200",
  PENDING:    "bg-amber-100 text-amber-700 border border-amber-200",
  PROCESSING: "bg-blue-100 text-blue-700 border border-blue-200",
};

const Toast = ({ color, text }: { color: "indigo" | "emerald"; text: string }) => (
  <div className={[
    "flex items-center gap-2 border text-xs font-semibold px-3 py-1.5 rounded-xl animate-pulse",
    color === "emerald"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : "bg-indigo-50 border-indigo-200 text-indigo-700",
  ].join(" ")}>
    <Check size={12} strokeWidth={2.5} />
    {text}
  </div>
);

const PayslipPage = () => {
  const {
    loading, error,
    currentPayslip, payslips,
    annualSummary,
    selectedMonthIndex, selectedYear,
    setSelectedMonthIndex, setSelectedYear,
    downloadPayslip, sendToWhatsApp, downloadAnnualStatement,
    retry,
  } = usePayslip();

  const [dlMsg,        setDlMsg]        = useState(false);
  const [waMsg,        setWaMsg]        = useState(false);
  const [annualDlMsg,  setAnnualDlMsg]  = useState(false);
  const [historyDlMsg, setHistoryDlMsg] = useState<string | null>(null);

  const handleDownload       = () => { downloadPayslip();         setDlMsg(true);       setTimeout(() => setDlMsg(false),       3000); };
  const handleWhatsApp       = () => { sendToWhatsApp();          setWaMsg(true);       setTimeout(() => setWaMsg(false),       3000); };
  const handleAnnualDownload = () => { downloadAnnualStatement(); setAnnualDlMsg(true); setTimeout(() => setAnnualDlMsg(false), 3000); };
  const handleHistoryDl      = (id: string) => { setHistoryDlMsg(id); setTimeout(() => setHistoryDlMsg(null), 3000); };

  const att = currentPayslip?.attendance;

  const summaryCards = [
    {
      title: "Gross Salary",
      value: inr(currentPayslip?.grossSalary),
      icon: TrendingUp,
      gradient: "from-indigo-500 to-violet-600",
      shadow: "shadow-indigo-200",
      sub: "Before deductions",
    },
    {
      title: "Net Salary",
      value: inr(currentPayslip?.netSalary),
      icon: Wallet,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-200",
      sub: "Take home pay",
    },
    {
      title: "Total Deductions",
      value: inr(currentPayslip?.totalDeductions),
      icon: ArrowDownCircle,
      gradient: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-200",
      sub: "PF + Tax + Others",
    },
    {
      title: "Attendance",
      value: `${att?.presentDays ?? 0} / ${att?.workingDays ?? 0}`,
      icon: Calendar,
      gradient: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-200",
      sub: `${att?.absentDays ?? 0} Absent · ${att?.halfDays ?? 0} Half-day`,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading payslip…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 pb-10 space-y-6">

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payslip</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {currentPayslip?.employeeName
              ? `${currentPayslip.employeeName}${currentPayslip.designation ? ` · ${currentPayslip.designation}` : ""}`
              : "Salary details"}
          </p>
        </div>

        {/* Right: status badge + month picker + toasts */}
        <div className="flex flex-wrap items-center gap-2">
          {currentPayslip && (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_BADGE[currentPayslip.status] ?? STATUS_BADGE["PENDING"]}`}>
              {currentPayslip.status === "PAID"
                ? "Paid"
                : currentPayslip.status === "PROCESSING"
                  ? "Processing"
                  : "Pending"}
            </span>
          )}

          {/* Calendar month picker dropdown */}
          <MonthPickerDropdown
            monthIndex={selectedMonthIndex}
            year={selectedYear}
            onChange={(m, y) => { setSelectedMonthIndex(m); setSelectedYear(y); }}
          />

          {dlMsg        && <Toast color="indigo"  text="PDF download started!" />}
          {waMsg        && <Toast color="emerald" text="Sent to WhatsApp!" />}
          {annualDlMsg  && <Toast color="indigo"  text="Annual statement downloading!" />}
          {historyDlMsg && <Toast color="indigo"  text="Payslip PDF downloading!" />}
        </div>
      </div>

      {/* ── Error banner ─────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span className="text-sm font-medium text-red-700 truncate">{error}</span>
          </div>
          <button onClick={retry} className="flex items-center gap-1.5 ml-4 text-sm font-bold text-red-700 hover:text-red-900 shrink-0 transition-colors">
            <RefreshCw size={13} strokeWidth={2} />
            Retry
          </button>
        </div>
      )}

      {/* ── No data state ─────────────────────────────────────────────── */}
      {!currentPayslip && !error && (
        <div className="flex flex-col items-center justify-center min-h-[220px] bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Calendar size={36} className="text-gray-200 mb-3" strokeWidth={1.5} />
          <p className="text-sm font-semibold text-gray-400">
            No payslip for this month
          </p>
          <p className="text-xs text-gray-300 mt-1">Try selecting a different month</p>
        </div>
      )}

      {currentPayslip && (
        <div className="space-y-6">

          {/* ── 4 Summary cards ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map(({ title, value, icon: Icon, gradient, shadow, sub }) => (
              <div
                key={title}
                className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 flex flex-col justify-between shadow-lg ${shadow} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 min-h-[120px]`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/80 leading-tight">{title}</p>
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-[22px] font-extrabold text-white leading-tight tabular-nums">{value}</p>
                  <p className="text-[11px] text-white/70 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Employee info + Salary breakdown + Actions ────────────── */}
          <CurrentSalaryCard
            payslip={currentPayslip}
            onDownload={handleDownload}
            onWhatsApp={handleWhatsApp}
          />

          {/* ── Salary history ────────────────────────────────────────── */}
          <SalaryHistoryTable
            payslips={payslips}
            onDownload={(p) => handleHistoryDl(p.id)}
          />

          {/* ── Annual summary ────────────────────────────────────────── */}
          <AnnualSummaryCard summary={annualSummary} onDownload={handleAnnualDownload} />

        </div>
      )}
    </div>
  );
};

export default PayslipPage;
