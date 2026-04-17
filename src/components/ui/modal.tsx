import * as React from "react";
import { cn } from "../../utils/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}) => {
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full rounded-3xl bg-white shadow-2xl overflow-hidden",
          sizes[size],
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-3 px-6 py-5 border-b border-gray-100">
          {title ? (
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
              {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
          ) : null}
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">{footer}</div>
        ) : null}
      </div>
    </div>
  );
};

export const ModalActions = ({
  primary,
  secondary,
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-2">
      <div className="flex-1 sm:flex-none">{secondary}</div>
      <div className="flex-1 sm:flex-none">{primary}</div>
    </div>
  );
};

Modal.displayName = "Modal";
ModalActions.displayName = "ModalActions";
