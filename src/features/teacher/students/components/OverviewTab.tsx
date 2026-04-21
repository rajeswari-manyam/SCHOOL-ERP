import type { Student } from "../types/my-students.types";
import { Phone } from "lucide-react";

const OverviewTab = ({ student }: { student: Student }) => {
  const balance = student.feeTotal - student.feePaid;
  const pct = student.feeTotal > 0 ? Math.round((student.feePaid / student.feeTotal) * 100) : 0;
  const feeColor =
    student.feeStatus === "PAID"    ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
    student.feeStatus === "OVERDUE" ? "text-red-600 bg-red-50 border-red-200" :
    student.feeStatus === "PARTIAL" ? "text-blue-600 bg-blue-50 border-blue-200" :
                                      "text-amber-600 bg-amber-50 border-amber-200";
  const barColor =
    student.feeStatus === "PAID"    ? "bg-emerald-500" :
    student.feeStatus === "OVERDUE" ? "bg-red-500"     :
    student.feeStatus === "PARTIAL" ? "bg-blue-500"    : "bg-amber-400";

  return (
    <div className="flex flex-col gap-5">
      {/* Parents */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Parent / Guardian</p>
        <div className="flex flex-col gap-2.5">
          {[
            { role: "Father", name: student.fatherName, phone: student.fatherPhone, icon: "👨" },
            { role: "Mother", name: student.motherName, phone: student.motherPhone, icon: "👩" },
          ].map(({ role, name, phone, icon }) => (
            <div key={role} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900">{name}</p>
                <p className="text-[11px] text-gray-400">{role}</p>
              </div>
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Phone size={12} className="text-current" strokeWidth={2} />
                {phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Fee card */}
      <div className={`rounded-xl border p-4 ${feeColor}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-extrabold uppercase tracking-widest">Fee Status</p>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${feeColor}`}>
            {student.feeStatus}
          </span>
        </div>
        {/* Bar */}
        <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-3">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] opacity-60">Total</p>
            <p className="text-sm font-extrabold">₹{(student.feeTotal / 1000).toFixed(0)}k</p>
          </div>
          <div>
            <p className="text-[10px] opacity-60">Paid</p>
            <p className="text-sm font-extrabold">₹{(student.feePaid / 1000).toFixed(0)}k</p>
          </div>
          <div>
            <p className="text-[10px] opacity-60">Balance</p>
            <p className="text-sm font-extrabold">₹{(balance / 1000).toFixed(0)}k</p>
          </div>
        </div>
        <p className="text-[10px] opacity-60 mt-2">Due: {student.feeDueDate}</p>
      </div>
    </div>
  );
};

export default OverviewTab;
