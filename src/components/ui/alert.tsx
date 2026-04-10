import * as React from "react";
import { cn } from "../../utils/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error" | "warning";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base = "w-full rounded-md border px-4 py-3 text-sm";

    const variants = {
      default: "bg-gray-100 text-gray-800 border-gray-300",
      success: "bg-[#00714D] text-[#00714D] border-[#00714D]",
      error: "bg-red-100 text-red-800 border-red-300",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  },
);

Alert.displayName = "Alert";
