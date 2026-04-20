import {
  useStudentDashboard,
  useAttendance,
  useTodaySchedule,
  useHomeworkWeek,
  useRecentResults,
  useAnnouncements,
  useDownloadHomeworkBrief,
} from "./hooks/Usestudentdashboard";

const StudentDashboard = () => {
  // ─── Queries ─────────────────────────
  const { data, isLoading } = useStudentDashboard();
  const { data: attendance } = useAttendance();
  const { data: schedule } = useTodaySchedule();
  const { data: homework } = useHomeworkWeek();
  const { data: results } = useRecentResults();
  const { data: announcements } = useAnnouncements();
  const { download, loadingId } = useDownloadHomeworkBrief();

  if (isLoading || !data) {
    return <div className="p-6 text-sm text-gray-500">Loading dashboard...</div>;
  }

  const student = data?.student;
  const stats = data?.stats;

  return (
    <div className="p-6 space-y-6">
      {/* ─── Header ───────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {student?.name}!
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          ◉ {student?.className} • {student?.schoolName} • Roll No: {student?.rollNo}
        </p>
      </div>

      {/* ─── Stats Cards ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Today's Status */}
        <div className="p-4 bg-white rounded-xl border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Today's Status</p>
              <p className="text-lg font-bold text-green-600 mt-2">{stats?.todayStatus}</p>
              <p className="text-xs text-gray-500 mt-1">{stats?.checkedInAt}</p>
            </div>
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
          </div>
        </div>

        {/* Attendance */}
        <div className="p-4 bg-white rounded-xl border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Attendance Month</p>
              <p className="text-lg font-bold text-indigo-600 mt-2">{stats?.attendanceMonth?.percentage}%</p>
              <p className="text-xs text-gray-500 mt-1">{stats?.attendanceMonth?.month}</p>
            </div>
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">%</div>
          </div>
        </div>

        {/* Homework Due */}
        <div className="p-4 bg-white rounded-xl border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Homework Due</p>
              <p className="text-lg font-bold text-orange-500 mt-2">{stats?.homeworkDueCount} this week</p>
              <p className="text-xs text-gray-500 mt-1">Submission portal active</p>
            </div>
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">📋</div>
          </div>
        </div>

        {/* Next Exam */}
        <div className="p-4 bg-white rounded-xl border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Next Exam</p>
              <p className="text-lg font-bold text-indigo-500 mt-2">{stats?.nextExamDaysLeft} days</p>
              <p className="text-xs text-gray-500 mt-1">{stats?.nextExamName}</p>
            </div>
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">📅</div>
          </div>
        </div>
      </div>

      {/* ─── Two Column: Schedule & Attendance ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border">
          <h2 className="text-sm font-bold mb-4 text-gray-900">Today's Schedule</h2>
          
          {schedule?.slots && schedule.slots.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Period</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Time</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Subject</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slots.map((slot, i) =>
                    slot.kind === "period" ? (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3 font-medium bg-indigo-600 text-white rounded text-center">{slot.label}</td>
                        <td className="py-3 px-3 text-gray-600">{slot.startTime} - {slot.endTime}</td>
                        <td className="py-3 px-3 text-gray-900 font-medium">{slot.subject}</td>
                        <td className="py-3 px-3 text-gray-600">{slot.teacher || "—"}</td>
                      </tr>
                    ) : (
                      <tr key={i} className="border-b border-gray-100">
                        <td colSpan={4} className="py-3 px-3 text-center text-xs text-gray-500 italic bg-gray-50">
                          {slot.label}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No schedule available</p>
          )}
        </div>

        {/* Attendance Calendar */}
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="text-sm font-bold mb-4 text-gray-900">My Attendance - April</h2>
          
          {attendance ? (
            <div className="space-y-3">
              {/* Calendar Grid */}
              <div className="text-xs">
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                    <div key={day} className="text-center font-bold text-gray-600 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const isPresent = [1, 3, 9, 15, 16, 17, 22, 23, 24].includes(day);
                    const isAbsent = [2, 8, 18, 25].includes(day);
                    const isHoliday = [4, 11, 26].includes(day);
                    
                    return (
                      <div
                        key={i}
                        className={`py-2 px-1 rounded text-center font-medium text-xs cursor-pointer ${
                          isPresent
                            ? "bg-indigo-600 text-white"
                            : isAbsent
                            ? "bg-red-500 text-white"
                            : isHoliday
                            ? "bg-gray-200 text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Legend */}
              <div className="pt-3 border-t border-gray-200 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <span className="text-gray-600">Holiday</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No attendance data</p>
          )}
        </div>
      </div>

      {/* ─── Two Column: Homework & Results ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Homework Due This Week */}
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="text-sm font-bold mb-4 text-gray-900">Homework Due This Week</h2>

          {homework?.items && homework.items.length > 0 ? (
            <div className="space-y-3">
              {homework.items.map((hw) => (
                <div key={hw.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{hw.subject}</p>
                    <p className="text-xs text-gray-500">{hw.title}</p>
                  </div>
                  <button
                    onClick={() => download(hw.id, hw.subject, hw.title)}
                    className="px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                    disabled={loadingId === hw.id}
                  >
                    {loadingId === hw.id ? "..." : "⬇"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No homework due</p>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="text-sm font-bold mb-4 text-gray-900">Recent Results</h2>

          {(Array.isArray(results) && results.length > 0) ? (
            <div className="space-y-4">
              {results.slice(0, 1).map((r: any) => (
                <div key={r.id} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium">{r.examName}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{r.marksObtained}<span className="text-lg text-gray-500">/{r.totalMarks}</span></p>
                  <p className="text-xs text-gray-600 mt-2">Rank: {r.rank || "—"}</p>
                  <a href="#" className="text-xs text-indigo-600 font-medium hover:text-indigo-700 mt-3 inline-flex items-center gap-1">
                    📊 View Detailed Report
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No results available</p>
          )}
        </div>
      </div>

      {/* ─── Announcements ───────────────────────── */}
      <div className="bg-white p-5 rounded-xl border">
        <h2 className="text-sm font-bold mb-4 text-gray-900">Latest Announcements</h2>

        {(Array.isArray(announcements) && announcements.length > 0) ? (
          <div className="space-y-3">
            {announcements.slice(0, 3).map((a: any) => (
              <div key={a.id} className="flex gap-3 p-3 border-b border-gray-100 last:border-b-0">
                <div className="text-lg">📢</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Published {new Date(a.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {announcements.length > 3 && (
              <div className="text-center">
                <a href="#" className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                  VIEW ALL ANNOUNCEMENTS
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No announcements</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;