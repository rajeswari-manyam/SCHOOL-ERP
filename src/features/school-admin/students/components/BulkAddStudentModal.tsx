import { useState, useRef, useEffect, useMemo } from "react";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2, Loader2, CheckCircle, ChevronDown, ChevronUp, Wand2, ArrowRight, Camera } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useClassesList } from "../hooks/useClassesList";
import { studentsApi } from "@/services/student.api";
import { getAllSections } from "@/services/section.api";
import type { CreateStudentPayload, Gender, Student } from "../types/student.types";
import type { Section } from "@/services/section.api";
import { parentsApi, getParentById } from "@/services/parent.api";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const BLOOD_GROUP_OPTIONS = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",
].map((b) => ({ value: b, label: b }));

const RELATION_OPTIONS = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Guardian", label: "Guardian" },
];

interface StudentPersonalRow {
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender | "";
  bloodGroup: string;
  rollNumber: string;
  admissionNo: string;
  address: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
}

interface StudentParentRow {
  fatherName: string;
  fatherRelation: string;
  fatherOccupation: string;
  fatherPhone: string;
  fatherImage: File | null;
  fatherImagePreview: string | null;
  motherName: string;
  motherRelation: string;
  motherOccupation: string;
  motherPhone: string;
  motherImage: File | null;
  motherImagePreview: string | null;
  fatherEmail: string;
  motherEmail: string;
  selectedParentId: string;
}

const inputCls = "w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
const selectCls = "h-10 rounded-xl bg-slate-50 border-slate-200";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const isRequired = label.endsWith(" *");
  const displayLabel = isRequired ? label.slice(0, -2) : label;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {displayLabel}
        {isRequired && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
};

const emptyPersonalRow = (): StudentPersonalRow => ({
  firstName: "", lastName: "", dob: "", gender: "", bloodGroup: "",
  rollNumber: "", admissionNo: "", address: "",
  classId: "", className: "", sectionId: "", sectionName: "",
});

const emptyParentRow = (): StudentParentRow => ({
  fatherName: "", fatherRelation: "Father", fatherOccupation: "", fatherPhone: "",
  fatherImage: null, fatherImagePreview: null,
  motherName: "", motherRelation: "Mother", motherOccupation: "", motherPhone: "",
  motherImage: null, motherImagePreview: null,
  fatherEmail: "", motherEmail: "",
  selectedParentId: "",
});

