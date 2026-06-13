import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllExams } from "@/services/exam.api";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import { getSubjectsBySectionId } from "@/services/subject.api";
import type { ExamSelector } from "../types/exam-marks.types";
import { EXAM_TYPE_LABELS } from "../types/exam-marks.types";

interface Props {
  selector: ExamSelector;
  onChange: (s: ExamSelector) => void;
  onLoad: () => void;
  studentsLoaded: boolean;
  apiLoading?: boolean;
  apiError?: boolean;
  errorMessage?: string | null;
}

const selectCls =
  "h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer w-full";

const ExamSelectorForm = ({ selector, onChange, onLoad, studentsLoaded, apiError, errorMessage }: Props) => {
  const set = (patch: Partial<ExamSelector>) => onChange({ ...selector, ...patch });

  const { data: examCatalog = [], isLoading: examCatalogLoading } = useQuery({
    queryKey: ["teacher", "exam-catalog"],
    queryFn: getAllExams,
    staleTime: 5 * 60_000,
  });

  const { data: classesRes, isLoading: classesLoading } = useQuery({
    queryKey: ["teacher", "exam-classes", selector.academicYearId ?? ""],
    queryFn: () => getAllClasses({ academicYearId: selector.academicYearId || undefined }),
    enabled: Boolean(selector.academicYearId),
    staleTime: 5 * 60_000,
  });

  const { data: sectionsRes, isLoading: sectionsLoading } = useQuery({
    queryKey: ["teacher", "exam-sections", selector.classId ?? ""],
    queryFn: () => getSectionsByClassId(selector.classId || ""),
    enabled: Boolean(selector.classId),
    staleTime: 5 * 60_000,
  });

  const { data: subjectsRes, isLoading: subjectsLoading } = useQuery({
    queryKey: ["teacher", "exam-subjects", selector.sectionId ?? ""],
    queryFn: () => getSubjectsBySectionId(selector.sectionId || ""),
    enabled: Boolean(selector.sectionId),
    staleTime: 5 * 60_000,
  });

  const examTypeOptions = useMemo(() => {
    const fromApi = (examCatalog ?? []).map((item) => ({
      value: item.exam_name,
      id: item.id,
      label: item.exam_name || "Exam",
    }));

    if (fromApi.length > 0) return fromApi;

    return (Object.keys(EXAM_TYPE_LABELS) as Array<keyof typeof EXAM_TYPE_LABELS>).map((key) => ({
      value: key,
      id: key,
      label: EXAM_TYPE_LABELS[key],
    }));
  }, [examCatalog]);

  const academicYearOptions = useMemo(() => {
    const options = new Map<string, string>();
    for (const item of examCatalog) {
      const yearName = item.academicYear?.yearName || "";
      const yearId = item.academicYearId || item.academicYear?.id || "";
      if (yearId && yearName) options.set(yearId, yearName);
    }
    return Array.from(options.entries()).map(([id, label]) => ({ id, label }));
  }, [examCatalog]);

  const classOptions = (classesRes?.data ?? []).map((item) => ({
    id: item.id,
    label: `Class ${item.class_name}`,
  }));

  const sectionOptions = (sectionsRes?.data ?? []).map((item) => ({
    id: item.id,
    label: item.sectionName || item.section_name || "Section",
  }));

  const subjectOptions = (subjectsRes?.data ?? []).map((item) => ({
    id: item.id,
    label: item.subject_name || "Subject",
  }));

  const allSelected =
    selector.examType && selector.classId && selector.sectionId && selector.subjectId && selector.academicYearId;

  const handleAcademicYearChange = (value: string) => {
    const selected = academicYearOptions.find((item) => item.id === value);
    set({
      academicYear: selected?.label ?? "",
      academicYearId: selected?.id ?? "",
      classId: "",
      className: "",
      sectionId: "",
      subjectId: "",
      subject: "",
    });
  };

  const handleClassChange = (value: string) => {
    const selected = classOptions.find((item) => item.id === value);
    set({
      classId: selected?.id ?? "",
      className: selected?.label ?? "",
      sectionId: "",
      subjectId: "",
      subject: "",
    });
  };

  const handleSectionChange = (value: string) => {
    const selected = sectionOptions.find((item) => item.id === value);
    set({ sectionId: selected?.id ?? "", subjectId: "", subject: "" });
  };

  const handleSubjectChange = (value: string) => {
    const selected = subjectOptions.find((item) => item.id === value);
    set({ subjectId: selected?.id ?? "", subject: selected?.label ?? "" });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        Exam Selector
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Exam Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Exam Type</label>
          <select
            value={selector.examType}
            onChange={(e) => {
              const selected = examTypeOptions.find((o) => o.value === e.target.value);
              set({ examType: e.target.value, examId: selected?.id ?? "" });
            }}
            className={selectCls}
            title="Exam type"
          >
            <option value="">Select...</option>
            {examTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Class */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Class</label>
          <select
            value={selector.classId ?? ""}
            onChange={(e) => handleClassChange(e.target.value)}
            className={selectCls}
            title="Class"
            disabled={classesLoading || !selector.academicYearId}
          >
            <option value="">{selector.academicYearId ? "Select class…" : "Select academic year first"}</option>
            {classOptions.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        {/* Section */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Section</label>
          <select
            value={selector.sectionId ?? ""}
            onChange={(e) => handleSectionChange(e.target.value)}
            className={selectCls}
            title="Section"
            disabled={sectionsLoading || !selector.classId}
          >
            <option value="">{selector.classId ? "Select section…" : "Select a class first"}</option>
            {sectionOptions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Subject</label>
          <select
            value={selector.subjectId ?? ""}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className={selectCls}
            title="Subject"
            disabled={subjectsLoading || !selector.sectionId}
          >
            <option value="">{selector.sectionId ? "Select subject…" : "Select a section first"}</option>
            {subjectOptions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        {/* Academic Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Academic Year</label>
          <select
            value={selector.academicYearId ?? ""}
            onChange={(e) => handleAcademicYearChange(e.target.value)}
            className={selectCls}
            title="Academic year"
            disabled={examCatalogLoading}
          >
            <option value="">{examCatalogLoading ? "Loading academic years…" : "Select academic year…"}</option>
            {academicYearOptions.map((y) => <option key={y.id} value={y.id}>{y.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500 mt-1">
        <div>
          <span className="font-semibold text-gray-400">Live exam catalog:</span> {examCatalog.length} exam definitions loaded from /tenant/getallexams
        </div>
        <div>
          <span className="font-semibold text-gray-400">Live classes:</span> {classOptions.length} available for the selected academic year
        </div>
        <div>
          <span className="font-semibold text-gray-400">Live sections:</span> {sectionOptions.length} available for the selected class
        </div>
        <div>
          <span className="font-semibold text-gray-400">Live subjects:</span> {subjectOptions.length} available for the selected section
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Button
          onClick={onLoad}
          disabled={!allSelected}
          variant={allSelected ? "default" : "outline"}
          size="md"
          className={`flex items-center gap-2 ${!allSelected ? "text-gray-400" : ""}`}
        >
          <Users size={14} className="text-current" />
          {studentsLoaded ? "Reload Students" : "Load Students"}
        </Button>

        {apiError && errorMessage && (
          <span className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold">
            <AlertCircle size={12} />
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
};

export default ExamSelectorForm;
