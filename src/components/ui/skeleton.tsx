import * as React from "react";
import { cn } from "../../utils/cn";

/**
 * Base skeleton primitive. Every composed dashboard skeleton is built on top
 * of this. It is an inert block (aria-hidden) that pulses and sweeps a subtle
 * shimmer so the UI never feels frozen while an API is in flight.
 *
 * Usage — always give it an explicit width/height so the placeholder reserves
 * the same space the real content will occupy (prevents layout shift):
 *
 *   <Skeleton className="h-4 w-32" />
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      data-skeleton=""
      className={cn(
        "skeleton-shimmer animate-pulse rounded-md bg-slate-200/80",
        className,
      )}
      {...props}
    />
  );
}
