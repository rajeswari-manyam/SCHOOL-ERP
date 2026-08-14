import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonStatCardProps {
  className?: string;
  /** Rows of shimmer bars inside the card body. */
  lines?: number;
}

/**
 * Fixed-height stat card placeholder. Mirrors the real stat cards used across
 * all dashboards (label / value / sub-text), so swapping skeleton → data never
 * changes the row height and causes a layout jump.
 */
export function SkeletonStatCard({ className, lines = 3 }: SkeletonStatCardProps) {
  return (
    <div
      aria-label="Loading statistic"
      className={cn(
        "min-h-[116px] rounded-xl border border-gray-100 bg-white p-3 sm:p-4 shadow-sm",
        className,
      )}
    >
      <Skeleton className="h-2.5 w-20" />
      <div className="mt-3 flex flex-col gap-2.5">
        <Skeleton className="h-6 w-24" />
        {Array.from({ length: Math.max(1, lines - 1) }).map((_, i) => (
          <Skeleton key={i} className={i % 2 === 0 ? "h-2.5 w-32" : "h-2.5 w-24"} />
        ))}
      </div>
    </div>
  );
}

/** Grid of stat-card skeletons — one `cols`-column row that stretches to fill. */
export function SkeletonStatGrid({
  count = 4,
  cols = 4,
  className,
}: {
  count?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading statistics"
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4",
        cols === 3 && "lg:grid-cols-3",
        cols === 4 && "lg:grid-cols-4",
        cols === 5 && "lg:grid-cols-5",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}
