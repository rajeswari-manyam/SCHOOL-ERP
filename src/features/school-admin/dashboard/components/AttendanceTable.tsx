import type { Attendance } from "../types/dashboard.types";

export const AttendanceTable = ({ data }: { data: Attendance[] }) => {
  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-sm border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
          <tr>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Teacher</th>
            <th className="px-4 py-3">Present</th>
            <th className="px-4 py-3">Absent</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((row) => (
            <tr key={row.class} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 text-slate-700">{row.class}</td>
              <td className="px-4 py-4 text-slate-700">{row.teacher}</td>
              <td className="px-4 py-4 text-slate-700">{row.present}</td>
              <td className="px-4 py-4 text-slate-700">{row.absent}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  row.status === "MARKED"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}>
                  {row.status === "MARKED" ? "Marked" : "Not marked"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
