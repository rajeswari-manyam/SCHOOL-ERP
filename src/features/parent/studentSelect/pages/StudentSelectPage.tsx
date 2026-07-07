// src/features/parent/studentSelect/pages/StudentSelectPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { logout as logoutApi } from "@/services/auth.api";
import type { Student } from "@/features/auth/types/auth.types";

const StudentSelectPage = () => {
  const navigate = useNavigate();
  const parent           = useAuthStore((s) => s.parent);
  const students          = useAuthStore((s) => s.students);
  const selectedStudent   = useAuthStore((s) => s.selectedStudent);
  const setSelectedStudent = useAuthStore((s) => s.setSelectedStudent);
  const storeLogout      = useAuthStore((s) => s.logout);

  // A student is already selected (or there's nothing to choose from) — skip this screen.
  useEffect(() => {
    if (students.length <= 1 || selectedStudent) {
      navigate("/parent/dashboard", { replace: true });
    }
  }, [students.length, selectedStudent, navigate]);

  const handleLogout = () => {
    logoutApi().catch(() => {});
    storeLogout();
    navigate("/login");
  };

  const handleSelect = (student: Student) => {
    setSelectedStudent(student);
    toast.success(`Switched to ${student.name}`);
    navigate("/parent/dashboard", { replace: true });
  };

  if (students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <UserRound size={22} className="text-rose-500" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 mb-1.5">
            No student is linked to this parent.
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Please contact your school administrator to link a student to this account.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
          >
            <LogOut size={14} />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Vidya<span className="text-indigo-600">Tracker</span>
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Select a Student</h1>
          <p className="text-sm text-slate-500 mt-1">
            {parent?.parent_name ? `Welcome, ${parent.parent_name}. ` : ""}
            Choose which student you'd like to view.
          </p>
        </div>

        <div className="space-y-3">
          {students.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => handleSelect(student)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors text-left"
            >
              <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-indigo-700 text-sm font-bold">
                  {student.name
                    .split(" ")
                    .map((n) => n[0] ?? "")
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "ST"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{student.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {student.roll_number ? `Roll No: ${student.roll_number}` : ""}
                  {student.class_id ? `${student.roll_number ? " · " : ""}Class ID: ${student.class_id}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 w-full inline-flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentSelectPage;
