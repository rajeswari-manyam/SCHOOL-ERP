import * as React from "react";
import { cn } from "../../utils/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-10 w-10 border-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-gray-300 border-t-primary",
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";
