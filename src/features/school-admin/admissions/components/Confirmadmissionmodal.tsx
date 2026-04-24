import { useState } from "react";
import type { Admission, ConfirmAdmissionFormData } from "../types/admissions.types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SECTIONS = ["A", "B", "C", "D", "E"];

interface Props {
  admission: Admission;
  onClose: () => void;
  onConfirm: (data: ConfirmAdmissionFormData) => Promise<void>;
  schoolName?: string;
  principalName?: string;
}

const admNoPreview = `ADM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

const ConfirmAdmissionModal = ({
  admission,
  onClose,
  onConfirm,
  schoolName = "Your School",
  principalName = "Principal",
}: Props) => {
  const [form, setForm] = useState<ConfirmAdmissionFormData>({
    section: "A",
    rollNumber: "",
    firstDayOfSchool: "",
    annualFee: "18500",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof ConfirmAdmissionFormData, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleConfirm = async () => {
    if (!form.section || !form.firstDayOfSchool) return;
    setSaving(true);
    try {
      await onConfirm(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const waMessage = `Welcome to ${schoolName}! ${admission.studentName} has been admitted to Class ${admission.classApplied}${form.section ? form.section : ""}. Admission No: ${admNoPreview}. First day: ${form.firstDayOfSchool || "TBD"}. Fee: ₹${Number(form.annualFee || 18500).toLocaleString("en-IN")}/year. We look forward to seeing you!\n\n— ${principalName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-base font-extrabold text-gray-900">
            Confirm Admission — {admission.studentName}
          </h2>
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

        <div className="p-6 space-y-5">
          {/* Summary row */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Student</p>
              <p className="font-semibold text-gray-800 mt-0.5">{admission.studentName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Parent</p>
              <p className="font-semibold text-gray-800 mt-0.5">{admission.parentName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Class</p>
              <p className="font-semibold text-gray-800 mt-0.5">Class {admission.classApplied}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Admission No</p>
              <p className="font-semibold text-indigo-600 mt-0.5">{admNoPreview}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Annual Fee</p>
              <p className="font-semibold text-gray-800 mt-0.5">₹{Number(form.annualFee || 18500).toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Enquiry Date</p>
              <p className="font-semibold text-gray-800 mt-0.5">{admission.enquiryDate}</p>
            </div>
          </div>

          {/* Section & Roll */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Section <span className="text-red-500">*</span></label>
              <Select
                className="bg-gray-50"
                options={SECTIONS.map(s => ({ label: s, value: s }))}
                value={form.section}
                onValueChange={value => set("section", value)}
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Roll Number</label>
              <Input
                className="bg-gray-50"
                placeholder="e.g. 36"
                value={form.rollNumber}
                onChange={e => set("rollNumber", e.target.value)}
              />
            </div>
          </div>

          {/* First day & fee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">First Day of School <span className="text-red-500">*</span></label>
              <Input
                type="date"
                className="bg-gray-50"
                value={form.firstDayOfSchool}
                onChange={e => set("firstDayOfSchool", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Annual Fee (₹)</label>
              <Input
                className="bg-gray-50"
                placeholder="18500"
                value={form.annualFee}
                onChange={e => set("annualFee", e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Notes</label>
            <Textarea
              className="bg-gray-50 resize-none"
              rows={2}
              placeholder="Add optional admission notes..."
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
            />
          </div>

          {/* WA Preview */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-2">Welcome WhatsApp Preview</p>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-emerald-100 text-sm text-gray-700 whitespace-pre-line">
              {waMessage}
              <p className="text-right text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1">
                {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!form.section || !form.firstDayOfSchool || saving}
            className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Confirm & Send Welcome WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAdmissionModal;