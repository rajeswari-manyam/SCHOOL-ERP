import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Users, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import type { ClassRecord, SectionRecord } from "@/services/class.api";
import {
  getFeeHeads,
  getStudentsByClassSection,
  addTransportFee,
  updateTransportFeeById,
} from "@/services/fee.api";
import type { FeeHeadDTO, TransportFeeRecord } from "@/services/fee.api";
import { useUIStore } from "@/store/uiStore";

// ── Schemas ───────────────────────────────────────────────────────────────────

const addSchema = z.object({
  classId:    z.string().min(1, "Required"),
  sectionId:  z.string().min(1, "Required"),
  feeheadId:  z.string().min(1, "Select a fee head"),
  slabName:   z.string().min(1, "Slab name is required"),
  fromKm:     z.coerce.number().min(0),
  toKm:       z.coerce.number().min(0),
  monthlyFee: z.coerce.number().min(1, "Monthly fee required"),
});

const editSchema = z.object({
  classId:    z.string().optional(),
  sectionId:  z.string().optional(),
  feeheadId:  z.string().min(1, "Select a fee head"),
  slabName:   z.string().min(1, "Slab name is required"),
  fromKm:     z.coerce.number().min(0),
  toKm:       z.coerce.number().min(0),
  monthlyFee: z.coerce.number().min(1, "Monthly fee required"),
});

type FormValues = z.infer<typeof addSchema>;

