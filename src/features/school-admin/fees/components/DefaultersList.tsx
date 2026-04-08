import { FeeRecord } from "../types/fees.types";

interface DefaultersListProps {
  records: FeeRecord[];
}

export const DefaultersList = ({ records }: DefaultersListProps) => (
  <div className="bg-white rounded shadow p-4 mt-8">
    <h3 className="font-semibold mb-2">Defaulters</h3>
    <ul className="list-disc pl-6">
      {records
        .filter((r) => r.status === "unpaid")
        .map((rec) => (
          <li key={rec.id}>
            {rec.studentName} - {rec.amount} (Due: {rec.dueDate})
          </li>
        ))}
    </ul>
  </div>
);
