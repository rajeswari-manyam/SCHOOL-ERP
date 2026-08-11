import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getAllStaff, getStaffById } from "@/services/staff.api";
import type { StaffRecord } from "@/services/staff.api";
import { createPayroll } from "@/services/payroll.api";
import type { CreatePayrollRecord } from "@/services/payroll.api";
import { useUIStore } from "@/store/uiStore";
import { formatINR } from "@/utils/formatters";
import { getErrorMessage } from "@/utils/getErrorMessage";

const schema = z.object({
  staff_id:            z.string().min(1, "Select a staff member"),
  salary:              z.number().min(1, "Salary is required"),
  pf_percentage:       z.number().min(0).max(100),
  hra:                 z.number().min(0),
  professional_tax:    z.number().min(0),
  transport_allowance: z.number().min(0),
  tds_monthly:         z.number().min(0),
  other_allowance:     z.number().min(0),
  effective_from:      z.string().min(1, "Date required"),
});

type FormData = z.infer<typeof schema>;

export default function AddPayrollPage() {
  const navigate = useNavigate();
  const goBack = () => navigate("/accountant/payroll", { state: { activeTab: "structure" } });

  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";

  const [staffList,     setStaffList]     = useState<StaffRecord[]>([]);
  const [staffLoading,  setStaffLoading]  = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<StaffRecord | null>(null);
  const [staffFetching, setStaffFetching] = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [successData,   setSuccessData]   = useState<CreatePayrollRecord | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        staff_id:            "",
        salary:              0,
        pf_percentage:       12,
        hra:                 0,
        professional_tax:    200,
        transport_allowance: 0,
        tds_monthly:         0,
        other_allowance:     0,
        effective_from:      today,
      },
    });

  const values = watch();

  // live salary preview (client-side estimate while filling the form)
  const basicSalary     = values.salary ?? 0;
  const previewGross    = basicSalary + values.hra + values.transport_allowance + values.other_allowance;
  const previewPF       = (basicSalary * values.pf_percentage) / 100;
  const previewDeduct   = previewPF + values.professional_tax + values.tds_monthly;
  const previewNet      = previewGross - previewDeduct;

  // load staff list on mount
  useEffect(() => {
    getAllStaff()
      .then((res) => setStaffList(res.data ?? []))
      .catch(() => toast.error("Failed to load staff list"))
      .finally(() => setStaffLoading(false));
  }, []);

  // fetch staff details for auto-fill
  const handleStaffChange = async (id: string) => {
    setValue("staff_id", id);
    setSuccessData(null);
    if (!id) { setSelectedStaff(null); return; }
    setStaffFetching(true);
    try {
      const res = await getStaffById(id);
      if (res.status) setSelectedStaff(res.data);
    } catch {
      toast.error("Failed to load staff details");
    } finally {
      setStaffFetching(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!academicYearId) {
      toast.error("Academic year not selected. Please select one from the top bar.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createPayroll({ ...data, salary: String(data.salary), academicYearId });
      if (res.status) {
        setSuccessData(res.data);
      } else {
        toast.error(res.message || "Failed to create payroll");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create payroll"));
    } finally {
      setSubmitting(false);
    }
  };

  const selectCls =
    "w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD] " +
    "disabled:bg-gray-50 disabled:text-gray-400";

  // ── Success View ──────────────────────────────────────────────────────────
  if (successData) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <button onClick={goBack} className="hover:text-gray-600 transition-colors">
            Payroll Management
          </button>
          <span>›</span>
          <span className="text-gray-700 font-semibold">Add Staff Payroll</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {/* Success header */}
          <div className="px-5 py-5 flex flex-col items-center text-center border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Payroll Added Successfully</h2>
            <p className="text-xs text-gray-400 mt-0.5">{successData.staff_name} · {successData.role}</p>
          </div>

          {/* Salary breakdown from API */}
          <div className="px-5 py-4 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: "Basic Salary",   value: formatINR(successData.base_salary),    color: "bg-slate-50" },
                { label: "PF Amount",      value: `−${formatINR(successData.pf_amount)}`, color: "bg-red-50 text-red-600" },
                { label: "HRA",            value: formatINR(successData.hra),             color: "bg-slate-50" },
                { label: "Transport",      value: formatINR(successData.transport_allowance), color: "bg-slate-50" },
                { label: "Other",          value: formatINR(successData.other_allowance), color: "bg-slate-50" },
                { label: "Prof. Tax",      value: `−${formatINR(successData.professional_tax)}`, color: "bg-red-50 text-red-600" },
                { label: "TDS Monthly",    value: `−${formatINR(successData.tds_monthly)}`, color: "bg-red-50 text-red-600" },
                { label: "PF %",           value: `${successData.pf_percentage}%`,        color: "bg-slate-50" },
              ].map((item) => (
                <div key={item.label} className={`rounded-lg px-3 py-2.5 ${item.color ?? "bg-slate-50"}`}>
                  <p className="text-[10px] text-gray-400">{item.label}</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Gross / Deductions / Net summary */}
            <div className="rounded-xl bg-[#E5EEFF] p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Gross Salary</span>
                <span className="font-semibold text-emerald-700">{formatINR(successData.gross_salary)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total Deductions</span>
                <span className="font-semibold text-red-500">−{formatINR(successData.total_deduction)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#C7D7F9]">
                <span className="text-sm font-semibold text-gray-900">Net Salary</span>
                <span className="text-base font-bold text-[#3525CD]">{formatINR(successData.net_salary)}</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center">
              Effective from {successData.effective_from}
            </p>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={goBack}
              className="w-full h-9 text-sm bg-[#3525CD] hover:bg-[#2a1da3] text-white"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form View ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBack} className="hover:text-gray-600 transition-colors">
          Payroll Management
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Add Staff Payroll</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              Add Staff Payroll
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Configure salary components for a staff member
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

          {/* Staff Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Staff Member <span className="text-red-500">*</span>
            </label>
            <select
              className={selectCls}
              disabled={staffLoading}
              value={values.staff_id}
              onChange={(e) => handleStaffChange(e.target.value)}
            >
              <option value="">
                {staffLoading ? "Loading staff…" : "Select staff…"}
              </option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.role} ({s.emp_number ?? "—"})
                </option>
              ))}
            </select>
            {errors.staff_id && (
              <p className="text-xs text-red-500 mt-1">{errors.staff_id.message}</p>
            )}
          </div>

          {/* Auto-filled staff info */}
          {staffFetching && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading staff details…
            </div>
          )}
          {selectedStaff && !staffFetching && (
            <div className="space-y-3">
              {/* Staff info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: "Name", value: selectedStaff.name },
                  { label: "Role", value: selectedStaff.role },
                ].map((f) => (
                  <div key={f.label} className="bg-[#F8FAFF] rounded-lg px-3 py-2.5 border border-indigo-100">
                    <p className="text-[10px] text-slate-400 mb-0.5">{f.label}</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{f.value}</p>
                  </div>
                ))}
              </div>
              {/* Bank details */}
              {(selectedStaff.bank_account_name || selectedStaff.bank_account_number || selectedStaff.ifsc_code) && (
                <div className="bg-[#F0FDF4] rounded-lg px-3 py-2.5 border border-green-100">
                  <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide mb-1.5">Bank Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { label: "Name",    value: selectedStaff.bank_account_name ?? "—" },
                      { label: "Account", value: selectedStaff.bank_account_number
                          ? `${"x".repeat(Math.max(0, selectedStaff.bank_account_number.length - 3))}${selectedStaff.bank_account_number.slice(-3)}`
                          : "—" },
                      { label: "IFSC",    value: selectedStaff.ifsc_code ?? "—" },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-[10px] text-slate-400">{f.label}</p>
                        <p className="text-xs font-semibold text-slate-800 truncate">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Salary */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Salary (Basic) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                className="pl-7 text-sm h-9"
                {...register("salary", {
                  setValueAs: (v) => {
                    const n = parseInt(String(v).replace(/\D/g, ""), 10);
                    return isNaN(n) ? 0 : n;
                  },
                })}
              />
            </div>
            {errors.salary && (
              <p className="text-xs text-red-500 mt-1">{errors.salary.message}</p>
            )}
          </div>

          {/* Manual fields — 2 column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* PF % */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">PF Percentage *</label>
              <div className="relative">
                <Input
                  type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0"
                  className="pr-9 text-sm h-9"
                  {...register("pf_percentage", {
                    setValueAs: (v) => { const n = parseInt(String(v).replace(/\D/g, ""), 10); return isNaN(n) ? 0 : Math.min(n, 100); },
                  })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Of basic salary</p>
            </div>

            {/* HRA */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">HRA</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="pl-7 text-sm h-9"
                  {...register("hra", { setValueAs: (v) => { const n = parseInt(String(v).replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n; } })} />
              </div>
            </div>

            {/* Professional Tax */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Professional Tax</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="pl-7 text-sm h-9"
                  {...register("professional_tax", { setValueAs: (v) => { const n = parseInt(String(v).replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n; } })} />
              </div>
            </div>

            {/* Transport Allowance */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Transport Allowance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="pl-7 text-sm h-9"
                  {...register("transport_allowance", { setValueAs: (v) => { const n = parseInt(String(v).replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n; } })} />
              </div>
            </div>

            {/* TDS Monthly */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">TDS (Monthly)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="pl-7 text-sm h-9"
                  {...register("tds_monthly", { setValueAs: (v) => { const n = parseInt(String(v).replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n; } })} />
              </div>
            </div>

            {/* Other Allowance */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Other Allowance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="pl-7 text-sm h-9"
                  {...register("other_allowance", { setValueAs: (v) => { const n = parseInt(String(v).replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n; } })} />
              </div>
            </div>

            {/* Effective From */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Effective From <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input type="date" className="pr-9 text-sm h-9"
                  {...register("effective_from")} />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              {errors.effective_from && (
                <p className="text-xs text-red-500 mt-1">{errors.effective_from.message}</p>
              )}
            </div>
          </div>

          {/* Live Salary Preview (client-side estimate) */}
          {selectedStaff && (
            <div className="rounded-xl p-4 space-y-2.5 bg-[#E5EEFF]">
              <p className="text-[10px] font-semibold text-[#3525CD] uppercase tracking-wide">Salary Preview</p>
              <div className="flex flex-wrap justify-between gap-x-2 text-xs">
                <span className="text-gray-500">Basic Salary</span>
                <span className="font-semibold text-slate-800">{formatINR(basicSalary)}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-x-2 text-xs">
                <span className="text-gray-500">Gross (Basic + HRA + Transport + Other)</span>
                <span className="font-semibold text-emerald-700">{formatINR(previewGross)}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-x-2 text-xs">
                <span className="text-gray-500">Total Deductions (PF + PT + TDS)</span>
                <span className="font-semibold text-red-500">−{formatINR(previewDeduct)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#C7D7F9]">
                <span className="text-sm font-semibold text-gray-900">Net Pay</span>
                <span className="text-base font-bold text-[#3525CD]">{formatINR(previewNet)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-1">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={goBack}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !values.staff_id}
              className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1da3] text-white disabled:opacity-50 gap-1.5"
            >
              {submitting
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                : "Add Payroll"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
