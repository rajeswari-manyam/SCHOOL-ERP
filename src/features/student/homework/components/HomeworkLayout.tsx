import { useState } from "react";
import { getCurrentWeekDays } from "../hooks/useHomework";

type Tab = "week" | "all" | "materials";

const tabs = [
  { key: "week"      as Tab, label: "This Week",       icon: "📅" },
  { key: "all"       as Tab, label: "All Homework",    icon: "📋" },
  { key: "materials" as Tab, label: "Study Materials", icon: "📚" },
];

export const HomeworkLayout = ({ children }: { children?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<Tab>("week");


  const weekDays = getCurrentWeekDays();
  const today    = new Date();
  const defaultIdx = weekDays.findIndex(
    (d) => d.date === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear()
  );
  const [activeDayIdx, setActiveDayIdx] = useState(defaultIdx >= 0 ? defaultIdx : 0);

  const monthYear = weekDays[0].fullDate.toLocaleDateString("en-IN", {
    month: "long", year: "numeric",
  });

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 min-h-screen bg-gray-50">

      {/* ── SIDEBAR ── */}
      <aside className="w-full md:w-48 flex-shrink-0 flex flex-col gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-2 md:p-3 shadow-sm">
          <p className="hidden md:block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
            Homework
          </p>
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap
                  transition-colors w-full md:w-auto
                  ${activeTab === tab.key
                    ? "bg-indigo-50 text-indigo-700 font-medium border border-indigo-100"
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="hidden md:block bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-700 leading-relaxed">
          <p className="font-semibold text-indigo-900 mb-1">💡 Tip</p>
          <p>Complete your English essay today to stay ahead of the deadline!</p>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col gap-3 min-w-0">

        {/* Real calendar strip */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 md:p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              🗓 {monthYear}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {weekDays.map((d, i) => {
              const isActive = i === activeDayIdx;
              const isToday  =
                d.date  === today.getDate() &&
                d.month === today.getMonth() &&
                d.year  === today.getFullYear();

              return (
                <button
                  key={`${d.year}-${d.month}-${d.date}`}
                  onClick={() => setActiveDayIdx(i)}
                  className={`min-w-[70px] flex flex-col items-center gap-1 py-2 rounded-lg transition-colors
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

        {/* Content */}
        <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm p-3 md:p-4">
          {children ?? (
            <div className="flex items-center justify-center h-full min-h-[250px] text-gray-400 text-sm text-center">
              Your homework content goes here
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeworkLayout;
