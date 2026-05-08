import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, ImagePlus } from "lucide-react";
import type { AddStudentFormData } from "../types/student.types";

interface AddStudentModalProps {
  onClose: () => void;
  onSubmit: (data: AddStudentFormData) => Promise<void>;
}

const EMPTY_FORM: AddStudentFormData = {
  firstName: "", lastName: "", dob: "", admissionNo: "", gender: "", class: "", section: "",
  bloodGroup: "", rollNumber: "", photo: null, residentialAddress: "",
  fatherName: "", fatherPhone: "", fatherOccupation: "", motherName: "", motherPhone: "",
  emergencyContact: "", whatsappNumber: "", sameAsFather: false,
};

const CLASSES = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));
const SECTIONS = ["A", "B", "C", "D"].map(s => ({ value: s, label: s }));
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(b => ({
  value: b,
  label: b,
}));

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
      {label}
    </label>
    {children}
  </div>
);

const StepIndicator = ({ step }: { step: 1 | 2 }) => (
  <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
    {[1, 2].map((n) => (
      <div key={n} className="flex items-center gap-1.5 sm:gap-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
            step >= n ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          {step > n ? "✓" : n}
        </div>
        <span
          className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap ${
            step >= n ? "text-indigo-700" : "text-gray-400"
          }`}
        >
          {n === 1 ? "Personal" : "Parent & Contact"}
        </span>
        {n < 2 && (
          <div
            className={`w-6 sm:w-12 h-0.5 shrink-0 ${
              step > n ? "bg-indigo-600" : "bg-gray-200"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

const AddStudentModal = ({ onClose, onSubmit }: AddStudentModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<AddStudentFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof AddStudentFormData) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => {
    if (!form.firstName || !form.lastName || !form.class || !form.section) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ── Backdrop — bottom-sheet on mobile, centered on sm+ ── */
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
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
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              Add New Student
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Enter student's personal details</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          <StepIndicator step={step} />

          {step === 1 ? (
            /* ── Step 1: Personal Details ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Field label="First Name">
                <Input
                  placeholder="e.g. Rahul"
                  value={form.firstName}
                  onChange={(e) => set("firstName")(e.target.value)}
                />
              </Field>

              <Field label="Last Name">
                <Input
                  placeholder="e.g. Sharma"
                  value={form.lastName}
                  onChange={(e) => set("lastName")(e.target.value)}
                />
              </Field>

              <Field label="Date of Birth">
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => set("dob")(e.target.value)}
                />
              </Field>

              <Field label="Admission Number">
                <div className="relative">
                  <Input
                    placeholder="ADR-2025-343"
                    value={form.admissionNo}
                    onChange={(e) => set("admissionNo")(e.target.value)}
                    className="pr-28"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set("admissionNo")(
                        `ADR-2025-${Math.floor(Math.random() * 900) + 100}`
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded whitespace-nowrap"
                  >
                    Auto-generate
                  </button>
                </div>
              </Field>

              {/* Gender — full width on mobile */}
              <div className="sm:col-span-2">
                <Field label="Gender">
                  <div className="flex gap-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <Button
                        key={g}
                        type="button"
                        variant={form.gender === g ? "default" : "outline"}
                        onClick={() => set("gender")(g)}
                        className="flex-1 py-2 rounded-lg text-xs font-bold border transition-colors"
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                </Field>
              </div>

              {/* Class + Section side by side */}
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <Field label="Class">
                    <Select
                      value={form.class}
                      onValueChange={set("class")}
                      options={CLASSES}
                      placeholder="Class"
                    />
                  </Field>
                </div>
                <div className="flex-1 min-w-0">
                  <Field label="Section">
                    <Select
                      value={form.section}
                      onValueChange={set("section")}
                      options={SECTIONS}
                      placeholder="Section"
                    />
                  </Field>
                </div>
              </div>

              <Field label="Blood Group">
                <Select
                  value={form.bloodGroup}
                  onValueChange={set("bloodGroup")}
                  options={BLOOD_GROUPS}
                  placeholder="Select Blood Group"
                />
              </Field>

              <Field label="Roll Number">
                <Input
                  placeholder="e.g. 24"
                  value={form.rollNumber}
                  onChange={(e) => set("rollNumber")(e.target.value)}
                />
              </Field>

              {/* Photo upload — full width */}
              <div className="sm:col-span-2">
                <Field label="Student Photo">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 sm:p-6 flex flex-col items-center gap-2 hover:border-indigo-300 transition-colors cursor-pointer">
                    <ImagePlus className="h-6 w-6 text-gray-300" />
                    <p className="text-xs text-gray-400">Upload Photo (JPG/PNG)</p>
                  </div>
                </Field>
              </div>

              {/* Address — full width */}
              <div className="sm:col-span-2">
                <Field label="Residential Address">
                  <Textarea
                    placeholder="Enter complete home address..."
                    value={form.residentialAddress}
                    onChange={(e) => set("residentialAddress")(e.target.value)}
                    rows={3}
                  />
                </Field>
              </div>
            </div>
          ) : (
            /* ── Step 2: Parent & Contact ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Field label="Father's Name">
                <Input
                  placeholder="Father's Name"
                  value={form.fatherName}
                  onChange={(e) => set("fatherName")(e.target.value)}
                />
              </Field>

              <Field label="Mother's Name">
                <Input
                  placeholder="Mother's Name"
                  value={form.motherName}
                  onChange={(e) => set("motherName")(e.target.value)}
                />
              </Field>

              <Field label="Father's Phone">
                <Input
                  placeholder="+91 98765 43210"
                  value={form.fatherPhone}
                  onChange={(e) => set("fatherPhone")(e.target.value)}
                />
              </Field>

              <Field label="Mother's Phone">
                <Input
                  placeholder="+91 00000 00000"
                  value={form.motherPhone}
                  onChange={(e) => set("motherPhone")(e.target.value)}
                />
              </Field>

              <Field label="Father's Occupation">
                <Input
                  placeholder="e.g. Software Engineer"
                  value={form.fatherOccupation}
                  onChange={(e) => set("fatherOccupation")(e.target.value)}
                />
              </Field>

              <Field label="Emergency Contact">
                <Input
                  placeholder="+91 98480 22338"
                  value={form.emergencyContact}
                  onChange={(e) => set("emergencyContact")(e.target.value)}
                />
              </Field>

              {/* WhatsApp — full width */}
              <div className="sm:col-span-2">
                <Field label="WhatsApp Alert Number">
                  <Input
                    placeholder="+91 98765 43210"
                    value={form.whatsappNumber}
                    onChange={(e) => set("whatsappNumber")(e.target.value)}
                    disabled={form.sameAsFather}
                  />
                  <div className="flex items-center gap-2 mt-2 cursor-pointer">
                    <Checkbox
                      checked={form.sameAsFather}
                      onCheckedChange={(checked) => {
                        set("sameAsFather")(checked);
                        if (checked) set("whatsappNumber")(form.fatherPhone);
                      }}
                      id="sameAsFather"
                    />
                    <Label
                      htmlFor="sameAsFather"
                      className="text-xs text-gray-500 cursor-pointer"
                    >
                      Same as Father's Phone
                    </Label>
                  </div>
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="
            flex flex-col-reverse sm:flex-row
            items-stretch sm:items-center
            justify-end
            gap-2 sm:gap-3
            px-4 sm:px-6 py-4
            border-t border-gray-100
            shrink-0
          "
        >
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </Button>

          {step === 1 ? (
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next: Parent & Contact →
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Adding..." : "➕ Add Student & Send Welcome WhatsApp"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;