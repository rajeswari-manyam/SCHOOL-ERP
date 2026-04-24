import { useState } from "react";
import type { AddEnquiryFormData, EnquirySource } from "../types/admissions.types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SOURCES: EnquirySource[] = ["Walk-in", "Phone Inquiry", "Social Media", "Referral", "Website", "Newspaper Ad"];
const CLASSES = ["LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const today = new Date().toISOString().split("T")[0];

const EMPTY: AddEnquiryFormData = {
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  studentName: "",
  dob: "",
  classApplied: "",
  source: "",
  referredBy: "",
  enquiryDate: today,
  notes: "",
};

interface Props {
  onClose: () => void;
  onSubmit: (data: AddEnquiryFormData) => Promise<void>;
  schoolName?: string;
  principalName?: string;
}

const InputField = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const AddEnquiryModal = ({
  onClose,
  onSubmit,
  schoolName = "Your School",
  principalName = "Principal",
}: Props) => {
  const [form, setForm] = useState<AddEnquiryFormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddEnquiryFormData, string>>>({});

  const set = (key: keyof AddEnquiryFormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.parentName.trim())  errs.parentName  = "Required";
    if (!form.parentPhone.trim()) errs.parentPhone  = "Required";
    if (!form.studentName.trim()) errs.studentName  = "Required";
    if (!form.classApplied)       errs.classApplied = "Required";
    if (!form.source)             errs.source       = "Required";
    if (!form.enquiryDate)        errs.enquiryDate  = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const waPreview = form.parentName
    ? `Dear ${form.parentName} garu,\nThank you for visiting ${schoolName}. We will contact you within 24 hours regarding admission${form.classApplied ? ` to Class ${form.classApplied}` : ""}.\n\n— ${principalName}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">New Admission Enquiry</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              A thank-you WhatsApp will be sent to the parent automatically
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                WhatsApp Active
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {/* Left col */}
          <InputField label="Parent's Name" required>
            <Input
              className="bg-gray-50"
              placeholder="Father or Mother name"
              value={form.parentName}
              onChange={e => set("parentName", e.target.value)}
            />
            {errors.parentName && <p className="text-red-500 text-[10px]">{errors.parentName}</p>}
          </InputField>

          <InputField label="Class Applying For" required>
            <Select
              className="bg-gray-50"
              placeholder="Select Class"
              options={CLASSES.map(c => ({ label: `Class ${c}`, value: c }))}
              value={form.classApplied}
              onValueChange={value => set("classApplied", value)}
            />
            {errors.classApplied && <p className="text-red-500 text-[10px]">{errors.classApplied}</p>}
          </InputField>

          <InputField label="Parent's Phone" required>
            <div className="flex gap-2">
              <span className="px-3 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-semibold">+91</span>
              <Input
                className="bg-gray-50 flex-1"
                placeholder="98765 43210"
                value={form.parentPhone}
                onChange={e => set("parentPhone", e.target.value)}
                maxLength={10}
              />
            </div>
            {errors.parentPhone
              ? <p className="text-red-500 text-[10px]">{errors.parentPhone}</p>
              : <p className="text-emerald-600 text-[10px] font-semibold">✓ WhatsApp message will be sent to this number</p>
            }
          </InputField>

          <InputField label="Enquiry Date" required>
            <Input
              type="date"
              className="bg-gray-50"
              value={form.enquiryDate}
              onChange={e => set("enquiryDate", e.target.value)}
            />
            {errors.enquiryDate && <p className="text-red-500 text-[10px]">{errors.enquiryDate}</p>}
          </InputField>

          <InputField label="Parent's Email">
            <Input
              className="bg-gray-50"
              placeholder="optional"
              value={form.parentEmail}
              onChange={e => set("parentEmail", e.target.value)}
            />
          </InputField>

          <InputField label="Enquiry Source" required>
            <Select
              className="bg-gray-50"
              placeholder="Select Source"
              options={SOURCES.map(s => ({ label: s, value: s }))}
              value={form.source}
              onValueChange={value => set("source", value)}
            />
            {errors.source && <p className="text-red-500 text-[10px]">{errors.source}</p>}
          </InputField>

          <InputField label="Student's Name" required>
            <Input
              className="bg-gray-50"
              placeholder="Child's full name"
              value={form.studentName}
              onChange={e => set("studentName", e.target.value)}
            />
            {errors.studentName && <p className="text-red-500 text-[10px]">{errors.studentName}</p>}
          </InputField>

          <InputField label="Referred By">
            <Input
              className="bg-gray-50"
              placeholder="Name of person who referred"
              value={form.referredBy}
              onChange={e => set("referredBy", e.target.value)}
            />
          </InputField>

          <InputField label="Date of Birth">
            <Input
              type="date"
              className="bg-gray-50"
              value={form.dob}
              onChange={e => set("dob", e.target.value)}
            />
          </InputField>

          <InputField label="Notes">
            <Textarea
              className="bg-gray-50 resize-none"
              rows={3}
              placeholder="Any specific requirements or queries"
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
            />
          </InputField>
        </div>

        {/* WA Preview */}
        {waPreview && (
          <div className="mx-6 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">WhatsApp Preview</p>
              <p className="text-[10px] text-emerald-600">Auto-sent immediately after adding</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-emerald-100 text-sm text-gray-700 whitespace-pre-line">
              {waPreview}
              <p className="text-right text-[10px] text-gray-400 mt-1">
                {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            )}
            Add Enquiry & Send WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEnquiryModal;