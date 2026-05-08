import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import type { MarketingRep } from "../types/marketing.types";
import { RepAvatar, AchievementBadge } from "./RepBadges";

interface TargetsTabProps {
  reps: MarketingRep[];
  stats: {
    demosThisMonth: number;
    demosTarget: number;
    schoolsClosed: number;
  };
}

// ── Shared card shell ─────────────────────────────────────────────────────────
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

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({
  value,
  max,
  color,
  label,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700"
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
      {children}
    </h3>
  );
}

// ── Nav button ────────────────────────────────────────────────────────────────
function NavBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "flex h-8 w-8 items-center justify-center rounded-lg",
        "border border-gray-200 dark:border-slate-700",
        "bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400",
        "hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ── TargetsTab ────────────────────────────────────────────────────────────────
const TargetsTab = ({ reps, stats }: TargetsTabProps) => {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const monthLabel = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });

  const chartData = reps.map((r) => ({
    name: r.name.split(" ")[0] + " " + (r.name.split(" ")[1]?.[0] ?? ""),
    demos: r.mtdDemos,
    closings: r.mtdClosings,
  }));

  const totalClosings  = reps.reduce((s, r) => s + r.mtdClosings, 0);
  const closingsTarget = stats.demosTarget / 2;
  const conversionRate =
    stats.demosThisMonth > 0
      ? Number(((totalClosings / stats.demosThisMonth) * 100).toFixed(0))
      : 0;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* ── Month nav + Set Targets ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <NavBtn onClick={prevMonth} label="Previous month">
            <ChevronLeft size={13} aria-hidden="true" />
          </NavBtn>

          <span
            aria-live="polite"
            className="min-w-[110px] text-center text-sm font-bold text-gray-900 dark:text-white"
          >
            {monthLabel} {year}
          </span>

          <NavBtn onClick={nextMonth} label="Next month">
            <ChevronRight size={13} aria-hidden="true" />
          </NavBtn>
        </div>

        <button
          type="button"
          className={[
            "flex w-full items-center justify-center gap-2 sm:w-auto",
            "rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2",
            "bg-white dark:bg-slate-900 text-sm font-semibold",
            "text-gray-600 dark:text-slate-300",
            "hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
          ].join(" ")}
        >
          <Calendar size={13} aria-hidden="true" />
          Set Targets
        </button>
      </div>

      {/* ── Chart + Performance summary ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-5">

        {/* Bar chart */}
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <SectionHeading>Demos vs Closings</SectionHeading>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-indigo-500" />
                <span className="text-gray-500 dark:text-slate-400">Demos</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-emerald-500" />
                <span className="text-gray-500 dark:text-slate-400">Closings</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="demos"    fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="closings" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance summary */}
        <Card className="flex flex-col gap-4 p-4 sm:p-5">
          <SectionHeading>Team Performance Summary</SectionHeading>

          <div className="flex flex-col gap-4">
            {/* Demos */}
            <div>
              <div className="mb-1.5 flex flex-wrap items-end justify-between gap-1">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                    Total Demos
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums leading-tight">
                    {stats.demosThisMonth}{" "}
                    <span className="text-sm font-normal text-gray-400 dark:text-slate-500">
                      / {stats.demosTarget} Target
                    </span>
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {Math.round((stats.demosThisMonth / stats.demosTarget) * 100)}%
                </span>
              </div>
              <ProgressBar
                value={stats.demosThisMonth}
                max={stats.demosTarget}
                color="bg-indigo-500"
                label="Demo target progress"
              />
            </div>

            {/* Closings */}
            <div>
              <div className="mb-1.5 flex flex-wrap items-end justify-between gap-1">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                    Total Closings
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums leading-tight">
                    {totalClosings}{" "}
                    <span className="text-sm font-normal text-gray-400 dark:text-slate-500">
                      / {closingsTarget} Target
                    </span>
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {Math.round((totalClosings / closingsTarget) * 100)}%
                </span>
              </div>
              <ProgressBar
                value={totalClosings}
                max={closingsTarget}
                color="bg-indigo-400"
                label="Closings target progress"
              />
            </div>

            {/* Conversion */}
            <div>
              <div className="mb-1.5 flex flex-wrap items-end justify-between gap-1">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums leading-tight">
                    {conversionRate}%{" "}
                    <span className="text-sm font-normal text-gray-400 dark:text-slate-500">Avg</span>
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Optimal
                </span>
              </div>
              <ProgressBar
                value={conversionRate}
                max={100}
                color="bg-emerald-500"
                label="Conversion rate progress"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Per rep table ────────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-50 dark:border-slate-800 px-4 py-3 sm:px-5 sm:py-4">
          <SectionHeading>Per Rep Performance</SectionHeading>
        </div>

        {/* Horizontally scrollable on small screens */}
        <div
          className="overflow-x-auto"
          role="region"
          aria-label="Per rep performance table, scroll horizontally on small screens"
        >
          <table className="w-full min-w-[580px]" aria-label="Per rep performance">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60">
                {[
                  "Representative",
                  "Demos",
                  "Closings",
                  "Conv %",
                  "Target",
                  "Achievement",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {reps.map((rep) => (
                <tr
                  key={rep.id}
                  className="transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <RepAvatar initials={rep.initials} size="sm" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        {rep.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-700 dark:text-slate-300 tabular-nums">
                    {rep.mtdDemos}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-700 dark:text-slate-300 tabular-nums">
                    {rep.mtdClosings}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-slate-400 tabular-nums">
                    {rep.conversionPct}%
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-slate-400 tabular-nums">
                    {rep.monthTarget}
                  </td>
                  <td className="px-4 py-3.5">
                    <AchievementBadge pct={rep.achievementPct} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      aria-label={`View details for ${rep.name}`}
                      className={[
                        "rounded-lg p-1 text-gray-400 dark:text-slate-500",
                        "hover:bg-gray-100 dark:hover:bg-slate-700",
                        "hover:text-gray-600 dark:hover:text-slate-300",
                        "transition-colors focus-visible:outline-none",
                        "focus-visible:ring-2 focus-visible:ring-indigo-500",
                      ].join(" ")}
                    >
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TargetsTab;