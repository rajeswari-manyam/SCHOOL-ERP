import type { FeeStats } from "../types/fees.types";
import { formatCurrency } from "../utils/Fee.utils";

interface FeeStatCardsProps {
  stats: FeeStats;
}

// ─── Shared card shell ────────────────────────────────────────────────────────
function StatCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "flex flex-col gap-2.5 rounded-2xl border p-4 sm:p-5",
        "transition-shadow duration-200 hover:shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ─── Badge row ────────────────────────────────────────────────────────────────
function Badge({
  bg,
  label,
  labelColor,
  icon,
}: {
  bg: string;
  label: string;
  labelColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center",
          "rounded-full text-white text-[11px] font-bold",
          bg,
        ].join(" ")}
      >
        {icon}
      </span>
      <span
        className={[
          "text-[10px] font-bold uppercase tracking-widest truncate",
          labelColor,
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Value ────────────────────────────────────────────────────────────────────
function Value({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[clamp(1.15rem,3vw,1.35rem)] font-bold leading-none text-gray-900 dark:text-white tabular-nums">
      {children}
    </p>
  );
}

// ─── FeeStatCards ─────────────────────────────────────────────────────────────
export function FeeStatCards({ stats }: FeeStatCardsProps) {
  return (
    <section
      aria-label="Fee statistics"
      className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6"
    >

      {/* ── Outstanding ─────────────────────────────────────────────────── */}
      <StatCard
        className="bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900"
      >
        <Badge
          bg="bg-red-500"
          label="Alert"
          labelColor="text-red-600 dark:text-red-400"
          icon="!"
        />
        <div>
          <Value>{formatCurrency(stats.totalOutstanding)}</Value>
          <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            <span className="font-semibold text-red-600 dark:text-red-400">
              {stats.pendingStudents} students
            </span>{" "}
            with dues pending
          </p>
        </div>
      </StatCard>

      {/* ── Collected ───────────────────────────────────────────────────── */}
      <StatCard
        className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
      >
        <Badge
          bg="bg-green-500"
          label="Progress"
          labelColor="text-gray-500 dark:text-gray-400"
          icon="✓"
        />
        <div>
          <Value>{formatCurrency(stats.collectedThisMonth)}</Value>
          <div className="mt-2 space-y-1">
            <div
              role="progressbar"
              aria-valuenow={stats.collectedPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${stats.collectedPercent}% of expected revenue collected`}
              className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700"
            >
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${Math.min(stats.collectedPercent, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              {stats.collectedPercent}% of expected revenue
            </p>
          </div>
        </div>
      </StatCard>

      {/* ── Reminders ───────────────────────────────────────────────────── */}
      <StatCard
        className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
      >
        <Badge
          bg="bg-green-400"
          label="Active"
          labelColor="text-green-600 dark:text-green-400"
          icon={<span aria-hidden="true">💬</span>}
        />
        <div>
          <Value>{stats.remindersToday.toLocaleString()}</Value>
          <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            via{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              WhatsApp
            </span>{" "}
            at {stats.reminderTime}
          </p>
        </div>
      </StatCard>

      {/* ── Severely Overdue ────────────────────────────────────────────── */}
      <StatCard
        className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
      >
        <Badge
          bg="bg-orange-500"
          label="Priority"
          labelColor="text-orange-600 dark:text-orange-400"
          icon={<span aria-hidden="true">⏰</span>}
        />
        <div>
          <Value>{stats.severelyOverdue.toLocaleString()}</Value>
          <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            Needs immediate admin action
          </p>
        </div>
      </StatCard>

    </section>
  );
}