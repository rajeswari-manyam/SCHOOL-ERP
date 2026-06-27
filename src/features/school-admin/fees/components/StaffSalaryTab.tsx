import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getAllPayslips, getAllPayroll, updatePayslipById, deletePayslipById } from "@/services/payroll.api";
import type { PayslipRecord, PayrollRecord } from "@/services/payroll.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { PaySalaryModal } from "@/features/accountant/payroll/components/payroll/PaySalaryModal";
import type { StaffPayroll, PaySalaryFormData, PayslipResult } from "@/features/accountant/payroll/types/payroll.types";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatCurrency(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

function toInitials(name: string) {
  return (name ?? "?").split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
}

function toStaffPayroll(p: PayslipRecord): StaffPayroll {
  const bonus      = p.bonus      ?? 0;
  const overtime   = p.overtime   ?? 0;
  const extraClass = p.extra_class_payment ?? 0;
  const leaveDed   = p.leave_deduction ?? 0;
  return {
    id:              p.staff_id,
    payslipId:       p.id,
    name:            p.staff_name ?? "Staff",
    initials:        toInitials(p.staff_name ?? ""),
    role:            "Staff",
    present:         p.present_days,
    absent:          p.absent_days,
    gross:           p.gross_salary,
    bonus,
    overtime,
    extraClass,
    leaveDeductions: leaveDed,
    otherDeductions: 0,
    adjustments:     bonus + overtime + extraClass - leaveDed,
    deductions:      p.total_deductions ?? 0,
    net:             p.net_salary,
    status:          p.payment_status === "Paid" ? "Paid" : "Pending",
    paymentDate:     p.payment_date ?? undefined,
  };
}

export function StaffSalaryTab() {
  const [payslips,    setPayslips]    = useState<PayslipRecord[]>([]);
  const [payrolls,    setPayrolls]    = useState<PayrollRecord[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showStructure, setShowStructure] = useState(false);
  const [editTarget,  setEditTarget]  = useState<StaffPayroll | null>(null);

  const fetchPayslips = useCallback(async () => {
    setLoading(true);
    try {
      const [psRes, prRes] = await Promise.all([getAllPayslips(), getAllPayroll()]);
      if (psRes.status) setPayslips(psRes.data);
      if (prRes.status) setPayrolls(prRes.data);
    } catch {
      toast.error("Failed to fetch payroll data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayslips(); }, [fetchPayslips]);

  const handlePayConfirm = async (_staffId: string, data: PaySalaryFormData): Promise<void | PayslipResult> => {
    if (!editTarget?.payslipId) throw new Error("No payslip to update");
    try {
      await updatePayslipById(editTarget.payslipId, {
        bonus:              data.bonus,
        overtime:           data.overtime,
        extra_class_payment: data.extraClass,
        leave_deduction:    data.leaveDeductions,
        payment_status:     "Paid",
        remarks:            data.remarks || undefined,
      });
      toast.success("Payslip updated successfully");
      fetchPayslips();
    } catch {
      toast.error("Failed to update payslip");
      throw new Error();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payslip?")) return;
    try {
      await deletePayslipById(id);
      setPayslips((prev) => prev.filter((p) => p.id !== id));
      toast.success("Payslip deleted");
    } catch {
      toast.error("Failed to delete payslip");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center p-6">
        <Spinner className="text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Salary Structure ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setShowStructure(!showStructure)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-t-2xl"
        >
          <span>Salary Structure ({payrolls.length})</span>
          <span className={`text-gray-400 transition-transform ${showStructure ? "rotate-180" : ""}`}>▼</span>
        </button>
        {showStructure && (
          <div className="overflow-x-auto border-t border-gray-100">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Staff", "Role", "Base Salary", "HRA", "Transport", "Other", "PF%", "PT", "TDS", "Gross", "Net", "Effective"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payrolls.map((pr) => (
                  <tr key={pr.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-medium text-gray-800 whitespace-nowrap">{pr.staff_name}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{pr.role}</td>
                    <td className="px-3 py-2.5 font-semibold tabular-nums">{formatCurrency(pr.base_salary)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCurrency(pr.hra)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCurrency(pr.transport_allowance)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCurrency(pr.other_allowance)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{pr.pf_percentage}%</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCurrency(pr.professional_tax)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCurrency(pr.tds_monthly)}</td>
                    <td className="px-3 py-2.5 font-semibold tabular-nums">{formatCurrency(pr.gross_salary)}</td>
                    <td className="px-3 py-2.5 font-bold text-gray-900 tabular-nums">{formatCurrency(pr.net_salary)}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{pr.effective_from}</td>
                  </tr>
                ))}
                {payrolls.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-3 py-6 text-center text-sm text-gray-400">No salary structure configured</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Payslips ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Payslips ({payslips.length})
        </h3>
        <Button variant="outline" size="sm" onClick={fetchPayslips} className="text-xs">
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Staff</TableHead>
              <TableHead className="py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Month</TableHead>
              <TableHead className="py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Gross</TableHead>
              <TableHead className="py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Net</TableHead>
              <TableHead className="py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</TableHead>
              <TableHead className="py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payslips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-gray-400">
                  No payslips found
                </TableCell>
              </TableRow>
            ) : (
              payslips.map((p) => (
                <TableRow key={p.id} className="border-b border-gray-50">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                        {p.staff_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{p.staff_name}</p>
                        <p className="text-[11px] text-gray-400">Base: {formatCurrency(p.base_salary)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-600">
                    {monthNames[p.month - 1]} {p.year}
                  </TableCell>
                  <TableCell className="py-3 text-sm font-semibold text-gray-800 tabular-nums">
                    {formatCurrency(p.gross_salary)}
                  </TableCell>
                  <TableCell className="py-3 text-sm font-bold text-gray-900 tabular-nums">
                    {formatCurrency(p.net_salary)}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant={p.payment_status === "Paid" ? "success" : "warning"}
                      className="text-[11px]"
                    >
                      {p.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditTarget(toStaffPayroll(p))}
                        className="h-8 px-2 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                      >
                        Update
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                        className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editTarget && (
        <PaySalaryModal
          staff={editTarget}
          onClose={() => setEditTarget(null)}
          onPay={handlePayConfirm}
        />
      )}
    </div>
  );
}
