import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { studentsApi } from "@/services/student.api";
import { useClassesList } from "../hooks/useClassesList";
import { useSectionsList } from "../hooks/useSectionsList";
import type { Student, UpdateStudentPayload, UpdateParentPayload } from "../types/student.types";

interface Props {
  student: Student;
  onClose: () => void;
  onSave: (id: string, payload: UpdateStudentPayload) => Promise<Student>;
}

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
  classId: s.classId ?? "",
  section: s.section ?? "",
  sectionId: s.sectionId ?? "",
  bloodGroup: s.bloodGroup ?? "",
  rollNumber: String(s.rollNumber ?? ""),
  residentialAddress: s.residentialAddress ?? "",
  fatherName: s.fatherName ?? "",
  fatherPhone: s.fatherPhone ?? "",
  fatherOccupation: s.fatherOccupation ?? "",
  motherName: s.motherName ?? "",
  motherPhone: s.motherPhone ?? "",
  motherOccupation: s.motherOccupation ?? "",
  emergencyContact: s.emergencyContact ?? "",
  fatherEmail: s.fatherEmail ?? "",
  motherEmail: s.motherEmail ?? "",
  admissionNo: s.admissionNo ?? "",
  status: s.status ?? "ACTIVE",
});

type FormState = ReturnType<typeof toForm>;

