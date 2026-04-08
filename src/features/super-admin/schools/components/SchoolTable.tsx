import { School } from "../types/school.types";

interface SchoolTableProps {
  schools: School[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onSuspend: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SchoolTable = ({ schools, onEdit, onView, onSuspend, onDelete }: SchoolTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Plan</th>
        <th>Students</th>
        <th>Teachers</th>
        <th>Status</th>
        <th>Expiry</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {schools.map((school) => (
        <tr key={school.id}>
          <td className="font-medium">{school.name}</td>
          <td>{school.email}</td>
          <td>
            <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
              {school.subscriptionPlan}
            </span>
          </td>
          <td>{school.studentCount}</td>
          <td>{school.teacherCount}</td>
          <td>
            <span className={`px-2 py-1 rounded text-sm ${
              school.status === "active" ? "bg-green-100 text-green-800" :
              school.status === "suspended" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {school.status}
            </span>
          </td>
          <td>{new Date(school.subscriptionExpiry).toLocaleDateString()}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onView(school.id)}>View</button>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(school.id)}>Edit</button>
            {school.status === "active" ? (
              <button className="text-orange-600 mr-2" onClick={() => onSuspend(school.id)}>Suspend</button>
            ) : null}
            <button className="text-red-600" onClick={() => onDelete(school.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
