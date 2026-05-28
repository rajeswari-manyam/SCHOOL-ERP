import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExamTimetable, ExamEntry } from "../types/timetable.types";
import {
  formatExamDate,
  formatExamDay,
  formatTimeSlot,
  NOTIFY_STATUS_ICON,
} from "../utils/Timetable.utils";

interface Props {
  exam: ExamTimetable;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onAddExam: () => void;
  onEditExam: (entry: ExamEntry) => void;
  onDeleteExam: (id: string) => void;
}

const ExamTableSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between p-5 pb-4">
      <div className="h-5 w-48 rounded bg-gray-200" />
      <div className="h-9 w-28 rounded-lg bg-gray-200" />
    </div>
    <div className="overflow-x-auto border-t border-gray-100">
      <table className="w-full" style={{ minWidth: 580 }}>
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 w-14 rounded bg-gray-200" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, r) => (
            <tr key={r} className="border-b border-gray-100">
              {Array.from({ length: 8 }).map((_, c) => (
                <td key={c} className="px-4 py-4">
                  <div className={`h-4 rounded bg-gray-100 ${c === 0 ? "w-20" : "w-16"}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ExamErrorBanner = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
    <span className="text-3xl">⚠️</span>
    <p className="max-w-xs text-sm text-red-600">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline" size="sm">
        Try Again
      </Button>
    )}
  </div>
);

const ExamTimetableTable: React.FC<Props> = ({
  exam,
  loading,
  error,
  onRetry,
  onAddExam,
  onEditExam,
  onDeleteExam,
}) => {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <ExamTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 p-4 pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5 sm:pb-4">
          <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">Exam Timetable</h2>
          <Button onClick={onAddExam} className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            + Add Exam
          </Button>
        </div>
        <ExamErrorBanner message={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* HEADER — stacks on mobile, row on desktop */}
      <div className="flex flex-col gap-3 p-4 pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5 sm:pb-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {exam.title}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">{exam.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            onClick={onAddExam}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 xs:w-auto sm:h-auto sm:py-2"
          >
            + Add Exam
          </Button>
        </div>
      </div>

      {/* TABLE — horizontally scrollable */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}
      >
        <style>{`
          .exam-tt::-webkit-scrollbar { height: 4px; }
          .exam-tt::-webkit-scrollbar-track { background: transparent; }
          .exam-tt::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }
        `}</style>

        <Table className="exam-tt w-full text-sm" style={{ minWidth: 580 }}>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/50">
              <TableHead className="sticky left-0 z-10 bg-gray-50/80 px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 backdrop-blur-sm sm:px-4 sm:text-xs">
                Subject
              </TableHead>
              {["Class", "Date", "Day", "Time", "Venue", "Notify", "Actions"].map((h) => (
                <TableHead key={h} className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 sm:px-4 sm:text-xs">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {exam.entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                  No exam entries yet. Click <strong>+ Add Exam</strong> to get started.
                </TableCell>
              </TableRow>
            ) : (
              exam.entries.map((entry) => (
                <TableRow key={entry.id} className="transition-colors hover:bg-gray-50/50">
                  <TableCell className="sticky left-0 z-10 bg-white px-3 py-3 font-semibold text-gray-800 sm:px-4 sm:py-4 sm:text-sm">
                    {entry.subject}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-500 sm:px-4 sm:py-4 sm:text-sm">
                    {entry.className}
                  </TableCell>
                  <TableCell className="px-3 py-3 sm:px-4 sm:py-4">
                    <span className="whitespace-nowrap text-xs text-gray-600 sm:text-sm">
                      {formatExamDate(entry.date)}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-500 sm:px-4 sm:py-4 sm:text-sm">
                    <span className="sm:hidden">{formatExamDay(entry.date).slice(0, 3)}</span>
                    <span className="hidden sm:inline">{formatExamDay(entry.date)}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 text-xs text-gray-600 sm:px-4 sm:py-4 sm:text-sm">
                    {formatTimeSlot(entry.startTime, entry.endTime)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 text-xs text-gray-500 sm:px-4 sm:py-4 sm:text-sm">
                    {entry.venue}
                  </TableCell>
                  <TableCell className="px-3 py-3 sm:px-4 sm:py-4">
                    <span title={entry.notifyStatus} className="text-base sm:text-lg">
                      {NOTIFY_STATUS_ICON[entry.notifyStatus] ?? "🕐"}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-3 sm:px-4 sm:py-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button onClick={() => onEditExam(entry)} variant="ghost" size="sm" title="Edit" aria-label={`Edit ${entry.subject}`} className="h-7 w-7 p-0 text-sm text-gray-400 transition-colors hover:text-indigo-600 sm:h-8 sm:w-8 sm:text-base">
                        ✏️
                      </Button>
                      <Button onClick={() => onDeleteExam(entry.id)} variant="ghost" size="sm" title="Delete" aria-label={`Delete ${entry.subject}`} className="h-7 w-7 p-0 text-sm text-gray-400 transition-colors hover:text-red-500 sm:h-8 sm:w-8 sm:text-base">
                        🗑️
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
};

export default ExamTimetableTable;