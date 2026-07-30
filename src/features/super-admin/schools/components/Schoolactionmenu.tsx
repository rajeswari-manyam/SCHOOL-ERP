import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { CheckCircle, Edit3, Eye, MoreVertical, PauseCircle, Trash2 } from "lucide-react";
import type { School } from "../types/school.types";
import { useSchoolMutations } from "../hooks/useSchools";

interface SchoolActionsMenuProps {
  school: School;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const MENU_WIDTH = 176; // w-44

const SchoolActionsMenu = ({ school, onView, onEdit }: SchoolActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { suspendSchool, reactivateSchool, deleteSchool } = useSchoolMutations();

  const updatePosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 4,
      left: Math.max(8, rect.right - MENU_WIDTH),
    });
  }, []);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleReposition = () => updatePosition();
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, updatePosition]);

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: () => { onView(school.id); setOpen(false); },
    },
    {
      label: "Edit School",
      icon: <Edit3 className="w-4 h-4" />,
      onClick: () => { onEdit(school.id); setOpen(false); },
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
          deleteSchool.mutate(school.id, {
            onSuccess: () => toast.success(`${school.name} has been deleted`),
            onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to delete school"),
          });
        }
        setOpen(false);
      },
    },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: position.top, left: position.left, width: MENU_WIDTH }}
          className="z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden"
        >
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
        </div>,
        document.body
      )}
    </>
  );
};

export default SchoolActionsMenu;
