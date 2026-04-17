import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import type { RecentSchool, SchoolPlan } from "../types/dashboard.types";
import { Button } from "@/components/ui/button";

const planStyles: Record<SchoolPlan, string> = {
  PRO:     "bg-gray-900 text-white",
  GROWTH:  "bg-indigo-100 text-indigo-700",
  STARTER: "bg-gray-100 text-gray-600",
};

const Avatar = ({ initials }: { initials: string }) => (
  <div className="w-9 h-9 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
    {initials}
  </div>
);

interface RecentSchoolsCardProps { schools: RecentSchool[]; }

const RecentSchoolsCard = ({ schools }: RecentSchoolsCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-50">
        <h2 className="text-sm font-extrabold text-gray-900">Recent Schools Onboarded</h2>
      </div>
      <div className="divide-y divide-gray-50">
        {schools.map((s) => (
          <div key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
            <Avatar initials={s.initials} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
              <p className="text-xs text-gray-400">{s.city}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide flex-shrink-0 ${planStyles[s.plan]}`}>
              {s.plan}
            </span>
            <span className="text-xs text-gray-400 flex-shrink-0 min-w-[60px] text-right">{s.joinedAgo}</span>
            <Button
              onClick={() => navigate(`/super-admin/schools/${s.id}`)}
              className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
            >
              <Eye size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSchoolsCard;
