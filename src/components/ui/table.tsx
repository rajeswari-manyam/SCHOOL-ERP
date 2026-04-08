import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Table Wrapper
========================= */
export const Table = ({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table
      className={cn("w-full border-collapse text-sm", className)}
      {...props}
    />
  </div>
);

/* =========================
   Table Head
========================= */
export const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-gray-100 text-gray-700", className)} {...props} />
);

/* =========================
   Table Body
========================= */
export const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("", className)} {...props} />
);

/* =========================
   Row
========================= */
export const TableRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn("border-b hover:bg-gray-50 transition", className)}
    {...props}
  />
);

/* =========================
   Head Cell
========================= */
export const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn("px-4 py-2 text-left font-medium", className)} {...props} />
);

/* =========================
   Cell
========================= */
export const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-2", className)} {...props} />
);
