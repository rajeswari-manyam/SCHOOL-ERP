import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { getAllStaff, type StaffRecord } from "@/services/class.api";
import type { AddSectionPayload } from "../types/classes.types";

interface Props {
  classId: string;
  className: string;
  onClose: () => void;
  onSubmit: (data: AddSectionPayload) => Promise<void>;
}

const sectionSchema = z.object({
  sectionName: z.string().min(1, "Section name is required"),
  classTeacherId: z.string().min(1, "Class teacher is required"),
  academicYearId: z.string().min(1, "Academic year is required"),
  totalStrength: z.coerce.number().min(0, "Strength cannot be negative"),
});

type SectionFormData = z.infer<typeof sectionSchema>;

export const AddSectionModal = ({ classId, className, onClose, onSubmit }: Props) => {
  const { years, loading: yearsLoading, activeYear } = useAcademicYears();
  const [teachers, setTeachers] = useState<StaffRecord[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema as never),
    defaultValues: {
      sectionName: "",
      classTeacherId: "",
      academicYearId: activeYear?.id || "",
      totalStrength: 0,
    },
  });

  useEffect(() => {
    if (activeYear?.id) {
      setValue("academicYearId", activeYear.id);
    }
  }, [activeYear, setValue]);

  useEffect(() => {
    let ignore = false;
    const loadTeachers = async () => {
      setTeachersLoading(true);
      try {
        const { data } = await getAllStaff({ role: "teacher" });
        if (!ignore) setTeachers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load teachers", err);
          setTeachers([]);
        }
      } finally {
        if (!ignore) setTeachersLoading(false);
      }
    };
    void loadTeachers();
    return () => { ignore = true; };
  }, []);

  const handleFormSubmit = async (data: SectionFormData) => {
    setSaving(true);
    try {
      await onSubmit({
        sectionName: data.sectionName,
        classTeacherId: data.classTeacherId,
        classId,
        academicYearId: data.academicYearId,
        totalStrength: data.totalStrength,
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create section";
      setError("root", { message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Add Section</h2>
            <p className="text-xs text-gray-400 mt-0.5">Class {className}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1">
          <div className="px-4 sm:px-6 py-4 space-y-4 flex-1">
            <div className="space-y-1">
              <Label required>Section Name</Label>
              <Input
                placeholder="e.g. C"
                {...register("sectionName")}
              />
              {errors.sectionName && (
                <p className="text-xs text-red-500">{errors.sectionName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label required>Class Teacher</Label>
              {teachersLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 size={14} className="animate-spin" />
                  Loading teachers...
                </div>
              ) : (
                <Select
                  value={watch("classTeacherId")}
                  onValueChange={(value) => setValue("classTeacherId", value)}
                  options={teachers.map((t) => ({
                    value: t.id,
                    label: `${t.name} (${t.email || t.phone || "Teacher"})`,
                  }))}
                  placeholder="Select teacher"
                />
              )}
              {errors.classTeacherId && (
                <p className="text-xs text-red-500">{errors.classTeacherId.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label required>Academic Year</Label>
              {yearsLoading ? (
                <div className="text-sm text-gray-400">Loading academic years...</div>
              ) : (
                <Select
                  value={watch("academicYearId")}
                  onValueChange={(value) => setValue("academicYearId", value)}
                  options={years.map((year) => ({ value: year.id, label: year.active ? `${year.yearName} (Active)` : year.yearName }))}
                  placeholder="Select academic year"
                />
              )}
              {errors.academicYearId && (
                <p className="text-xs text-red-500">{errors.academicYearId.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Total Strength</Label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                {...register("totalStrength")}
              />
              {errors.totalStrength && (
                <p className="text-xs text-red-500">{errors.totalStrength.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-[11px] text-red-600 font-mono whitespace-pre-wrap break-all leading-relaxed">{errors.root.message}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
            <Button type="button" onClick={onClose} variant="outline" className="w-full sm:w-auto">Cancel</Button>
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-indigo-600 text-white"
            >
              {saving ? "Adding..." : "Add Section"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
