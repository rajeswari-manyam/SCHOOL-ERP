import { School } from "../types/school.types";

interface SchoolDetailCardProps {
  school: School;
}

export const SchoolDetailCard = ({ school }: SchoolDetailCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-xl font-bold">{school.name}</h2>
        <p className="text-gray-500">{school.email}</p>
      </div>
      <span className={`px-3 py-1 rounded ${
        school.status === "active" ? "bg-green-100 text-green-800" :
        school.status === "suspended" ? "bg-red-100 text-red-800" :
        "bg-yellow-100 text-yellow-800"
      }`}>
        {school.status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-gray-500 text-sm">Phone</p>
        <p>{school.phone}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Address</p>
        <p>{school.address}, {school.city}, {school.state}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Subscription Plan</p>
        <p className="capitalize">{school.subscriptionPlan}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Expires</p>
        <p>{new Date(school.subscriptionExpiry).toLocaleDateString()}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Students</p>
        <p>{school.studentCount}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Teachers</p>
        <p>{school.teacherCount}</p>
      </div>
    </div>
  </div>
);
