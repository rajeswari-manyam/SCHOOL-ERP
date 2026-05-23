import * as React from "react";
import { cn } from "../../utils/cn";

export interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  children,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  let timeout: ReturnType<typeof setTimeout>;

  const handleEnter = () => {
    timeout = setTimeout(() => setOpen(true), 150);
  };

  const handleLeave = () => {
    clearTimeout(timeout);
    setOpen(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {trigger}

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-64 rounded-lg border bg-white p-4 shadow-lg",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
