import * as React from "react";

interface CheckboxFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const CheckboxField = React.forwardRef<
  HTMLInputElement,
  CheckboxFieldProps
>(({ label, error, className, containerClassName, ...props }, ref) => {
  return (
    <div className={containerClassName}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={`w-4 h-4 accent-[#3525CD] ${className}`}
          {...props}
        />
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>

      {error && <p className="text-xs text-red-500 ml-6 mt-1">{error}</p>}
    </div>
  );
});

CheckboxField.displayName = "CheckboxField";