import { useState } from "react";

type Tab = "week" | "all" | "materials";

interface Day {
  label: string;
  date: number;
}

const days: Day[] = [
  { label: "Mon", date: 7 },
  { label: "Tue", date: 8 },
  { label: "Wed", date: 9 },
  { label: "Thu", date: 10 },
  { label: "Fri", date: 11 },
];

const tabs = [
  { key: "week" as Tab, label: "This Week", icon: "📅" },
  { key: "all" as Tab, label: "All Homework", icon: "📋" },
  { key: "materials" as Tab, label: "Study Materials", icon: "📚" },
];

export const HomeworkLayout = ({ children }: { children?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<Tab>("materials");
  const [activeDay, setActiveDay] = useState<number>(7);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 min-h-screen bg-gray-50">

      {/* ── TOP / SIDEBAR (mobile horizontal tabs) ── */}
      <aside className="w-full md:w-48 flex-shrink-0 flex flex-col gap-3">

        {/* Tabs */}
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
                  ${
                    activeTab === tab.key
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

        {/* Tip card (hidden on very small screens if needed) */}
        <div className="hidden md:block bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-700 leading-relaxed">
          <p className="font-semibold text-indigo-900 mb-1">💡 Tip</p>
          <p>Complete your English essay today to stay ahead of the deadline!</p>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col gap-3 min-w-0">

        {/* Calendar */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 md:p-4 shadow-sm">

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              🗓 May 2026
            </span>
            <span className="text-xs text-gray-400">Week 19</span>
          </div>

          {/* scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((d) => (
              <button
                key={d.date}
                onClick={() => setActiveDay(d.date)}
                className={`min-w-[70px] flex flex-col items-center gap-1 py-2 rounded-lg transition-colors
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