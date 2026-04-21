import { useState } from "react";
import { X } from "lucide-react";
import type { Student } from "../types/my-students.types";
import OverviewTab from "./OverviewTab";
import AttendanceTab from "./AttendanceTab";
import HomeworkTab from "./HomeworkTab";
import { Button } from "@/components/ui/button";
// ── Avatar colours (match table) ─────────────────────────────────────────
const AVATAR_COLORS = [
  "#6c63ff","#f59e0b","#10b981","#3b82f6","#ef4444",
  "#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1",
];

// ── Overview Tab ──────────────────────────────────────────────────────────


// ── Main Drawer ───────────────────────────────────────────────────────────
type DrawerTab = "overview" | "attendance" | "homework";

interface Props {
  student: Student | null;
  open: boolean;
  onClose: () => void;
  studentIndex?: number;
}

const StudentQuickViewDrawer = ({ student, open, onClose, studentIndex = 0 }: Props) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");

  if (!student) return null;

  const avatarColor = AVATAR_COLORS[studentIndex % AVATAR_COLORS.length];
  const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const tabs: { id: DrawerTab; label: string }[] = [
    { id: "overview",   label: "Overview"   },
    { id: "attendance", label: "Attendance" },
    { id: "homework",   label: "Homework"   },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ width: 380 }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                style={{ background: avatarColor }}
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-gray-900">{student.name}</h3>
                  {student.isActive ? (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">Active</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Roll #{student.rollNo} · {student.className}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X size={16} className="text-current" strokeWidth={2.5} />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 bg-gray-100 rounded-xl p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === t.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === "overview"   && <OverviewTab   student={student} />}
          {activeTab === "attendance" && <AttendanceTab student={student} />}
          {activeTab === "homework"   && <HomeworkTab   student={student} />}
        </div>
      </div>
    </>
  );
};

export default StudentQuickViewDrawer;
