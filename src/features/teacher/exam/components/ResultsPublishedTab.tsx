import { Download, TrendingUp, BarChart2, Trophy } from "lucide-react";
import type { PublishedResult, Grade } from "../types/exam-marks.types";
import { GRADE_CONFIG } from "../hooks/useExamMarks";

const RANK_MEDALS = ["🥇", "🥈", "🥉"] as const;

interface Props {
  results: PublishedResult[];
  onDownload: () => void;
}

// ── Section card shell ────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-gray-100 dark:border-slate-800",
        "bg-white dark:bg-slate-900 shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
      {children}
    </p>
  );
}

// ── ResultsPublishedTab ───────────────────────────────────────────────────────
const ResultsPublishedTab = ({ results, onDownload }: Props) => {
  // ── Empty state ─────────────────────────────────────────────────────────────
  if (results.length === 0) {
    return (
      <Card className="py-16 text-center">
        <div aria-hidden="true" className="mb-3 text-4xl">📊</div>
        <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">
          No published results yet
        </p>
      </Card>
    );
  }

  const result = results[0];
  const maxAvg = Math.max(...result.subjectPerformance.map((s) => s.average), 1);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">

      {/* ── Summary header ──────────────────────────────────────────────── */}
      <Card className="px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <div className="min-w-0">
            <p className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">
              {result.examLabel}
            </p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500 truncate">
              {result.className} · {result.academicYear} · Published {result.publishedOn}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 sm:gap-5 sm:shrink-0">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                Class Avg
              </p>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {result.classAverage}
              </p>
            </div>
            <div className="h-8 w-px bg-gray-100 dark:bg-slate-700" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                Pass Rate
              </p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {result.overallPassRate}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">

        {/* ── Subject performance ──────────────────────────────────────── */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2
              size={14}
              className="text-gray-400 dark:text-slate-500 shrink-0"
              aria-hidden="true"
            />
            <SectionLabel>Subject Performance</SectionLabel>
          </div>

          <div className="flex flex-col gap-4" role="list">
            {result.subjectPerformance.map((sp) => {
              const barWidth = (sp.average / maxAvg) * 100;
              const isGood = sp.passRate >= 80;
              const isMid  = sp.passRate >= 60;
              const passColor = isGood
                ? "text-emerald-600 dark:text-emerald-400"
                : isMid
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-500 dark:text-red-400";
              const barColor = isGood
                ? "bg-emerald-500"
                : isMid
                  ? "bg-amber-400"
                  : "bg-red-400";

              return (
                <div key={sp.subject} role="listitem">
                  {/* Row: subject + stats */}
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <span className="text-xs font-semibold text-gray-700 dark:text-slate-200 min-w-0 truncate">
                      {sp.subject}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] shrink-0 flex-wrap">
                      <span className="text-gray-400 dark:text-slate-500">
                        Avg{" "}
                        <span className="font-bold text-gray-700 dark:text-slate-200 tabular-nums">
                          {sp.average}
                        </span>
                      </span>
                      <span className="text-gray-400 dark:text-slate-500">
                        Pass{" "}
                        <span className={`font-bold tabular-nums ${passColor}`}>
                          {sp.passRate}%
                        </span>
                      </span>
                      <span className="flex items-center gap-0.5 text-gray-400 dark:text-slate-500">
                        <TrendingUp size={10} aria-hidden="true" />
                        <span className="font-bold text-indigo-500 dark:text-indigo-400 tabular-nums">
                          {sp.highest}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Bar */}
                  <div
                    role="progressbar"
                    aria-valuenow={sp.average}
                    aria-valuemin={0}
                    aria-valuemax={maxAvg}
                    aria-label={`${sp.subject} average: ${sp.average}`}
                    className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── Right col: top performers + download ─────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Top performers */}
          <Card className="flex-1 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy
                size={14}
                className="text-gray-400 dark:text-slate-500 shrink-0"
                aria-hidden="true"
              />
              <SectionLabel>Top Performers</SectionLabel>
            </div>

            <ol aria-label="Top 3 students" className="flex flex-col gap-3">
              {result.topStudents.map((ts) => {
                const gradeCfg = GRADE_CONFIG[ts.grade as Grade];
                return (
                  <li key={ts.rank} className="flex items-center gap-3">
                    <span
                      aria-label={`Rank ${ts.rank}`}
                      className="shrink-0 text-xl leading-none"
                    >
                      {RANK_MEDALS[ts.rank - 1]}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {ts.name}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">
                        #{ts.rollNo}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-extrabold text-gray-800 dark:text-slate-100 tabular-nums">
                        {ts.marks}
                        <span className="text-[11px] font-normal text-gray-400 dark:text-slate-500">
                          /{ts.maxMarks}
                        </span>
                      </span>
                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-2 py-0.5",
                          "text-[10px] font-bold",
                          gradeCfg.classes,
                        ].join(" ")}
                      >
                        {ts.grade}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          {/* Download button */}
          <button
            type="button"
            onClick={onDownload}
            className={[
              "flex w-full items-center justify-center gap-2",
              "h-11 rounded-xl text-sm font-semibold",
              "bg-indigo-600 text-white",
              "hover:bg-indigo-700 active:scale-[0.98]",
              "transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              "dark:bg-indigo-500 dark:hover:bg-indigo-600",
            ].join(" ")}
          >
            <Download size={15} aria-hidden="true" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPublishedTab;