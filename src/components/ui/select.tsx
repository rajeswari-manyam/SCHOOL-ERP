import * as React from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options = [],
      placeholder = "Select an option",
      className,
      onValueChange,
      onChange,
      ...props
    },
    ref,
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onValueChange?.(event.target.value);
      onChange?.(event);
    };

    return (
      <select
        ref={ref}
        className={cn(
          "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100",
          className,
        )}
        onChange={handleChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";
