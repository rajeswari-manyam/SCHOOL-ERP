import * as React from "react";
import { cn } from "../../utils/cn";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
  onValueChange?: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        value={value}
        onChange={(e) => onValueChange?.(Number(e.target.value))}
        className={cn(
          "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
          "accent-primary",
          className,
        )}
        {...props}
      />
    );
  },
);

Slider.displayName = "Slider";
