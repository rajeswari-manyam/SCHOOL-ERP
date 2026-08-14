import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonChartCardProps {
  className?: string;
  /** Fixed height of the chart body — match the real chart's height to prevent layout shift. */
  height?: string;
  /** Optional sub-headline shimmer above the chart area. */
  sub?: boolean;
}

/**
 * Chart card placeholder. Charts (recharts etc.) render at fixed pixel heights,
 * so the skeleton reserves the exact same height — the layout never jumps when
 * the real chart swaps in.
 */
export function SkeletonChartCard({
  className,
  height = "h-64",
  sub = true,
}: SkeletonChartCardProps) {
  return (
    <div
      aria-label="Loading chart"
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <Skeleton className="h-4 w-40" />
      {sub && <Skeleton className="mt-2 h-3 w-24" />}
      <Skeleton className={cn("mt-4 w-full rounded-lg", height)} />
    </div>
  );
}
