import { useNavigate } from "react-router-dom";
import type { AdmissionStage } from "../types/sa-dashboard.types";

const stageStyles: Record<string, { label: string; accent: string }> = {
  ENQUIRY:   { label: "ENQUIRY",   accent: "text-gray-600" },
  INTERVIEW: { label: "INTERVIEW", accent: "text-blue-600" },
  DOCS:      { label: "DOCS",      accent: "text-indigo-600" },
  CONFIRMED: { label: "CONFIRMED", accent: "text-emerald-600 font-extrabold" },
  DECLINED:  { label: "DECLINED",  accent: "text-red-500" },
};

const quickActions = [
  { label: "ADD STUDENT",     icon: "👤+",  path: "/school-admin/students/new",     color: "text-gray-700" },
  { label: "ATTENDANCE",      icon: "✅",   path: "/school-admin/attendance",        color: "text-gray-700" },
  { label: "FEE PAYMENT",     icon: "💳",   path: "/school-admin/fees",              color: "text-gray-700" },
  { label: "SEND BROADCAST",  icon: "📢",   path: "/school-admin/broadcast",         color: "text-gray-700" },
  { label: "ADD ENQUIRY",     icon: "🔍",   path: "/school-admin/admissions/new",    color: "text-gray-700" },
  { label: "GEN. REPORT",     icon: "📊",   path: "/school-admin/reports",           color: "text-gray-700" },
];

const AdmissionsPipelineCard = ({ stages = [] }: { stages?: AdmissionStage[] }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
      <h2 className="text-base font-extrabold text-gray-900">Admissions Pipeline & Quick Actions</h2>

      {/* Pipeline stages */}
      <div className="grid grid-cols-5 gap-2">
        {stages.map((s) => {
          const style = stageStyles[s.key] ?? { label: s.key, accent: "text-gray-600" };
          return (
            <div key={s.key} className="flex flex-col items-center gap-1 px-2 py-3 bg-gray-50 rounded-xl text-center">
              <p className={`text-[10px] font-bold uppercase tracking-wide ${s.key === "CONFIRMED" ? "text-emerald-500" : s.key === "DECLINED" ? "text-red-400" : "text-gray-400"}`}>
                {style.label}
              </p>
              <p className={`text-2xl font-extrabold ${s.key === "CONFIRMED" ? "text-emerald-600" : s.key === "DECLINED" ? "text-red-500" : "text-gray-800"}`}>
                {s.count}
              </p>
              {s.key === "CONFIRMED" && <div className="w-full h-0.5 bg-emerald-400 rounded-full mt-0.5" />}
            </div>
          );
        })}
      </div>

      {/* Quick action grid */}
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className="flex flex-col items-center gap-2 py-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdmissionsPipelineCard;
