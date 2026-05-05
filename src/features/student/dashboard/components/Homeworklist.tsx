import type { HomeworkItem } from "../types/Student dashboard.types";
import { formatDueDate } from "../utils/Student dashboard.utils";
import { useDownloadHomeworkBrief } from "../hooks/Usestudentdashboard";
import { Button } from "@/components/ui/button";

// Subject icon map (emoji fallback, swap for Lucide icons if available)
const SUBJECT_ICONS: Record<string, string> = {
  English: "📖",
  Mathematics: "📐",
  Science: "🔬",
  "Social Studies": "🌍",
  Hindi: "📝",
  "Computer Science": "💻",
};

const getSubjectIcon = (subject: string): string => {
  const key = Object.keys(SUBJECT_ICONS).find((k) =>
    subject.toLowerCase().includes(k.toLowerCase())
  );
  return key ? SUBJECT_ICONS[key] : "📋";
};

interface HomeworkListProps {
  items: HomeworkItem[];
}

const HomeworkList = ({ items }: HomeworkListProps) => {
  const { download, loadingId } = useDownloadHomeworkBrief();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-900">Homework Due This Week</h2>

      <div className="flex flex-col gap-3">
        {items.map((hw) => (
          <div
            key={hw.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all"
          >
            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-lg flex-shrink-0">
              {getSubjectIcon(hw.subject)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {hw.subject}: {hw.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Due: {formatDueDate(hw.dueDate)}
              </p>
            </div>

            {/* Download button */}
            {hw.briefUrl && (
              <Button
                onClick={() => download(hw.id, hw.subject, hw.title)}
                disabled={loadingId === hw.id}
                variant="ghost"
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
              >
                {loadingId === hw.id ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                )}
                Download Brief
              </Button>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            No homework due this week 🎉
          </p>
        )}
      </div>
    </div>
  );
};

export default HomeworkList;