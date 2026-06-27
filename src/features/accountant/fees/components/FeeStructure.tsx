import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, X, Loader2, BookOpen,
  GraduationCap, Bus, Library, Activity,
  FlaskConical, Eye, Users, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AddFeeHeadModal } from "./AddFeeHeadModal";
import { Concessions } from "./ConcessionTable";
import { BILLING_CYCLES, FEE_HEAD_COLORS } from "../constants/fee.constants";
import { formatINR } from "../../../../utils/formatters";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import type { ClassRecord, SectionRecord } from "@/services/class.api";
import {
  getFeeHeads,
  getStudentsByClassSection,
  getFeeStructures,
  addFee,
  updateFeeHeadMapping,
  deleteFeeHeadMapping,
  deleteFeeHeadById,
} from "@/services/fee.api";
import type { FeeHeadDTO, FeeHeadMappingDTO, StudentByClassSectionRecord } from "@/services/fee.api";
import { useUIStore } from "@/store/uiStore";
import type { FeeStructureAssignment, FeeStructureFormValues, StudentWithFee} from "../types/fees.types";
import type { FeeStructureProps } from "../types/fees.types";

const ALLOWED_CONCESSION_TYPES = ["Scholarship", "Sibling Discount", "Staff Child", "Special Concession"];

const feeStructureSchema = z.object({
  feeHeadId:              z.string().min(1, "Fee head is required"),
  classId:                z.string().min(1, "Class is required"),
  sectionId:              z.string(),
  applicableTo:           z.enum(["all", "selected"]),
  mandatory:              z.boolean(),
  billingCycle:           z.enum(["Monthly", "Quarterly", "Annual", "One-Time"]),
  dueDate:                z.string().min(1, "Due date is required"),
  amount:                 z.string().min(1, "Amount is required"),
  annualTotal:            z.string(),
  studentIds:             z.array(z.string()),
  allowConcession:        z.boolean(),
  allowedConcessionTypes: z.array(z.string()),
});

const feeHeadIcons: Record<string, React.ReactNode> = {
  "Tuition Fee":     <BookOpen className="w-3.5 h-3.5 text-white" />,
  "Examination Fee": <GraduationCap className="w-3.5 h-3.5 text-white" />,
  "Transport Fee":   <Bus className="w-3.5 h-3.5 text-white" />,
  "Activity Fee":    <Activity className="w-3.5 h-3.5 text-white" />,
  "Library Fee":     <Library className="w-3.5 h-3.5 text-white" />,
  "Lab Fee":         <FlaskConical className="w-3.5 h-3.5 text-white" />,
};

function computeAnnualTotal(amount: number | null, billingCycle: string): number | null {
  if (amount == null) return null;
  switch (billingCycle) {
    case "Monthly":   return amount * 12;
    case "Quarterly": return amount * 4;
    default:          return amount;
  }
}

// ── Add / Edit Fee Structure Modal ────────────────────────────────────────────

