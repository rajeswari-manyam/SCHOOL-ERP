import * as React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "error" | "warning" | "outline" | "blue" | "amber" | "violet" | "emerald" | "red" | "gray" | "sky" | "purple" | "green" | "orange";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

    const variants = {
      default: "bg-gray-200 text-gray-800",
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
      outline: "border border-gray-300 text-gray-700",
      blue: "bg-blue-50 text-blue-700 border border-blue-200",
      amber: "bg-amber-50 text-amber-700 border border-amber-200",
      violet: "bg-violet-50 text-violet-700 border border-violet-200",
      emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      red: "bg-red-50 text-red-700 border border-red-200",
      gray: "bg-gray-100 text-gray-600 border border-gray-200",
      sky: "bg-sky-50 text-sky-700 border border-sky-200",
      purple: "bg-purple-50 text-purple-700 border border-purple-200",
      green: "bg-green-50 text-green-700 border border-green-200",
      orange: "bg-orange-50 text-orange-700 border border-orange-200",
    };

    return (
      <span
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
