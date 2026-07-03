import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import { Form, FormField } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { typography } from "@/styles/typography";
import { useStaffStore } from "../store/usestore";
import { fetchDepartments } from "@/services/department.api";
import type { StaffMember, UpdateStaffPayload } from "../types/staff.types";
import type { Department } from "@/features/school-admin/settings/types/settings.types";

interface Props {
  staff: StaffMember;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

interface FormState {
  name: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  employeeId: string;
  qualification: string;
  departmentId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  ifscCode: string;
  dob: string;
  joiningDate: string;
}

const toForm = (s: StaffMember): FormState => ({
  name: s.name ?? "",
  phone: s.phone ?? "",
  email: s.email ?? "",
  role: s.role ?? "",
  status: s.status ?? "ACTIVE",
  employeeId: s.employeeId ?? "",
  qualification: s.qualification ?? "",
  departmentId: s.departmentId ?? "",
  bankAccountName: s.bankAccountName ?? "",
  bankAccountNumber: s.bankAccountNumber ?? "",
  ifscCode: s.ifscCode ?? "",
  dob: s.dateOfBirth ?? "",
  joiningDate: s.dateOfJoin ?? "",
});

export const EditStaffModal = ({ staff, onClose }: Props) => {
  const updateStaffInStore = useStaffStore((s) => s.updateStaffInStore);
  const editLoading = useStaffStore((s) => s.editLoading);

  const [form, setForm] = useState<FormState>(() => toForm(staff));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    fetchDepartments().then(setDepartments);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setForm(toForm(staff));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [staff]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    const cleanedPhone = form.phone.replace(/\D/g, "");
    if (!cleanedPhone) next.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(cleanedPhone)) next.phone = "Enter a valid 10-digit number";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email";
    return next;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload: UpdateStaffPayload = {
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, ""),
      email: form.email.trim(),
      role: form.role || undefined,
      status: form.status as UpdateStaffPayload["status"],
      emp_number: form.employeeId.trim() || undefined,
      qualification: form.qualification.trim() || undefined,
      department_id: form.departmentId || undefined,
      bank_account_name: form.bankAccountName.trim() || undefined,
      bank_account_number: form.bankAccountNumber.trim() || undefined,
      ifsc_code: form.ifscCode.trim() || undefined,
      date_of_birth: form.dob || undefined,
      date_of_join: form.joiningDate || undefined,
    };

    try {
      await updateStaffInStore(staff.id, payload);
      toast.success("Staff member updated successfully.");
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update staff member";
      toast.error(message);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className={typography.heading.h4}>Edit Staff Member</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 text-slate-400 shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <FormField label="Full Name *" error={errors.name}>
            <Input name="name" type="text" value={form.name} inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("name", e.target.value)} />
          </FormField>

          <FormField label="Role" error={errors.role}>
            <Input name="role" type="text" value={form.role} placeholder="e.g. Teacher" inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("role", e.target.value)} />
          </FormField>

          <FormField label="Phone *" error={errors.phone}>
            <Input name="phone" type="tel" value={form.phone} inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("phone", e.target.value)} />
          </FormField>

          <FormField label="Email *" error={errors.email}>
            <Input name="email" type="email" value={form.email} inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("email", e.target.value)} />
          </FormField>

          <FormField label="Employee ID">
            <Input name="employeeId" type="text" value={form.employeeId} inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("employeeId", e.target.value)} />
          </FormField>

          <FormField label="Qualification">
            <Input name="qualification" type="text" value={form.qualification} placeholder="B.Ed, M.Sc" inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("qualification", e.target.value)} />
          </FormField>

          <FormField label="Date of Birth">
            <Input name="dob" type="date" value={form.dob} inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("dob", e.target.value)} />
          </FormField>

          <FormField label="Date of Joining">
            <Input name="joiningDate" type="date" value={form.joiningDate} inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("joiningDate", e.target.value)} />
          </FormField>

          <FormField label="Bank Account Name">
            <Input name="bankAccountName" type="text" value={form.bankAccountName} placeholder="Account holder name" inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("bankAccountName", e.target.value)} />
          </FormField>

          <FormField label="Bank Account Number">
            <Input name="bankAccountNumber" type="text" value={form.bankAccountNumber} placeholder="Enter account number" inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("bankAccountNumber", e.target.value)} />
          </FormField>

          <FormField label="IFSC Code">
            <Input name="ifscCode" type="text" value={form.ifscCode} placeholder="SBIN0001234" inputSize="sm"
              className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
              onChange={(e) => handleChange("ifscCode", e.target.value)} />
          </FormField>

          <FormField label="Status">
            <Select options={STATUS_OPTIONS} placeholder="Select status" value={form.status}
              onValueChange={(v) => handleChange("status", v)} />
          </FormField>

          <FormField label="Department" error={errors.departmentId}>
            <Select
              options={[
                { label: "Select department", value: "" },
                ...departments.map((d) => ({ label: d.departmentName, value: d.id })),
              ]}
              value={form.departmentId}
              onValueChange={(v) => handleChange("departmentId", v)}
              className="w-full"
            />
          </FormField>

          <div className="col-span-full flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100 shrink-0">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto" disabled={editLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={editLoading} className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200">
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      </div>
    </div>,
    document.body,
  );
};
