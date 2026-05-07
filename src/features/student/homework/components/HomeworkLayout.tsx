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
    <div className="flex gap-4 p-4 min-h-screen bg-gray-50">
      {/* ── Sidebar ── */}
      <aside className="w-48 flex-shrink-0 flex flex-col gap-3">
        {/* Tabs Card */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
            Homework
          </p>
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
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

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Calendar Card */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              🗓 May 2026
            </span>
            <span className="text-xs text-gray-400">Week 19</span>
          </div>
          <div className="flex gap-2">
            {days.map((d) => (
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

        {/* Middle Content — your existing homework card goes here */}
        <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm">
          {children ?? (
            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400 text-sm">
              Your homework content goes here
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeworkLayout;