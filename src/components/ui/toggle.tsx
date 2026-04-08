import * as React from "react";
import { cn } from "../../utils/cn";

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    ref,
  ) => {
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

    const translate = {
      sm: value ? "translate-x-5" : "translate-x-1",
      md: value ? "translate-x-6" : "translate-x-1",
      lg: value ? "translate-x-8" : "translate-x-1",
    };

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={value}
        onClick={toggle}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center rounded-full transition",
          sizes[size],
          value ? "bg-primary" : "bg-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block rounded-full bg-white transform transition",
            thumbSizes[size],
            translate[size],
          )}
        />
      </button>
    );
  },
);

Toggle.displayName = "Toggle";
