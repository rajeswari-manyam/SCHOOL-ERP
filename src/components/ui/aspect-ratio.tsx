import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Command Root
========================= */
export const Command = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-lg border bg-white shadow-md",
        className,
      )}
      {...props}
    />
  );
};

/* =========================
   Input
========================= */
export const CommandInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn(
        "w-full border-b px-3 py-2 text-sm outline-none",
        className,
      )}
      placeholder="Type a command..."
      {...props}
    />
  );
};

/* =========================
   List
========================= */
export const CommandList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("max-h-60 overflow-auto", className)} {...props} />;
};

/* =========================
   Item
========================= */
export const CommandItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
        className,
      )}
      {...props}
    />
  );
};
