import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Menu Bar Root
========================= */
export const MenuBar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b bg-white px-4 py-2",
        className,
      )}
      {...props}
    />
  );
};

/* =========================
   Menu Item
========================= */
export const MenuItem = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 transition",
        className,
      )}
      {...props}
    />
  );
};
