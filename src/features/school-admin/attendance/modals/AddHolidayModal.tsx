// attendance/modals/AddHolidayModal.tsx
// Image 6 — "Add Holiday" modal

import { useState } from "react";
import { useAddHoliday } from "../hooks/useAttendance";
import type { HolidayType } from "../types/attendance.types";

interface AddHolidayModalProps {
  open: boolean;
  onClose: () => void;
}

const HOLIDAY_TYPES: { value: HolidayType; label: string }[] = [
  { value: "NATIONAL_HOLIDAY", label: "National Holiday" },
  { value: "PUBLIC_HOLIDAY",   label: "Public Holiday"   },
  { value: "SCHOOL_EVENT",     label: "School Event"     },
  { value: "SCHOOL_DAY",       label: "School Day"       },
];

const iCls = "w-full h-12 px-4 rounded-2xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition placeholder:text-gray-400";

const AddHolidayModal = ({ open, onClose }: AddHolidayModalProps) => {
  const { mutate, isPending } = useAddHoliday();

  const [name,     setName]     = useState("");
  const [date,     setDate]     = useState("");
  const [type,     setType]     = useState<HolidayType>("NATIONAL_HOLIDAY");
  const [repeat,   setRepeat]   = useState(true);
  const [notes,    setNotes]    = useState("");
  const [notifyWA, setNotifyWA] = useState(true);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Holiday name is required";
    if (!date)        e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    mutate({ name, date, type, repeatAnnually: repeat, notes }, { onSuccess: () => { onClose(); resetForm(); } });
  };

  const resetForm = () => {
    setName(""); setDate(""); setType("NATIONAL_HOLIDAY"); setRepeat(true); setNotes(""); setErrors({});
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-7 pb-5 flex-shrink-0">
            <h2 className="text-xl font-extrabold text-gray-900">Add Holiday</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-xl hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 px-7 space-y-5">
            {/* Holiday Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Holiday Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                placeholder="e.g. Independence Day"
                className={`${iCls} ${errors.name ? "border-red-300 focus:ring-red-300" : ""}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: "" })); }}
                className={`${iCls} ${errors.date ? "border-red-300 focus:ring-red-300" : ""}`}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Holiday Type + Repeat toggle */}
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Holiday Type *</label>
                <div className="relative">
                  <select
                    className={`${iCls} pr-10 cursor-pointer appearance-none`}
                    value={type}
                    onChange={(e) => setType(e.target.value as HolidayType)}
                  >
                    {HOLIDAY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Repeat Annually?</label>
                <div className="flex items-center gap-3 h-12">
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => setRepeat((v) => !v)}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${repeat ? "bg-indigo-600" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${repeat ? "left-[26px]" : "left-0.5"}`} />
                  </button>
                  <span className="text-sm font-semibold text-gray-700">{repeat ? "On" : "Off"}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional: any additional notes for staff"
                className={`${iCls} h-auto py-3.5 resize-none leading-relaxed`}
              />
            </div>

            {/* Info box */}
            <div className="bg-gray-50 rounded-2xl px-4 py-3.5">
              <p className="text-sm text-gray-500 leading-relaxed">
                This holiday will appear on the calendar and attendance will not be expected on this day.
              </p>
            </div>

            {/* Notify WA checkbox */}
            <label className="flex items-center gap-3 cursor-pointer pb-2">
              <div
                onClick={() => setNotifyWA((v) => !v)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${notifyWA ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"}`}
              >
                {notifyWA && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-800">Notify all teachers via WhatsApp</span>
              {/* WA icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </label>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-t border-gray-100">
            <button onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-700 text-white text-sm font-bold hover:bg-indigo-800 disabled:opacity-60 transition-colors shadow-sm"
            >
              {isPending && (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
              {isPending ? "Saving…" : "Save Holiday"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddHolidayModal;
