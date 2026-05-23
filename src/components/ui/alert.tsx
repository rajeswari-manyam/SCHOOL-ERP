import * as React from "react";
import { cn } from "../../utils/cn";

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "default" | "success" | "error" | "warning";
  title?: React.ReactNode;        // ✅ now safe
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      title,
      description,
      icon,
      action,
      ...props
    },
    ref
  ) => {
    const base =
      "w-full rounded-lg border p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3";

    const variants = {
      default: "bg-gray-50 text-gray-800 border-gray-200",
      success: "bg-green-50 text-green-800 border-green-200",
      error: "bg-red-50 text-red-800 border-red-200",
      warning: "bg-amber-50 text-amber-800 border-amber-200",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {/* Left Section */}
        <div className="flex items-start gap-2 sm:gap-3">
          
          {/* Icon */}
          {icon && <div className="mt-0.5 shrink-0">{icon}</div>}

          {/* Text */}
          <div className="flex flex-col">
            {title && (
              <p className="text-sm font-semibold">
                {title}
              </p>
            )}

            {description && (
              <p className="text-xs opacity-90 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action */}
        {action && <div className="sm:ml-auto">{action}</div>}
      </div>
    );
  }
);

Alert.displayName = "Alert";