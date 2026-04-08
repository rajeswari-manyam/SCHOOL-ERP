import type{ Payslip } from "../types/payslip.types";

interface PayslipTableProps {
  payslips: Payslip[];
}

export const PayslipTable = ({ payslips }: PayslipTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Month</th>
        <th>Base Salary</th>
        <th>Allowances</th>
        <th>Deductions</th>
        <th>Net Pay</th>
        <th>Status</th>
        <th>Paid At</th>
      </tr>
    </thead>
    <tbody>
      {payslips.map((p) => (
        <tr key={p.id}>
          <td>{p.month}</td>
          <td>${p.baseSalary.toLocaleString()}</td>
          <td>${p.allowances.toLocaleString()}</td>
          <td>${p.deductions.toLocaleString()}</td>
          <td className="font-bold">${p.netPay.toLocaleString()}</td>
          <td>
            <span className={`px-2 py-1 rounded text-sm ${p.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              {p.status}
            </span>
          </td>
          <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
