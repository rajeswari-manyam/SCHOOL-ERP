import { cn } from "@/utils/cn";

interface PaginationProps {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}
const Pagination = ({ page, total, pageSize, onChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const btn = "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-gray-50">
      <p className="text-sm text-gray-400">Showing {total === 0 ? 0 : (page-1)*pageSize+1}–{Math.min(page*pageSize,total)} of {total} templates</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page-1)} disabled={page===1} className={cn(btn,"border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button onClick={() => onChange(page+1)} disabled={page===totalPages||totalPages===0} className={cn(btn,"border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
};
export default Pagination;
