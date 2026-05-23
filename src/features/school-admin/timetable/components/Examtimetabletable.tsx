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
  formatNotificationDate,
  NOTIFY_STATUS_ICON,
} from "../utils/Timetable.utils";

interface Props {
  exam: ExamTimetable;
  onAddExam: () => void;
  onEditExam: (entry: ExamEntry) => void;
  onDeleteExam: (id: string) => void;
  onToggleNotify: (enabled: boolean) => void;
  onResendNotification: () => void;
}

const ExamTimetableTable: React.FC<Props> = ({
  exam,
  onAddExam,
  onEditExam,
  onDeleteExam,
  onToggleNotify,
  onResendNotification,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* ══════════════════════════════════════════
          HEADER
          Mobile:  title block stacks above actions
          Desktop: single row
      ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-3 p-4 pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5 sm:pb-4">

        {/* Title + subtitle */}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {exam.title}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">{exam.subtitle}</p>
        </div>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

          {/* Notify parents toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
              Notify Parents
            </span>

            {/* Toggle pill */}
            <button
              type="button"
              role="switch"
              aria-checked={exam.notifyParentsEnabled}
              onClick={() => onToggleNotify(!exam.notifyParentsEnabled)}
              className={[
                "relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                exam.notifyParentsEnabled ? "bg-indigo-600" : "bg-gray-200",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  exam.notifyParentsEnabled ? "left-[18px]" : "left-0.5",
                ].join(" ")}
              />
            </button>

            <span className="text-base leading-none">💬</span>
          </div>

          {/* Add exam CTA — full width on xs, auto on sm+ */}
          <Button
            onClick={onAddExam}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 xs:w-auto sm:h-auto sm:py-2"
          >
            + Add Exam
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TABLE
          Horizontally scrollable — never crushes on mobile.
          Sticky Subject column so users always know which row.
      ══════════════════════════════════════════ */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}
      >
        <style>{`
          .exam-tt::-webkit-scrollbar { height: 4px; }
          .exam-tt::-webkit-scrollbar-track { background: transparent; }
          .exam-tt::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }
        `}</style>

        <Table
          className="exam-tt w-full text-sm"
          style={{ minWidth: 580 }}
        >
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/50">
              {/* Sticky subject header */}
              <TableHead className="sticky left-0 z-10 bg-gray-50/80 px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 backdrop-blur-sm sm:px-4 sm:text-xs">
                Subject
              </TableHead>
              {["Class", "Date", "Day", "Time", "Venue", "Notify", "Actions"].map((h) => (
                <TableHead
                  key={h}
                  className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 sm:px-4 sm:text-xs"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {exam.entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No exam entries yet. Click <strong>+ Add Exam</strong> to get started.
                </TableCell>
              </TableRow>
            ) : (
              exam.entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  {/* Sticky subject cell */}
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
                    {/* Full day on sm+, 3-char on mobile */}
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
                      {NOTIFY_STATUS_ICON[entry.notifyStatus]}
                    </span>
                  </TableCell>

                  {/* Action buttons */}
                  <TableCell className="px-3 py-3 sm:px-4 sm:py-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        onClick={() => onEditExam(entry)}
                        variant="ghost"
                        size="sm"
                        title="Edit"
                        aria-label={`Edit ${entry.subject}`}
                        className="h-7 w-7 p-0 text-sm text-gray-400 transition-colors hover:text-indigo-600 sm:h-8 sm:w-8 sm:text-base"
                      >
                        ✏️
                      </Button>
                      <Button
                        onClick={() => onDeleteExam(entry.id)}
                        variant="ghost"
                        size="sm"
                        title="Delete"
                        aria-label={`Delete ${entry.subject}`}
                        className="h-7 w-7 p-0 text-sm text-gray-400 transition-colors hover:text-red-500 sm:h-8 sm:w-8 sm:text-base"
                      >
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

      {/* ══════════════════════════════════════════
          FOOTER NOTIFICATION BANNER
          Stacks on mobile, inline on sm+
      ══════════════════════════════════════════ */}
      {exam.lastNotificationSentAt && (
        <div className="flex flex-col gap-2 border-t border-gray-100 bg-orange-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-5">

          <div className="flex items-start gap-2 text-xs text-orange-700 sm:items-center">
            <span className="mt-0.5 shrink-0 sm:mt-0">ℹ️</span>
            <p className="leading-snug">
              Exam schedule WhatsApp sent to{" "}
              <strong>{exam.notificationRecipientsCount} Class 10 parents</strong> on{" "}
              {formatNotificationDate(exam.lastNotificationSentAt)} ✓
            </p>
          </div>

          <Button
            onClick={onResendNotification}
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs font-bold uppercase tracking-wide text-indigo-600 transition-colors hover:text-indigo-800 sm:w-auto sm:justify-start"
          >
            Resend Notification
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExamTimetableTable;