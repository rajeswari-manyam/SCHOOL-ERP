import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Form, FormField } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { typography } from "@/styles/typography";

interface Props {
  onClose: () => void;
}

const FIELDS = [
  { name: "fullName",       label: "Full Name *",           placeholder: "e.g. Priya Reddy" },
  { name: "role",           label: "Role *",                placeholder: "Class Teacher" },
  { name: "phone",          label: "Phone Number *",        placeholder: "+91 98765 43210" },
  { name: "employeeId",     label: "Employee ID",           placeholder: "EMP-024 (auto-generated)" },
  { name: "email",          label: "Email",                 placeholder: "priya@hps.edu.in" },
  { name: "qualification",  label: "Qualification",         placeholder: "B.Ed, M.Sc" },
  { name: "dob",            label: "Date of Birth",         placeholder: "mm/dd/yyyy" },
  { name: "salary",         label: "Monthly Salary (₹)",   placeholder: "25,000" },
  { name: "joiningDate",    label: "Date of Joining *",     placeholder: "mm/dd/yyyy" },
  { name: "classTeacherOf", label: "Class Teacher of",      placeholder: "Class 7B" },
];

export const AddStaffModal = ({ onClose }: Props) => {
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
        <div className="flex-1 overflow-y-auto">
          <Form className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {FIELDS.map((field) => (
              <FormField key={field.name} label={field.label}>
                <Input
                  name={field.name}
                  placeholder={field.placeholder}
                  inputSize="sm"
                  className="border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
                />
              </FormField>
            ))}
          </Form>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200">
            Add Staff Member
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};