interface Student { id: string; label: string }

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
  editData?: TransportFeeRecord;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SlabModal({ onClose, onSuccess, editData }: Props) {
  const isEdit         = !!editData;
  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";

  const [classes,         setClasses]         = useState<ClassRecord[]>([]);
  const [sections,        setSections]        = useState<SectionRecord[]>([]);
  const [students,        setStudents]        = useState<Student[]>([]);
  const [selectedIds,     setSelectedIds]     = useState<Set<string>>(new Set());
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [feeHeads,        setFeeHeads]        = useState<FeeHeadDTO[]>([]);
  const [submitting,      setSubmitting]      = useState(false);
  const [search,          setSearch]          = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : addSchema) as Parameters<typeof useForm>[0]["resolver"],
    defaultValues: {
      classId:    "",
      sectionId:  "",
      feeheadId:  editData?.feehead_id  ?? "",
      slabName:   editData?.slab_name   ?? "",
      fromKm:     editData?.from_km     ?? 0,
      toKm:       editData?.to_km       ?? 0,
      monthlyFee: editData?.monthly_fee ?? 0,
    },
  });

  const watchClassId   = watch("classId");
  const watchSectionId = watch("sectionId");
  const watchMonthly   = watch("monthlyFee");
  const annualFee      = useMemo(() => (isNaN(watchMonthly) ? 0 : watchMonthly * 12), [watchMonthly]);

  const filteredStudents = useMemo(() =>
    search.trim()
      ? students.filter((s) => s.label.toLowerCase().includes(search.toLowerCase()))
      : students,
    [students, search]
  );

  const allSelected  = filteredStudents.length > 0 && filteredStudents.every((s) => selectedIds.has(s.id));
  const someSelected = filteredStudents.some((s) => selectedIds.has(s.id));

  // Load fee heads on mount
  useEffect(() => {
    getFeeHeads().then((r) => { if (r.status) setFeeHeads(r.data ?? []); }).catch(() => {});
  }, []);

  // Load classes (add mode only)
  useEffect(() => {
    if (!isEdit) {
      getAllClasses().then((r) => setClasses(r.data ?? [])).catch(() => {});
    }
  }, [isEdit]);

  // Load sections when class changes
  useEffect(() => {
    if (!watchClassId) { setSections([]); setStudents([]); setSelectedIds(new Set()); return; }
    getSectionsByClassId(watchClassId)
      .then((r) => setSections(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, [watchClassId]);

  // Load students when class + section selected
  useEffect(() => {
    if (!watchClassId || !watchSectionId) { setStudents([]); setSelectedIds(new Set()); return; }
    setStudentsLoading(true);
    getStudentsByClassSection(watchClassId, watchSectionId)
      .then((res) => {
        if (res.status && Array.isArray(res.data)) {
          setStudents(res.data.map((s) => ({
            id:    s.id,
            label: `${s.first_name} ${s.last_name} (${s.admission_number})`,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setStudentsLoading(false));
  }, [watchClassId, watchSectionId]);

  const toggleStudent = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredStudents.forEach((s) => next.delete(s.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredStudents.forEach((s) => next.add(s.id));
        return next;
      });
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (isEdit && editData) {
      setSubmitting(true);
      try {
        await updateTransportFeeById(editData.id, {
          feehead_id:  data.feeheadId,
          slab_name:   data.slabName,
          from_km:     data.fromKm,
          to_km:       data.toKm,
          monthly_fee: data.monthlyFee,
          annual_fee:  annualFee,
        });
        toast.success("Transport fee updated");
        onSuccess?.();
        onClose();
      } catch {
        toast.error("Failed to update transport fee");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Add mode — must have at least one student selected
    if (selectedIds.size === 0) {
      toast.error("Select at least one student");
      return;
    }

    setSubmitting(true);
    try {
      const ids = Array.from(selectedIds);
      const results = await Promise.allSettled(
        ids.map((studentId) =>
          addTransportFee({
            feehead_id:    data.feeheadId,
            slab_name:     data.slabName,
            from_km:       data.fromKm,
            to_km:         data.toKm,
            student_id:    studentId,
            section_id:    data.sectionId ?? "",
            class_id:      data.classId,
            academicYearId,
            monthly_fee:   data.monthlyFee,
            annual_fee:    annualFee,
          })
        )
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed === 0) {
        toast.success(`Transport fee assigned to ${ids.length} student${ids.length > 1 ? "s" : ""}`);
      } else {
        toast.warning(`${ids.length - failed} added, ${failed} failed`);
      }
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Failed to add transport fees");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "bg-[#EFF4FF] mt-1.5 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm " +
    "focus:outline-none focus:border-[#3525CD] focus:ring-1 focus:ring-[#3525CD]/20 transition-all";
  const selectCls =
    "bg-[#EFF4FF] mt-1.5 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm " +
    "focus:outline-none focus:border-[#3525CD] focus:ring-1 focus:ring-[#3525CD]/20 transition-all " +
    "disabled:bg-gray-50 disabled:text-gray-400";
  const labelCls = "text-[11px] font-medium text-gray-500 uppercase tracking-wide";
  const errorCls = "text-[11px] text-red-500 mt-1";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:w-[520px] max-h-[95vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {isEdit ? "Edit Transport Fee" : "Add Transport Fee"}
            </h2>
            {isEdit
              ? <p className="text-xs text-gray-400 mt-0.5">{editData!.studentName}</p>
              : <p className="text-xs text-gray-400 mt-0.5">Assign a slab to one or more students</p>
            }
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <form id="slab-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* ── Student Section ── */}
            {isEdit ? (
              <div>
                <label className={labelCls}>Student</label>
                <div className="mt-1.5 h-10 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {editData!.studentName} · {editData!.className} {editData!.sectionName}
                </div>
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-[#EFF4FF] bg-[#F8FAFF] p-4">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Select Students
                </p>

                {/* Class + Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Class <span className="text-red-500">*</span></label>
                    <select {...register("classId")} className={selectCls}>
                      <option value="">Select class…</option>
                      {classes.map((c) => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                    </select>
                    {errors.classId && <p className={errorCls}>{errors.classId.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Section <span className="text-red-500">*</span></label>
                    <select {...register("sectionId")} className={selectCls} disabled={!watchClassId}>
                      <option value="">Select section…</option>
                      {sections.map((s) => <option key={s.id} value={s.id}>{s.sectionName}</option>)}
                    </select>
                    {errors.sectionId && <p className={errorCls}>{errors.sectionId.message}</p>}
                  </div>
                </div>

                {/* Student multi-select list */}
                {watchClassId && watchSectionId && (
                  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    {/* Search + select-all bar */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
                      <button
                        type="button"
                        onClick={toggleAll}
                        className="shrink-0 text-[#3525CD] hover:text-[#2a1fb5]"
                        title={allSelected ? "Deselect all" : "Select all"}
                      >
                        {allSelected
                          ? <CheckSquare className="w-4 h-4" />
                          : someSelected
                          ? <CheckSquare className="w-4 h-4 opacity-50" />
                          : <Square className="w-4 h-4" />}
                      </button>
                      <input
                        type="text"
                        placeholder="Search students…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 text-xs bg-transparent outline-none placeholder:text-slate-400"
                      />
                      {selectedIds.size > 0 && (
                        <span className="text-[11px] font-semibold text-[#3525CD] shrink-0">
                          {selectedIds.size} selected
                        </span>
                      )}
                    </div>

                    {/* Student list */}
                    <div className="max-h-44 overflow-y-auto divide-y divide-slate-50">
                      {studentsLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        </div>
                      ) : filteredStudents.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          {students.length === 0 ? "No students found in this section" : "No matches"}
                        </div>
                      ) : (
                        filteredStudents.map((s) => {
                          const checked = selectedIds.has(s.id);
                          return (
                            <label
                              key={s.id}
                              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-blue-50/50 ${checked ? "bg-indigo-50/60" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleStudent(s.id)}
                                className="w-3.5 h-3.5 accent-[#3525CD] shrink-0"
                              />
                              <span className="text-xs text-slate-700 leading-tight">{s.label}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Fee Head ── */}
            <div>
              <label className={labelCls}>Fee Head <span className="text-red-500">*</span></label>
              <select {...register("feeheadId")} className={selectCls}>
                <option value="">Select fee head…</option>
                {feeHeads.map((f) => <option key={f.id} value={f.id}>{f.feeName}</option>)}
              </select>
              {errors.feeheadId && <p className={errorCls}>{errors.feeheadId.message}</p>}
            </div>

            {/* ── Slab Name ── */}
            <div>
              <label className={labelCls}>Slab Name <span className="text-red-500">*</span></label>
              <input {...register("slabName")} placeholder="e.g. Bus 1" className={inputCls} />
              {errors.slabName && <p className={errorCls}>{errors.slabName.message}</p>}
            </div>

            {/* ── Distance Range ── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>From (km)</label>
                <input type="number" min="0" {...register("fromKm")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>To (km)</label>
                <input type="number" min="0" {...register("toKm")} className={inputCls} />
              </div>
            </div>

            {/* ── Monthly + Annual ── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Monthly Fee (₹) <span className="text-red-500">*</span></label>
                <input type="number" min="0" {...register("monthlyFee")} className={inputCls} />
                {errors.monthlyFee && <p className={errorCls}>{errors.monthlyFee.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Annual Fee (auto)</label>
                <div className="mt-1.5 h-10 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 font-medium">
                  ₹{annualFee.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-gray-100 flex items-center gap-2 sm:justify-end">
          {!isEdit && selectedIds.size > 0 && (
            <span className="text-xs text-slate-500 mr-auto">
              {selectedIds.size} student{selectedIds.size > 1 ? "s" : ""} selected
            </span>
          )}
          <Button variant="outline" type="button" onClick={onClose} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button
            form="slab-form"
            type="submit"
            disabled={submitting}
            className="flex-1 sm:flex-none bg-[#3525CD] hover:bg-[#2a1fb5] text-white disabled:opacity-60"
          >
            {submitting
              ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Saving…</>
              : isEdit
              ? "Update"
              : `Add${selectedIds.size > 1 ? ` (${selectedIds.size})` : ""} Transport Fee`}
          </Button>
        </div>
      </div>
    </div>
  );
}
