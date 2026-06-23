import { useEffect, useState } from "react";
import { X, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getAllStaff, type StaffRecord } from "@/services/staff.api";
import { getSectionById } from "@/services/section.api";
import { fetchSubjectsBySectionId } from "@/services/school-classes.api";
import type { UpdateSectionPayload } from "@/services/school-classes.api";
import type { SubjectItem } from "../types/classes.types";

interface Props {
  sectionId: string;
  sectionName: string;
  onClose: () => void;
  onSubmit: (id: string, payload: UpdateSectionPayload) => Promise<void>;
}

export const EditSectionModal = ({ sectionId, sectionName, onClose, onSubmit }: Props) => {
  const [name, setName] = useState(sectionName);
  const [teacherId, setTeacherId] = useState("");
  const [totalStrength, setTotalStrength] = useState<number>(0);
  const [teachers, setTeachers] = useState<StaffRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const [sectionRes, staffRes, subjectsData] = await Promise.all([
          getSectionById(sectionId),
          getAllStaff({ role: "teacher" }).catch(() => ({ data: [] })),
          fetchSubjectsBySectionId(sectionId).catch(() => [] as SubjectItem[]),
        ]);
        if (ignore) return;

        const record: Record<string, unknown> = sectionRes
          ? (((sectionRes as { data?: unknown }).data ?? sectionRes) as Record<string, unknown>)
          : {};

        if (record) {
          setName(String(record.sectionName ?? record.section_name ?? sectionName));
          setTeacherId(String(record.classTeacherId ?? record.class_teacher_id ?? ""));
          setTotalStrength(Number(record.totalStrength ?? record.total_strength ?? 0));
        }

        const allTeachers = Array.isArray((staffRes as { data?: unknown }).data)
          ? ((staffRes as { data: StaffRecord[] }).data)
          : [];
        setTeachers(allTeachers);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Failed to load section data");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    void load();
    return () => { ignore = true; };
  }, [sectionId, sectionName]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Section name is required"); return; }
    setError(null);
    setSaving(true);
    try {
      const payload: UpdateSectionPayload = { sectionName: name.trim() };
      if (teacherId) payload.classTeacherId = teacherId;
      payload.totalStrength = totalStrength;
      await onSubmit(sectionId, payload);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update section");
    } finally {
      setSaving(false);
    }
  };

  const teacherOptions = teachers.map((t) => ({
    value: t.id,
    label: `${t.name} (${t.email || t.phone || "Teacher"})`,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Edit Section</h2>
            <p className="text-xs text-gray-400 mt-0.5">Section {sectionName}</p>
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

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4 space-y-4 flex-1 overflow-y-auto max-h-[60vh]">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">{error}</div>
            )}

            <div className="space-y-1">
              <Label required>Section Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. A"
              />
            </div>

            <div className="space-y-1">
              <Label>Class Teacher</Label>
              {teachers.length === 0 ? (
                <p className="text-xs text-gray-400">No teachers available</p>
              ) : (
                <Select
                  value={teacherId}
                  onValueChange={setTeacherId}
                  options={teacherOptions}
                  placeholder="Select teacher"
                />
              )}
            </div>

            <div className="space-y-1">
              <Label>Total Strength</Label>
              <Input
                type="number"
                min="0"
                value={totalStrength}
                onChange={(e) => setTotalStrength(Number(e.target.value))}
                placeholder="0"
              />
            </div>

            {subjects.length > 0 && (
              <div className="space-y-2">
                <Label>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Subjects
                  </span>
                </Label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {subjects.map((sub) => (
                    <span
                      key={sub.id}
                      className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-medium shadow-sm"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
          <Button type="button" onClick={onClose} variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving || loading}
            className="w-full sm:w-auto bg-indigo-600 text-white"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};