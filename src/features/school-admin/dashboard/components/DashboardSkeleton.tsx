import {
  Skeleton,
  SkeletonStatGrid,
  SkeletonTableCard,
} from "@/components/common/skeletons";

/**
 * Full-page dashboard placeholder. NOTE: this is intentionally NOT used as a
 * blocking gate on the dashboard — sections render their own skeleton in place
 * and the page paints immediately. Keep this for route-level Suspense or as a
 * generic first-paint fallback where a single aggregate query is unavoidable.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading dashboard">
      {/* Alert skeleton */}
      <Skeleton className="h-12 rounded-2xl" />

      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-3.5 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>

      {/* Stats */}
      <SkeletonStatGrid count={4} cols={4} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SkeletonTableCard rows={4} minHeight="min-h-[220px]" />
        <SkeletonTableCard rows={4} minHeight="min-h-[220px]" />
      </div>
    </div>
  );
}
