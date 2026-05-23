import * as React from "react";
import { cn } from "../../utils/cn";

interface DropdownContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextProps | null>(null);

/* =========================
   Root
========================= */
export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

/* =========================
   Trigger
========================= */
export const DropdownMenuTrigger = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("Must be used inside DropdownMenu");

  return (
    <button onClick={() => ctx.setOpen(!ctx.open)} className={cn(className)}>
      {children}
    </button>
  );
};

/* =========================
   Content
========================= */
export const DropdownMenuContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ctx = React.useContext(DropdownContext);
  if (!ctx || !ctx.open) return null;

  return (
    <div
      className={cn(
        "absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-lg z-50",
        className,
      )}
    >
      {children}
    </div>
  );
};

/* =========================
   Item
========================= */
export const DropdownMenuItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const ctx = React.useContext(DropdownContext);

  return (
    <div
      onClick={() => {
        onClick?.();
        ctx?.setOpen(false);
      }}
      className={cn(
        "px-4 py-2 text-sm cursor-pointer hover:bg-gray-100",
        className,
      )}
    >
      {children}
    </div>
  );
};
