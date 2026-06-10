import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Student, UpdateStudentPayload } from "../types/student.types";

interface Props {
  student: Student;
  onClose: () => void;
  onSave: (id: string, payload: UpdateStudentPayload) => Promise<Student>;
}

const CLASSES = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
const SECTIONS = ["A", "B", "C", "D"].map((s) => ({ value: s, label: s }));
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => ({ value: b, label: b }));
const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Transferred", value: "TRANSFERRED" },
  { label: "Inactive", value: "INACTIVE" },
];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</label>
    {children}
  </div>
);

const toForm = (s: Student) => ({
  firstName: s.firstName ?? "",
  lastName: s.lastName ?? "",
  dob: s.dob ?? "",
  gender: s.gender ?? "",
  class: s.class ?? "",
  section: s.section ?? "",
  bloodGroup: s.bloodGroup ?? "",
  rollNumber: String(s.rollNumber ?? ""),
  residentialAddress: s.residentialAddress ?? "",
  fatherName: s.fatherName ?? "",
  fatherPhone: s.fatherPhone ?? "",
  motherName: s.motherName ?? "",
  motherPhone: s.motherPhone ?? "",
  emergencyContact: s.emergencyContact ?? "",
  email: s.email ?? "",
  admissionNo: s.admissionNo ?? "",
  status: s.status ?? "ACTIVE",
});

type FormState = ReturnType<typeof toForm>;

export const EditStudentModal = ({ student, onClose, onSave }: Props) => {
  const [form, setForm] = useState<FormState>(() => toForm(student));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setForm(toForm(student));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [student]);

  const set = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateStudentPayload = {
      first_name: form.firstName.trim() || undefined,
      last_name: form.lastName.trim() || undefined,
      gender: form.gender.toLowerCase() as UpdateStudentPayload["gender"],
      date_of_birth: form.dob || undefined,
      class: form.class || undefined,
      section: form.section || undefined,
      blood_group: form.bloodGroup as UpdateStudentPayload["blood_group"],
      roll_number: form.rollNumber || undefined,
      address: form.residentialAddress.trim() || undefined,
      father_name: form.fatherName.trim() || undefined,
      father_phone: form.fatherPhone.trim() || undefined,
      mother_name: form.motherName.trim() || undefined,
      mother_phone: form.motherPhone.trim() || undefined,
      emergency_contact: form.emergencyContact.trim() || undefined,
      email: form.email.trim() || undefined,
      status: form.status as UpdateStudentPayload["status"],
    };

    setLoading(true);
    try {
      await onSave(student.id, payload);
      toast.success("Student updated successfully");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">Edit Student</h2>
            <p className="text-xs text-gray-400 mt-0.5">{student.firstName} {student.lastName} · {student.admissionNo}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Status">
            <Select options={STATUS_OPTIONS} value={form.status} onValueChange={set("status")} placeholder="Select status" />
          </Field>

          <Field label="Admission Number">
            <Input value={form.admissionNo} onChange={(e) => set("admissionNo")(e.target.value)} placeholder="ADR-2025-343" />
          </Field>

          <Field label="First Name">
            <Input value={form.firstName} onChange={(e) => set("firstName")(e.target.value)} placeholder="Rahul" />
          </Field>

          <Field label="Last Name">
            <Input value={form.lastName} onChange={(e) => set("lastName")(e.target.value)} placeholder="Sharma" />
          </Field>

          <Field label="Date of Birth">
            <Input type="date" value={form.dob} onChange={(e) => set("dob")(e.target.value)} />
          </Field>

          <Field label="Gender">
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <Button key={g} type="button" variant={form.gender === g ? "default" : "outline"} onClick={() => set("gender")(g)} className="flex-1">
                  {g}
                </Button>
              ))}
            </div>
          </Field>

          <Field label="Class">
            <Select options={CLASSES} value={form.class} onValueChange={set("class")} placeholder="Select Class" />
          </Field>

          <Field label="Section">
            <Select options={SECTIONS} value={form.section} onValueChange={set("section")} placeholder="Select Section" />
          </Field>

          <Field label="Blood Group">
            <Select options={BLOOD_GROUPS} value={form.bloodGroup} onValueChange={set("bloodGroup")} placeholder="Select Blood Group" />
          </Field>

          <Field label="Roll Number">
            <Input value={form.rollNumber} onChange={(e) => set("rollNumber")(e.target.value)} placeholder="24" />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Residential Address">
              <Textarea value={form.residentialAddress} onChange={(e) => set("residentialAddress")(e.target.value)} rows={2} placeholder="Enter complete address..." />
            </Field>
          </div>

          <Field label="Father's Name">
            <Input value={form.fatherName} onChange={(e) => set("fatherName")(e.target.value)} placeholder="Father's name" />
          </Field>

          <Field label="Father's Phone">
            <Input value={form.fatherPhone} onChange={(e) => set("fatherPhone")(e.target.value)} placeholder="9876543210" />
          </Field>

          <Field label="Mother's Name">
            <Input value={form.motherName} onChange={(e) => set("motherName")(e.target.value)} placeholder="Mother's name" />
          </Field>

          <Field label="Mother's Phone">
            <Input value={form.motherPhone} onChange={(e) => set("motherPhone")(e.target.value)} placeholder="9876543210" />
          </Field>

          <Field label="Emergency Contact">
            <Input value={form.emergencyContact} onChange={(e) => set("emergencyContact")(e.target.value)} placeholder="9876543210" />
          </Field>

          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} placeholder="rahul@example.com" />
          </Field>

          <div className="col-span-full flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-0 py-4 border-t border-gray-100 shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto" disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
