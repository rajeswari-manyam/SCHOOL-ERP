import type { Fee } from "../types/fees.types";
import { format } from "date-fns";
interface FeeTableProps {
  fees: Fee[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FeeTable = ({ fees, onEdit, onDelete }: FeeTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Student</th>
        <th>Amount</th>
        <th>Due Date</th>
        <th>Status</th>
        <th>Paid At</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {fees.map((fee) => (
        <tr key={fee.id}>
          <td>{fee.student}</td>
          <td>{fee.amount}</td>
       <td>{format(new Date(fee.dueDate), "dd MMM yyyy")}</td>
          <td>{fee.status}</td>
      <td>{fee.paidAt ? format(new Date(fee.paidAt), "dd MMM yyyy") : "-"}</td>
          <td>
            <button
              className="text-blue-600 mr-2"
              onClick={() => onEdit(fee.id)}
            >
              Edit
            </button>
            <button className="text-red-600" onClick={() => onDelete(fee.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
