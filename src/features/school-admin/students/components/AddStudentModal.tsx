import { useState, useEffect, useRef } from "react";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, ArrowRight, MessageCircle, Camera, Trash2 } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useClassesList } from "../hooks/useClassesList";
import { useSectionsList } from "../hooks/useSectionsList";

import type { AddStudentFormData, Student } from "../types/student.types";
import { useBulkCreateParentsMutation } from "../hooks/useCreateParentMutation";
import type { CreateParentPayload } from "../types/parent.types";

interface CreateStudentResponse {
  status: boolean;
  message: string;
  data: Student;
}

interface AddStudentModalProps {
  onClose: () => void;
  onSubmit: (data: AddStudentFormData) => Promise<CreateStudentResponse | undefined>;
  students?: Student[];
}

const genNextAdmissionNo = (studentList: Student[]): string => {
  const nums = studentList
    .map((s) => parseInt(s.admissionNo?.replace(/\D/g, "") || "0", 10))
    .filter((n) => !isNaN(n) && n > 0);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `ADM-${String(next).padStart(3, "0")}`;
};

const EMPTY_FORM: AddStudentFormData = {
  firstName: "", lastName: "", dob: "", admissionNo: "", gender: "",
  class: "", class_id: "", section: "", sectionId: "",
  bloodGroup: "", rollNumber: "", photo: null, residentialAddress: "",
  fatherName: "", fatherPhone: "", fatherOccupation: "", fatherRelation: "Father",
  motherName: "", motherPhone: "", motherOccupation: "", motherRelation: "Mother",
  emergencyContact: "", whatsappNumber: "", sameAsFather: false, email: "",
};

const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((b) => ({ value: b, label: b }));

/* ── Field styles ── */
const inputCls = "w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";

/* ── Field wrapper ── */
const Field = ({
  label, children, className = "", required = false, hasError = false, errorText,
}: {
  label: string; children: React.ReactNode; className?: string; required?: boolean; hasError?: boolean; errorText?: string;
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {errorText
      ? <p className="text-[10px] text-red-500 font-medium -mt-0.5">{errorText}</p>
      : hasError && <p className="text-[10px] text-red-500 font-medium -mt-0.5">This field is required</p>
    }
  </div>
);

/* ── Step indicator ── */
const StepIndicator = ({ step }: { step: 1 | 2 }) => (
  <div className="flex items-center gap-0 mb-6">
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step >= 1 ? "bg-indigo-600 text-white" : "border-2 border-gray-300 text-gray-400"}`}>
        {step > 1 ? "✓" : "1"}
      </div>
      <span className={`text-xs font-semibold whitespace-nowrap ${step >= 1 ? "text-indigo-700" : "text-gray-400"}`}>Personal Details</span>
    </div>
    <div className={`flex-1 mx-3 h-0.5 ${step > 1 ? "bg-indigo-600" : "bg-gray-200"}`} />
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step >= 2 ? "bg-indigo-600 text-white" : "border-2 border-gray-300 text-gray-400"}`}>
        2
      </div>
      <span className={`text-xs font-semibold whitespace-nowrap ${step >= 2 ? "text-indigo-700" : "text-gray-400"}`}>Parent & Contact</span>
    </div>
  </div>
);

