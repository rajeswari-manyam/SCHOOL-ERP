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
    const base =
      "w-full rounded-md border transition focus:outline-none focus:ring-2 disabled:opacity-50";

    const variants = {
      default: "border-gray-300 focus:ring-primary",
      outline: "border-2 border-gray-400 focus:ring-gray-500",
      ghost: "border-transparent bg-gray-100 focus:ring-gray-300",
      error: "border-red-500 focus:ring-red-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-5 text-lg",
    };

    return (
      <input
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[inputSize], className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
