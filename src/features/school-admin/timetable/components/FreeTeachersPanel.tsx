import { useState, useEffect } from "react";
import { Users, ChevronDown, Loader2 } from "lucide-react";
import { getFreeTeachers, type FreeTeacher } from "@/services/timetable.api";

export default function FreeTeachersPanel() {
  const [freeTeachers, setFreeTeachers] = useState<FreeTeacher[]>([]);
  const [currentDay, setCurrentDay] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFreeTeachers()
      .then((res) => {
        setFreeTeachers(res.data ?? []);
        setCurrentDay(res.current_day ?? "");
        setCurrentTime(res.current_time ?? "");
      })
      .catch(() => setFreeTeachers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <Users size={14} className="text-emerald-600" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-800">Free Teachers</p>
            {currentDay && currentTime && (
              <p className="text-[10px] text-gray-400">
                {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)} · {currentTime}
              </p>
            )}
          </div>
          {!loading && freeTeachers.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              {freeTeachers.length}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-gray-400">
              <Loader2 size={12} className="animate-spin" />
              Loading…
            </div>
          ) : freeTeachers.length === 0 ? (
            <p className="py-6 text-center text-xs text-gray-400">No free teachers at the moment.</p>
          ) : (
            <div className="space-y-1.5">
              {freeTeachers.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2 hover:bg-emerald-50/40 hover:border-emerald-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700">
                      {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 truncate">{t.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {t.employee_id}
                      {t.department ? ` · ${t.department}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
