import type { ReactNode } from "react";
import type { FeeStats } from "../types/fees.types";
import { formatCurrency } from "../utils/Fee.utils";

interface FeeStatCardsProps {
  stats: FeeStats;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compact Stat Card
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "flex flex-col gap-1 rounded-lg border p-2",
        "w-full min-w-0",
        "transition-all duration-200 hover:shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────────────────────
function Badge({
  bg,
  label,
  labelColor,
  icon,
}: {
  bg: string;
  label: string;
  labelColor: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1">
      <span
        aria-hidden="true"
        className={[
          "flex h-4.5 w-4.5 shrink-0 items-center justify-center",
          "rounded-full text-white text-[8px] font-bold",
          bg,
        ].join(" ")}
      >
        {icon}
      </span>

      <span
        className={[
          "text-[7px] font-bold uppercase tracking-wide truncate",
          labelColor,
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Value
// ─────────────────────────────────────────────────────────────────────────────
function Value({ children }: { children: ReactNode }) {
  return (
    <p className="text-[14px] sm:text-[15px] font-semibold leading-none text-gray-900 dark:text-white tabular-nums">
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fee Stat Cards
// ─────────────────────────────────────────────────────────────────────────────
export function FeeStatCards({ stats }: FeeStatCardsProps) {
  return (
    <section
      aria-label="Fee statistics"
      className="
        grid
        grid-cols-[repeat(auto-fit,minmax(140px,1fr))]
        gap-2
        mb-4
      "
    >
      {/* Outstanding */}
      <StatCard className="bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900">
        <Badge
          bg="bg-red-500"
          label="Alert"
          labelColor="text-red-600 dark:text-red-400"
          icon="!"
        />

        <div>
          <Value>{formatCurrency(stats.totalOutstanding)}</Value>

          <p className="mt-1 text-[8px] text-gray-500 dark:text-gray-400 leading-snug">
            <span className="font-semibold text-red-600 dark:text-red-400">
              {stats.pendingStudents}
            </span>{" "}
            students pending
          </p>
        </div>
      </StatCard>

      {/* Collected */}
      <StatCard className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <Badge
          bg="bg-green-500"
          label="Progress"
          labelColor="text-gray-500 dark:text-gray-400"
          icon="✓"
        />

        <div>
          <Value>{formatCurrency(stats.collectedThisMonth)}</Value>

          <div className="mt-1 space-y-0.5">
            <div
              role="progressbar"
              aria-valuenow={stats.collectedPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700"
            >
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${Math.min(stats.collectedPercent, 100)}%`,
                }}
              />
            </div>

            <p className="text-[7px] text-gray-400 dark:text-gray-500">
              {stats.collectedPercent}% collected
            </p>
          </div>
        </div>
      </StatCard>

      {/* Reminders */}
      <StatCard className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <Badge
          bg="bg-green-400"
          label="Active"
          labelColor="text-green-600 dark:text-green-400"
          icon={<span aria-hidden="true">💬</span>}
        />

        <div>
          <Value>{stats.remindersToday.toLocaleString()}</Value>

          <p className="mt-1 text-[8px] text-gray-500 dark:text-gray-400 leading-snug">
            WhatsApp at {stats.reminderTime}
          </p>
        </div>
      </StatCard>

      {/* Overdue */}
      <StatCard className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <Badge
          bg="bg-orange-500"
          label="Priority"
          labelColor="text-orange-600 dark:text-orange-400"
          icon={<span aria-hidden="true">⏰</span>}
        />

        <div>
          <Value>{stats.severelyOverdue.toLocaleString()}</Value>

          <p className="mt-1 text-[8px] text-gray-500 dark:text-gray-400 leading-snug">
            Immediate action needed
          </p>
        </div>
      </StatCard>
    </section>
  );
}