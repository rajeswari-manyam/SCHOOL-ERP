import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Edit3, Eye, MoreVertical, PauseCircle, Trash2 } from "lucide-react";
import type { School } from "../types/school.types";
import { useSchoolMutations } from "../hooks/useSchools";

interface SchoolActionsMenuProps {
  school: School;
}

const SchoolActionsMenu = ({ school }: SchoolActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { suspendSchool, reactivateSchool, deleteSchool } = useSchoolMutations();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: () => navigate(`/super-admin/schools/${school.id}`),
    },
    {
      label: "Edit School",
      icon: <Edit3 className="w-4 h-4" />,
      onClick: () => navigate(`/super-admin/schools/${school.id}/edit`),
    },
    {
      label: school.status === "SUSPENDED" ? "Reactivate" : "Suspend",
      icon: school.status === "SUSPENDED" ? <CheckCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />,
      className: "text-amber-600",
      onClick: () => {
        if (school.status === "SUSPENDED") {
          reactivateSchool.mutate(school.id);
        } else {
          suspendSchool.mutate(school.id);
        }
        setOpen(false);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      className: "text-red-600",
      onClick: () => {
        if (confirm(`Delete ${school.name}? This cannot be undone.`)) {
          deleteSchool.mutate(school.id);
        }
        setOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${a.className ?? "text-gray-700"}`}
            >
              <span className="text-base">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolActionsMenu;