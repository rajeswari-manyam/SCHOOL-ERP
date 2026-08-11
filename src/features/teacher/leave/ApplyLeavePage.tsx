import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Check, Clock, Loader2, AlertCircle, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLeave, LEAVE_TYPE_META } from "./hooks/useLeave";
import LeaveCalendarPreview from "./components/LeaveCalendarPreview";
import type { LeaveType } from "./types/leave.types";

// Reused as-is by other staff portals (e.g. accountant) — stay under
// whichever portal prefix this page is currently mounted under.
const usePortalBase = () => {
  const { pathname } = useLocation();
  return pathname.startsWith("/accountant") ? "/accountant" : "/teacher";
};

const ApplyLeavePage = () => {
  const navigate = useNavigate();
  const portalBase = usePortalBase();
  const goBackToLeave = () => navigate(`${portalBase}/leave`);

  const fileRef = useRef<HTMLInputElement>(null);

  const {
    balances,
    form, patchForm,
    totalDays, needsMedicalCert, formValid,
    submitting, submitSuccess, submitError,
    submitLeave,
    previewDays, previewMonthLabel,
  } = useLeave();

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-3 sm:px-6 pt-2 pb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBackToLeave} className="hover:text-gray-600 transition-colors">
          Leave
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Apply for Leave</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarPlus size={16} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">Apply for Leave</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Fill in the details below to submit your application
              </p>
            </div>
          </div>
          <Button onClick={goBackToLeave} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-6">
          {submitSuccess ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <Check size={40} className="text-emerald-500" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="text-base font-extrabold text-gray-900">Application Submitted!</p>
                <p className="text-sm text-gray-400 mt-1">Your leave request has been sent for approval.</p>
                <p className="text-xs text-gray-300 mt-1">You'll be notified once the principal reviews it.</p>
              </div>
              <button
                onClick={goBackToLeave}
                className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">

              {/* Leave Type pills — 2-col grid on all sizes */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Leave Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    const types: LeaveType[] = Array.isArray(balances) && balances.length > 0
                      ? balances.map(b => b.type)
                      : (Object.keys(LEAVE_TYPE_META) as LeaveType[]);
                    const isTrailingOrphan = (i: number) => types.length % 2 === 1 && i === types.length - 1;
                    return types.map((type, i) => {
                      const m = LEAVE_TYPE_META[type];
                      if (!m) return null;
                      const selected = form.type === type;
                      return (
                        <Button
                          key={type}
                          type="button"
                          onClick={() => patchForm({ type })}
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          className={[
                            "flex items-center gap-2.5 px-4 rounded-xl text-sm font-semibold transition-all text-left",
                            "h-11 sm:h-10",
                            isTrailingOrphan(i) ? "col-span-2" : "",
                            selected
                              ? `${m.bg} ${m.border} ${m.color} shadow-sm`
                              : "border-gray-200 bg-[#EFF4FF] text-gray-600 hover:border-gray-300",
                          ].join(" ")}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${selected ? m.dot : "bg-gray-300"}`} />
                          {m.label}
                          {selected && (
                            <Check size={14} className="ml-auto text-current" strokeWidth={3} />
                          )}
                        </Button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Date pickers — side by side on all sizes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                    From Date
                  </label>
                  <Input
                    type="date"
                    value={form.fromDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => patchForm({ fromDate: e.target.value })}
                    inputSize="md"
                    className="h-11 sm:h-9 bg-[#EFF4FF]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                    To Date
                  </label>
                  <Input
                    type="date"
                    value={form.toDate}
                    min={form.fromDate || new Date().toISOString().slice(0, 10)}
                    onChange={(e) => patchForm({ toDate: e.target.value })}
                    inputSize="md"
                    className="h-11 sm:h-9 bg-[#EFF4FF]"
                  />
                </div>
              </div>

              {/* Total days auto-calc */}
              {form.fromDate && form.toDate && totalDays > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <Clock size={14} className="text-indigo-600 shrink-0" strokeWidth={2} />
                  <p className="text-xs font-semibold text-indigo-700">
                    Total:{" "}
                    <span className="font-extrabold">
                      {totalDays} working {totalDays === 1 ? "day" : "days"}
                    </span>
                    <span className="text-indigo-400 ml-1">(Sundays excluded)</span>
                  </p>
                </div>
              )}

              {/* Leave calendar preview */}
              {previewDays.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                    Leave Preview
                  </label>
                  <LeaveCalendarPreview days={previewDays} monthLabel={previewMonthLabel} />
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Reason <span className="text-red-400">*</span>
                </label>
                <Textarea
                  rows={3}
                  value={form.reason}
                  onChange={(e) => patchForm({ reason: e.target.value })}
                  placeholder="Briefly describe the reason for your leave…"
                  size="md"
                  className="bg-[#EFF4FF]"
                />
                <p className="text-[10px] text-gray-300 mt-1 text-right">
                  {form.reason.length} chars (min 10)
                </p>
              </div>

              {/* Medical certificate upload — conditional */}
              {needsMedicalCert && (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block">
                    Medical Certificate{" "}
                    <span className="text-red-400">*</span>
                    <span className="text-gray-300 font-normal normal-case tracking-normal ml-1">
                      (required for Sick leave ≥ 3 days)
                    </span>
                  </label>
                  <Input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) =>
                      patchForm({ medicalCertFile: e.target.files?.[0] ?? null })
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    variant={form.medicalCertFile ? "default" : "outline"}
                    size="sm"
                    className={[
                      "flex items-center gap-2 px-4 rounded-xl border-2 border-dashed text-sm font-semibold transition-all",
                      "h-12 sm:h-10",
                      form.medicalCertFile
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-[#EFF4FF] text-gray-500 hover:border-indigo-300 hover:text-indigo-600",
                    ].join(" ")}
                  >
                    <Upload size={16} className="text-current shrink-0" />
                    <span className="truncate">
                      {form.medicalCertFile
                        ? `✓ ${form.medicalCertFile.name}`
                        : "Click to upload PDF / JPG / PNG"}
                    </span>
                  </Button>
                </div>
              )}

              {/* Substitute arrangement */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Substitute Arrangement
                </label>
                <Textarea
                  rows={2}
                  value={form.substituteArrangement}
                  onChange={(e) => patchForm({ substituteArrangement: e.target.value })}
                  placeholder="e.g. Mr. Praveen Kumar will cover my periods…"
                  size="md"
                  className="bg-[#EFF4FF]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitSuccess && (
          <div className="shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50/50 sm:px-6">
            {submitError && (
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                <span>{submitError}</span>
              </div>
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                onClick={goBackToLeave}
                variant="outline"
                size="md"
                className="w-full h-11 rounded-xl text-sm font-semibold sm:w-auto sm:h-9 sm:px-5"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={submitLeave}
                disabled={!formValid || submitting}
                variant="default"
                size="md"
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold sm:w-auto sm:h-9 sm:px-5"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="text-current animate-spin" strokeWidth={2.5} />
                    Submitting…
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyLeavePage;
