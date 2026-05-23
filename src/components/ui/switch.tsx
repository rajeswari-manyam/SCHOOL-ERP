import * as React from "react";
import { cn } from "../../utils/cn";

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    const handleToggle = () => {
      onCheckedChange?.(!checked);
    };

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-primary" : "bg-gray-300",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";