/* ── Toggle switch ── */
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button type="button" onClick={onChange}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? "bg-indigo-600" : "bg-gray-300"}`}>
    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
  </button>
);

/* ── +91 phone input ── */
const PhoneInput = ({
  value, onChange, placeholder = "00000 00000", readOnly = false, hasError: _hasError = false,
}: { value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean; hasError?: boolean }) => (
  <div className={`flex h-11 rounded-xl border overflow-hidden transition focus-within:ring-2 ${
    readOnly
      ? "bg-indigo-50 border-indigo-200 focus-within:ring-indigo-300 focus-within:border-indigo-400"
      : "bg-slate-50 border-slate-200 focus-within:ring-indigo-300 focus-within:border-indigo-400"
  }`}>
    <span className="flex items-center px-3 text-sm font-semibold text-gray-500 border-r border-slate-200 bg-white/60 shrink-0 select-none">+91</span>
    <input
      className="flex-1 px-3 text-sm bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-800"
      placeholder={placeholder} value={value} readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </div>
);

const AddStudentModal = ({ onClose, onSubmit, students = [] }: AddStudentModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<AddStudentFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [studentData, setStudentData] = useState<{ id?: string; school_id?: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuthStore();
  const academicYearId = useUIStore((s) => s.academicYearId);

  const { classes, loading: classesLoading, error: classesError, retry: retryClasses } = useClassesList(academicYearId);
  const { sections, loading: sectionsLoading, error: sectionsError, retry: retrySections } = useSectionsList(selectedClassId);
  const { mutateAsync: createParents, isPending: parentLoading, error: parentApiError, reset: resetParentError } = useBulkCreateParentsMutation();

  const [generatedAdmNo] = useState(() => genNextAdmissionNo(students));

  useEffect(() => {
    if (autoGenerate) {
      setForm((prev) => ({ ...prev, admissionNo: generatedAdmNo }));
    } else {
      setForm((prev) => ({ ...prev, admissionNo: "" }));
    }
  }, [autoGenerate, generatedAdmNo]);

  useEffect(() => {
    if (form.sameAsFather) {
      setForm((prev) => ({ ...prev, whatsappNumber: prev.fatherPhone }));
    }
  }, [form.sameAsFather, form.fatherPhone]);

  const clearError = (field: string) => {
    setErrors((prev) => { const next = new Set(prev); next.delete(field); return next; });
    setFieldErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  // Parse API error message → which field it belongs to
  const parseApiFieldError = (msg: string): { field: string | null; text: string } => {
    const lower = msg.toLowerCase();
    if (lower.includes("admission")) return { field: "admissionNo", text: msg };
    if (lower.includes("roll"))      return { field: "rollNumber",  text: msg };
    if (lower.includes("email"))     return { field: "email",       text: msg };
    if (lower.includes("phone"))     return { field: "fatherPhone", text: msg };
    return { field: null, text: msg };
  };

  const set = (field: keyof AddStudentFormData) => (value: string | boolean) => {
    clearError(String(field));
    setForm((prev: AddStudentFormData): AddStudentFormData => {
      if (field === "class") {
        const strVal = String(value);
        const matched = classes.find((c) => c.value === strVal);
        setSelectedClassId(matched?.id ?? null);
        return { ...prev, section: "", sectionId: "", class_id: matched?.id ?? "", class: strVal };
      }
      if (field === "section") {
        const strVal = String(value);
        const matched = sections.find((c) => c.value === strVal);
        return { ...prev, sectionId: matched?.id ?? "", section: strVal };
      }
      return { ...prev, [field]: value } as AddStudentFormData;
    });
  };

  const handlePhotoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const e = (field: string) => errors.has(field);

  const validateStep1 = (): boolean => {
    const next = new Set<string>();
    if (!form.firstName.trim())               next.add("firstName");
    if (!form.dob)                            next.add("dob");
    if (!autoGenerate && !form.admissionNo.trim()) next.add("admissionNo");
    if (!form.gender)                         next.add("gender");
    if (!form.class)                          next.add("class");
    if (!form.section)                        next.add("section");
    setErrors(next);
    return next.size === 0;
  };

  const validateStep2 = (): boolean => {
    const next = new Set<string>();
    if (!form.fatherName.trim())  next.add("fatherName");
    if (!form.fatherPhone.trim()) next.add("fatherPhone");
    if (!form.motherName.trim())  next.add("motherName");
    if (!form.motherPhone.trim()) next.add("motherPhone");
    setErrors(next);
    return next.size === 0;
  };

  const handleNext = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    setFormError(null);
    setFieldErrors({});
    try {
      const response = await onSubmit(form);
      const student = response?.data;
      if (!student?.id) throw new Error("Student creation failed. No ID returned.");
      setStudentData({
        id: student.id,
        school_id: (student as any)?.schoolId ?? (student as any)?.school_id,
      });
      setStep(2);
    } catch (err: any) {
      setStudentData(null);
      const msg = err?.message || "Student API error";
      const { field, text } = parseApiFieldError(msg);
      if (field) {
        setFieldErrors({ [field]: text });
        setErrors((prev) => new Set([...prev, field]));
      } else {
        setFormError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => { setFormError(null); setErrors(new Set()); setStep(1); };

  const buildParentPayload = (parent_name: string, relation: string, occupation: string, phone: string): CreateParentPayload => ({
    parent_name, relation,
    occupation: occupation || "Not specified",
    email: form.email, phone,
    students: [studentData?.id ?? ""],
    address: form.residentialAddress,
    school_id: studentData?.school_id || user?.schoolcode || "",
  });

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    setFormError(null);
    resetParentError();
    try {
      if (!studentData?.id) { setFormError("Student data missing."); return; }
      await createParents([
        buildParentPayload(form.fatherName, form.fatherRelation, form.fatherOccupation, form.fatherPhone),
        buildParentPayload(form.motherName, form.motherRelation, form.motherOccupation, form.motherPhone),
      ]);
      setForm(EMPTY_FORM);
      setStudentData(null);
      setPhotoPreview(null);
      setStep(1);
      onClose();
    } catch (err: any) {
      setFormError(err?.message || "Parent API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex justify-center pt-2.5 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-7 pt-5 pb-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Add New Student</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {step === 1 ? "Enter student's personal details" : "Enter parent & contact details"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 pb-5">
          <StepIndicator step={step} />

          {/* ── Step 1: Personal Details ── */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Photo */}
              <div className="sm:col-span-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {photoPreview
                    ? <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
                    : <Camera className="w-5 h-5 text-gray-300" />
                  }
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Student Photo</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      {photoPreview ? "Change" : "Upload Photo"}
                    </button>
                    {photoPreview && (
                      <button type="button" onClick={handleRemovePhoto}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>
              </div>

              <Field label="First Name" required hasError={e("firstName")}>
                <input className={inputCls} placeholder="e.g. Rahul"
                  value={form.firstName} onChange={(ev) => set("firstName")(ev.target.value)} />
              </Field>

              <Field label="Last Name">
                <input className={inputCls} placeholder="e.g. Sharma"
                  value={form.lastName} onChange={(ev) => set("lastName")(ev.target.value)} />
              </Field>

              <Field label="Date of Birth" required hasError={e("dob")}>
                <input type="date" className={inputCls}
                  value={form.dob} onChange={(ev) => set("dob")(ev.target.value)} />
              </Field>

              {/* Admission Number */}
              <Field label="Admission Number" required hasError={e("admissionNo")} errorText={fieldErrors["admissionNo"]}>
                <div className="flex items-center justify-between mb-1 -mt-0.5">
                  <span />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-indigo-600">Auto-generate</span>
                    <Toggle checked={autoGenerate} onChange={() => { setAutoGenerate((v) => !v); clearError("admissionNo"); }} />
                  </div>
                </div>
                <input
                  className={`${inputCls} ${autoGenerate ? "bg-indigo-50 text-indigo-700 font-semibold border-indigo-200" : ""} ${fieldErrors["admissionNo"] ? "border-red-400 ring-1 ring-red-300" : ""}`}
                  placeholder="ADM-001"
                  value={form.admissionNo}
                  readOnly={autoGenerate}
                  onChange={(ev) => !autoGenerate && set("admissionNo")(ev.target.value)}
                />
              </Field>

              {/* Gender pills */}
              <div className="sm:col-span-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Gender<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex gap-2 mt-0.5">
                    {["Male", "Female", "Other"].map((g) => (
                      <button key={g} type="button" onClick={() => set("gender")(g)}
                        className={`flex-1 h-11 rounded-full text-sm font-semibold border transition-colors ${
                          form.gender === g
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-gray-600 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}>
                        {g}
                      </button>
                    ))}
                  </div>
                  {e("gender") && <p className="text-[10px] text-red-500 font-medium -mt-0.5">Please select a gender</p>}
                </div>
              </div>

              {/* Class */}
              <Field label="Class" required hasError={e("class")}>
                {classesLoading ? (
                  <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-xs text-gray-400">Loading…</span>
                  </div>
                ) : classesError ? (
                  <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl bg-red-50 border border-red-200">
                    <span className="text-xs text-red-600 flex-1 truncate">Failed</span>
                    <button type="button" onClick={retryClasses} className="text-[10px] font-bold text-red-700">Retry</button>
                  </div>
                ) : (
                  <Select value={form.class} onValueChange={set("class")} options={classes} placeholder="Select Class"
                    className="h-11 rounded-xl bg-slate-50 border-slate-200" />
                )}
              </Field>

              {/* Section */}
              <Field label="Section" required hasError={e("section")}>
                {!form.class ? (
                  <div className="flex items-center h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-gray-400">
                    Select a class first
                  </div>
                ) : sectionsLoading ? (
                  <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-xs text-gray-400">Loading…</span>
                  </div>
                ) : sectionsError ? (
                  <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl bg-red-50 border border-red-200">
                    <span className="text-xs text-red-600 flex-1 truncate">Failed</span>
                    <button type="button" onClick={retrySections} className="text-[10px] font-bold text-red-700">Retry</button>
                  </div>
                ) : (
                  <Select value={form.section} onValueChange={set("section")} options={sections} placeholder="Select Section"
                    className="h-11 rounded-xl bg-slate-50 border-slate-200" />
                )}
              </Field>

              <Field label="Blood Group">
                <Select value={form.bloodGroup} onValueChange={set("bloodGroup")} options={BLOOD_GROUPS}
                  placeholder="Select Blood Group" className="h-11 rounded-xl bg-slate-50 border-slate-200" />
              </Field>

              <Field label="Roll Number" errorText={fieldErrors["rollNumber"]}>
                <input className={`${inputCls} ${fieldErrors["rollNumber"] ? "border-red-400 ring-1 ring-red-300" : ""}`} placeholder="e.g. 24"
                  value={form.rollNumber} onChange={(ev) => set("rollNumber")(ev.target.value)} />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Residential Address">
                  <Textarea placeholder="Enter complete home address…" value={form.residentialAddress}
                    onChange={(ev) => set("residentialAddress")(ev.target.value)} rows={3}
                    className="rounded-xl bg-slate-50 border-slate-200 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400" />
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 2: Parent & Contact ── */}
          {step === 2 && (
            <div className="space-y-5">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Father / Guardian Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <Field label="Father's Name" required hasError={e("fatherName")}>
                    <input className={inputCls} placeholder="e.g. Kumar Reddy"
                      value={form.fatherName} onChange={(ev) => set("fatherName")(ev.target.value)} />
                  </Field>

                  <Field label="Mother's Name" required hasError={e("motherName")}>
                    <input className={inputCls} placeholder="e.g. Lakshmi Reddy"
                      value={form.motherName} onChange={(ev) => set("motherName")(ev.target.value)} />
                  </Field>

                  {/* Father's Phone */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Father's Phone<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                        <MessageCircle className="w-2.5 h-2.5" /> WHATSAPP
                      </span>
                    </div>
                    <PhoneInput value={form.fatherPhone} onChange={set("fatherPhone")}
                      placeholder="98765 43210" hasError={e("fatherPhone")} />
                    {e("fatherPhone")
                      ? <p className="text-[10px] text-red-500 font-medium -mt-0.5">This field is required</p>
                      : <p className="text-[10px] text-gray-400 italic">Required for emergency alerts and attendance notifications.</p>
                    }
                  </div>

                  <Field label="Mother's Phone" required hasError={e("motherPhone")}>
                    <PhoneInput value={form.motherPhone} onChange={set("motherPhone")}
                      placeholder="00000 00000" hasError={e("motherPhone")} />
                  </Field>

                  <Field label="Father's Occupation">
                    <input className={inputCls} placeholder="e.g. Software Engineer"
                      value={form.fatherOccupation} onChange={(ev) => set("fatherOccupation")(ev.target.value)} />
                  </Field>

                  <Field label="Emergency Contact">
                    <PhoneInput value={form.emergencyContact} onChange={set("emergencyContact")} placeholder="98480 22338" />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Email (Common)">
                      <input type="email" className={inputCls} placeholder="parent@email.com"
                        value={form.email} onChange={(ev) => set("email")(ev.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* WhatsApp Alert Number */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">WhatsApp Alert Number</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <PhoneInput value={form.whatsappNumber} onChange={set("whatsappNumber")}
                      placeholder="98765 43210" readOnly={!!form.sameAsFather} />
                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                      <input type="checkbox" checked={!!form.sameAsFather}
                        onChange={(ev) => set("sameAsFather")(ev.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-300 cursor-pointer" />
                      <span className="text-xs font-semibold text-gray-600">Same as Father's Phone</span>
                    </label>
                  </div>

                  <div className="rounded-xl bg-green-50 border border-green-200 p-3.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-green-700">Preview Message</span>
                    </div>
                    <p className="text-[11px] text-green-900 leading-relaxed">
                      Welcome to <strong>{(user as any)?.schoolName || (user as any)?.school_name || "School"}</strong>!{" "}
                      <span className="text-green-700 font-semibold">{form.firstName || "Student"} {form.lastName}</span>{" "}
                      has been added to Class <strong>{form.class || "—"}{form.section ? " " + form.section : ""}</strong>.{" "}
                      Admission No: <strong className="text-green-700">{form.admissionNo || "ADM-XXXX-XXX"}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* API Error */}
        {(formError || parentApiError) && (
          <div className="px-5 sm:px-7 pb-2 shrink-0">
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <p className="text-xs text-red-600">{formError || (parentApiError as Error)?.message}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {step === 2 && (
              <button onClick={handleBack}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                ← Back
              </button>
            )}

            {step === 1 && (
              <button onClick={handleNext} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Creating…" : <>Next: Parent & Contact <ArrowRight className="w-4 h-4" /></>}
              </button>
            )}

            {step === 2 && (
              <button onClick={handleSubmit} disabled={loading || parentLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm">
                {loading || parentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                {loading || parentLoading ? "Adding…" : "Add Student & Send Welcome WhatsApp"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
