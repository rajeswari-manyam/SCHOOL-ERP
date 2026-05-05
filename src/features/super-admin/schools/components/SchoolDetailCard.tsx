import type { School } from "../types/school.types";

interface SchoolDetailCardProps {
  school: School;
}

export const SchoolDetailCard = ({ school }: SchoolDetailCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-xl font-bold">{school.name}</h2>
        <p className="text-gray-500">{school.city}</p>
      </div>
      <span className={`px-3 py-1 rounded ${
        school.status === "ACTIVE" ? "bg-green-100 text-green-800" :
        school.status === "SUSPENDED" ? "bg-red-100 text-red-800" :
        "bg-yellow-100 text-yellow-800"
      }`}>
        {school.status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-gray-500 text-sm">Plan</p>
        <p className="capitalize">{school.plan}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Expires</p>
        <p>{new Date(school.subscriptionEnd).toLocaleDateString()}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Students</p>
        <p>{school.students}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Last Active</p>
        <p>{school.lastActive}</p>
      </div>
    </div>
  </div>
);