const StepIndicator = ({ step }: { step: 1 | 2 | 3 }) => (
  <div className="flex items-center gap-0 mb-6">
    {([1, 2, 3] as const).map((n, idx) => (
      <div key={n} className="flex items-center gap-0 flex-1 last:flex-none">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            step > n ? "bg-indigo-600 text-white" : step === n ? "bg-indigo-600 text-white" : "border-2 border-gray-300 text-gray-400"
          }`}>
            {step > n ? "✓" : n === 3 ? "✓" : n}
          </div>
          <span className={`text-xs font-semibold whitespace-nowrap ${step >= n ? "text-indigo-700" : "text-gray-400"}`}>
            {n === 1 ? "Students" : n === 2 ? "Parents" : "Done"}
          </span>
        </div>
        {idx < 2 && <div className={`flex-1 mx-3 h-0.5 ${step > n ? "bg-indigo-600" : "bg-gray-200"}`} />}
      </div>
    ))}
  </div>
);

interface Props { onClose: () => void; }

const BulkAddStudentModal = ({ onClose }: Props) => {
  const academicYearId = useUIStore((s) => s.academicYearId);
  const academicYearName = useUIStore((s) => s.academicYearName);
  const admissionYear = academicYearName ? academicYearName.split("-")[0] : String(new Date().getFullYear());
  const { user } = useAuthStore();
  const schoolcode = user?.schoolcode ?? "";

  const { classes, loading: clsLoading } = useClassesList(academicYearId);
  const [allSections, setAllSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [existingStudents, setExistingStudents] = useState<Student[]>([]);

  // Siblings already enrolled share one parent — surface them so a second
  // (or third) child can reuse the parent's details instead of retyping them.
  const existingParents = useMemo(() => {
    const seen = new Set<string>();
    const result: { parentId: string; label: string; student: Student }[] = [];
    for (const s of existingStudents) {
      if (!s.parentId || seen.has(s.parentId)) continue;
      seen.add(s.parentId);
      const name = s.fatherName || s.motherName || "Parent";
      const phone = s.fatherPhone || s.motherPhone || "";
      result.push({
        parentId: s.parentId,
        label: `${name}${phone ? ` — +91 ${phone}` : ""} (sibling of ${s.firstName} ${s.lastName})`,
        student: s,
      });
    }
    return result;
  }, [existingStudents]);

  const selectExistingParentForRow = (index: number, parentId: string) => {
    const match = existingParents.find((p) => p.parentId === parentId)?.student;
    setParentRows((prev) => prev.map((r, i) => {
      if (i !== index) return r;
      if (!match) return { ...r, selectedParentId: parentId };
      return {
        ...r,
        selectedParentId: parentId,
        fatherName: match.fatherName ?? "", fatherPhone: match.fatherPhone ?? "",
        fatherOccupation: match.fatherOccupation ?? "", fatherEmail: match.fatherEmail ?? "",
        motherName: match.motherName ?? "", motherPhone: match.motherPhone ?? "",
        motherOccupation: match.motherOccupation ?? "", motherEmail: match.motherEmail ?? "",
      };
    }));
  };

  useEffect(() => {
    studentsApi.getAll(academicYearId).then(setExistingStudents).catch(() => {});
  }, [academicYearId]);

  useEffect(() => {
    getAllSections().then(setAllSections).catch(() => {});
  }, []);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const admissionNoCounterRef = useRef(0);

  const nextAdmNo = () => {
    admissionNoCounterRef.current += 1;
    return `ADM-${admissionYear}-${String(admissionNoCounterRef.current).padStart(3, "0")}`;
  };

  const [personalRows, setPersonalRows] = useState<StudentPersonalRow[]>([{ ...emptyPersonalRow(), admissionNo: `ADM-${admissionYear}-001` }]);
  const [parentRows, setParentRows] = useState<StudentParentRow[]>([]);
  const [createdStudents, setCreatedStudents] = useState<Student[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([0]));

  // Sync counter with initial row
  useEffect(() => { admissionNoCounterRef.current = 1; }, []);

  const updatePersonalRow = (index: number, field: keyof StudentPersonalRow, value: string) =>
    setPersonalRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));

  const handleRowClassChange = (index: number, classId: string, className: string) =>
    setPersonalRows((prev) => prev.map((r, i) =>
      i === index ? { ...r, classId, className, sectionId: "", sectionName: "" } : r
    ));

  const handleRowSectionChange = (index: number, sectionId: string, sectionName: string) =>
    setPersonalRows((prev) => prev.map((r, i) => (i === index ? { ...r, sectionId, sectionName } : r)));

  const updateParentRow = (index: number, field: keyof StudentParentRow, value: string) =>
    setParentRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));

  const updateParentImage = (index: number, which: "father" | "mother", file: File | null) => {
    const imageField = which === "father" ? "fatherImage" : "motherImage";
    const previewField = which === "father" ? "fatherImagePreview" : "motherImagePreview";
    setParentRows((prev) => prev.map((r, i) => (i === index ? { ...r, [imageField]: file } : r)));
    if (!file) {
      setParentRows((prev) => prev.map((r, i) => (i === index ? { ...r, [previewField]: null } : r)));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result as string;
      setParentRows((prev) => prev.map((r, i) => (i === index ? { ...r, [previewField]: preview } : r)));
    };
    reader.readAsDataURL(file);
  };

  const addRow = () => {
    const newIdx = personalRows.length;
    setPersonalRows((prev) => [...prev, { ...emptyPersonalRow(), admissionNo: nextAdmNo() }]);
    if (parentRows.length > 0) setParentRows((prev) => [...prev, emptyParentRow()]);
    setExpandedRows((prev) => new Set([...prev, newIdx]));
  };

  const removeRow = (index: number) => {
    if (personalRows.length <= 1) return;
    setPersonalRows((prev) => prev.filter((_, i) => i !== index));
    if (parentRows.length > 0) setParentRows((prev) => prev.filter((_, i) => i !== index));
    setExpandedRows((prev) => {
      const next = new Set<number>();
      prev.forEach((n) => { if (n < index) next.add(n); else if (n > index) next.add(n - 1); });
      return next;
    });
  };

  const toggleRow = (i: number) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });

  const generateAdmissionNo = (index: number) => {
    updatePersonalRow(index, "admissionNo", nextAdmNo());
  };

  const generateAllAdmissionNos = () =>
    setPersonalRows((prev) =>
      prev.map((r) => (!r.admissionNo ? { ...r, admissionNo: nextAdmNo() } : r))
    );

  const getSectionsForClass = (classId: string) =>
    allSections.filter((s) => s.classId === classId);

  const handleNext = () => {
    const valid = personalRows.filter((r) => r.firstName.trim());
    if (valid.length === 0) { setError("At least one student with a first name is required."); return; }
    if (personalRows.some((r) => !r.classId)) { setError("Please select a class for each student."); return; }
    if (personalRows.some((r) => !r.sectionId)) { setError("Please select a section for each student."); return; }
    setError(null);
    setParentRows(personalRows.map(() => emptyParentRow()));
    setStep(2);
  };

  const handleBack = () => { setError(null); setRowErrors({}); setStep(1); };

  // Never throws — a failure here shouldn't block the rest of the bulk-add
  // flow. Returns a label per failure (empty array on success).
  //
  // NOTE: /tenant/updateparentById REPLACES the parent's whole students list
  // (unlinks everyone, then relinks only what's sent) rather than appending —
  // confirmed against the backend controller. So the sibling-link path below
  // fetches the parent's current students and sends the full merged list.
  const createParentsForStudent = async (studentId: string, parent: StudentParentRow, address: string): Promise<string[]> => {
    if (parent.selectedParentId) {
      try {
        const existingParent = await getParentById(parent.selectedParentId);
        const existingIds = (existingParent.students ?? []).map((s: any) =>
          typeof s === "string" ? s : s.id
        );
        const mergedIds = Array.from(new Set([...existingIds, studentId]));
        await studentsApi.updateParent(parent.selectedParentId, { students: mergedIds });
        return [];
      } catch (err: any) {
        return [`Parent: ${err?.message ?? "Failed to link sibling"}`];
      }
    }
    if (!parent.fatherName.trim() && !parent.motherName.trim()) return [];
    try {
      await parentsApi.createParent({
        ...(parent.fatherName.trim() ? {
          father_name: parent.fatherName.trim(),
          father_occupation: parent.fatherOccupation || "Not specified",
          father_email: parent.fatherEmail,
          father_phone: parent.fatherPhone.trim(),
          ...(parent.fatherImage ? { father_image: parent.fatherImage } : {}),
        } : {}),
        ...(parent.motherName.trim() ? {
          mother_name: parent.motherName.trim(),
          mother_occupation: parent.motherOccupation || "Not specified",
          mother_email: parent.motherEmail,
          mother_phone: parent.motherPhone.trim(),
          ...(parent.motherImage ? { mother_image: parent.motherImage } : {}),
        } : {}),
        students: [studentId],
        address,
      });
      return [];
    } catch (err: any) {
      return [`Parent: ${err?.message ?? "Failed to save"}`];
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setRowErrors({});
    try {
      const validIndices = personalRows
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => r.firstName.trim());
      if (validIndices.length === 0) throw new Error("No students to add.");

      const newRowErrors: Record<number, string> = {};
      const created: Student[] = [];

      // Create one-by-one so we get per-row errors
      for (const { r, i } of validIndices) {
        const payload: CreateStudentPayload = {
          first_name: r.firstName.trim(), last_name: r.lastName.trim(),
          gender: (r.gender || "Male").toLowerCase() as Lowercase<Gender>,
          date_of_birth: r.dob || "", blood_group: (r.bloodGroup || undefined) as never,
          address: r.address || undefined, class_id: r.classId, sectionId: r.sectionId,
          roll_number: r.rollNumber || undefined, admission_number: r.admissionNo || undefined,
          admission_date: new Date().toISOString().split("T")[0],
          school_code: schoolcode, ...(academicYearId ? { academicYearId } : {}),
        };
        try {
          const student = await studentsApi.createStudent(payload);
          created.push(student);
        } catch (err: any) {
          newRowErrors[i] = err?.message || "Failed to create student";
        }
      }

      setCreatedStudents(created);
      const parentFailures: string[] = [];
      if (created.length > 0) {
        const parentJobs: Promise<string[]>[] = [];
        for (let i = 0; i < created.length && i < parentRows.length; i++) {
          const parent = parentRows[i];
          if (parent.selectedParentId || parent.fatherName.trim() || parent.motherName.trim()) {
            parentJobs.push(createParentsForStudent(created[i].id, parent, personalRows[i]?.address ?? ""));
          }
        }
        if (parentJobs.length > 0) {
          const perStudentFailures = await Promise.all(parentJobs);
          parentFailures.push(...perStudentFailures.flat());
        }
      }

      const studentErrorCount = Object.keys(newRowErrors).length;
      if (studentErrorCount > 0 || parentFailures.length > 0) {
        setRowErrors(newRowErrors);
        const parts: string[] = [];
        if (studentErrorCount > 0) {
          parts.push(created.length === 0
            ? "Some students could not be added. Check the errors below each row."
            : `${studentErrorCount} student(s) failed. The rest were added successfully.`);
        }
        if (parentFailures.length > 0) {
          parts.push(`Some parent records could not be saved: ${parentFailures.join("; ")}`);
        }
        setError(parts.join(" "));
        if (created.length === 0) return;
      }

      if (studentErrorCount === 0) setStep(3);
    } catch (err: any) {
      setError(err?.message || "Failed to add students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-4xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden">

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-2.5 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-7 pt-5 pb-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Bulk Add Students</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {step === 1 ? "Enter personal details for each student" :
               step === 2 ? "Enter parent & guardian details" : "Students added successfully"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 pb-5">
          <StepIndicator step={step} />

          {/* ── STEP 1: Personal Details ── */}
          {step === 1 && (
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Students ({personalRows.length})
                </p>
                <button
                  type="button"
                  onClick={generateAllAdmissionNos}
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Wand2 className="w-3 h-3" /> Generate All Adm. Nos.
                </button>
              </div>

              <div className="divide-y divide-gray-50">
                {personalRows.map((row, i) => {
                  const expanded = expandedRows.has(i);
                  return (
                    <div key={i} className={rowErrors[i] ? "border border-red-200 rounded-xl bg-red-50/30" : ""}>
                      {/* Row header */}
                      <div className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50/50 transition-colors">
                        <button type="button" onClick={() => toggleRow(i)} className="p-1 text-gray-400 hover:text-indigo-600 shrink-0">
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <span className={`text-xs font-bold shrink-0 w-6 ${rowErrors[i] ? "text-red-500" : "text-indigo-600"}`}>#{i + 1}</span>
                        <span className="text-sm font-medium text-gray-700 min-w-[120px] truncate">
                          {row.firstName || row.lastName ? `${row.firstName} ${row.lastName}`.trim() : "New Student"}
                        </span>
                        {rowErrors[i] ? (
                          <span className="text-[10px] font-semibold text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full truncate max-w-[200px]">
                            {rowErrors[i]}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 truncate hidden sm:inline">
                            {row.className
                              ? `${row.className}${row.sectionName ? " / " + row.sectionName : ""}`
                              : row.admissionNo || "—"}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          disabled={personalRows.length <= 1}
                          className="ml-auto p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Expanded fields */}
                      {expanded && (
                        <div className="px-4 sm:px-6 pb-5 pt-1 bg-slate-50/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                          {/* Class + Section span full width */}
                          <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Field label="Class *">
                              {clsLoading ? (
                                <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200">
                                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                  <span className="text-xs text-gray-400">Loading…</span>
                                </div>
                              ) : (
                                <Select
                                  value={row.classId}
                                  onValueChange={(v) => {
                                    const matched = classes.find((c) => c.value === v);
                                    if (matched) handleRowClassChange(i, matched.id, matched.label);
                                  }}
                                  options={classes}
                                  placeholder="Select Class"
                                  className={selectCls}
                                />
                              )}
                            </Field>
                            <Field label="Section *">
                              {!row.classId ? (
                                <div className="flex items-center h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-400">
                                  Select a class first
                                </div>
                              ) : (
                                <Select
                                  value={row.sectionId}
                                  onValueChange={(v) => {
                                    const matched = getSectionsForClass(row.classId).find((s) => s.id === v);
                                    if (matched) handleRowSectionChange(i, matched.id, matched.sectionName);
                                  }}
                                  options={getSectionsForClass(row.classId).map((s) => ({ value: s.id, label: s.sectionName }))}
                                  placeholder="Select Section"
                                  className={selectCls}
                                />
                              )}
                            </Field>
                          </div>

                          <Field label="First Name *">
                            <input className={inputCls} placeholder="Rahul" value={row.firstName}
                              onChange={(e) => updatePersonalRow(i, "firstName", e.target.value)} />
                          </Field>
                          <Field label="Last Name">
                            <input className={inputCls} placeholder="Sharma" value={row.lastName}
                              onChange={(e) => updatePersonalRow(i, "lastName", e.target.value)} />
                          </Field>
                          <Field label="Date of Birth">
                            <input type="date" className={inputCls} value={row.dob}
                              onChange={(e) => updatePersonalRow(i, "dob", e.target.value)} />
                          </Field>
                          <Field label="Gender">
                            <Select value={row.gender} onValueChange={(v) => updatePersonalRow(i, "gender", v)}
                              options={GENDER_OPTIONS} placeholder="Select" className={selectCls} />
                          </Field>
                          <Field label="Blood Group">
                            <Select value={row.bloodGroup} onValueChange={(v) => updatePersonalRow(i, "bloodGroup", v)}
                              options={BLOOD_GROUP_OPTIONS} placeholder="Select" className={selectCls} />
                          </Field>
                          <Field label="Roll Number">
                            <input
                              className={`${inputCls} ${rowErrors[i]?.toLowerCase().includes("roll") ? "border-red-400 ring-1 ring-red-300" : ""}`}
                              placeholder="24" value={row.rollNumber}
                              onChange={(e) => { updatePersonalRow(i, "rollNumber", e.target.value); setRowErrors((p) => { const n = { ...p }; delete n[i]; return n; }); }}
                            />
                            {rowErrors[i]?.toLowerCase().includes("roll") && (
                              <p className="text-[10px] text-red-500 font-medium mt-0.5">{rowErrors[i]}</p>
                            )}
                          </Field>
                          <Field label="Admission Number">
                            <div className="flex gap-1.5">
                              <input
                                className={`${inputCls} flex-1 min-w-0 ${rowErrors[i]?.toLowerCase().includes("admission") ? "border-red-400 ring-1 ring-red-300" : ""}`}
                                placeholder={`ADR-${admissionYear}-001`}
                                value={row.admissionNo}
                                onChange={(e) => { updatePersonalRow(i, "admissionNo", e.target.value); setRowErrors((p) => { const n = { ...p }; delete n[i]; return n; }); }}
                              />
                              <button
                                type="button"
                                onClick={() => generateAdmissionNo(i)}
                                className="shrink-0 flex items-center gap-1 px-2.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
                              >
                                <Wand2 className="w-3 h-3" /> Gen
                              </button>
                            </div>
                            {rowErrors[i]?.toLowerCase().includes("admission") && (
                              <p className="text-[10px] text-red-500 font-medium mt-1">{rowErrors[i]}</p>
                            )}
                          </Field>
                          <div className="sm:col-span-2 lg:col-span-4">
                            <Field label="Address">
                              <Textarea
                                placeholder="Enter complete address…"
                                value={row.address}
                                onChange={(e) => updatePersonalRow(i, "address", e.target.value)}
                                rows={2}
                                className="rounded-xl bg-slate-50 border-slate-200 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                              />
                            </Field>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Student Row
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Parent Details ── */}
          {step === 2 && (
            <div className="space-y-3">
              {parentRows.map((row, i) => {
                const personal = personalRows[i];
                return (
                  <div key={i} className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-indigo-50/60 px-4 py-2.5 border-b border-indigo-100">
                      <p className="text-xs font-bold text-indigo-700">
                        #{i + 1} — {personal?.firstName || "Student"} {personal?.lastName || ""}
                        {personal?.admissionNo ? ` (${personal.admissionNo})` : ""}
                      </p>
                    </div>
                    {existingParents.length > 0 && (
                      <div className="px-4 pt-3">
                        <Field label="Sibling Already Enrolled? Select Existing Parent">
                          <Select
                            options={[
                              { label: "None — add a new parent", value: "" },
                              ...existingParents.map((p) => ({ label: p.label, value: p.parentId })),
                            ]}
                            value={row.selectedParentId}
                            onValueChange={(v) => selectExistingParentForRow(i, v)}
                            placeholder="None — add a new parent"
                            className={selectCls}
                          />
                        </Field>
                        {row.selectedParentId && (
                          <p className="text-[11px] text-indigo-600 mt-1">
                            Parent details filled in from the sibling's record below — edit if anything's changed.
                          </p>
                        )}
                      </div>
                    )}
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Father / Parent 1</p>
                        <Field label="Name">
                          <input className={inputCls} placeholder="Father's name" value={row.fatherName}
                            onChange={(e) => updateParentRow(i, "fatherName", e.target.value)} />
                        </Field>
                        <Field label="Relation">
                          <Select value={row.fatherRelation} onValueChange={(v) => updateParentRow(i, "fatherRelation", v)}
                            options={RELATION_OPTIONS} className={selectCls} />
                        </Field>
                        <Field label="Occupation">
                          <input className={inputCls} placeholder="Occupation" value={row.fatherOccupation}
                            onChange={(e) => updateParentRow(i, "fatherOccupation", e.target.value)} />
                        </Field>
                        <Field label="Phone">
                          <input className={inputCls} placeholder="9876543210" value={row.fatherPhone}
                            onChange={(e) => updateParentRow(i, "fatherPhone", e.target.value)} />
                        </Field>
                        <Field label="Email">
                          <input type="email" className={inputCls} placeholder="father@email.com" value={row.fatherEmail}
                            onChange={(e) => updateParentRow(i, "fatherEmail", e.target.value)} />
                        </Field>
                        <Field label="Photo">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              {row.fatherImagePreview
                                ? <img src={row.fatherImagePreview} alt="" className="w-full h-full object-cover" />
                                : <Camera className="w-3.5 h-3.5 text-gray-300" />
                              }
                            </div>
                            <label className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                              {row.fatherImagePreview ? "Change" : "Upload"}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => updateParentImage(i, "father", e.target.files?.[0] ?? null)} />
                            </label>
                            {row.fatherImagePreview && (
                              <button type="button" onClick={() => updateParentImage(i, "father", null)}
                                className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </Field>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Mother / Parent 2</p>
                        <Field label="Name">
                          <input className={inputCls} placeholder="Mother's name" value={row.motherName}
                            onChange={(e) => updateParentRow(i, "motherName", e.target.value)} />
                        </Field>
                        <Field label="Relation">
                          <Select value={row.motherRelation} onValueChange={(v) => updateParentRow(i, "motherRelation", v)}
                            options={RELATION_OPTIONS} className={selectCls} />
                        </Field>
                        <Field label="Occupation">
                          <input className={inputCls} placeholder="Occupation" value={row.motherOccupation}
                            onChange={(e) => updateParentRow(i, "motherOccupation", e.target.value)} />
                        </Field>
                        <Field label="Phone">
                          <input className={inputCls} placeholder="9876543210" value={row.motherPhone}
                            onChange={(e) => updateParentRow(i, "motherPhone", e.target.value)} />
                        </Field>
                        <Field label="Email">
                          <input type="email" className={inputCls} placeholder="mother@email.com" value={row.motherEmail}
                            onChange={(e) => updateParentRow(i, "motherEmail", e.target.value)} />
                        </Field>
                        <Field label="Photo">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              {row.motherImagePreview
                                ? <img src={row.motherImagePreview} alt="" className="w-full h-full object-cover" />
                                : <Camera className="w-3.5 h-3.5 text-gray-300" />
                              }
                            </div>
                            <label className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                              {row.motherImagePreview ? "Change" : "Upload"}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => updateParentImage(i, "mother", e.target.files?.[0] ?? null)} />
                            </label>
                            {row.motherImagePreview && (
                              <button type="button" onClick={() => updateParentImage(i, "mother", null)}
                                className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </Field>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Students Added!</h3>
              <p className="text-sm text-gray-500 mb-6">{createdStudents.length} student(s) have been added successfully.</p>
              <div className="w-full max-w-md rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 max-h-48 overflow-y-auto mb-6">
                {createdStudents.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-gray-700">#{i + 1} {s.firstName} {s.lastName}</span>
                    <span className="text-xs text-gray-400 tabular-nums">{s.admissionNo || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
            {step === 3 ? "Close" : "Cancel"}
          </button>

          <div className="flex items-center gap-2">
            {step === 2 && (
              <button onClick={handleBack}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                ← Back
              </button>
            )}
            {step === 1 && (
              <button onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm">
                Next: Parents <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === 2 && (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Adding…" : `Add ${personalRows.filter((r) => r.firstName.trim()).length} Student(s)`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkAddStudentModal;