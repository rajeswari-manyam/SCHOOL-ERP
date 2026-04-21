interface QuickActionsCardProps {
  onMarkAttendance: () => void;
  onAssignHomework: () => void;
  onUploadMaterial: () => void;
  onApplyLeave: () => void;
  onViewStudents: () => void;
}

import {
  CheckCircle,
  PencilLine,
  Paperclip,
  Calendar,
  Users,
} from "lucide-react";

const actions = [
  { label: "Mark Attendance", color: "bg-[#25d366] hover:bg-[#22c55e] text-white", icon: CheckCircle },
  { label: "Assign Homework",  color: "bg-indigo-600 hover:bg-indigo-700 text-white", icon: PencilLine },
  { label: "Upload Material",  color: "bg-blue-500 hover:bg-blue-600 text-white",    icon: Paperclip },
  { label: "Apply Leave",      color: "bg-amber-500 hover:bg-amber-600 text-white",  icon: Calendar },
  { label: "View Students",    color: "bg-gray-100 hover:bg-gray-200 text-gray-800", icon: Users },
];

const QuickActionsCard = ({
  onMarkAttendance, onAssignHomework, onUploadMaterial, onApplyLeave, onViewStudents,
}: QuickActionsCardProps) => {
  const handlers = [onMarkAttendance, onAssignHomework, onUploadMaterial, onApplyLeave, onViewStudents];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-extrabold text-gray-900 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={handlers[i]}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${a.color}`}
            >
              <Icon className="w-5 h-5" />
              {a.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsCard;
