import React from "react";

// ─── Inline Error Banner ──────────────────────────────────────────────────────

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => (
  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg width="18" height="18" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-red-800">Something went wrong</p>
      <p className="text-xs text-red-600 mt-0.5 break-words">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex-shrink-0 text-xs font-semibold text-red-700 hover:text-red-900 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors bg-white"
      >
        Retry
      </button>
    )}
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
      <svg width="28" height="28" fill="none" stroke="#6366f1" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="12" y2="18" />
      </svg>
    </div>
    <p className="text-base font-bold text-gray-900">{title}</p>
    <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="6.5" y1="1" x2="6.5" y2="12" /><line x1="1" y1="6.5" x2="12" y2="6.5" />
        </svg>
        {actionLabel}
      </button>
    )}
  </div>
);

// ─── Toast Notification ───────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  onDismiss: () => void;
}

const TOAST_CONFIG: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: "bg-green-50 border-green-200",
    icon: (
      <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: (
      <svg width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    icon: (
      <svg width="16" height="16" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    bg: "bg-indigo-50 border-indigo-200",
    icon: (
      <svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

export const Toast = ({ type, message, onDismiss }: ToastProps) => {
  const cfg = TOAST_CONFIG[type];
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-lg max-w-sm animate-in fade-in slide-in-from-bottom-4 ${cfg.bg}`}
      role="alert"
    >
      <span className="flex-shrink-0">{cfg.icon}</span>
      <p className="text-sm font-semibold text-gray-800 flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-0.5 rounded"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
        </svg>
      </button>
    </div>
  );
};

// ─── React Error Boundary ─────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class TimetableErrorBoundary extends React.Component<
  React.PropsWithChildren<{ onReset?: () => void }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ onReset?: () => void }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[TimetableErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white rounded-2xl border border-red-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <svg width="28" height="28" fill="none" stroke="#dc2626" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="text-base font-bold text-gray-900">Timetable failed to render</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}