export const EditStudentModal = ({ student, onClose, onSave }: Props) => {
  const [form, setForm] = useState<FormState>(() => toForm(student));
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(student.photo ?? null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [fatherPhotoFile, setFatherPhotoFile] = useState<File | null>(null);
  const [fatherPhotoPreview, setFatherPhotoPreview] = useState<string | null>(student.parentImage ?? null);
  const fatherPhotoInputRef = useRef<HTMLInputElement>(null);
  const [motherPhotoFile, setMotherPhotoFile] = useState<File | null>(null);
  const [motherPhotoPreview, setMotherPhotoPreview] = useState<string | null>(null);
  const motherPhotoInputRef = useRef<HTMLInputElement>(null);

  // Real class/section option lists (with backend IDs) — mirrors AddStudentModal,
  // so edits resolve to the same class_id/sectionId the backend expects instead
  // of sending a raw "9"/"A" label the update endpoint can't look up.
  const [selectedClassId, setSelectedClassId] = useState<string | null>(student.classId ?? null);
  const { classes } = useClassesList(student.academicYearId ?? null);
  const { sections } = useSectionsList(selectedClassId);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setForm(toForm(student));
      setSelectedClassId(student.classId ?? null);
      setPhotoFile(null);
      setPhotoPreview(student.photo ?? null);
      setFatherPhotoFile(null);
      setFatherPhotoPreview(student.parentImage ?? null);
      setMotherPhotoFile(null);
      setMotherPhotoPreview(null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [student]);

  const set = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleClassChange = (value: string) => {
    const matched = classes.find((c) => c.value === value);
    setSelectedClassId(matched?.id ?? null);
    setForm((prev) => ({ ...prev, class: value, classId: matched?.id ?? "", section: "", sectionId: "" }));
  };

  const handleSectionChange = (value: string) => {
    const matched = sections.find((s) => s.value === value);
    setForm((prev) => ({ ...prev, section: value, sectionId: matched?.id ?? "" }));
  };

  const handlePhotoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(student.photo ?? null);
    }
  };

  // Reverts a newly staged (not-yet-saved) photo back to the student's current one.
  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(student.photo ?? null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleFatherPhotoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null;
    setFatherPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFatherPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFatherPhotoPreview(student.parentImage ?? null);
    }
  };

  const handleRemoveFatherPhoto = () => {
    setFatherPhotoFile(null);
    setFatherPhotoPreview(student.parentImage ?? null);
    if (fatherPhotoInputRef.current) fatherPhotoInputRef.current.value = "";
  };

  const handleMotherPhotoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null;
    setMotherPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setMotherPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setMotherPhotoPreview(null);
    }
  };

  const handleRemoveMotherPhoto = () => {
    setMotherPhotoFile(null);
    setMotherPhotoPreview(null);
    if (motherPhotoInputRef.current) motherPhotoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateStudentPayload = {
      first_name: form.firstName.trim() || undefined,
      last_name: form.lastName.trim() || undefined,
      gender: (form.gender.trim().toLowerCase() || undefined) as UpdateStudentPayload["gender"],
      date_of_birth: form.dob || undefined,
      class: form.class || undefined,
      section: form.section || undefined,
      class_id: form.classId || undefined,
      sectionId: form.sectionId || undefined,
      blood_group: (form.bloodGroup || undefined) as UpdateStudentPayload["blood_group"],
      roll_number: form.rollNumber || undefined,
      address: form.residentialAddress.trim() || undefined,
      father_name: form.fatherName.trim() || undefined,
      father_phone: form.fatherPhone.trim() || undefined,
      mother_name: form.motherName.trim() || undefined,
      mother_phone: form.motherPhone.trim() || undefined,
      emergency_contact: form.emergencyContact.trim() || undefined,
      status: form.status as UpdateStudentPayload["status"],
      ...(photoFile ? { photo: photoFile } : {}),
    };

    setLoading(true);
    try {
      const calls: Promise<unknown>[] = [onSave(student.id, payload)];

      if (student.parentId) {
        const parentPayload: UpdateParentPayload = {
          ...(form.fatherName.trim() ? { father_name: form.fatherName.trim() } : {}),
          ...(form.fatherPhone.trim() ? { father_phone: form.fatherPhone.trim() } : {}),
          ...(form.fatherOccupation.trim() ? { father_occupation: form.fatherOccupation.trim() } : {}),
          ...(form.fatherEmail.trim() ? { father_email: form.fatherEmail.trim() } : {}),
          ...(form.motherName.trim() ? { mother_name: form.motherName.trim() } : {}),
          ...(form.motherPhone.trim() ? { mother_phone: form.motherPhone.trim() } : {}),
          ...(form.motherOccupation.trim() ? { mother_occupation: form.motherOccupation.trim() } : {}),
          ...(form.motherEmail.trim() ? { mother_email: form.motherEmail.trim() } : {}),
          ...(form.residentialAddress.trim() ? { address: form.residentialAddress.trim() } : {}),
          ...(fatherPhotoFile ? { father_image: fatherPhotoFile } : {}),
          ...(motherPhotoFile ? { mother_image: motherPhotoFile } : {}),
        };
        if (Object.keys(parentPayload).length > 0) {
          calls.push(studentsApi.updateParent(student.parentId, parentPayload));
        }
      }

      await Promise.all(calls);
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
          {/* Photo */}
          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {photoPreview
                ? <img src={photoPreview} alt={student.firstName} className="w-full h-full object-cover" />
                : <Camera className="w-5 h-5 text-gray-300" />
              }
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Student Photo</label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => photoInputRef.current?.click()} className="text-xs">
                  {photoPreview ? "Change" : "Upload Photo"}
                </Button>
                {photoFile && (
                  <button type="button" onClick={handleRemovePhoto}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>
          </div>

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
            <Select
              options={classes.map((c) => ({ value: c.value, label: c.label }))}
              value={form.class}
              onValueChange={handleClassChange}
              placeholder="Select Class"
            />
          </Field>

          <Field label="Section">
            <Select
              options={sections.map((s) => ({ value: s.value, label: s.label }))}
              value={form.section}
              onValueChange={handleSectionChange}
              placeholder="Select Section"
            />
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

          <Field label="Father's Occupation">
            <Input value={form.fatherOccupation} onChange={(e) => set("fatherOccupation")(e.target.value)} placeholder="e.g. Software Engineer" />
          </Field>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {fatherPhotoPreview
                ? <img src={fatherPhotoPreview} alt={form.fatherName} className="w-full h-full object-cover" />
                : <Camera className="w-4 h-4 text-gray-300" />
              }
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Father's Photo</label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fatherPhotoInputRef.current?.click()} className="text-xs">
                  {fatherPhotoPreview ? "Change" : "Upload Photo"}
                </Button>
                {fatherPhotoFile && (
                  <button type="button" onClick={handleRemoveFatherPhoto}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input ref={fatherPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFatherPhotoChange} />
            </div>
          </div>

          <Field label="Mother's Name">
            <Input value={form.motherName} onChange={(e) => set("motherName")(e.target.value)} placeholder="Mother's name" />
          </Field>

          <Field label="Mother's Phone">
            <Input value={form.motherPhone} onChange={(e) => set("motherPhone")(e.target.value)} placeholder="9876543210" />
          </Field>

          <Field label="Mother's Occupation">
            <Input value={form.motherOccupation} onChange={(e) => set("motherOccupation")(e.target.value)} placeholder="e.g. Teacher" />
          </Field>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {motherPhotoPreview
                ? <img src={motherPhotoPreview} alt={form.motherName} className="w-full h-full object-cover" />
                : <Camera className="w-4 h-4 text-gray-300" />
              }
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Mother's Photo</label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => motherPhotoInputRef.current?.click()} className="text-xs">
                  {motherPhotoPreview ? "Change" : "Upload Photo"}
                </Button>
                {motherPhotoFile && (
                  <button type="button" onClick={handleRemoveMotherPhoto}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input ref={motherPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleMotherPhotoChange} />
            </div>
          </div>

          <Field label="Emergency Contact">
            <Input value={form.emergencyContact} onChange={(e) => set("emergencyContact")(e.target.value)} placeholder="9876543210" />
          </Field>

          <Field label="Father's Email">
            <Input type="email" value={form.fatherEmail} onChange={(e) => set("fatherEmail")(e.target.value)} placeholder="father@example.com" />
          </Field>

          <Field label="Mother's Email">
            <Input type="email" value={form.motherEmail} onChange={(e) => set("motherEmail")(e.target.value)} placeholder="mother@example.com" />
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