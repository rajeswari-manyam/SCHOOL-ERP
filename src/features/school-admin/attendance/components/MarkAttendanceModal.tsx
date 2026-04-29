import { useAttendanceStore } from "../store";

const MarkAttendanceModal = () => {
  const {
    showMarkAttendanceModal,
    markAttendanceForm,
    closeMarkAttendance,
    toggleStudentPresent,
    setMarkClass,
    setMarkSection,
  } = useAttendanceStore();

  if (!showMarkAttendanceModal) return null;

  const presentCount = markAttendanceForm.students.filter((s) => s.isPresent).length;
  const absentCount = markAttendanceForm.students.length - presentCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Mark Attendance — Web Form</h2>
            <p className="text-xs text-gray-500 mt-1">Backup method when WhatsApp is unavailable</p>
          </div>
          <button
            onClick={closeMarkAttendance}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none mt-1"
          >
            &times;
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Class
              </label>
              <select
                value={markAttendanceForm.class}
                onChange={(e) => setMarkClass(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {["Class 6A","Class 6B","Class 7A","Class 8A","Class 9A","Class 10A"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Section
              </label>
              <select
                value={markAttendanceForm.section}
                onChange={(e) => setMarkSection(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {["A","B","C"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Date
              </label>
              <input
                type="text"
                value="07 Apr 2025"
                readOnly
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Student Attendance</p>
              <p className="text-xs text-gray-500">All marked Present by default — uncheck to mark Absent</p>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Marking {presentCount} present, {absentCount} absent
            </span>
          </div>

          <div className="divide-y divide-gray-50">
            {markAttendanceForm.students.map((student) => (
              <div
                key={student.rollNo}
                className={`flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors ${
                  !student.isPresent ? "bg-red-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={student.isPresent}
                    onChange={() => toggleStudentPresent(student.rollNo)}
                    className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 w-5 font-mono">{student.rollNo}</span>
                  <span className={`text-sm font-medium ${!student.isPresent ? "text-red-600" : "text-gray-800"}`}>
                    {student.name}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    student.isPresent
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {student.isPresent ? "PRESENT" : "ABSENT"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-sm">⚠</span>
            <p className="text-xs text-amber-700 italic">
              Parent WhatsApp alerts will be sent automatically for all absent students.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={closeMarkAttendance}
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={closeMarkAttendance}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendanceModal;
