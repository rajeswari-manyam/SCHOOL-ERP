import * as React from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full border rounded-md px-3 py-2 text-left bg-white",
          "flex items-center justify-between",
          className,
        )}
      >
        <span className={selected ? "" : "text-gray-400"}>
          {selected?.label || placeholder}
        </span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-1 w-full rounded-md border bg-white shadow-md z-50">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onValueChange?.(option.value);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
