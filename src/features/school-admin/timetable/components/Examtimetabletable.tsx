import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">{exam.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{exam.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notify parents toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Notify Parents
            </span>
            <Button
              onClick={() => onToggleNotify(!exam.notifyParentsEnabled)}
              variant="outline"
              size="sm"
              className={`relative w-10 h-5 rounded-full transition-colors p-0 ${
                exam.notifyParentsEnabled ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  exam.notifyParentsEnabled ? "translate-x-5" : ""
                }`}
              />
            </Button>
            <span className="text-lg">💬</span>
          </div>

          <Button
            onClick={onAddExam}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + Add Exam
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/50">
              {["SUBJECT", "CLASS", "DATE", "DAY", "TIME", "VENUE", "NOTIFY", "ACTIONS"].map((h) => (
                <TableHead key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {exam.entries.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="px-4 py-4 font-semibold text-gray-800">{entry.subject}</TableCell>
                <TableCell className="px-4 py-4 text-gray-500">{entry.className}</TableCell>
                <TableCell className="px-4 py-4 text-gray-600">
                  <span className="whitespace-nowrap">{formatExamDate(entry.date)}</span>
                </TableCell>
                <TableCell className="px-4 py-4 text-gray-500">{formatExamDay(entry.date)}</TableCell>
                <TableCell className="px-4 py-4 text-gray-600 whitespace-nowrap">
                  {formatTimeSlot(entry.startTime, entry.endTime)}
                </TableCell>
                <TableCell className="px-4 py-4 text-gray-500 whitespace-nowrap">{entry.venue}</TableCell>
                <TableCell className="px-4 py-4">
                  <span title={entry.notifyStatus} className="text-lg">
                    {NOTIFY_STATUS_ICON[entry.notifyStatus]}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onEditExam(entry)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-indigo-600 transition-colors text-base h-8 w-8 p-0"
                      title="Edit"
                    >
                      ✏️
                    </Button>
                    <Button
                      onClick={() => onDeleteExam(entry.id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 transition-colors text-base h-8 w-8 p-0"
                      title="Delete"
                    >
                      🗑️
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer notification banner */}
      {exam.lastNotificationSentAt && (
        <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-3 border-t border-gray-100 bg-orange-50">
          <div className="flex items-center gap-2 text-xs text-orange-700">
            <span>ℹ️</span>
            <span>
              Exam schedule WhatsApp sent to{" "}
              <strong>{exam.notificationRecipientsCount} Class 10 parents</strong> on{" "}
              {formatNotificationDate(exam.lastNotificationSentAt)} ✓
            </span>
          </div>
          <Button
            onClick={onResendNotification}
            variant="ghost"
            size="sm"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide transition-colors"
          >
            Resend Notification
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExamTimetableTable;