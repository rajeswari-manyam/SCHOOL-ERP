import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Form Wrapper
========================= */
export const Form = ({
  children,
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <form className={cn("space-y-4", className)} {...props}>
      {children}
    </form>
  );
};

/* =========================
   Form Field Wrapper
========================= */
interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  description,
  error,
  children,
}) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      {children}

      {description && <p className="text-xs text-gray-500">{description}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
