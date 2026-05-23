import * as React from "react";
import { cn } from "@/utils/cn";

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      size = "md",
      disabled,
      ...props
    },
    ref
  ) => {
    // Controlled vs uncontrolled
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);

    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internalChecked;

    const toggle = () => {
      if (disabled) return;

      const newValue = !value;
      if (!isControlled) setInternalChecked(newValue);
      onCheckedChange?.(newValue);
    };

    // Sizes
    const sizes = {
      sm: "h-5 w-9",
      md: "h-6 w-11",
      lg: "h-7 w-14",
    };

    const thumbSizes = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={cn(
          "inline-flex items-center rounded-full px-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400",
          sizes[size],
          value
            ? "bg-indigo-600 justify-end"
            : "bg-gray-300 justify-start",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "rounded-full bg-white shadow-sm transition-all duration-200",
            thumbSizes[size]
          )}
        />
      </button>
    );
  }
);

Toggle.displayName = "Toggle";