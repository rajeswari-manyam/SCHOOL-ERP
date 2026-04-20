import { useRef } from "react";
import { Upload, Check, Clock, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ApplyLeaveFormData, LeaveType } from "../types/leave.types";
import { LEAVE_TYPE_META } from "../hooks/useLeave";
import LeaveCalendarPreview from "./LeaveCalendarPreview";
import type { LeaveCalendarDay } from "../types/leave.types";

const LEAVE_TYPES: LeaveType[] = ["CASUAL", "SICK", "PERSONAL", "EMERGENCY"];

interface Props {
  open: boolean;
  onClose: () => void;
  form: ApplyLeaveFormData;
  patchForm: (patch: Partial<ApplyLeaveFormData>) => void;
  totalDays: number;
  needsMedicalCert: boolean;
  formValid: boolean;
  submitting: boolean;
  submitSuccess: boolean;
  onSubmit: () => void;
  previewDays: LeaveCalendarDay[];
  previewMonthLabel: string;
}

const UploadIcon = () => (
  <Upload size={16} className="text-current" />
);

const CheckIcon = () => (
  <Check size={40} className="text-emerald-500" strokeWidth={2.5} />
);

const ApplyLeaveModal = ({
  open, onClose,
  form, patchForm,
  totalDays, needsMedicalCert, formValid,
  submitting, submitSuccess,
  onSubmit,
  previewDays, previewMonthLabel,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Apply for Leave"
      description="Fill in the details below to submit your application"
      size="sm"
      footer={null}
    >
      <div className="flex-1 overflow-y-auto">
        {submitSuccess ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckIcon />
                </div>
                <div className="text-center">
                  <p className="text-base font-extrabold text-gray-900">Application Submitted!</p>
                  <p className="text-sm text-gray-400 mt-1">Your leave request has been sent for approval.</p>
                  <p className="text-xs text-gray-300 mt-1">You'll be notified once the principal reviews it.</p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">

                {/* Leave Type pills */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Leave Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LEAVE_TYPES.map(type => {
                      const m = LEAVE_TYPE_META[type];
                      const selected = form.type === type;
                      return (
                        <Button
                          key={type}
                          type="button"
                          onClick={() => patchForm({ type })}
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${selected ? `${m.bg} ${m.border} ${m.color} shadow-sm` : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${selected ? m.dot : "bg-gray-300"}`} />
                          {m.label}
                          {selected && (
                            <Check size={14} className="ml-auto text-current" strokeWidth={3} />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Date pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">From Date</label>
                    <Input
                      type="date"
                      value={form.fromDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={e => patchForm({ fromDate: e.target.value })}
                      inputSize="md"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">To Date</label>
                    <Input
                      type="date"
                      value={form.toDate}
                      min={form.fromDate || new Date().toISOString().slice(0, 10)}
                      onChange={e => patchForm({ toDate: e.target.value })}
                      inputSize="md"
                    />
                  </div>
                </div>

                {/* Total days auto-calc */}
                {form.fromDate && form.toDate && totalDays > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <Clock size={14} className="text-indigo-600" strokeWidth={2} />
                    <p className="text-xs font-semibold text-indigo-700">
                      Total: <span className="font-extrabold">{totalDays} working {totalDays === 1 ? "day" : "days"}</span>
                      <span className="text-indigo-400 ml-1">(Sundays excluded)</span>
                    </p>
                  </div>
                )}

                {/* Leave calendar preview */}
                {previewDays.length > 0 && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Leave Preview</label>
                    <LeaveCalendarPreview days={previewDays} monthLabel={previewMonthLabel} />
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Reason <span className="text-red-400">*</span></label>
                  <Textarea
                    rows={3}
                    value={form.reason}
                    onChange={e => patchForm({ reason: e.target.value })}
                    placeholder="Briefly describe the reason for your leave…"
                    size="md"
                  />
                  <p className="text-[10px] text-gray-300 mt-1 text-right">{form.reason.length} chars (min 10)</p>
                </div>

                {/* Medical certificate upload — conditional */}
                {needsMedicalCert && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block flex items-center gap-1.5">
                      Medical Certificate
                      <span className="text-red-400">*</span>
                      <span className="text-gray-300 font-normal normal-case tracking-normal ml-1">(required for Sick leave ≥ 3 days)</span>
                    </label>
                    <Input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={e => patchForm({ medicalCertFile: e.target.files?.[0] ?? null })}
                    />
                    <Button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      variant={form.medicalCertFile ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-all ${
                        form.medicalCertFile
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      <UploadIcon />
                      {form.medicalCertFile
                        ? `✓ ${form.medicalCertFile.name}`
                        : "Click to upload PDF / JPG / PNG"}
                    </Button>
                  </div>
                )}

                {/* Substitute arrangement */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Substitute Arrangement</label>
                  <Textarea
                    rows={2}
                    value={form.substituteArrangement}
                    onChange={e => patchForm({ substituteArrangement: e.target.value })}
                    placeholder="e.g. Mr. Praveen Kumar will cover my periods…"
                    size="md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!submitSuccess && (
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                size="md"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onSubmit}
                disabled={!formValid || submitting}
                variant="default"
                size="md"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="text-current animate-spin" strokeWidth={2.5} />
                    Submitting…
                  </>
                ) : "Submit Application"}
              </Button>
            </div>
          )}
      </Modal>
  );
};

export default ApplyLeaveModal;
