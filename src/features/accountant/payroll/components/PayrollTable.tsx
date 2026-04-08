import { Payroll } from "../types/payroll.types";

interface PayrollTableProps {
  payrolls: Payroll[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PayrollTable = ({
  payrolls,
  onEdit,
  onDelete,
}: PayrollTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Month</th>
        <th>Staff</th>
        <th>Base Salary</th>
        <th>Allowances</th>
        <th>Deductions</th>
        <th>Net Pay</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {payrolls.map((p) => (
        <tr key={p.id}>
          <td>{p.month}</td>
          <td>{p.staffName}</td>
          <td>{p.baseSalary}</td>
          <td>{p.allowances}</td>
          <td>{p.deductions}</td>
          <td>{p.netPay}</td>
          <td>{p.status}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(p.id)}>
              Edit
            </button>
            <button className="text-red-600" onClick={() => onDelete(p.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
