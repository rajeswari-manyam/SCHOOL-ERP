import { FeeRecord } from "../types/fees.types";

interface FeePendingTableProps {
  records: FeeRecord[];
  onMarkPaid: (feeId: string) => void;
}

export const FeePendingTable = ({
  records,
  onMarkPaid,
}: FeePendingTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr>
          <th className="px-4 py-2">Student</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Due Date</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {records.map((rec) => (
          <tr key={rec.id}>
            <td className="px-4 py-2">{rec.studentName}</td>
            <td className="px-4 py-2">{rec.amount}</td>
            <td className="px-4 py-2">{rec.dueDate}</td>
            <td className="px-4 py-2 capitalize">{rec.status}</td>
            <td className="px-4 py-2">
              {rec.status === "unpaid" && (
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => onMarkPaid(rec.id)}
                >
                  Mark Paid
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