function AddFeeStructureModal({
  onClose,
  onSuccess,
  editData,
  feeHeads: feeHeadsProp,
}: {
  onClose: () => void;
  onSuccess: () => void;
  editData?: FeeStructureAssignment | null;
  feeHeads: FeeHeadDTO[];
}) {
  const academicYearName = useUIStore((s) => s.academicYearName) ?? "Current Year";
  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";
  const [submitting, setSubmitting]   = useState(false);
  const [allStudents, setAllStudents] = useState<StudentWithFee[]>([]);
  const [classList, setClassList]     = useState<ClassRecord[]>([]);
  const [sectionList, setSectionList] = useState<SectionRecord[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeeStructureFormValues>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: {
      feeHeadId:              editData?.feeHeadId ?? "",
      classId:                editData?.classId ?? "",
      sectionId:              editData?.sectionId ?? "",
      applicableTo:           "all",
      mandatory:              editData?.mandatory ?? true,
      billingCycle:           (editData?.billingCycle as any) ?? "Monthly",
      dueDate:                editData?.dueDate ?? "",
      amount:                 editData?.amount?.toString() ?? "",
      annualTotal:            editData?.annualTotal?.toString() ?? "",
      studentIds:             editData?.studentIds ?? [],
      allowConcession:        false,
      allowedConcessionTypes: [],
    },
  });

  const applicableTo           = watch("applicableTo");
  const mandatory              = watch("mandatory");
  const billingCycle           = watch("billingCycle");
  const amount                 = watch("amount");
  const watchClassId           = watch("classId");
  const watchSectionId         = watch("sectionId");
  const allowConcession        = watch("allowConcession");
  const allowedConcessionTypes = watch("allowedConcessionTypes");

  useEffect(() => {
    getAllClasses().then((res) => { if (res.status) setClassList(res.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!watchClassId) { setSectionList([]); return; }
    getSectionsByClassId(watchClassId).then((res) => {
      if (res.status) setSectionList(res.data);
    }).catch(() => {});
  }, [watchClassId]);

  useEffect(() => {
    if (applicableTo === "selected" && watchClassId && watchSectionId) {
      getStudentsByClassSection(watchClassId, watchSectionId).then((res) => {
        if (res.status && Array.isArray(res.data)) {
          setAllStudents(res.data.map((s: StudentByClassSectionRecord) => ({
            studentId: s.id,
            studentName: `${s.first_name} ${s.last_name}`,
            admissionNo: s.admission_number,
            className: s.class_name,
            sectionName: s.section_name,
            selected: false,
          })));
        }
      }).catch(() => {});
    } else {
      setAllStudents([]);
    }
  }, [applicableTo, watchClassId, watchSectionId, editData]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("amount", val);
    const num = Number(val);
    if (!isNaN(num)) {
      const annual = computeAnnualTotal(num, billingCycle);
      setValue("annualTotal", annual?.toString() ?? "");
    } else {
      setValue("annualTotal", "");
    }
  };

  const toggleStudent = (studentId: string) => {
    const current = watch("studentIds");
    setValue(
      "studentIds",
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId]
    );
  };

  const toggleConcessionType = (type: string) => {
    const current = allowedConcessionTypes;
    setValue(
      "allowedConcessionTypes",
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
    );
  };

  const onSubmit = async (data: FeeStructureFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        feeHeadId: data.feeHeadId,
        academicYearId,
        classId: data.classId,
        sectionId: data.sectionId || "",
        amount: Number(data.amount),
        dueDate: data.dueDate,
        applicableTo: data.applicableTo === "selected" ? "SELECTED_STUDENTS" : "ALL_STUDENTS",
        selectedStudentIds: data.applicableTo === "selected" ? data.studentIds : undefined,
        billingCycle: data.billingCycle,
        isMandatory: data.mandatory,
        allowConcession: data.allowConcession,
        concessionTypes: data.allowConcession ? data.allowedConcessionTypes : undefined,
      };
      if (editData) {
        await updateFeeHeadMapping(editData.id, payload);
      } else {
        await addFee(payload);
      }
      toast.success(editData ? "Fee structure updated successfully" : "Fee structure added successfully");
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Failed to save fee structure");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 h-10 text-sm rounded-lg border outline-none transition-all bg-[#EFF4FF] placeholder:text-gray-400 text-gray-800 ${
      hasError ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-transparent focus:ring-2 focus:ring-indigo-300"
    }`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-h-[92vh] sm:w-[620px] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-y-auto">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-semibold text-gray-900">
            {editData ? "Edit Fee Structure" : "Add Fee Structure"}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-4 pb-6">

          {/* Academic Year (display only) */}
          <div className="flex items-center gap-3 bg-indigo-50 rounded-lg px-4 py-2.5 border border-indigo-100">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Academic Year</span>
            <span className="ml-auto text-sm font-bold text-indigo-800">{academicYearName}</span>
          </div>

          {/* Fee Head + Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
                Fee Head <span className="text-red-500">*</span>
              </label>
              <select className={inputClass(!!errors.feeHeadId)} {...register("feeHeadId")}>
                <option value="">Select fee head</option>
                {feeHeadsProp.map((fh) => (
                  <option key={fh.id} value={fh.id}>{fh.feeName}</option>
                ))}
              </select>
              {errors.feeHeadId && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.feeHeadId.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
                Class <span className="text-red-500">*</span>
              </label>
              <select className={inputClass(!!errors.classId)} {...register("classId")}>
                <option value="">Select class</option>
                {classList.map((c) => (
                  <option key={c.id} value={c.id}>{c.class_name}</option>
                ))}
              </select>
              {errors.classId && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.classId.message}
                </p>
              )}
            </div>
          </div>

          {/* Section */}
          <div>
            <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">Section</label>
            <select className={inputClass(false)} {...register("sectionId")}>
              <option value="">All Sections</option>
              {sectionList.map((s) => (
                <option key={s.id} value={s.id}>{s.sectionName}</option>
              ))}
            </select>
          </div>

          {/* Applicable To */}
          <div>
            <label className="text-[11px] font-semibold text-gray-900 mb-2 block tracking-wide uppercase">
              Applicable To <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {(["all", "selected"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={applicableTo === opt}
                    onChange={() => setValue("applicableTo", opt)}
                    className="accent-[#3525CD]"
                  />
                  <span className="text-sm text-gray-700">
                    {opt === "all" ? "All Students" : "Selected Students"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Selected Students panel */}
          {applicableTo === "selected" && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Select Students</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setValue("studentIds", allStudents.map((s) => s.studentId))} className="text-[11px] text-[#3525CD] hover:underline">Select All</button>
                  <button type="button" onClick={() => setValue("studentIds", [])} className="text-[11px] text-slate-500 hover:underline">Clear</button>
                </div>
              </div>
              {allStudents.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                  <p className="text-xs text-slate-400">Select a class to see students</p>
                </div>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {allStudents.map((s) => {
                    const isSelected = watch("studentIds").includes(s.studentId);
                    return (
                      <label key={s.studentId} className="flex items-center gap-2 p-1.5 rounded hover:bg-white cursor-pointer">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleStudent(s.studentId)} className="w-3.5 h-3.5 accent-[#3525CD]" />
                        <span className="text-xs text-slate-700">{s.studentName}</span>
                        <span className="text-[10px] text-slate-400 ml-auto">{s.admissionNo}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Mandatory Fee Toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-800">Mandatory Fee</p>
              <p className="text-[11px] text-gray-400">Students cannot opt out of this fee</p>
            </div>
            <button
              type="button"
              onClick={() => setValue("mandatory", !mandatory)}
              className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${mandatory ? "bg-[#3525CD]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${mandatory ? "left-[23px]" : "left-[3px]"}`} />
            </button>
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">Billing Cycle</label>
            <div className="flex flex-wrap gap-2">
              {BILLING_CYCLES.map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => {
                    setValue("billingCycle", cycle);
                    const num = Number(amount);
                    if (!isNaN(num)) setValue("annualTotal", computeAnnualTotal(num, cycle)?.toString() ?? "");
                  }}
                  className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                    billingCycle === cycle
                      ? "bg-[#3525CD] text-white border-[#3525CD]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date + Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input type="date" className={inputClass(!!errors.dueDate)} {...register("dueDate")} />
              {errors.dueDate && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.dueDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
                Amount <span className="text-red-500">*</span>
              </label>
              <input type="number" placeholder="0" className={inputClass(!!errors.amount)} value={amount} onChange={handleAmountChange} />
              {errors.amount && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          {/* Annual Total */}
          <div className="bg-indigo-50 rounded-lg px-4 py-2.5 flex items-center justify-between border border-indigo-100">
            <span className="text-xs font-semibold text-indigo-700">Annual Total</span>
            <span className="text-sm font-bold text-indigo-800">
              {watch("annualTotal") ? formatINR(Number(watch("annualTotal"))) : "—"}
            </span>
          </div>

          {/* Allow Concession Toggle */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Allow Concession</p>
                <p className="text-[11px] text-gray-400">Enable discount/scholarship for this fee</p>
              </div>
              <button
                type="button"
                onClick={() => setValue("allowConcession", !allowConcession)}
                className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${allowConcession ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${allowConcession ? "left-[23px]" : "left-[3px]"}`} />
              </button>
            </div>

            {allowConcession && (
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Allowed Concession Types</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALLOWED_CONCESSION_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer bg-white rounded-lg px-3 py-2 border border-slate-100 hover:border-[#3525CD]/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={allowedConcessionTypes.includes(type)}
                        onChange={() => toggleConcessionType(type)}
                        className="w-3.5 h-3.5 accent-[#3525CD]"
                      />
                      <span className="text-xs text-slate-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white pt-3 pb-2 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1fb5] text-white disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editData ? "Update" : "Add Fee Structure"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Student Side Panel ────────────────────────────────────────────────────────

function StudentSidePanel({ assignment, onClose }: { assignment: FeeStructureAssignment | null; onClose: () => void }) {
  const [allStudents] = useState<{ name: string; admissionNo: string }[]>([]);
  const [loading] = useState(false);

  const isSelectedStudents = assignment?.applicableTo === "SELECTED_STUDENTS";
  const assignedList = assignment?.assignedStudents ?? [];

  const displayStudents: { name: string; admissionNo: string }[] = isSelectedStudents
    ? assignedList.map((s) => ({ name: `${s.first_name} ${s.last_name}`.trim(), admissionNo: s.admission_number }))
    : allStudents;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-800">{assignment?.feeHeadName ?? "Fee Structure"}</p>
          <p className="text-[11px] text-slate-400">
            {assignment?.className}{assignment?.sectionName ? ` · ${assignment.sectionName}` : ""} · {assignment?.academicYear ?? ""}
          </p>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Detail grid */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          {([
            ["Billing Cycle", assignment?.billingCycle],
            ["Amount",        assignment?.amount != null ? formatINR(assignment.amount) : "—"],
            ["Due Date",      assignment?.dueDate],
            ["Mandatory",     assignment?.mandatory ? "Yes" : "No"],
            ["Allow Concession", assignment?.allowConcession ? "Yes" : "No"],
            ["Status",        assignment?.status ?? "—"],
          ] as [string, string | undefined][]).map(([label, val]) => (
            <div key={label} className="bg-slate-50 rounded p-2">
              <span className="text-slate-400 block mb-0.5">{label}</span>
              <span className="font-medium text-slate-700">{val}</span>
            </div>
          ))}
        </div>

        {/* Applicable-to badge */}
        <div className="mb-3 flex items-center gap-2">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            isSelectedStudents
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}>
            {isSelectedStudents ? "Selected Students" : "All Students"}
          </span>
          <span className="text-[11px] text-slate-400">{displayStudents.length} student{displayStudents.length !== 1 ? "s" : ""}</span>
        </div>

        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {isSelectedStudents ? "Assigned Students" : "Students in Class"}
        </h4>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          </div>
        ) : displayStudents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">No students found</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {displayStudents.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100">
                <div>
                  <p className="text-xs font-medium text-slate-700">{s.name}</p>
                  <p className="text-[10px] text-slate-400">{s.admissionNo}</p>
                </div>
                <p className="text-xs font-semibold text-slate-700">{formatINR(assignment?.amount ?? 0)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main FeeStructure Component ───────────────────────────────────────────────

const SUB_TABS = ["Fee Heads", "Fee Structures", "Concessions"] as const;
type SubTab = typeof SUB_TABS[number];

export const FeeStructure = ({ showModal, setShowModal }: FeeStructureProps) => {
  const [activeSubTab, setActiveSubTab]             = useState<SubTab>("Fee Heads");
  const [assignments, setAssignments]               = useState<FeeStructureAssignment[]>([]);
  const [feeHeadsList, setFeeHeadsList]             = useState<FeeHeadDTO[]>([]);
  const [showFormModal, setShowFormModal]           = useState(false);
  const [editingAssignment, setEditingAssignment]   = useState<FeeStructureAssignment | null>(null);
  const [viewingAssignment, setViewingAssignment]   = useState<FeeStructureAssignment | null>(null);
  const [deletingId, setDeletingId]                 = useState<string | null>(null);
  const [editingFeeHead, setEditingFeeHead]         = useState<FeeHeadDTO | null>(null);
  const [deletingFeeHeadId, setDeletingFeeHeadId]  = useState<string | null>(null);
  const [triggerAddConcession, setTriggerAddConcession] = useState(false);

  const refreshFeeHeads = useCallback(() => {
    getFeeHeads().then((res) => {
      if (res.status) setFeeHeadsList(res.data);
    }).catch(() => {});
  }, []);

  const refreshFeeStructures = useCallback(() => {
    getFeeStructures({ class_id: "", section_id: "", fromDate: "2020-01-01", toDate: "2030-12-31" }).then((res) => {
      if (res.status) {
        setAssignments(res.data.map((m: FeeHeadMappingDTO) => ({
          id: m.id,
          feeHeadId: m.feeHeadId,
          feeHeadName: m.feeHeadName,
          classId: m.classId,
          className: m.className,
          sectionId: m.sectionId,
          sectionName: m.sectionName,
          mandatory: m.isMandatory,
          billingCycle: m.billingCycle as FeeStructureAssignment["billingCycle"],
          dueDate: m.dueDate,
          amount: m.amount,
          annualTotal: m.billingCycle === "Monthly" ? m.amount * 12 : m.billingCycle === "Quarterly" ? m.amount * 4 : m.amount,
          applicableTo: m.applicableTo as "ALL_STUDENTS" | "SELECTED_STUDENTS",
          allowConcession: m.allowConcession,
          status: m.status,
          academicYear: m.academicYear,
          assignedStudents: m.assignedStudents.map((s) => ({
            id: s.id,
            first_name: s.first_name,
            last_name: s.last_name,
            admission_number: s.admission_number,
          })),
        })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    refreshFeeHeads();
    refreshFeeStructures();
  }, [refreshFeeHeads, refreshFeeStructures]);

  useEffect(() => {
    if (showModal) setActiveSubTab("Fee Heads");
  }, [showModal]);

  const handleDeleteFeeStructure = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFeeHeadMapping(id);
      toast.success("Fee structure deleted");
      refreshFeeStructures();
    } catch {
      toast.error("Failed to delete fee structure");
    } finally {
      setDeletingId(null);
    }
  }, [refreshFeeStructures]);

  const handleDeleteFeeHead = useCallback(async (id: string) => {
    setDeletingFeeHeadId(id);
    try {
      await deleteFeeHeadById(id);
      toast.success("Fee head deleted");
      refreshFeeHeads();
    } catch {
      toast.error("Failed to delete fee head");
    } finally {
      setDeletingFeeHeadId(null);
    }
  }, [refreshFeeHeads]);

  return (
    <div className="px-3 md:px-5 pt-3 pb-10 font-sans">

      {/* Modals */}
      {(showModal || editingFeeHead !== null) && (
        <AddFeeHeadModal
          onClose={() => { setShowModal(false); setEditingFeeHead(null); }}
          onSuccess={() => { refreshFeeHeads(); }}
          editData={editingFeeHead ?? undefined}
        />
      )}
      {showFormModal && (
        <AddFeeStructureModal
          onClose={() => setShowFormModal(false)}
          onSuccess={() => { refreshFeeStructures(); refreshFeeHeads(); }}
          editData={editingAssignment}
          feeHeads={feeHeadsList}
        />
      )}
      {viewingAssignment && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setViewingAssignment(null)} />
          <StudentSidePanel assignment={viewingAssignment} onClose={() => setViewingAssignment(null)} />
        </>
      )}

      {/* ── Sub-tab bar ── */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-5 overflow-x-auto scrollbar-hide">
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeSubTab === tab
                ? "border-[#3525CD] text-[#3525CD]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
        {activeSubTab === "Concessions" && (
          <Button
            size="sm"
            className="ml-auto mb-1 h-7 text-xs bg-[#3525CD] text-white whitespace-nowrap"
            onClick={() => setTriggerAddConcession(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Concession
          </Button>
        )}
      </div>

      {/* ── Fee Heads Tab ── */}
      {activeSubTab === "Fee Heads" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Fee Heads</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-[#3525CD] text-[11px] font-semibold">
                {feeHeadsList.length}
              </span>
            </div>
            <Button size="sm" className="h-8 text-xs bg-[#3525CD] text-white" onClick={() => setShowModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Fee Head
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            {feeHeadsList.length === 0 ? (
              <div className="p-10 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No fee heads yet. Click "+ Add Fee Head" to create one.</p>
              </div>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {["Fee Name", "Description", "Order", "Status", "Actions"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${["Order","Actions","Status"].includes(h) ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feeHeadsList.map((fh) => {
                    const isDeleting = deletingFeeHeadId === fh.id;
                    const isActive   = (fh.status ?? "Active").toLowerCase() === "active";
                    return (
                      <tr key={fh.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
                              <BookOpen className="w-3.5 h-3.5 text-[#3525CD]" />
                            </div>
                            <span className="text-[13px] font-medium text-slate-800">{fh.feeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-slate-500 max-w-[200px] truncate">{fh.description || "—"}</td>
                        <td className="px-4 py-3 text-center text-[13px] text-slate-600">{fh.displayOrder}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            {fh.status ?? "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setEditingFeeHead(fh)} className="p-1.5 rounded text-slate-400 hover:text-[#3525CD] hover:bg-indigo-50 transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteFeeHead(fh.id)} disabled={isDeleting} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50" title="Delete">
                              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Fee Structures Tab ── */}
      {activeSubTab === "Fee Structures" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Fee Structures</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-[#3525CD] text-[11px] font-semibold">
                {assignments.length}
              </span>
            </div>
            <Button size="sm" className="h-8 text-xs bg-[#3525CD] text-white" onClick={() => { setEditingAssignment(null); setShowFormModal(true); }}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Fee Structure
            </Button>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-600">No fee structures configured</p>
              <p className="text-xs text-slate-400 mt-1">Click "Add Fee Structure" to create one</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {["Fee Head", "Class", "Section", "Billing Cycle", "Amount", "Annual Total", "Due Date", "Type", "Actions"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${["Amount", "Annual Total"].includes(h) ? "text-right" : ["Type", "Actions"].includes(h) ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => {
                    const isDeleting = deletingId === a.id;
                    const bgColor = FEE_HEAD_COLORS[a.feeHeadName] ?? "bg-slate-400";
                    const icon = feeHeadIcons[a.feeHeadName] ?? <BookOpen className="w-3 h-3 text-white" />;
                    return (
                      <tr key={a.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-7 h-7 rounded-md flex items-center justify-center ${bgColor}`}>{icon}</span>
                            <span className="text-[13px] font-medium text-slate-800 whitespace-nowrap">{a.feeHeadName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-slate-700">{a.className}</td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">{a.sectionName ?? "All"}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{a.billingCycle}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-medium text-slate-800">{a.amount != null ? formatINR(a.amount) : "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-[13px] font-semibold text-[#3525CD]">{a.annualTotal != null ? formatINR(a.annualTotal) : "—"}</span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-slate-600 whitespace-nowrap">{a.dueDate || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${a.mandatory ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {a.mandatory ? "Mandatory" : "Optional"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setViewingAssignment(a)} className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View Students">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setEditingAssignment(a); setShowFormModal(true); }} className="p-1.5 rounded text-slate-400 hover:text-[#3525CD] hover:bg-indigo-50 transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteFeeStructure(a.id)} disabled={isDeleting} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50" title="Delete">
                              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Concessions Tab ── */}
      {activeSubTab === "Concessions" && (
        <Concessions
          triggerAdd={triggerAddConcession}
          onAddHandled={() => setTriggerAddConcession(false)}
        />
      )}

    </div>
  );
};
