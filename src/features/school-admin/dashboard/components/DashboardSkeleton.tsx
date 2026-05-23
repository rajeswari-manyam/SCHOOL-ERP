import { cn } from '../../../../utils/cn';

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg bg-surface-3 shimmer-bg animate-pulse', className)} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Alert skeleton */}
      <Skeleton className="h-12 rounded-2xl" />

      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 card p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
        <div className="lg:col-span-2 card p-5 space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-32 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
