import * as React from "react";
import { cn } from "../../utils/cn";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  children,
  side = "right",
  className,
}) => {
  if (!open) return null;

  const positions = {
    right: "right-0 top-0 h-full w-80",
    left: "left-0 top-0 h-full w-80",
    top: "top-0 left-0 w-full h-64",
    bottom: "bottom-0 left-0 w-full h-64",
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sheet Panel */}
      <div
        className={cn(
          "absolute bg-white shadow-lg p-4 transition",
          positions[side],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};
