import * as React from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "outline" | "ghost" | "error";
  size?: "sm" | "md" | "lg";
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
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
      sm: "min-h-[88px] px-3 py-2",
      md: "min-h-[112px] px-4 py-3",
      lg: "min-h-[136px] px-5 py-4 text-base",
    };

    return (
      <textarea
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
