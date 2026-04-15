import * as React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline" | "ghost" | "error";
  inputSize?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "md",
      type = "text",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "block w-full rounded-xl border bg-white text-sm text-slate-900 transition duration-150 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

    const variantStyles = {
      default: "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
      outline: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200",
      ghost: "border-transparent bg-slate-100 focus:border-slate-300 focus:ring-2 focus:ring-slate-200",
      error: "border-red-500 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200",
    };

    const sizeStyles = {
      sm: "h-9 px-3",
      md: "h-10 px-4",
      lg: "h-12 px-5 text-base",
    };

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[inputSize],
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
