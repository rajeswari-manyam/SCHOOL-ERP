import { Receipt } from "../types/receipts.types";

interface ReceiptTableProps {
  receipts: Receipt[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReceiptTable = ({
  receipts,
  onEdit,
  onDelete,
}: ReceiptTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Date</th>
        <th>Student</th>
        <th>Amount</th>
        <th>Payment Method</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {receipts.map((r) => (
        <tr key={r.id}>
          <td>{new Date(r.date).toLocaleDateString()}</td>
          <td>{r.studentName}</td>
          <td>{r.amount}</td>
          <td>{r.paymentMethod}</td>
          <td>{r.description || "-"}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(r.id)}>
              Edit
            </button>
            <button className="text-red-600" onClick={() => onDelete(r.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
