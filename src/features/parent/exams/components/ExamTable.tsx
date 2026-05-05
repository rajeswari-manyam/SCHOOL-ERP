import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enIN } from "date-fns/locale";
import dayjs from "dayjs";
import { X, CalendarDays, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import typography, { combineTypography } from "@/styles/typography";
import type { Exam } from "../types/exam.types";
import "react-big-calendar/lib/css/react-big-calendar.css";

// ── date-fns localizer ──
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { "en-IN": enIN },
});

const columnHelper = createColumnHelper<Exam>();

export function ExamTable({ exams }: { exams: Exam[] }) {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => (
          <span
            className={combineTypography(
              typography.body.small,
              "font-medium text-[#0B1C30]"
            )}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-sm text-gray-500">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("day", {
        header: "Day",
        cell: (info) => (
          <span className="text-sm text-gray-500">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("time", {
        header: "Time",
        cell: (info) => (
          <span className="text-sm text-gray-500">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("venue", {
        header: "Venue",
        cell: (info) => (
          <span className="text-sm text-gray-500">{info.getValue()}</span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: exams,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Build calendar event from selected exam
  const examDate = selectedExam
    ? dayjs(selectedExam.date, "DD MMM YYYY").toDate()
    : new Date();

  const calendarEvents = selectedExam
    ? [
        {
          title: selectedExam.subject,
          start: examDate,
          end: examDate,
          allDay: true,
        },
      ]
    : [];

  return (
    <>
      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl mb-6 shadow-sm overflow-x-auto">
        <Table className="min-w-[700px] md:min-w-full table-fixed">

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 text-left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </tr>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => setSelectedExam(row.original)}
                className="group hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                {row.getVisibleCells().map((cell, i) => (
                  <TableCell
                    key={cell.id}
                    className={
                      i === 0
                        ? "px-4 py-3.5 border-b border-[#F1F3F8] group-hover:border-l-2 group-hover:border-l-[#3525CD] transition-all"
                        : "px-4 py-3.5 border-b border-[#F1F3F8]"
                    }
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      {/* ── CALENDAR MODAL ── */}
      {selectedExam && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelectedExam(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[#0B1C30]">
                  Exam Calendar
                </h3>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                  {selectedExam.subject} —{" "}
                  {dayjs(selectedExam.date, "DD MMM YYYY").format(
                    "DD MMMM YYYY"
                  )}
                </p>
              </div>

              <button
                onClick={() => setSelectedExam(null)}
                className="text-[#9CA3AF] hover:text-[#0B1C30] transition p-1 rounded-lg hover:bg-[#F4F6FA]"
              >
                <X size={18} />
              </button>
            </div>

            {/* PILLS */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1.5 text-[12px] text-[#3525CD] bg-[#EEF0FF] border border-[#D0D8FF] px-3 py-1 rounded-full">
                <CalendarDays size={12} />
                {dayjs(selectedExam.date, "DD MMM YYYY").format(
                  "dddd, DD MMM YYYY"
                )}
              </span>

              <span className="flex items-center gap-1.5 text-[12px] text-[#374151] bg-[#F4F6FA] border border-[#E8EBF2] px-3 py-1 rounded-full">
                <Clock size={12} />
                {selectedExam.time}
              </span>

              <span className="flex items-center gap-1.5 text-[12px] text-[#374151] bg-[#F4F6FA] border border-[#E8EBF2] px-3 py-1 rounded-full">
                <MapPin size={12} />
                {selectedExam.venue}
              </span>
            </div>

            {/* REACT-BIG-CALENDAR */}
            <div className="h-[420px]">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                defaultView="month"
                defaultDate={examDate}
                views={["month", "week", "day"]}
                className="font-sans text-sm"
                eventPropGetter={() => ({
                  className:
                    "!bg-[#3525CD] !border-none !rounded-md !text-xs !px-1.5 !py-0.5",
                })}
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setSelectedExam(null)}
                className="text-[12px] bg-[#3525CD] text-white px-5 py-2 rounded-xl hover:bg-[#2a1db5] transition"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}