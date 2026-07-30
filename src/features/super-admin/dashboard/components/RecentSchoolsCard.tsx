import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import type { RecentSchool } from "../types/dashboard.types";
import { Button } from "@/components/ui/button";

const Avatar = ({ initials }: { initials: string }) => (
  <div className="w-7 h-7 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
    {initials}
  </div>
);

const joinedAgo = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
};

interface RecentSchoolsCardProps { schools: RecentSchool[]; }

const RecentSchoolsCard = ({ schools }: RecentSchoolsCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50">
        <h2 className="text-[13px] font-extrabold text-gray-900">Recent Schools Onboarded</h2>
      </div>
      {schools.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400">No schools onboarded yet.</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {schools.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition-colors sm:flex-row sm:items-center">
              <Avatar initials={s.name.slice(0, 2).toUpperCase()} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{s.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{s.location}</p>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide flex-shrink-0 bg-indigo-100 text-indigo-700">
                {s.plan}
              </span>
              <span className="text-[11px] text-gray-400 flex-shrink-0 min-w-[60px] text-right">{joinedAgo(s.createdAt)}</span>
              <Button
                onClick={() => navigate(`/super-admin/schools/${s.id}`)}
                className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
              >
                <Eye size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSchoolsCard;
