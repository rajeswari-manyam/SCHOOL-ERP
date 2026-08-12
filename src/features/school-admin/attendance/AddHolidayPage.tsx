// school-admin/attendance/AddHolidayPage.tsx
// Full-page version of the former AddHolidayModal popup — same data/logic,
// just rendered as a routed page instead of a fixed overlay.
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { createHoliday } from "@/services/holidays.api";
import { useQueryClient } from "@tanstack/react-query";
import { attendanceKeys } from "./hooks/useAttendance";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const holidayTypeOptions = [
  { label: "Public",     value: "public"     },
  { label: "Optional",   value: "optional"   },
  { label: "Restricted", value: "restricted" },
];

// Native <input type="date"> only accepts min/max in exact "yyyy-mm-dd"
// form — the API's startDate/endDate may come back as a full ISO timestamp
// (e.g. "2025-06-01T00:00:00.000Z"), so slice down to the date portion.
const toDateInputValue = (value?: string | null): string | undefined =>
  value ? value.slice(0, 10) : undefined;

const AddHolidayPage = () => {
  const navigate = useNavigate();
  const goBackToHolidays = () => navigate("/schooladmin/holidays");
  const queryClient = useQueryClient();
  const { activeYear } = useAcademicYears();
  const yearMin = toDateInputValue(activeYear?.startDate);
  const yearMax = toDateInputValue(activeYear?.endDate);
  const [holidayName,     setHolidayName]     = useState("");
  const [fromDate,        setFromDate]        = useState("");
  const [toDate,          setToDate]          = useState("");
  const [holidayType,     setHolidayType]     = useState("public");
  const [repeatAnnually,  setRepeatAnnually]  = useState(true);
  const [notes,           setNotes]           = useState("");
  const [notifyTeachers,  setNotifyTeachers]  = useState(true);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [success,         setSuccess]         = useState<string | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const isFormValid = holidayName.trim() && fromDate.trim() && toDate.trim() && holidayType.trim();

  const handleSave = async () => {
    if (!isFormValid) return;

    const schoolCode =
      import.meta.env.VITE_SCHOOL_CODE || localStorage.getItem("schoolcode");
    if (!schoolCode) {
      setError("School code not found. Please log in again.");
      return;
    }
    if (!activeYear?.id) {
      setError("Academic year not loaded. Please refresh the page.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        holidayname: holidayName.trim(),
        from_date:   fromDate,
        to_date:     toDate,
        type:        holidayType,
        note:        notes.trim() || holidayType,
        school_code: schoolCode,
        academicYearId: activeYear.id,
      };

      const result = await createHoliday(payload);

      queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: "all" });
      setSuccess(result.message || "Holiday created successfully.");
      successTimerRef.current = setTimeout(() => {
        goBackToHolidays();
      }, 1200);
    } catch (err: any) {
      console.error(
        "createHoliday failed:",
        err?.response?.status,
        JSON.stringify(err?.response?.data),
      );
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create holiday. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button type="button" onClick={goBackToHolidays} className="hover:text-indigo-600 transition-colors font-medium">
          Holidays
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Add Holiday</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarPlus size={16} />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Add Holiday</h1>
          </div>
          <Button onClick={goBackToHolidays} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <Label required className="block mb-1">Holiday Name</Label>
            <Input
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              placeholder="e.g. Independence Day"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required className="block mb-1">From Date</Label>
              <Input
                type="date"
                value={fromDate}
                min={yearMin}
                max={yearMax}
                onChange={(e) => { setFromDate(e.target.value); if (toDate && e.target.value > toDate) setToDate(e.target.value); }}
                disabled={loading}
              />
            </div>
            <div>
              <Label required className="block mb-1">To Date</Label>
              <Input
                type="date"
                value={toDate}
                min={fromDate || yearMin}
                max={yearMax}
                onChange={(e) => setToDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required className="block mb-1">Holiday Type</Label>
              <Select
                value={holidayType}
                options={holidayTypeOptions}
                onValueChange={(value) => setHolidayType(value)}
                placeholder="Select holiday type"
                disabled={loading}
              />
            </div>
            <div>
              <Label className="block mb-1">Repeat Annually?</Label>
              <div className="flex items-center gap-3 mt-2.5">
                <Switch
                  checked={repeatAnnually}
                  onCheckedChange={setRepeatAnnually}
                  disabled={loading}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {repeatAnnually ? "On" : "Off"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="block mb-1">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional: any additional notes for staff"
              size="sm"
              disabled={loading}
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
            This holiday will appear on the calendar and attendance will not be
            expected on this day.
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={notifyTeachers}
              onCheckedChange={setNotifyTeachers}
              disabled={loading}
            />
            <span className="text-sm text-gray-700">
              Notify all teachers via WhatsApp{" "}
              <span className="text-green-600">📱</span>
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              <span className="text-red-500 text-base">⚠</span>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              <span className="text-green-500 text-base">✓</span>
              {success}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <Button
            onClick={goBackToHolidays}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto"
            disabled={loading || !isFormValid}
          >
            {loading ? "Saving..." : "Save Holiday"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddHolidayPage;
