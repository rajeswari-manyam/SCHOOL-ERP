import { useHomework } from "../hooks/useHomework";
import { HomeworkCard } from "../components/HomeWorkCard";
import { StudyMaterialCard } from "../components/StudyMaterialCard";
import SubmitHomeworkModal from "../components/SubmitHomeworkModal";
import { useAuthStore } from "@/store/authStore";

type Tab = "week" | "all" | "materials";

const TABS = [
  { key: "week"      as Tab, label: "This Week",       icon: "📅" },
  { key: "all"       as Tab, label: "All Homework",    icon: "📋" },
  { key: "materials" as Tab, label: "Study Materials", icon: "📚" },
];

export const HomeworkPage = () => {
  // ── Pull real UUIDs from auth store ─────────────────────────────────────
  const authUser = useAuthStore((s) => s.user);
  const classId   = (authUser as any)?.class_id   ?? (authUser as any)?.classId   ?? "";
  const sectionId = (authUser as any)?.section_id ?? (authUser as any)?.sectionId ?? "";

  const {
    activeTab, setActiveTab,
    homework,
    thisWeekHomework,
    materials,
    loading, error, refetch,
    weekDays,
    selectedDay, setSelectedDay,
    submitModalOpen,
    selectedHomework,
    openSubmitModal,
    closeSubmitModal,
    handleSubmit,
  } = useHomework({ classId, sectionId });

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading homework…</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-red-500 font-medium">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-semibold bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Month/year label from the real week ────────────────────────────────────
  const firstDay  = weekDays[0].fullDate;
  const monthYear = firstDay.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">My Homework</h1>
      <p className="text-sm text-gray-400 mb-6">Academic Year 2024-25</p>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

        {/* ── SIDEBAR ── */}
        <aside className="w-full lg:w-48 flex-shrink-0 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
          <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
              Homework
            </p>
            <nav className="flex lg:flex-col gap-2 lg:gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left w-full
                    ${activeTab === tab.key
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-700 leading-relaxed">
            <p className="font-semibold text-indigo-900 mb-1">💡 Tip</p>
            <p>Complete your pending assignments to stay ahead of the deadline!</p>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* ── Real calendar strip — Mon–Fri of current week ── */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                🗓 {monthYear}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {weekDays.map((d) => {
                const isActive =
                  d.date  === selectedDay.date &&
                  d.month === selectedDay.month &&
                  d.year  === selectedDay.year;

                const today = new Date();
                const isToday =
                  d.date  === today.getDate() &&
                  d.month === today.getMonth() &&
                  d.year  === today.getFullYear();

                return (
                  <button
                    key={`${d.year}-${d.month}-${d.date}`}
                    onClick={() => setSelectedDay(d)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors
                      ${isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                  >
                    <span className={`text-[10px] font-semibold uppercase tracking-wide
                      ${isActive ? "text-indigo-200" : "text-gray-400"}`}>
                      {d.label}
                    </span>
                    <span className="text-sm font-medium">{d.date}</span>
                    <span className={`w-1 h-1 rounded-full
                      ${isActive ? "bg-white/60" : isToday ? "bg-indigo-500" : "bg-transparent"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── THIS WEEK ── */}
          {activeTab === "week" && (
            <div className="space-y-3">
              {thisWeekHomework.length === 0
                ? <p className="text-sm text-gray-400 p-4">No homework from this day onwards 🎉</p>
                : thisWeekHomework.map((hw) => (
                    <HomeworkCard key={hw.id} item={hw} onSubmit={openSubmitModal} />
                  ))
              }
            </div>
          )}

          {/* ── ALL HOMEWORK ── */}
          {activeTab === "all" && (
            <div className="space-y-3">
              {homework.length === 0
                ? <p className="text-sm text-gray-400 p-4">No homework found.</p>
                : homework.map((hw) => (
                    <HomeworkCard key={hw.id} item={hw} onSubmit={openSubmitModal} />
                  ))
              }
            </div>
          )}

          {/* ── STUDY MATERIALS ── */}
          {activeTab === "materials" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((m) => (
                  <StudyMaterialCard key={m.id} item={m} />
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Need something else?</p>
                  <p className="text-xs text-gray-500 mt-1">
                    If you cannot find a specific study material, please contact your subject teacher or check the departmental library.
                  </p>
                </div>
                <button className="flex-shrink-0 text-xs font-semibold border border-indigo-200 bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition">
                  Request Material
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── SUBMIT MODAL ── */}
      <SubmitHomeworkModal
        open={submitModalOpen}
        onClose={closeSubmitModal}
        onSubmit={() => { if (selectedHomework) handleSubmit(selectedHomework.id); }}
        assignment={
          selectedHomework
            ? {
                title:      selectedHomework.title,
                subject:    selectedHomework.subject,
                className:  classId,
                dueLabel:   selectedHomework.dueDate,
                assignedBy: selectedHomework.assignedBy,
              }
            : undefined
        }
      />
    </div>
  );
};