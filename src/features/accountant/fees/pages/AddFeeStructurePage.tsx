import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { BILLING_CYCLES } from "../constants/fee.constants";
import { formatINR } from "../../../../utils/formatters";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import type { ClassRecord, SectionRecord } from "@/services/class.api";
import {
  getFeeHeads,
  getStudentsByClassSection,
  addFee,
  updateFeeHeadMapping,
} from "@/services/fee.api";
import type { FeeHeadDTO, StudentByClassSectionRecord } from "@/services/fee.api";
import { useUIStore } from "@/store/uiStore";
import type { FeeStructureAssignment, FeeStructureFormValues, StudentWithFee } from "../types/fees.types";

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

function computeAnnualTotal(amount: number | null, billingCycle: string): number | null {
  if (amount == null) return null;
  switch (billingCycle) {
    case "Monthly":   return amount * 12;
    case "Quarterly": return amount * 4;
    default:          return amount;
  }
}

export default function AddFeeStructurePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const editData = (location.state as { editData?: FeeStructureAssignment } | null)?.editData ?? null;
  const isEdit = !!id;

  const goBack = () => navigate("/accountant/fees", { state: { activeTab: "Fee Structure" } });

  const academicYearName = useUIStore((s) => s.academicYearName) ?? "Current Year";
  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";
  const [submitting, setSubmitting]   = useState(false);
  const [feeHeadsList, setFeeHeadsList] = useState<FeeHeadDTO[]>([]);
  const [allStudents, setAllStudents] = useState<StudentWithFee[]>([]);
  const [classList, setClassList]     = useState<ClassRecord[]>([]);
  const [sectionList, setSectionList] = useState<SectionRecord[]>([]);

  useEffect(() => {
    getFeeHeads().then((res) => { if (res.status) setFeeHeadsList(res.data); }).catch(() => {});
  }, []);

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
  }, [applicableTo, watchClassId, watchSectionId]);

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
        ? current.filter((sid) => sid !== studentId)
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
      if (isEdit && editData) {
        await updateFeeHeadMapping(editData.id, payload);
      } else {
        await addFee(payload);
      }
      toast.success(isEdit ? "Fee structure updated successfully" : "Fee structure added successfully");
      goBack();
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
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBack} className="hover:text-gray-600 transition-colors">
          Fee Management
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">
          {isEdit ? "Edit Fee Structure" : "Add Fee Structure"}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              {isEdit ? "Edit Fee Structure" : "Add Fee Structure"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Academic Year {academicYearName}
            </p>
          </div>
          <button
            type="button"
            onClick={goBack}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-5 sm:px-6 py-5 space-y-4">

          {/* Fee Head + Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
                Fee Head <span className="text-red-500">*</span>
              </label>
              <select className={inputClass(!!errors.feeHeadId)} {...register("feeHeadId")}>
                <option value="">Select fee head</option>
                {feeHeadsList.map((fh) => (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-1">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={goBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1fb5] text-white disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "Update" : "Add Fee Structure"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
