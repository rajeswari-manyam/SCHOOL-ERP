import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      icon: "👁",
      onClick: () => navigate(`/super-admin/schools/${school.id}`),
    },
    {
      label: "Edit School",
      icon: "✏️",
      onClick: () => navigate(`/super-admin/schools/${school.id}/edit`),
    },
    {
      label: school.status === "SUSPENDED" ? "Reactivate" : "Suspend",
      icon: school.status === "SUSPENDED" ? "✅" : "⏸",
      className: "text-amber-600",
      onClick: () => {
        school.status === "SUSPENDED"
          ? reactivateSchool.mutate(school.id)
          : suspendSchool.mutate(school.id);
        setOpen(false);
      },
    },
    {
      label: "Delete",
      icon: "🗑",
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        </svg>
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