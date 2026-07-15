import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllExams } from "@/services/exam.api";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import { getSubjectsBySectionId } from "@/services/subject.api";

export interface SubmittedFilter {
  class_id: string;
  section_id: string;
  subject_id: string;
  exam_id: string;
  // human-readable labels (for display only)
  className?: string;
  sectionName?: string;
  subjectName?: string;
  examName?: string;
  // academic year of the selected exam — fallback source for publishing when
  // a row's own record doesn't carry its academicYearId
  academicYearId?: string;
}

interface Props {
  filter: SubmittedFilter;
  onChange: (f: SubmittedFilter) => void;
  onSearch: () => void;
  loading?: boolean;
}

const selectCls =
  "h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed";

const SubmittedMarksFilter = ({ filter, onChange, onSearch, loading }: Props) => {
  const set = (patch: Partial<SubmittedFilter>) => onChange({ ...filter, ...patch });

  // ── Exam catalog (for academic year + exam options) ───────────────────
  const { data: examCatalog = [], isLoading: examCatalogLoading } = useQuery({
    queryKey: ["teacher", "exam-catalog"],
    queryFn: getAllExams,
    staleTime: 5 * 60_000,
  });

  // ── Academic Year options derived from catalog ─────────────────────────
  const academicYearOptions = useMemo(() => {
    const options = new Map<string, string>();
    for (const item of examCatalog) {
      const yearName = item.academicYear?.yearName || "";
      const yearId = item.academicYearId || item.academicYear?.id || "";
      if (yearId && yearName) options.set(yearId, yearName);
    }
    return Array.from(options.entries()).map(([id, label]) => ({ id, label }));
  }, [examCatalog]);

  // ── Classes (cascade on selected academic year) ────────────────────────
  const { data: classesRes, isLoading: classesLoading } = useQuery({
    queryKey: ["teacher", "submitted-filter-classes", filter.academicYearId],
    queryFn: () => getAllClasses({ academicYearId: filter.academicYearId || undefined }),
    staleTime: 5 * 60_000,
  });

  // ── Sections (cascade on class) ───────────────────────────────────────
  const { data: sectionsRes, isLoading: sectionsLoading } = useQuery({
    queryKey: ["teacher", "submitted-filter-sections", filter.class_id],
    queryFn: () => getSectionsByClassId(filter.class_id),
    enabled: Boolean(filter.class_id),
    staleTime: 5 * 60_000,
  });

  // ── Subjects (cascade on section) ────────────────────────────────────
  const { data: subjectsRes, isLoading: subjectsLoading } = useQuery({
    queryKey: ["teacher", "submitted-filter-subjects", filter.section_id],
    queryFn: () => getSubjectsBySectionId(filter.section_id),
    enabled: Boolean(filter.section_id),
    staleTime: 5 * 60_000,
  });

  // ── Exam options (cascade on selected academic year) ───────────────────
  const examOptions = useMemo(() => {
    return (examCatalog ?? [])
      .filter((item) => {
        if (!filter.academicYearId) return true;
        const yearId = item.academicYearId || item.academicYear?.id || "";
        return yearId === filter.academicYearId;
      })
      .map((item) => ({
        id: item.id,
        label: item.exam_name || "Exam",
        academicYearId: item.academicYearId || item.academicYear?.id || "",
      }));
  }, [examCatalog, filter.academicYearId]);

  const classOptions = (classesRes?.data ?? []).map((item) => ({
    id: item.id,
    label: `Class ${item.class_name}`,
  }));

  const sectionOptions = (sectionsRes?.data ?? []).map((item) => ({
    id: item.id,
    label: item.sectionName || "Section",
  }));

  const subjectOptions = (subjectsRes?.data ?? []).map((item) => ({
    id: item.id,
    label: item.subject_name || "Subject",
  }));

  const canSearch = Boolean(filter.class_id && filter.section_id && filter.subject_id);

  const handleReset = () => {
    onChange({ class_id: "", section_id: "", subject_id: "", exam_id: "", academicYearId: "" });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-indigo-500" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Filter Submitted Marks
          </p>
        </div>
        {(filter.class_id || filter.section_id || filter.subject_id || filter.exam_id || filter.academicYearId) && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      {/* Dropdowns grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">

        {/* Academic Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Academic Year</label>
          <select
            value={filter.academicYearId ?? ""}
            onChange={(e) => {
              const selected = academicYearOptions.find((o) => o.id === e.target.value);
              set({
                academicYearId: selected?.id ?? "",
                // cascade reset — classes/sections/subjects/exam depend on the year
                class_id: "", className: "",
                section_id: "", sectionName: "",
                subject_id: "", subjectName: "",
                exam_id: "", examName: "",
              });
            }}
            className={selectCls}
            disabled={examCatalogLoading}
            title="Academic Year"
          >
            <option value="">All Years</option>
            {academicYearOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Class */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Class</label>
          <select
            value={filter.class_id}
            onChange={(e) => {
              const selected = classOptions.find((o) => o.id === e.target.value);
              set({
                class_id: e.target.value,
                className: selected?.label ?? "",
                // cascade reset
                section_id: "",
                sectionName: "",
                subject_id: "",
                subjectName: "",
              });
            }}
            className={selectCls}
            disabled={classesLoading || examCatalogLoading}
            title="Class"
          >
            <option value="">All Classes</option>
            {classOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Section</label>
          <select
            value={filter.section_id}
            onChange={(e) => {
              const selected = sectionOptions.find((o) => o.id === e.target.value);
              set({
                section_id: e.target.value,
                sectionName: selected?.label ?? "",
                // cascade reset
                subject_id: "",
                subjectName: "",
              });
            }}
            className={selectCls}
            disabled={!filter.class_id || sectionsLoading}
            title="Section"
          >
            <option value="">
              {!filter.class_id ? "Select class first" : sectionsLoading ? "Loading…" : "All Sections"}
            </option>
            {sectionOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">Subject</label>
          <select
            value={filter.subject_id}
            onChange={(e) => {
              const selected = subjectOptions.find((o) => o.id === e.target.value);
              set({
                subject_id: e.target.value,
                subjectName: selected?.label ?? "",
              });
            }}
            className={selectCls}
            disabled={!filter.section_id || subjectsLoading}
            title="Subject"
          >
            <option value="">
              {!filter.section_id ? "Select section first" : subjectsLoading ? "Loading…" : "All Subjects"}
            </option>
            {subjectOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Exam (optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500">
            Exam{" "}
            <span className="text-gray-300 font-normal">(optional)</span>
          </label>
          <select
            value={filter.exam_id}
            onChange={(e) => {
              const selected = examOptions.find((o) => o.id === e.target.value);
              set({
                exam_id: e.target.value,
                examName: selected?.label ?? "",
                academicYearId: selected?.academicYearId ?? "",
              });
            }}
            className={selectCls}
            disabled={examCatalogLoading}
            title="Exam"
          >
            <option value="">All Exams</option>
            {examOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search button */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-400">
          {canSearch
            ? "Click Search to load results"
            : "Select Class, Section and Subject to search"}
        </p>
        <Button
          type="button"
          onClick={onSearch}
          variant="default"
          size="sm"
          disabled={!canSearch || loading}
          className="px-5 rounded-xl text-xs font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Searching…
            </span>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SubmittedMarksFilter;
