import { useState, useMemo } from "react";
import { ChevronRight, Search, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/statcard";
import { cn } from "@/utils/cn";
import { formatINR } from "@/utils/formatters";
import { getModeBadgeClass } from "@/utils/payment";
import typography from "@/styles/typography";
import { mockStudents, mockFees, mockTransactions } from "../../fees/data/fee.data";
import type { Student, Transaction } from "../../fees/types/fees.types";

type PaymentStatus = "PAID" | "PARTIAL" | "PENDING";

const statusStyles: Record<PaymentStatus, string> = {
  PAID: "bg-green-50 text-green-700",
  PARTIAL: "bg-amber-50 text-amber-700",
  PENDING: "bg-red-50 text-red-700",
};

export default function StudentLedgerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return mockStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const studentFees = useMemo(() => {
    if (!selectedStudent) return [];
    return mockFees.filter((f) => f.student === selectedStudent.name);
  }, [selectedStudent]);

  const studentTransactions = useMemo(() => {
    if (!selectedStudent) return [];
    const txMap = new Map<string, Transaction[]>();
    for (const tx of mockTransactions) {
      const key = tx.student;
      if (!txMap.has(key)) txMap.set(key, []);
      txMap.get(key)!.push(tx);
    }
    for (const fee of mockFees) {
      if (fee.student === selectedStudent.name) {
        if (!txMap.has(fee.student)) txMap.set(fee.student, []);
      }
    }
    return (txMap.get(selectedStudent.name) || []).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [selectedStudent]);

  const totalFees = useMemo(
    () => studentFees.reduce((sum, f) => sum + f.amount, 0),
    [studentFees]
  );
  const totalPaid = useMemo(
    () => studentTransactions.reduce((sum, t) => sum + t.paidAmount, 0),
    [studentTransactions]
  );
  const pendingAmount = totalFees - totalPaid;

  const handleSelect = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setShowDropdown(false);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setShowDropdown(true);
    if (!val) setSelectedStudent(null);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedStudent(null);
    setShowDropdown(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <span>Accounts</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">Student Ledger</span>
        </div>
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">
          Student Ledger
        </h1>
        <p className="text-xs md:text-sm text-gray-500">
          Individual student financial history
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or admission no..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>
        {showDropdown && filteredStudents.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredStudents.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-center justify-between border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    {s.className} &middot; {s.admissionNo}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{s.parentName}</span>
              </button>
            ))}
          </div>
        )}
        {showDropdown && searchQuery && filteredStudents.length === 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
            No students found
          </div>
        )}
      </div>

      {selectedStudent && (
        <>
          {/* Student Info Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className={`${typography.heading.h6} text-gray-900`}>
                    {selectedStudent.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedStudent.className} &middot;{" "}
                    {selectedStudent.admissionNo}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-500">Parent</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedStudent.parentName}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Fees"
              value={totalFees.toLocaleString("en-IN")}
            />
            <StatCard
              label="Paid Amount"
              value={totalPaid.toLocaleString("en-IN")}
            />
            <div
              className={cn(
                "group bg-white border rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition-all duration-200 h-full",
                pendingAmount > 0
                  ? "border-red-200 hover:border-red-400 hover:shadow-md hover:-translate-y-1"
                  : "border-[#E8EBF2] hover:border-[#3525CD] hover:shadow-md hover:-translate-y-1"
              )}
            >
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-600">
                Pending Amount
              </p>
              <p
                className={cn(
                  "text-xl font-semibold leading-tight",
                  pendingAmount > 0 ? "text-red-600" : "text-[#0B1C30]"
                )}
              >
                {pendingAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5"
              onClick={() => console.log("Export PDF for student:", selectedStudent?.name)}
            >
              <FileText className="w-3.5 h-3.5" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5"
              onClick={() => console.log("Export Excel for student:", selectedStudent?.name)}
            >
              <Download className="w-3.5 h-3.5" />
              Excel
            </Button>
          </div>

          {/* Transaction History - Mobile Card View */}
          <div className="sm:hidden space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Transaction History
            </h3>
            {studentTransactions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No transactions found
              </p>
            ) : (
              studentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="rounded-xl border border-slate-200 p-4 bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {tx.feeHead ?? "Fee"}
                      </p>
                      <p className="text-slate-400 text-[11px]">{tx.date}</p>
                    </div>
                    <span className="font-bold text-[#3525CD] text-sm">
                      {formatINR(tx.amount)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-slate-500">
                      Paid: {formatINR(tx.paidAmount)}
                    </span>
                    <span className="text-slate-300 text-[11px]">·</span>
                    <span className="text-xs text-slate-500">
                      Balance: {formatINR(tx.remainingAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={getModeBadgeClass(tx.mode as any)}>
                      {tx.mode}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                        statusStyles[tx.status as PaymentStatus] ??
                          "bg-gray-50 text-gray-600"
                      )}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Transaction History - Desktop Table */}
          <div className="hidden sm:block">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Transaction History
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Date", "Fee Head", "Amount", "Paid Amount", "Balance", "Payment Mode", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {studentTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-sm text-gray-400"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    studentTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-400 text-[12px] whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[13px]">
                          {tx.feeHead ?? "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 text-[13px]">
                          {formatINR(tx.amount)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[13px]">
                          {formatINR(tx.paidAmount)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[13px]">
                          {formatINR(tx.remainingAmount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={getModeBadgeClass(tx.mode as any)}
                          >
                            {tx.mode}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                              statusStyles[tx.status as PaymentStatus] ??
                                "bg-gray-50 text-gray-600"
                            )}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!selectedStudent && (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Search for a student above to view their ledger
          </p>
        </div>
      )}
    </div>
  );
}
