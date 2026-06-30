import { CheckCircle, PencilLine, Paperclip, Calendar, Users } from "lucide-react";

interface QuickActionsCardProps {
  onMarkAttendance: () => void;
  onAssignHomework: () => void;
  onUploadMaterial: () => void;
  onApplyLeave: () => void;
  onViewStudents: () => void;
}

const actions = [
  { label: "Mark Attendance", icon: CheckCircle, variant: "primary" as const },
  { label: "Assign Homework",  icon: PencilLine,  variant: "primary" as const },
  { label: "Upload Material",  icon: Paperclip,   variant: "secondary" as const },
  { label: "Apply Leave",      icon: Calendar,    variant: "secondary" as const },
  { label: "View Students",    icon: Users,       variant: "ghost" as const },
];

const variantCls = {
  primary:   "bg-indigo-600 hover:bg-indigo-700 text-white",
  secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200",
  ghost:     "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
};

const QuickActionsCard = ({ onMarkAttendance, onAssignHomework, onUploadMaterial, onApplyLeave, onViewStudents }: QuickActionsCardProps) => {
  const handlers = [onMarkAttendance, onAssignHomework, onUploadMaterial, onApplyLeave, onViewStudents];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
      <h3 className="text-xs font-bold text-gray-900 mb-3">Quick Actions</h3>
      <div className="flex flex-col gap-1.5">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={handlers[i]}
              className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${variantCls[a.variant]}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {a.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsCard;
