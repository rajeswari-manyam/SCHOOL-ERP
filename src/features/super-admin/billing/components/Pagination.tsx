import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
}) => {
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);
  const pages = buildPageRange(page, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-white/10">
      <p className="text-[12px] text-gray-400">
        Showing <span className="font-medium text-gray-600 dark:text-gray-300">{from}–{to}</span>{' '}
        of <span className="font-medium text-gray-600 dark:text-gray-300">{total}</span> institutions
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`flex h-7 min-w-[28px] items-center justify-center rounded-lg border px-2 text-[12px] font-medium transition-colors ${
                p === page
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};





