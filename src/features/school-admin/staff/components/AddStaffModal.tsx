import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { nanoid } from "nanoid";
import { Button } from "../../../../components/ui/button";
import { Form, FormField } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { typography } from "@/styles/typography";
import { createStaff } from "../api/staff.api";
import { useStaffStore } from "../store/usestore";
import { useAuthStore } from "@/store/authStore";
import type { CreateStaffPayload } from "../types/staff.types";

interface Props {
  onClose: () => void;
}

const FIELDS = [
  { name: "fullName",       label: "Full Name *",           placeholder: "e.g. Priya Reddy", type: "text" },
  { name: "role",           label: "Role *",                placeholder: "Class Teacher", type: "text" },
  { name: "empNumber",      label: "Employee ID",           placeholder: "Optional: EMP-12345", type: "text" },
  { name: "department",     label: "Department",            placeholder: "Science / Math / Administration", type: "text" },
  { name: "designation",    label: "Designation",           placeholder: "Assistant Teacher", type: "text" },
  { name: "phone",          label: "Phone Number *",        placeholder: "9876543210", type: "tel" },
  { name: "email",          label: "Email",                 placeholder: "priya@hps.edu.in", type: "email" },
  { name: "qualification",  label: "Qualification",         placeholder: "B.Ed, M.Sc", type: "text" },
  { name: "dob",            label: "Date of Birth",         placeholder: "yyyy-mm-dd", type: "date" },
  { name: "salary",         label: "Monthly Salary (₹)",   placeholder: "25000", type: "number" },
  { name: "joiningDate",    label: "Date of Joining *",     placeholder: "yyyy-mm-dd", type: "date" },
];

const INITIAL_FORM = {
  fullName: "",
  role: "",
  empNumber: "",
  department: "",
  designation: "",
  phone: "",
  email: "",
  qualification: "",
  dob: "2000-01-01",
  salary: "0",
  joiningDate: "2025-01-01",
};

export const AddStaffModal = ({ onClose }: Props) => {
  const schoolcode = useAuthStore((s) => s.user?.schoolcode ?? "");
  const staffData = useStaffStore((s) => s.staffData);
  const setStaffData = useStaffStore((s) => s.setStaffData);

  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const cleanedPhone = formValues.phone.trim().replace(/[^0-9]/g, "");

    if (!formValues.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!formValues.role.trim()) nextErrors.role = "Role is required";
    if (!cleanedPhone) nextErrors.phone = "Phone number is required";
    if (!/^[0-9]{10}$/.test(cleanedPhone)) nextErrors.phone = "Enter a valid 10-digit phone number";
    if (!formValues.email.trim()) nextErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) nextErrors.email = "Enter a valid email address";
    if (!formValues.joiningDate.trim()) nextErrors.joiningDate = "Joining date is required";

    return nextErrors;
  };

  const normalizePhone = (value: string) => {
    const cleaned = value.trim().replace(/[^0-9]/g, "");
    if (/^[0-9]{10}$/.test(cleaned)) return cleaned;
    return value.trim();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (!schoolcode) {
      toast.error("Unable to determine school code.");
      return;
    }

    const payload: CreateStaffPayload = {
      name: formValues.fullName.trim(),
      email: formValues.email.trim(),
      phone: normalizePhone(formValues.phone),
      emp_number: (formValues.empNumber || "").trim() || `EMP-${nanoid(6)}`,
      qualification: formValues.qualification.trim(),
      department: formValues.department.trim() || formValues.role.trim(),
      designation: formValues.designation.trim() || formValues.role.trim(),
      monthly_salary: Number(formValues.salary || 0),
      date_of_birth: formValues.dob,
      date_of_join: formValues.joiningDate,
      school_code: schoolcode,
      role: formValues.role.trim(),
    };

    console.log("Create staff payload:", payload);

    try {
      setLoading(true);
      const createdStaff = await createStaff(payload);
      console.log("Staff created response:", createdStaff);
      setStaffData([...staffData, createdStaff]);
      toast.success("Staff member created successfully.");
      onClose();
    } catch (error: unknown) {
      console.error("Create staff error:", error);
      let message = "Failed to create staff member. Please try again.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      // Map common backend validation messages to specific form fields
      const lowered = (message || "").toLowerCase();
      if (lowered.includes("email") && (lowered.includes("exists") || lowered.includes("required") || lowered.includes("already"))) {
        setErrors((prev) => ({ ...prev, email: message }));
      } else if (lowered.includes("phone") && (lowered.includes("required") || lowered.includes("invalid") || lowered.includes("exists"))) {
        setErrors((prev) => ({ ...prev, phone: message }));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    /* ── Backdrop — bottom-sheet on mobile, centered on sm+ ── */
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/30 backdrop-blur-sm">
      <div
        className="
          bg-white w-full sm:max-w-2xl
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl
          max-h-[92vh] sm:max-h-[90vh]
          flex flex-col
          overflow-hidden
        "
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className={typography.heading.h4}>Add Staff Member</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 text-slate-400 shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* ── Form body (scrollable) ── */}
        <Form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {FIELDS.map((field) => (
            <FormField key={field.name} label={field.label} error={errors[field.name]}>
              <Input
                name={field.name}
                type={field.type}
                value={formValues[field.name as keyof typeof INITIAL_FORM]}
                placeholder={field.placeholder}
                inputSize="sm"
                className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </FormField>
          ))}

          {/* ── Footer ── */}
          <div className="col-span-full flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-0 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200">
              {loading ? "Creating..." : "Add Staff Member"}
            </Button>
          </div>
        </Form>
      </div>
    </div>,
    document.body
  );
};