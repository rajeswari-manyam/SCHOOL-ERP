
import { useState } from "react";
import { useAttendanceToday, useAttendanceMutations } from "../hooks/useattendance.ts";
import { StudentAvatar } from "../components/StudentAvatar";

export default function DailyAttendance() {
  const { data, isLoading } = useAttendanceToday();
  const { retryAlert }      = useAttendanceMutations();

  const [selectedClassId, setSelectedClassId] = useState<string | null>("6A");
  const [panelOpen,        setPanelOpen]       = useState(true);

  const { data: classDetail, isLoading: detailLoading } = useClassDetail(
    selectedClassId ?? ""
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    );
  }

  const rows = data?.rows ?? [];

  const handleView = (id: string) => {
    setSelectedClassId(id);
    setPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Academic Year 2024–25</span>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search records…"
              className="bg-slate-100 text-sm rounded-lg pl-8 pr-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">A</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content */}
        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${panelOpen ? "mr-[340px]" : ""}`}>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Daily Attendance</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">{data?.date ?? "—"}</p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Campus Presence</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-slate-800">94.2%</span>
                <span className="text-sm font-semibold text-emerald-500 mb-1">↑2.1%</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Overall attendance across all grades</p>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "94.2%" }} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border-l-4 border-red-400 border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pending Alerts</p>
              <span className="text-4xl font-black text-red-500">12</span>
              <p className="text-xs text-slate-500 mt-2">Failed SMS/WhatsApp notifications</p>
              <button className="mt-3 text-xs font-semibold text-red-500 hover:text-red-600">View all →</button>
            </div>
          </div>

          {/* Class Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Class Details</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</p>
            </div>
            <div className="divide-y divide-slate-100">
              {rows.map((cls) => (
                <div key={cls.id} className={`flex items-center justify-between px-5 py-4 transition-colors ${selectedClassId === cls.cls && panelOpen ? "bg-indigo-50" : "hover:bg-slate-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold ${selectedClassId === cls.cls && panelOpen ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {cls.cls}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Class {cls.cls}</p>
                      <p className="text-xs text-slate-400">
                        {cls.present !== null ? (
                          <>
                            <span className="text-emerald-600 font-medium">{cls.present} Present</span>
                            {" • "}
                            <span className={cls.absent! > 0 ? "text-red-500 font-medium" : "text-slate-400"}>{cls.absent} Absent</span>
                          </>
                        ) : (
                          <span className="text-orange-500 font-medium">Not yet marked</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {cls.status === "MARKED" ? (
                    <button
                      onClick={() => handleView(cls.cls)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${selectedClassId === cls.cls && panelOpen ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"}`}
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {panelOpen && (
          <div className="fixed right-0 top-0 bottom-0 w-[340px] bg-white border-l border-slate-200 shadow-xl flex flex-col z-20">
            <div className="px-5 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {classDetail ? `${classDetail.label} — ${data?.date ?? ""}` : "Loading…"}
                  </h3>
                  {classDetail && (
                    <p className="text-xs text-slate-500 mt-0.5">Teacher: {classDetail.teacher}</p>
                  )}
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              {classDetail && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    WhatsApp Delivery
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Marked at: {classDetail.markedAt}
                  </span>
                </div>
              )}
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {detailLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
                      <div className="h-2.5 w-16 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : (
                (classDetail?.students ?? []).map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${!student.present ? "bg-red-50" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <StudentAvatar name={student.name} size={36} />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{student.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-xs text-slate-400">Roll: {student.roll}</p>
                          {student.alertStatus === "delivered" && (
                            <span className="text-[10px] text-slate-400">✅ Alert Delivered</span>
                          )}
                          {student.alertStatus === "failed" && (
                            <span className="text-[10px] text-red-400 flex items-center gap-1">
                              ⚠️ Alert Failed
                              <button
                                onClick={() => retryAlert.mutate({ studentId: student.id, classId: selectedClassId ?? "" })}
                                disabled={retryAlert.isPending}
                                className="text-indigo-500 font-semibold hover:text-indigo-700 disabled:opacity-60"
                              >
                                Retry
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest ${student.present ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {student.present ? "PRESENT" : "ABSENT"}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer Stats */}
            {classDetail && (
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="grid grid-cols-3 text-center mb-4">
                  <div>
                    <p className="text-xl font-black text-slate-800">{classDetail.present}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Present</p>
                  </div>
                  <div className="border-x border-slate-100">
                    <p className="text-xl font-black text-red-500">{classDetail.absent}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Absent</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-amber-500">
                      {classDetail.students.filter((s) => s.alertStatus === "delivered").length}/
                      {classDetail.students.filter((s) => s.alertStatus).length}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Alerts</p>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl font-bold text-sm text-white bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all shadow-md shadow-amber-200 mb-2">
                  Resend Failed Alerts
                </button>
                <button className="w-full py-3 rounded-xl font-bold text-sm text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors">
                  Edit Attendance
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
