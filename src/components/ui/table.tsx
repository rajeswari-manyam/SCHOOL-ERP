import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Table Wrapper
========================= */
export const Table = ({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  );
};

/* =========================
   Table Header
========================= */
export const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead
      className={cn(
        "bg-[#EFF4FF] text-slate-500 border-b border-[#E5E7EB]",
        className
      )}
      {...props}
    />
  );
};

/* =========================
   Table Body
========================= */
export const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody className={cn("", className)} {...props} />;
};

/* =========================
   Table Row
========================= */
export const TableRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr
      className={cn(
        "border-b border-[#F0F2F7] hover:bg-[#F9FAFF] transition-colors",
        className
      )}
      {...props}
    />
  );
};

/* =========================
   Table Head Cell (TH)
========================= */
export const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th
      className={cn(
        "text-left align-top text-xs font-semibold uppercase tracking-wide px-4 py-3 text-slate-500",
        className
      )}
      {...props}
    />
  );
};

/* =========================
   Table Cell (TD)
========================= */
export const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td
      className={cn(
        "text-left align-top px-4 py-3 text-sm text-slate-800",
        className
      )}
      {...props}
    />
  );
};