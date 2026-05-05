import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  itemLabel?: string;
  showPageNumbers?: boolean;
}
export const PlanBadge = () => {};
export const StatusBadge = () => {};

const Pagination = ({
  page,
  total,
  pageSize,
  onChange,
  itemLabel = "items",
  showPageNumbers = false,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(page * pageSize, total);

  const pages: (number | "...")[] = [];
  if (showPageNumbers) {
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
  }

  const btn = "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-gray-50">
      <p className="text-sm text-gray-400">
        {total === 0
          ? `Showing 0 of 0 ${itemLabel}`
          : `Showing ${from}–${to} of ${total} ${itemLabel}`}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(page - 1, 1))}
          disabled={page === 1 || totalPages <= 1}
          className={cn(btn, "border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed")}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {showPageNumbers && totalPages > 1 && (
          <>
            {pages.map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onChange(p as number)}
                  className={cn(
                    btn,
                    p === page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {p}
                </button>
              )
            )}
          </>
        )}

        <button
          onClick={() => onChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages || totalPages <= 1}
          className={cn(btn, "border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed")}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
