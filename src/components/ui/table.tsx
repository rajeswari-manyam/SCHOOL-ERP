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
        "bg-[#F9FAFB] text-[#6B7280] border-b border-[#E5E7EB]",
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
   Table Head Cell
========================= */
export const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th
      className={cn(
        "text-left align-top text-[11px] font-semibold uppercase tracking-wide px-4 py-3",
        className
      )}
      {...props}
    />
  );
};

/* =========================
   Table Cell
========================= */
export const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td
      className={cn(
        "text-left align-top px-4 py-3 text-[#0B1C30]",
        className
      )}
      {...props}
    />
  );
};