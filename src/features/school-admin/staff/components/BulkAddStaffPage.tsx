import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, Loader2, CheckCircle, ChevronDown, ChevronUp, Camera } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { createStaff } from "@/services/staff.api";
import { fetchDepartments } from "@/services/department.api";
import { getAllAcademicYears } from "@/services/academicYear.api";
import { useStaffStore } from "../store/usestore";
import type { Department } from "@/features/school-admin/settings/types/settings.types";
import type { AcademicYearRecord } from "@/services/academicYear.api";


interface StaffRow {
  name: string;
  phone: string;
  email: string;
  role: string;
  qualification: string;
  dateOfBirth: string;
  dateOfJoin: string;
  empNumber: string;
  autoGenEmp: boolean;
  departmentId: string;
  academicYearId: string;
  status: string;
  bankAccountName: string;
  bankAccountNumber: string;
  ifscCode: string;
  image: File | null;
  imagePreview: string | null;
}

const emptyRow = (): StaffRow => ({
  name: "",
  phone: "",
  email: "",
  role: "",
  qualification: "",
  dateOfBirth: "2000-01-01",
  dateOfJoin: new Date().toISOString().slice(0, 10),
  empNumber: "",
  autoGenEmp: true,
  departmentId: "",
  academicYearId: "",
  status: "ACTIVE",
  bankAccountName: "",
  bankAccountNumber: "",
  ifscCode: "",
  image: null,
  imagePreview: null,
});

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${checked ? "bg-indigo-600" : "bg-gray-200"}`}
  >
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
  </button>
);

const inputBase = "w-full h-9 px-3 rounded-lg bg-[#EFF4FF] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 border border-slate-200 transition";
const fieldBg = "bg-[#EFF4FF]";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const isRequired = label.endsWith(" *");
  const displayLabel = isRequired ? label.slice(0, -2) : label;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {displayLabel}
        {isRequired && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
};

const genEmpId = (base: number, offset: number) =>
  `EMP-${String(base + offset).padStart(3, "0")}`;

const BulkAddStaffPage = () => {
  const navigate = useNavigate();
  const goBackToList = () => navigate("/schooladmin/staff");
  const schoolcode = useAuthStore((s) => s.user?.schoolcode ?? "");
  const schoolId = useAuthStore((s) => s.user?.id ?? "");
  const globalAcademicYearId = useUIStore((s) => s.academicYearId);
  const loadStaff = useStaffStore((s) => s.loadStaff);
  const staffData  = useStaffStore((s) => s.staffData);

  // Compute the next EMP number from existing staff once on mount
  const nextEmpBase = useState(() => {
    const nums = staffData
      .map((s) => /^EMP-(\d+)$/i.exec(s.employeeId?.trim() ?? "")?.[1])
      .map((n) => (n ? parseInt(n, 10) : NaN))
      .filter((n) => !isNaN(n) && n > 0);
    return nums.length > 0 ? Math.max(...nums) + 1 : 1;
  })[0];

  const makeRow = (offset: number): StaffRow => ({
    ...emptyRow(),
    empNumber: genEmpId(nextEmpBase, offset),
  });

  const [rows, setRows] = useState<StaffRow[]>([makeRow(0)]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: number }>({ inserted: 0, skipped: 0 });

  useEffect(() => {
    fetchDepartments().then(setDepartments);
    getAllAcademicYears().then((res) => setAcademicYears(res.data));
  }, []);

  const updateRow = (index: number, field: keyof StaffRow, value: string | boolean) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const handleRowImageChange = (index: number, file: File | null) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, image: file } : r)));
    if (!file) {
      setRows((prev) => prev.map((r, i) => (i === index ? { ...r, imagePreview: null } : r)));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result as string;
      setRows((prev) => prev.map((r, i) => (i === index ? { ...r, imagePreview: preview } : r)));
    };
    reader.readAsDataURL(file);
  };

  const addRow = () =>
    setRows((prev) => [...prev, makeRow(prev.length)]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const toggleRow = (i: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const handleSubmit = async () => {
    const valid = rows.filter((r) => r.name.trim() && r.email.trim() && r.phone.trim() && r.role.trim());
    if (valid.length === 0) {
      setError("At least one staff member with name, email, phone, and role is required.");
      return;
    }
    if (!schoolcode) {
      setError("School code not found.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // No bulk-with-images endpoint exists, so each row is created individually
      // via the same multipart endpoint the single Add Staff form uses.
      const results = await Promise.allSettled(
        valid.map((r) =>
          createStaff({
            school_id: schoolId,
            name: r.name.trim(),
            email: r.email.trim(),
            phone: r.phone.trim().replace(/[^0-9]/g, ""),
            role: r.role.trim(),
            qualification: r.qualification.trim(),
            date_of_birth: r.dateOfBirth,
            date_of_join: r.dateOfJoin,
            emp_number: r.empNumber.trim() || "EMP-001",
            school_code: schoolcode,
            status: r.status || "ACTIVE",
            ...(r.departmentId        ? { department_id: r.departmentId } : {}),
            ...(r.academicYearId || globalAcademicYearId ? { academicYearId: r.academicYearId || (globalAcademicYearId ?? undefined) } : {}),
            ...(r.bankAccountName.trim()   ? { bank_account_name: r.bankAccountName.trim() } : {}),
            ...(r.bankAccountNumber.trim() ? { bank_account_number: r.bankAccountNumber.trim() } : {}),
            ...(r.ifscCode.trim()          ? { ifsc_code: r.ifscCode.trim().toUpperCase() } : {}),
            ...(r.image ? { image: r.image } : {}),
          })
        )
      );

      const inserted = results.filter((r) => r.status === "fulfilled").length;
      const skipped = results.length - inserted;
      setResult({ inserted, skipped });
      setSuccess(true);
      // Refresh the staff list in the background — don't keep the user
      // waiting on the full list/stats/leaves refetch before unlocking the UI.
      loadStaff();
    } catch (err: any) {
      setError(err?.message || "Failed to add staff members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button type="button" onClick={goBackToList} className="hover:text-indigo-600 transition-colors font-medium">
          Staff
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Bulk Add</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              {success ? "Success" : "Bulk Add Staff"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {success
                ? "Staff members added"
                : "Add multiple staff members at once"}
            </p>
          </div>
          <Button onClick={goBackToList} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Staff Added Successfully!</h3>
              <p className="text-sm text-gray-500 mb-6">
                {result.inserted} staff member(s) added, {result.skipped} skipped.
              </p>
              <Button onClick={goBackToList} variant="outline" className="text-sm">
                Close
              </Button>
            </div>
          ) : (
            <>
              <div className="border rounded-xl border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Staff Members ({rows.length})
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {rows.map((row, i) => {
                    const expanded = expandedRows.has(i);
                    return (
                      <div key={i}>
                        <div
                          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 hover:bg-gray-50/50 cursor-pointer"
                          onClick={() => toggleRow(i)}
                        >
                          <span className="p-1 text-gray-400 shrink-0">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                          <span className="text-xs font-bold text-indigo-600 shrink-0 w-6">#{i + 1}</span>
                          <span className="text-sm text-gray-700 min-w-[120px] truncate">
                            {row.name || "New Staff"}
                          </span>
                          <span className="text-xs text-gray-400 truncate hidden sm:inline">
                            {row.role || row.empNumber ? `${row.role || ""}${row.empNumber ? ` · ${row.empNumber}` : ""}` : "-"}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeRow(i); }}
                            disabled={rows.length <= 1}
                            className="ml-auto p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {expanded && (
                          <div className="px-4 sm:px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-gray-50/30">
                            <Field label="Full Name *">
                              <Input className={fieldBg} placeholder="Enter full name" value={row.name} onChange={(e) => updateRow(i, "name", e.target.value)} />
                            </Field>
                            <Field label="Role *">
                              <Input className={fieldBg} placeholder="Enter role" value={row.role} onChange={(e) => updateRow(i, "role", e.target.value)} />
                            </Field>
                            <Field label="Email *">
                              <Input className={fieldBg} type="email" placeholder="Enter email" value={row.email} onChange={(e) => updateRow(i, "email", e.target.value)} />
                            </Field>
                            <Field label="Phone *">
                              <Input className={fieldBg} type="tel" placeholder="Enter phone number" value={row.phone} maxLength={10} onChange={(e) => updateRow(i, "phone", e.target.value)} />
                            </Field>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Employee ID</label>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Auto</span>
                                  <Toggle
                                    checked={row.autoGenEmp}
                                    onChange={(v) => updateRow(i, "autoGenEmp", v)}
                                  />
                                </div>
                              </div>
                              <input
                                className={
                                  row.autoGenEmp
                                    ? inputBase.replace("bg-[#EFF4FF]", "bg-slate-100") + " text-gray-400 cursor-not-allowed"
                                    : inputBase
                                }
                                value={row.empNumber}
                                readOnly={row.autoGenEmp}
                                placeholder="EMP-001"
                                onChange={(e) => { if (!row.autoGenEmp) updateRow(i, "empNumber", e.target.value); }}
                              />
                            </div>
                            <Field label="Qualification">
                              <Input className={fieldBg} placeholder="Enter qualification" value={row.qualification} onChange={(e) => updateRow(i, "qualification", e.target.value)} />
                            </Field>
                            <Field label="Date of Birth">
                              <Input className={fieldBg} type="date" value={row.dateOfBirth} onChange={(e) => updateRow(i, "dateOfBirth", e.target.value)} />
                            </Field>
                            <Field label="Date of Joining *">
                              <Input className={fieldBg} type="date" value={row.dateOfJoin} onChange={(e) => updateRow(i, "dateOfJoin", e.target.value)} />
                            </Field>
                            <Field label="Status">
                              <Select
                                className={fieldBg}
                                value={row.status}
                                onValueChange={(v) => updateRow(i, "status", v)}
                                options={[
                                  { label: "Active",   value: "ACTIVE" },
                                  { label: "Inactive", value: "INACTIVE" },
                                ]}
                              />
                            </Field>
                            <Field label="Department">
                              <Select
                                className={fieldBg}
                                value={row.departmentId}
                                onValueChange={(v) => updateRow(i, "departmentId", v)}
                                options={[
                                  { label: "Select department", value: "" },
                                  ...departments.map((d) => ({ label: d.departmentName, value: d.id })),
                                ]}
                              />
                            </Field>
                            <Field label="Academic Year">
                              <Select
                                className={fieldBg}
                                value={row.academicYearId}
                                onValueChange={(v) => updateRow(i, "academicYearId", v)}
                                options={[
                                  { label: "Select academic year", value: "" },
                                  ...academicYears.map((y) => ({ label: y.yearName, value: y.id })),
                                ]}
                              />
                            </Field>
                            <Field label="Bank Account Name">
                              <Input className={fieldBg} placeholder="Account holder name" value={row.bankAccountName} onChange={(e) => updateRow(i, "bankAccountName", e.target.value)} />
                            </Field>
                            <Field label="Bank Account Number">
                              <Input className={fieldBg} placeholder="Enter bank account number" value={row.bankAccountNumber} maxLength={18} onChange={(e) => updateRow(i, "bankAccountNumber", e.target.value)} />
                            </Field>
                            <Field label="IFSC Code">
                              <Input className={fieldBg} placeholder="Enter IFSC code" value={row.ifscCode} maxLength={11} onChange={(e) => updateRow(i, "ifscCode", e.target.value.toUpperCase())} />
                            </Field>
                            <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Photo</label>
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                  {row.imagePreview
                                    ? <img src={row.imagePreview} alt="" className="w-full h-full object-cover" />
                                    : <Camera className="w-4 h-4 text-gray-300" />
                                  }
                                </div>
                                <label className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                                  {row.imagePreview ? "Change" : "Upload Photo"}
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleRowImageChange(i, e.target.files?.[0] ?? null)} />
                                </label>
                                {row.imagePreview && (
                                  <button type="button" onClick={() => handleRowImageChange(i, null)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                  <Button type="button" variant="outline" size="sm" onClick={addRow} className="text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Staff
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {!success && (
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
            <Button onClick={goBackToList} variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto bg-emerald-600 text-white">
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Adding...</>
              ) : (
                `Add ${rows.filter((r) => r.name.trim() && r.email.trim() && r.phone.trim()).length} Staff Member(s)`
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkAddStaffPage;
