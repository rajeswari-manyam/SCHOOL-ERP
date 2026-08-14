import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableCardProps {
  className?: string;
  /** Number of shimmer rows to render. */
  rows?: number;
  /** Fixed minimum height so a short table never collapses the section. */
  minHeight?: string;
}

/**
 * Table card placeholder (header + avatar/text/badge rows). Used inside the
 * dashboard wherever a data table will eventually mount.
 */
export function SkeletonTableCard({
  className,
  rows = 5,
  minHeight = "min-h-[260px]",
}: SkeletonTableCardProps) {
  return (
    <div
      aria-label="Loading table"
      className={cn(
        "rounded-xl border border-gray-100 bg-white shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
      <div className={cn("flex flex-col justify-center gap-4 p-4", minHeight)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <Skeleton className="h-5 w-14 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
