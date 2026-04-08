import type { AdmissionApplication } from "../types/admissions.types";

interface ApplicationTableProps {
  applications: AdmissionApplication[];
  onReview: (id: string) => void;
}

export const ApplicationTable = ({
  applications,
  onReview,
}: ApplicationTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr>
          <th className="px-4 py-2">Student</th>
          <th className="px-4 py-2">Class</th>
          <th className="px-4 py-2">Parent</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Applied At</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((a) => (
          <tr key={a.id}>
            <td className="px-4 py-2">{a.studentName}</td>
            <td className="px-4 py-2">{a.class}</td>
            <td className="px-4 py-2">{a.parentName}</td>
            <td className="px-4 py-2">{a.phone}</td>
            <td className="px-4 py-2 capitalize">{a.status}</td>
            <td className="px-4 py-2">{a.appliedAt}</td>
            <td className="px-4 py-2">
              <button className="text-blue-600" onClick={() => onReview(a.id)}>
                Review
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
