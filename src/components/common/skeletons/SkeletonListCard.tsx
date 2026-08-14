import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonListCardProps {
  className?: string;
  /** Number of list rows to render. */
  rows?: number;
  /** Render a card header shimmer bar. */
  header?: boolean;
  /** Fixed minimum height so a short list never collapses the section. */
  minHeight?: string;
}

/**
 * List card placeholder (header + icon/text rows). Use inside dashboard
 * sections that render a vertical list of items (leaves, homework, feeds…).
 */
export function SkeletonListCard({
  className,
  rows = 4,
  header = true,
  minHeight,
}: SkeletonListCardProps) {
  return (
    <div
      aria-label="Loading list"
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {header && <Skeleton className="h-4 w-36" />}
      <div
        className={cn("flex flex-col justify-center gap-4", header && "mt-4")}
        style={minHeight ? { minHeight } : undefined}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
