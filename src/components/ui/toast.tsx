import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Types
========================= */
type ToastType = "default" | "success" | "error";

interface ToastItem {
  id: number;
  title?: string;
  description?: string;
  type?: ToastType;
}

/* =========================
   Context
========================= */
const ToastContext = React.createContext<{
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
} | null>(null);

/* =========================
   Provider
========================= */
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, "id">) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000); // auto remove
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/* =========================
   Hook
========================= */
export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

/* =========================
   Toast UI
========================= */
const Toast = ({ title, description, type = "default" }: ToastItem) => {
  const base = "w-72 rounded-md border p-4 shadow-md bg-white";

  const variants = {
    default: "border-gray-300",
    success: "border-green-500",
    error: "border-red-500",
  };

  return (
    <div className={cn(base, variants[type])}>
      {title && <p className="font-medium">{title}</p>}
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
};
