import { useRef } from "react";
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
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

  const inputBase = "w-full h-10 rounded-xl border border-gray-200 text-sm text-gray-800 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
  const labelBase = "text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full"
          style={{ maxWidth: 480, maxHeight: "90vh" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Apply for Leave</h2>
              <p className="text-xs text-gray-400 mt-0.5">Fill in the details below to submit your application</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">

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
                  <label className={labelBase}>Leave Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LEAVE_TYPES.map(type => {
                      const m = LEAVE_TYPE_META[type];
                      const selected = form.type === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => patchForm({ type })}
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                            selected
                              ? `${m.bg} ${m.border} ${m.color} shadow-sm`
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${selected ? m.dot : "bg-gray-300"}`} />
                          {m.label}
                          {selected && (
                            <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelBase}>From Date</label>
                    <input
                      type="date"
                      value={form.fromDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={e => patchForm({ fromDate: e.target.value })}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>To Date</label>
                    <input
                      type="date"
                      value={form.toDate}
                      min={form.fromDate || new Date().toISOString().slice(0, 10)}
                      onChange={e => patchForm({ toDate: e.target.value })}
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Total days auto-calc */}
                {form.fromDate && form.toDate && totalDays > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p className="text-xs font-semibold text-indigo-700">
                      Total: <span className="font-extrabold">{totalDays} working {totalDays === 1 ? "day" : "days"}</span>
                      <span className="text-indigo-400 ml-1">(Sundays excluded)</span>
                    </p>
                  </div>
                )}

                {/* Leave calendar preview */}
                {previewDays.length > 0 && (
                  <div>
                    <label className={labelBase}>Leave Preview</label>
                    <LeaveCalendarPreview days={previewDays} monthLabel={previewMonthLabel} />
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className={labelBase}>Reason <span className="text-red-400">*</span></label>
                  <textarea
                    rows={3}
                    value={form.reason}
                    onChange={e => patchForm({ reason: e.target.value })}
                    placeholder="Briefly describe the reason for your leave…"
                    className="w-full rounded-xl border border-gray-200 text-sm text-gray-800 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none placeholder-gray-300"
                  />
                  <p className="text-[10px] text-gray-300 mt-1 text-right">{form.reason.length} chars (min 10)</p>
                </div>

                {/* Medical certificate upload — conditional */}
                {needsMedicalCert && (
                  <div className="flex flex-col gap-2">
                    <label className={`${labelBase} flex items-center gap-1.5`}>
                      Medical Certificate
                      <span className="text-red-400">*</span>
                      <span className="text-gray-300 font-normal normal-case tracking-normal ml-1">(required for Sick leave ≥ 3 days)</span>
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={e => patchForm({ medicalCertFile: e.target.files?.[0] ?? null })}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
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
                    </button>
                  </div>
                )}

                {/* Substitute arrangement */}
                <div>
                  <label className={labelBase}>Substitute Arrangement</label>
                  <textarea
                    rows={2}
                    value={form.substituteArrangement}
                    onChange={e => patchForm({ substituteArrangement: e.target.value })}
                    placeholder="e.g. Mr. Praveen Kumar will cover my periods…"
                    className="w-full rounded-xl border border-gray-200 text-sm text-gray-800 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none placeholder-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!submitSuccess && (
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={!formValid || submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold transition-colors shadow-sm disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity=".3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                    </svg>
                    Submitting…
                  </>
                ) : "Submit Application"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplyLeaveModal;
