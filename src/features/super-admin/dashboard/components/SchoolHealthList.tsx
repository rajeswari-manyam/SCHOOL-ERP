import { SchoolHealth } from "../types/dashboard.types";

interface SchoolHealthListProps {
  schools: SchoolHealth[];
}

export const SchoolHealthList = ({ schools }: SchoolHealthListProps) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h3 className="font-semibold">School Health</h3>
    </div>
    <div className="divide-y">
      {schools.map((school) => (
        <div key={school.schoolId} className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">{school.schoolName}</p>
            <p className="text-sm text-gray-500">{school.studentCount} students</p>
          </div>
          <span className={`px-2 py-1 rounded text-sm ${
            school.status === "healthy" ? "bg-green-100 text-green-800" :
            school.status === "warning" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {school.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);
