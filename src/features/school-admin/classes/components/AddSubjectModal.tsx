import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { fetchDepartments, getDepartmentById, type DepartmentStaff } from "@/services/department.api";
import type { Department } from "@/features/school-admin/settings/types/settings.types";
import type { AddSubjectPayload } from "../types/classes.types";

interface Props {
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  academicYearId: string;
  onClose: () => void;
  onSubmit: (data: AddSubjectPayload) => Promise<void>;
}

const subjectSchema = z.object({
  subject_name: z.string().min(1, "Subject name is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export const AddSubjectModal = ({
  classId,
  className,
  sectionId,
  sectionName,
  academicYearId,
  onClose,
  onSubmit,
}: Props) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<DepartmentStaff[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { subject_name: "", teacher_id: "" },
  });

  const subjectName = watch("subject_name");

  // Load all departments once on mount for name-matching
  useEffect(() => {
    let ignore = false;
    fetchDepartments()
      .then((data) => { if (!ignore) setDepartments(data); })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

  // When subject name changes, debounce → match department → fetch its staffs
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = subjectName.trim().toLowerCase();
    if (!trimmed) {
      setTeachers([]);
      setValue("teacher_id", "");
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const matched = departments.find(
        (d) => d.departmentName.toLowerCase() === trimmed
      );

      if (!matched) {
        setTeachers([]);
        setValue("teacher_id", "");
        return;
      }

      setTeachersLoading(true);
      setValue("teacher_id", "");
      try {
        const dept = await getDepartmentById(matched.id);
        setTeachers(dept?.staffs ?? []);
      } catch {
        setTeachers([]);
      } finally {
        setTeachersLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [subjectName, departments, setValue]);

  const handleFormSubmit = async (data: SubjectFormData) => {
    setSaving(true);
    try {
      await onSubmit({
        subject_name: data.subject_name,
        class_id: classId,
        sectionid: sectionId,
        teacher_id: data.teacher_id,
        academicYearId,
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create subject";
      setError("root", { message });
    } finally {
      setSaving(false);
    }
  };

  const trimmed = subjectName.trim().toLowerCase();
  const hasMatch = departments.some((d) => d.departmentName.toLowerCase() === trimmed);

  const teacherPlaceholder = !trimmed
    ? "Enter subject name first"
    : !hasMatch
    ? "No matching department"
    : teachers.length === 0
    ? "No teachers in this department"
    : "Select teacher";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Add Subject</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Class {className} · Section {sectionName}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1">
          <div className="px-4 sm:px-6 py-4 space-y-4 flex-1">

            <div className="space-y-1">
              <Label required>Subject Name</Label>
              <Input placeholder="e.g. Maths" {...register("subject_name")} />
              {errors.subject_name && (
                <p className="text-xs text-red-500">{errors.subject_name.message}</p>
              )}
              {trimmed && !hasMatch && departments.length > 0 && (
                <p className="text-xs text-amber-500">
                  No department named &quot;{subjectName.trim()}&quot;. Check spelling or create the department first.
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label required>Teacher</Label>
              {teachersLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                  <Loader2 size={14} className="animate-spin" />
                  Loading teachers...
                </div>
              ) : (
                <Select
                  value={watch("teacher_id")}
                  onValueChange={(value) => setValue("teacher_id", value)}
                  options={teachers.map((t) => ({
                    value: t.id,
                    label: `${t.name} (${t.email || t.phone || t.role})`,
                  }))}
                  placeholder={teacherPlaceholder}
                  disabled={teachers.length === 0}
                />
              )}
              {errors.teacher_id && (
                <p className="text-xs text-red-500">{errors.teacher_id.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                <span className="text-red-500 text-base">⚠</span>
                <p className="text-sm text-red-700">{errors.root.message}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
            <Button type="button" onClick={onClose} variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-indigo-600 text-white"
            >
              {saving ? "Adding..." : "Add Subject"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};