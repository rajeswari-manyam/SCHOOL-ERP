import type { Invoice } from "../types/billing.types";

interface InvoiceTableProps {
  invoices: Invoice[];
  onPay: (id: string) => void;
}

export const InvoiceTable = ({ invoices, onPay }: InvoiceTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>School</th>
        <th>Amount</th>
        <th>Due Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {invoices.map((inv) => (
        <tr key={inv.id}>
          <td>{inv.schoolName}</td>
          <td>${inv.amount.toLocaleString()}</td>
          <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
          <td>
            <span className={`px-2 py-1 rounded text-sm ${
              inv.status === "paid" ? "bg-green-100 text-green-800" :
              inv.status === "pending" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>{inv.status}</span>
          </td>
          <td>
            {inv.status !== "paid" && (
              <button className="text-blue-600" onClick={() => onPay(inv.id)}>Mark Paid</button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
