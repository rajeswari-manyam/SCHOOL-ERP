import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2, Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { bulkCreateStaff } from "@/services/school-staff.api";
import { fetchDepartments } from "@/services/department.api";
import { getAllAcademicYears } from "@/services/academicYear.api";
import { useStaffStore } from "../store/usestore";
import type { Department } from "@/features/school-admin/settings/types/settings.types";
import type { AcademicYearRecord } from "@/services/academicYear.api";

const ROLE_OPTIONS = [
  "Class Teacher", "Subject Teacher", "Principal", "Vice Principal",
  "Admin", "Librarian", "Lab Assistant", "Accountant", "Support Staff",
];

interface StaffRow {
  name: string;
  phone: string;
  email: string;
  role: string;
  qualification: string;
  salary: string;
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
}

const emptyRow = (): StaffRow => ({
  name: "",
  phone: "",
  email: "",
  role: "",
  qualification: "",
  salary: "0",
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

const inputBase = "w-full h-9 px-3 rounded-lg bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 border border-slate-200 transition";

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

interface Props {
  onClose: () => void;
}

const genEmpId = (base: number, offset: number) =>
  `EMP-${String(base + offset).padStart(3, "0")}`;

const BulkAddStaffModal = ({ onClose }: Props) => {
  const schoolcode = useAuthStore((s) => s.user?.schoolcode ?? "");
  const schoolId = useAuthStore((s) => s.user?.id ?? "");
  const globalAcademicYearId = useUIStore((s) => s.academicYearId);
  const loadStaff = useStaffStore((s) => s.loadStaff);
  const staffData  = useStaffStore((s) => s.staffData);

  // Compute the next EMP number from existing staff once on mount
  const nextEmpBase = useState(() => {
    const nums = staffData
      .map((s) => parseInt(s.employeeId?.replace(/\D/g, "") || "0", 10))
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
      const staffPayload = valid.map((r) => ({
        name: r.name.trim(),
        email: r.email.trim(),
        phone: r.phone.trim().replace(/[^0-9]/g, ""),
        role: r.role.trim(),
        qualification: r.qualification.trim(),
        salary: Number(r.salary || 0),
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
      }));

      const payload = {
        school_id: schoolId,
        staff: staffPayload,
      };

      const res = await bulkCreateStaff(payload);
      setResult({ inserted: res.inserted ?? 0, skipped: res.skipped ?? 0 });
      setSuccess(true);
      await loadStaff();
    } catch (err: any) {
      setError(err?.message || "Failed to add staff members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-4xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              {success ? "Success" : "Bulk Add Staff"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {success
                ? "Staff members added"
                : "Add multiple staff members at once"}
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Staff Added Successfully!</h3>
              <p className="text-sm text-gray-500 mb-6">
                {result.inserted} staff member(s) added, {result.skipped} skipped.
              </p>
              <Button onClick={onClose} variant="outline" className="text-sm">
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
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 hover:bg-gray-50/50">
                          <button type="button" onClick={() => toggleRow(i)} className="p-1 text-gray-400 hover:text-gray-600 shrink-0">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <span className="text-xs font-bold text-indigo-600 shrink-0 w-6">#{i + 1}</span>
                          <span className="text-sm text-gray-700 min-w-[120px] truncate">
                            {row.name || "New Staff"}
                          </span>
                          <span className="text-xs text-gray-400 truncate hidden sm:inline">
                            {row.role || row.empNumber ? `${row.role || ""}${row.empNumber ? ` · ${row.empNumber}` : ""}` : "-"}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeRow(i)}
                            disabled={rows.length <= 1}
                            className="ml-auto p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {expanded && (
                          <div className="px-4 sm:px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-gray-50/30">
                            <Field label="Full Name *">
                              <Input placeholder="Priya Reddy" value={row.name} onChange={(e) => updateRow(i, "name", e.target.value)} />
                            </Field>
                            <Field label="Role *">
                              <Select
                                value={row.role}
                                onValueChange={(v) => updateRow(i, "role", v)}
                                options={[
                                  { label: "Select role…", value: "" },
                                  ...ROLE_OPTIONS.map((r) => ({ label: r, value: r })),
                                ]}
                              />
                            </Field>
                            <Field label="Email *">
                              <Input type="email" placeholder="priya@school.edu" value={row.email} onChange={(e) => updateRow(i, "email", e.target.value)} />
                            </Field>
                            <Field label="Phone *">
                              <Input type="tel" placeholder="9876543210" value={row.phone} maxLength={10} onChange={(e) => updateRow(i, "phone", e.target.value)} />
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
                                className={inputBase + (row.autoGenEmp ? " bg-slate-50 text-gray-400 cursor-not-allowed" : "")}
                                value={row.empNumber}
                                readOnly={row.autoGenEmp}
                                placeholder="EMP-001"
                                onChange={(e) => { if (!row.autoGenEmp) updateRow(i, "empNumber", e.target.value); }}
                              />
                            </div>
                            <Field label="Qualification">
                              <Input placeholder="B.Ed, M.Sc" value={row.qualification} onChange={(e) => updateRow(i, "qualification", e.target.value)} />
                            </Field>
                            <Field label="Date of Birth">
                              <Input type="date" value={row.dateOfBirth} onChange={(e) => updateRow(i, "dateOfBirth", e.target.value)} />
                            </Field>
                            <Field label="Date of Joining *">
                              <Input type="date" value={row.dateOfJoin} onChange={(e) => updateRow(i, "dateOfJoin", e.target.value)} />
                            </Field>
                            <Field label="Monthly Salary (₹)">
                              <Input type="number" placeholder="25000" value={row.salary} onChange={(e) => updateRow(i, "salary", e.target.value)} />
                            </Field>
                            <Field label="Status">
                              <Select
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
                                value={row.academicYearId}
                                onValueChange={(v) => updateRow(i, "academicYearId", v)}
                                options={[
                                  { label: "Select academic year", value: "" },
                                  ...academicYears.map((y) => ({ label: y.yearName, value: y.id })),
                                ]}
                              />
                            </Field>
                            <Field label="Bank Account Name">
                              <Input placeholder="Account holder name" value={row.bankAccountName} onChange={(e) => updateRow(i, "bankAccountName", e.target.value)} />
                            </Field>
                            <Field label="Bank Account Number">
                              <Input placeholder="e.g. 012345678901" value={row.bankAccountNumber} maxLength={18} onChange={(e) => updateRow(i, "bankAccountNumber", e.target.value)} />
                            </Field>
                            <Field label="IFSC Code">
                              <Input placeholder="SBIN0001234" value={row.ifscCode} maxLength={11} onChange={(e) => updateRow(i, "ifscCode", e.target.value.toUpperCase())} />
                            </Field>
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
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
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

export default BulkAddStaffModal;
