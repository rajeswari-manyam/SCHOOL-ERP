import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "./button";

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  className?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  className,
}) => {
  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center")}>
      {/* Overlay */}
      <div
        className={cn("absolute inset-0 bg-black/50 backdrop-blur-sm")}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg",
          className,
        )}
      >
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>

          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
