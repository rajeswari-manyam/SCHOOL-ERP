import { useState } from "react";
import { useAttendanceStore } from "../store";

const AddHolidayModal = () => {
  const { showAddHolidayModal, closeAddHoliday } = useAttendanceStore();
  const [holidayName, setHolidayName] = useState("");
  const [date, setDate] = useState("");
  const [holidayType, setHolidayType] = useState("National Holiday");
  const [repeatAnnually, setRepeatAnnually] = useState(true);
  const [notes, setNotes] = useState("");
  const [notifyTeachers, setNotifyTeachers] = useState(true);

  if (!showAddHolidayModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add Holiday</h2>
          <button
            onClick={closeAddHoliday}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Holiday Name */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Holiday Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              placeholder="e.g. Independence Day"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Holiday Type + Repeat */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Holiday Type <span className="text-red-500">*</span>
              </label>
              <select
                value={holidayType}
                onChange={(e) => setHolidayType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option>National Holiday</option>
                <option>Public Holiday</option>
                <option>School Event</option>
                <option>School Day</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Repeat Annually?
              </label>
              <div className="flex items-center gap-3 mt-2.5">
                <button
                  onClick={() => setRepeatAnnually(!repeatAnnually)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    repeatAnnually ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      repeatAnnually ? "translate-x-5.5 left-0.5" : "left-0.5"
                    }`}
                    style={{ transform: repeatAnnually ? "translateX(20px)" : "translateX(0)" }}
                  />
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  {repeatAnnually ? "On" : "Off"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional: any additional notes for staff"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>

          {/* Info Banner */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
            This holiday will appear on the calendar and attendance will not be expected on this day.
          </div>

          {/* Notify Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyTeachers}
              onChange={(e) => setNotifyTeachers(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-600"
            />
            <span className="text-sm text-gray-700">
              Notify all teachers via WhatsApp{" "}
              <span className="text-green-600">📱</span>
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={closeAddHoliday}
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={closeAddHoliday}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Save Holiday
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHolidayModal;
