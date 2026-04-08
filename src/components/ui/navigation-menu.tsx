import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Navigation Menu Root
========================= */
export const NavigationMenu = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <nav
      className={cn(
        "flex items-center gap-4 bg-white border-b px-4 py-2",
        className,
      )}
      {...props}
    />
  );
};

/* =========================
   Nav Item
========================= */
export const NavItem = ({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
}) => {
  return (
    <button
      className={cn(
        "px-3 py-2 text-sm rounded-md transition",
        active ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-100",
        className,
      )}
      {...props}
    />
  );
};
