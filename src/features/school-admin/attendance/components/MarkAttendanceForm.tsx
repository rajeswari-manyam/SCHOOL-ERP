
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CLASS_OPTIONS, SECTION_OPTIONS } from "../utils/constants";
import type { MarkAttendanceFormValues } from "../types/attendance.types";
import { MOCK_CLASS_DETAILS } from "../utils/constants";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const markAttendanceSchema = z.object({
  classId: z.string().min(1, "Please select a class"),
  section: z.string().min(1, "Please select a section"),
  presentStudentIds: z.array(z.number()).min(1, "At least one student must be marked as present"),
});

type MarkAttendanceFormData = z.infer<typeof markAttendanceSchema>;

interface Props {
  onSubmit: (values: MarkAttendanceFormValues) => void;
  isSubmitting?: boolean;
}

export function MarkAttendanceForm({ onSubmit, isSubmitting }: Props) {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MarkAttendanceFormData>({
    resolver: zodResolver(markAttendanceSchema),
    defaultValues: {
      classId: CLASS_OPTIONS[4], // Class 8A
      section: SECTION_OPTIONS[0],
      presentStudentIds: [],
    },
  });

  // Use first mock class detail students as a proxy
  const [students, setStudents] = useState(
    MOCK_CLASS_DETAILS[0].students.map((s) => ({ id: s.id, name: s.name, present: true }))
  );
  // Initialize presentStudentIds with all students marked as present
  useEffect(() => {
    const initialPresentIds = students.filter((s) => s.present).map((s) => s.id);
    setValue("presentStudentIds", initialPresentIds);
  }, [setValue, students]);
  const presentCount = students.filter((s) => s.present).length;
  const absentCount  = students.filter((s) => !s.present).length;

  const toggle = (id: number) => {
    setStudents((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s));
      const presentIds = updated.filter((s) => s.present).map((s) => s.id);
      setValue("presentStudentIds", presentIds);
      return updated;
    });
  };

  const handleFormSubmit = (data: MarkAttendanceFormData) => {
    onSubmit({
      classId: data.classId,
      presentStudentIds: data.presentStudentIds,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Form Controls */}
      <div className="px-6 pt-5 pb-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Class */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              Class <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Select
                options={CLASS_OPTIONS.map(c => ({ label: c, value: c }))}
                placeholder="Select Class"
                {...register("classId")}
              />
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.classId && (
              <p className="mt-1 text-xs text-red-600">{errors.classId.message}</p>
            )}
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              Section <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Select
                options={SECTION_OPTIONS.map(s => ({ label: s, value: s }))}
                placeholder="Select Section"
                {...register("section")}
              />
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.section && (
              <p className="mt-1 text-xs text-red-600">{errors.section.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              Date
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700">
              {today}
            </div>
          </div>
        </div>
        {errors.presentStudentIds && (
          <p className="mt-3 text-xs text-red-600">{errors.presentStudentIds.message}</p>
        )}
      </div>

      {/* Student List Header */}
      <div className="px-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Student Attendance
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              All marked Present by default — uncheck to mark Absent
            </p>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            <span className="text-emerald-600">{presentCount} present</span>,{" "}
            <span className="text-red-500">{absentCount} absent</span>
          </p>
        </div>
      </div>

      {/* Student List */}
      <div className="px-6 max-h-64 overflow-y-auto space-y-1 pb-2">
        {students.map((student) => (
          <label
            key={student.id}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors select-none ${
              student.present ? "hover:bg-slate-50" : "bg-red-50 hover:bg-red-100/70"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                  student.present ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300"
                }`}
                onClick={() => toggle(student.id)}
              >
                {student.present && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono w-5 text-right">
                {String(student.id).padStart(2, "0")}
              </span>
              <span className={`text-sm font-medium ${student.present ? "text-slate-700" : "text-slate-500"}`}>
                {student.name}
              </span>
            </div>
            <span
              className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full ${
                student.present ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
              }`}
            >
              {student.present ? "PRESENT" : "ABSENT"}
            </span>
          </label>
        ))}
      </div>

      {/* WhatsApp Alert Banner */}
      <div className="mx-6 my-3 flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-xs text-amber-700 font-medium">
          Parent WhatsApp alerts will be sent automatically for all absent students.
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting…
            </>
          ) : (
            "Submit Attendance"
          )}
        </Button>
      </div>
    </form>
  );
}
