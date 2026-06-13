import { useState, useEffect } from "react";
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
import { BILLING_CYCLES, FEE_HEAD_COLORS } from "../constants/fee.constants";
import { formatINR } from "../../../../utils/formatters";
import { getFeeHeads } from "@/services/fee.api";
import {
  mockClassList,
  mockSections,
  mockStudentsList,
  mockAssignments,
  getNextAssignmentId,
} from "../data/fee.data";
import type { FeeHead, FeeStructureAssignment, FeeStructureFormValues, StudentWithFee } from "../types/fees.types";
import type { FeeStructureProps } from "../types/fees.types";

const feeStructureSchema = z.object({
  feeHeadId: z.string().min(1, "Fee head is required"),
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string(),
  mandatory: z.boolean(),
  billingCycle: z.enum(["Monthly", "Quarterly", "Annual", "One-Time"]),
  dueDate: z.string().min(1, "Due date is required"),
  amount: z.string().min(1, "Amount is required"),
  annualTotal: z.string(),
  studentIds: z.array(z.string()),
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
    case "Monthly": return amount * 12;
    case "Quarterly": return amount * 4;
    case "Annual": return amount;
    case "One-Time": return amount;
    default: return null;
  }
}

function AddFeeStructureModal({
  onClose,
  onSuccess,
  editData,
  feeHeads: feeHeadsProp,
}: {
  onClose: () => void;
  onSuccess: () => void;
  editData?: FeeStructureAssignment | null;
  feeHeads: FeeHead[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [allStudents, setAllStudents] = useState<StudentWithFee[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeeStructureFormValues>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: {
      feeHeadId: editData?.feeHeadId ?? "",
      classId: editData?.classId ?? "",
      sectionId: editData?.sectionId ?? "",
      mandatory: editData?.mandatory ?? true,
      billingCycle: (editData?.billingCycle as any) ?? "Monthly",
      dueDate: editData?.dueDate ?? "",
      amount: editData?.amount?.toString() ?? "",
      annualTotal: editData?.annualTotal?.toString() ?? "",
      studentIds: editData?.studentIds ?? [],
    },
  });

  const mandatory = watch("mandatory");
  const billingCycle = watch("billingCycle");
  const amount = watch("amount");
  const watchClassId = watch("classId");
  const watchSectionId = watch("sectionId");

  useEffect(() => {
    if (!mandatory && watchClassId) {
      const cls = mockClassList.find((c) => c.id === watchClassId);
      const section = mockSections.find((s) => s.id === watchSectionId);
      const sectionName = section?.sectionName ?? "";
      const className = cls?.name ?? "";
      const filtered = mockStudentsList.filter((s) => {
        const matchClass = s.className === className;
        const matchSection = !watchSectionId || !sectionName || s.sectionName === sectionName;
        return matchClass && matchSection;
      });
      const mapped = filtered.map((s) => ({
        ...s,
        selected: editData?.studentIds?.includes(s.studentId) ?? false,
      }));
      setAllStudents(mapped);
    }
  }, [mandatory, watchClassId, watchSectionId, editData]);

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
    if (current.includes(studentId)) {
      setValue("studentIds", current.filter((id) => id !== studentId));
    } else {
      setValue("studentIds", [...current, studentId]);
    }
  };

  const selectAllStudents = () => {
    setValue("studentIds", allStudents.map((s) => s.studentId));
  };

  const deselectAllStudents = () => {
    setValue("studentIds", []);
  };

  const onSubmit = async (data: FeeStructureFormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      const feeHead = feeHeadsProp.find((fh) => fh.id === data.feeHeadId);
      const cls = mockClassList.find((c) => c.id === data.classId);
      const section = mockSections.find((s) => s.id === data.sectionId);
      const amountNum = data.amount ? Number(data.amount) : null;
      const annualTotalNum = data.annualTotal ? Number(data.annualTotal) : null;

      const assignment: FeeStructureAssignment = {
        id: editData?.id ?? getNextAssignmentId(),
        feeHeadId: data.feeHeadId,
        feeHeadName: feeHead?.name ?? "Unknown",
        classId: data.classId,
        className: cls?.name ?? "Unknown",
        sectionId: data.sectionId || null,
        sectionName: section?.sectionName ?? null,
        mandatory: data.mandatory,
        billingCycle: data.billingCycle,
        dueDate: data.dueDate,
        amount: amountNum,
        annualTotal: annualTotalNum,
        studentIds: data.mandatory ? [] : data.studentIds,
      };

      if (editData) {
        const idx = mockAssignments.findIndex((a) => a.id === editData.id);
        if (idx !== -1) mockAssignments[idx] = assignment;
        toast.success("Fee structure updated successfully");
      } else {
        mockAssignments.push(assignment);
        toast.success("Fee structure created successfully");
      }
      onSuccess();
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

  const currentSections = mockSections.filter((s) => s.classId === watchClassId);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-h-[90vh] sm:w-[600px] rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-6 overflow-y-auto pb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            {editData ? "Edit Fee Structure" : "Add Fee Structure"}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
                Fee Head
              </label>
              <select className={inputClass(!!errors.feeHeadId)} {...register("feeHeadId")}>
                <option value="">Select fee head</option>
                {feeHeadsProp.map((fh) => (
                  <option key={fh.id} value={fh.id}>{fh.name}</option>
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
                Class
              </label>
              <select className={inputClass(!!errors.classId)} {...register("classId")}>
                <option value="">Select class</option>
                {mockClassList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.classId && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.classId.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
              Section
            </label>
            <select className={inputClass(false)} {...register("sectionId")}>
              <option value="">All Sections</option>
              {currentSections.map((s) => (
                <option key={s.id} value={s.id}>{s.sectionName}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-900">Mandatory for all students?</span>
            <button
              type="button"
              onClick={() => setValue("mandatory", !mandatory)}
              className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${mandatory ? "bg-[#3525CD]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${mandatory ? "left-[23px]" : "left-[3px]"}`} />
            </button>
          </div>

          {!mandatory && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Select Students</span>
                <div className="flex gap-2">
                  <button type="button" onClick={selectAllStudents} className="text-[11px] text-[#3525CD] hover:underline">Select All</button>
                  <button type="button" onClick={deselectAllStudents} className="text-[11px] text-slate-500 hover:underline">Clear</button>
                </div>
              </div>
              {allStudents.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                  <p className="text-xs text-slate-400">Select a class and section to see students</p>
                </div>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {allStudents.map((s) => {
                    const isSelected = watch("studentIds").includes(s.studentId);
                    return (
                      <label key={s.studentId} className="flex items-center gap-2 p-1.5 rounded hover:bg-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleStudent(s.studentId)}
                          className="w-3.5 h-3.5 accent-[#3525CD]"
                        />
                        <span className="text-xs text-slate-700">{s.studentName}</span>
                        <span className="text-[10px] text-slate-400 ml-auto">{s.admissionNo}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
              Billing Cycle
            </label>
            <div className="flex flex-wrap gap-2">
              {BILLING_CYCLES.map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => {
                    setValue("billingCycle", cycle);
                    const num = Number(amount);
                    if (!isNaN(num)) {
                      const annual = computeAnnualTotal(num, cycle);
                      setValue("annualTotal", annual?.toString() ?? "");
                    }
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
                Due Date
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
                Amount
              </label>
              <input
                type="number"
                placeholder="0"
                className={inputClass(!!errors.amount)}
                value={amount}
                onChange={handleAmountChange}
              />
              {errors.amount && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg px-4 py-2.5 flex items-center justify-between border border-indigo-100">
            <span className="text-xs font-semibold text-indigo-700">Annual Total</span>
            <span className="text-sm font-bold text-indigo-800">
              {watch("annualTotal") ? formatINR(Number(watch("annualTotal"))) : "—"}
            </span>
          </div>

          <div className="sticky bottom-0 bg-white pt-3 pb-2 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1fb5] text-white disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editData ? "Update" : "Add Fee Structure"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StudentSidePanel({
  assignment,
  onClose,
}: {
  assignment: FeeStructureAssignment | null;
  onClose: () => void;
}) {
  const [students, setStudents] = useState<{ name: string; admissionNo: string; feeAmount: number; concession: string }[]>([]);

  useEffect(() => {
    if (!assignment) return;
    const filtered = mockStudentsList.filter((s) => s.className === assignment.className);
    const mapped = filtered.map((s) => ({
      name: s.studentName,
      admissionNo: s.admissionNo,
      feeAmount: assignment.amount ?? 0,
      concession: "—",
    }));
    setStudents(mapped);
  }, [assignment]);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-800">{assignment?.feeHeadName ?? "Fee Structure"}</p>
          <p className="text-[11px] text-slate-400">{assignment?.className}{assignment?.sectionName ? ` - ${assignment.sectionName}` : ""}</p>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 rounded p-2">
            <span className="text-slate-400 block">Billing Cycle</span>
            <span className="font-medium text-slate-700">{assignment?.billingCycle}</span>
          </div>
          <div className="bg-slate-50 rounded p-2">
            <span className="text-slate-400 block">Amount</span>
            <span className="font-medium text-slate-700">{assignment?.amount != null ? formatINR(assignment.amount) : "—"}</span>
          </div>
          <div className="bg-slate-50 rounded p-2">
            <span className="text-slate-400 block">Due Date</span>
            <span className="font-medium text-slate-700">{assignment?.dueDate}</span>
          </div>
          <div className="bg-slate-50 rounded p-2">
            <span className="text-slate-400 block">Mandatory</span>
            <span className="font-medium text-slate-700">{assignment?.mandatory ? "Yes" : "No"}</span>
          </div>
        </div>

        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Students</h4>
        {students.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">No students found</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {students.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100">
                <div>
                  <p className="text-xs font-medium text-slate-700">{s.name}</p>
                  <p className="text-[10px] text-slate-400">{s.admissionNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-700">{formatINR(s.feeAmount)}</p>
                  <p className="text-[10px] text-emerald-600">Concession: {s.concession}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const FeeStructure = ({ showModal, setShowModal }: FeeStructureProps) => {
  const [assignments, setAssignments] = useState<FeeStructureAssignment[]>([]);
  const [feeHeadsList, setFeeHeadsList] = useState<FeeHead[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<FeeStructureAssignment | null>(null);
  const [viewingAssignment, setViewingAssignment] = useState<FeeStructureAssignment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = () => setAssignments([...mockAssignments]);

  useEffect(() => {
    refresh();
    getFeeHeads().then((res) => {
      if (res.status) setFeeHeadsList(res.data as unknown as FeeHead[]);
    }).catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await new Promise((r) => setTimeout(r, 300));
    try {
      const idx = mockAssignments.findIndex((a) => a.id === id);
      if (idx !== -1) mockAssignments.splice(idx, 1);
      toast.success("Fee structure deleted");
      refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNew = () => {
    setEditingAssignment(null);
    setShowFormModal(true);
  };

  const handleEdit = (assignment: FeeStructureAssignment) => {
    setEditingAssignment(assignment);
    setShowFormModal(true);
  };

  return (
    <div className="px-3 md:px-5 pt-4 pb-10 space-y-5 font-sans">
      {showModal && <AddFeeHeadModal onClose={() => setShowModal(false)} onSuccess={refresh} />}
      {showFormModal && (
        <AddFeeStructureModal
          onClose={() => setShowFormModal(false)}
          onSuccess={refresh}
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Fee Structure Assignments</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-[#3525CD] text-[11px] font-semibold">
            {assignments.length} configured
          </span>
        </div>
        <Button
          size="sm"
          className="h-8 text-xs bg-[#3525CD] text-white"
          onClick={handleAddNew}
        >
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
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fee Head</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Section</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Billing Cycle</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Annual Total</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => {
                const isDeleting = deletingId === assignment.id;
                const bgColor = FEE_HEAD_COLORS[assignment.feeHeadName] ?? "bg-slate-400";
                const icon = feeHeadIcons[assignment.feeHeadName] ?? <BookOpen className="w-3 h-3 text-white" />;
                return (
                  <tr key={assignment.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center ${bgColor}`}>
                          {icon}
                        </span>
                        <span className="text-[13px] font-medium text-slate-800">{assignment.feeHeadName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-slate-700">{assignment.className}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-500">{assignment.sectionName ?? "All"}</td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-slate-600">{assignment.billingCycle}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[13px] font-medium text-slate-800">
                      {assignment.amount != null ? formatINR(assignment.amount) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[13px] font-semibold text-[#3525CD]">
                        {assignment.annualTotal != null ? formatINR(assignment.annualTotal) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{assignment.dueDate || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        assignment.mandatory ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {assignment.mandatory ? "Mandatory" : "Optional"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingAssignment(assignment)}
                          className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Students"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-1.5 rounded text-slate-400 hover:text-[#3525CD] hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          disabled={isDeleting}
                          className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
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
  );
};