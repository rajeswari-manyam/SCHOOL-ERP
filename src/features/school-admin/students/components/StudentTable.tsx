import { useNavigate } from "react-router-dom";
import type { Student } from "../types/student.types";
import { StatusBadge, FeeBadge } from "./StudentBadge";

const Avatar = ({ s }: { s: Student }) => {
  const initials = (s.firstName[0] + s.lastName[0]).toUpperCase();
  const colors = ["bg-indigo-100 text-indigo-700", "bg-pink-100 text-pink-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-blue-100 text-blue-700"];
  const color = colors[parseInt(s.id) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
};

const StudentTable = ({ students }: { students: Student[] }) => {
  const navigate = useNavigate();

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-400 text-sm">No students found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Photo</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Admission No.</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Student Name</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Class</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Section</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Parent Phone</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Fee Status</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr
                key={s.id}
                className={`border-b border-gray-50 hover:bg-indigo-50/30 transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
                onClick={() => navigate(`/school-admin/students/${s.id}`)}
              >
                <td className="px-4 py-3"><Avatar s={s} /></td>
                <td className="px-4 py-3 text-xs font-semibold text-gray-500">{s.admissionNo}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{s.firstName} {s.lastName}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.class}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.section}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.parentPhone}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3"><FeeBadge status={s.feeStatus} /></td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/school-admin/students/${s.id}`)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      title="View"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;