import * as React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "error" | "warning" | "outline";
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
