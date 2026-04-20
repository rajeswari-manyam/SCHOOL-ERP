import { createPortal } from "react-dom";
import { Button } from "../../../../components/ui/button";
import { Form, FormField } from "../../../../components/ui/form";
import { typography } from "@/styles/typography";

interface Props {
  onClose: () => void;
}

const FIELDS = [
  { name: "fullName", label: "Full Name *", placeholder: "e.g. Priya Reddy" },
  { name: "role", label: "Role *", placeholder: "Class Teacher" },
  { name: "phone", label: "Phone Number *", placeholder: "+91 98765 43210" },
  { name: "employeeId", label: "Employee ID", placeholder: "EMP-024 (auto-generated)" },
  { name: "email", label: "Email", placeholder: "priya@hps.edu.in" },
  { name: "qualification", label: "Qualification", placeholder: "B.Ed, M.Sc" },
  { name: "dob", label: "Date of Birth", placeholder: "mm/dd/yyyy" },
  { name: "salary", label: "Monthly Salary (₹)", placeholder: "25,000" },
  { name: "joiningDate", label: "Date of Joining *", placeholder: "mm/dd/yyyy" },
  { name: "classTeacherOf", label: "Class Teacher of", placeholder: "Class 7B" },
];

export const AddStaffModal = ({ onClose }: Props) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className={typography.heading.h4}>
            Add Staff Member
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 text-slate-400"
          >
            ✕
          </Button>
        </div>

        {/* FORM BODY */}
        <Form className="p-6 grid grid-cols-2 gap-4">
          {FIELDS.map((field) => (
            <FormField key={field.name} label={field.label}>
              <input
                name={field.name}
                placeholder={field.placeholder}
                className="
                  h-9 px-3 w-full rounded-lg border border-slate-200
                  text-sm text-slate-800 placeholder:text-slate-300
                  focus:outline-none focus:ring-2 focus:ring-indigo-300
                  focus:border-indigo-400 transition
                "
              />
            </FormField>
          ))}
        </Form>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200">
            Add Staff Member
          </Button>
        </div>

      </div>
    </div>,
    document.body
  );
};