import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Per-section error state. A slow or failed API must never take down the rest
 * of the dashboard — each section renders this in its own space with an inline
 * retry that refetches only that section's query.
 */
export function SectionError({
  message = "This section failed to load",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-[140px] w-full flex-col items-center justify-center gap-2.5 rounded-xl border border-red-100 bg-red-50/50 p-4 text-center",
        className,
      )}
    >
      <AlertCircle className="h-5 w-5 text-red-400" strokeWidth={2} />
      <p className="text-xs font-medium text-red-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Wrapper for content that only mounts once its data is ready. The fallback is
 * rendered inside the same sized box as the content so the layout doesn't jump.
 */
export function SectionState({
  isLoading,
  isError,
  errorMessage,
  onRetry,
  fallback,
  children,
}: {
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  fallback: React.ReactNode;
  children: React.ReactNode;
}) {
  if (isLoading) return <>{fallback}</>;
  if (isError) return <SectionError message={errorMessage} onRetry={onRetry} />;
  return <>{children}</>;
}
