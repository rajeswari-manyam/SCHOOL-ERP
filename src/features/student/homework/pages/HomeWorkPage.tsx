import { useState } from "react";
import { useHomework } from "../hooks/Usehomework";
import { HomeworkCard } from "../components/HomeWorkCard";
import { StudyMaterialCard } from "../components/StudyMaterialCard";
import SubmitHomeworkModal from "../components/SubmitHomeworkModal";

type Tab = "week" | "all" | "materials";

const TABS = [
  { key: "week" as Tab, label: "This Week", icon: "📅" },
  { key: "all" as Tab, label: "All Homework", icon: "📋" },
  { key: "materials" as Tab, label: "Study Materials", icon: "📚" },
];

const DAYS = [
  { label: "Mon", date: 7 },
  { label: "Tue", date: 8 },
  { label: "Wed", date: 9 },
  { label: "Thu", date: 10 },
  { label: "Fri", date: 11 },
];

export const HomeworkPage = () => {
  const [activeDay, setActiveDay] = useState(7);

  const {
    activeTab,
    setActiveTab,
    homework,
    thisWeekHomework,
    materials,
    submitModalOpen,
    selectedHomework,
    openSubmitModal,
    closeSubmitModal,
    handleSubmit,
  } = useHomework();

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">My Homework — Class 10A</h1>
      <p className="text-sm text-gray-400 mb-6">Academic Year 2024-25</p>

     <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

        {/* ── SIDEBAR ── */}
      <aside className="w-full lg:w-48 flex-shrink-0 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">  
          {/* Tabs Card */}
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
                    ${
                      activeTab === tab.key
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

          {/* Tip Card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-700 leading-relaxed">
            <p className="font-semibold text-indigo-900 mb-1">💡 Tip</p>
            <p>Complete your English essay today to stay ahead of the deadline!</p>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Calendar Card — top of main */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                🗓 May 2026
              </span>
              <span className="text-xs text-gray-400">Week 19</span>
            </div>
           <div className="flex gap-2 overflow-x-auto"> 
              {DAYS.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setActiveDay(d.date)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors
                    ${
                      activeDay === d.date
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide
                      ${activeDay === d.date ? "text-indigo-200" : "text-gray-400"}`}
                  >
                    {d.label}
                  </span>
                  <span className="text-sm font-medium">{d.date}</span>
                </button>
              ))}
            </div>
          </div>

          {/* THIS WEEK */}
          {activeTab === "week" && (
            <div className="space-y-3">
              {thisWeekHomework.map((hw) => (
                <HomeworkCard key={hw.id} item={hw} onSubmit={openSubmitModal} />
              ))}
            </div>
          )}

          {/* ALL HOMEWORK */}
          {activeTab === "all" && (
            <div className="space-y-3">
              {homework.map((hw) => (
                <HomeworkCard key={hw.id} item={hw} onSubmit={openSubmitModal} />
              ))}
            </div>
          )}

          {/* STUDY MATERIALS */}
          {activeTab === "materials" && (
            <>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> 
                {materials.map((m) => (
                  <StudyMaterialCard key={m.id} item={m} />
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Need something else?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    If you cannot find a specific study material, please contact
                    your subject teacher or check the departmental library.
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

      {/* SUBMIT MODAL */}
      <SubmitHomeworkModal
        open={submitModalOpen}
        onClose={closeSubmitModal}
        onSubmit={() => {
          if (selectedHomework) handleSubmit(selectedHomework.id);
        }}
        assignment={
          selectedHomework
            ? {
                title: selectedHomework.title,
                subject: selectedHomework.subject,
                className: "10A",
                dueLabel: selectedHomework.dueDate,
                assignedBy: selectedHomework.assignedBy,
              }
            : undefined
        }
      />
    </div>
  );
};