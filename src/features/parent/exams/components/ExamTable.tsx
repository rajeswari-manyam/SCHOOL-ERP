import { useMemo, useState, useEffect } from "react";
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
import { X, CalendarDays, Clock, MapPin, ChevronRight } from "lucide-react";
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

// ── Responsive hook ────────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

// ── Mobile exam card ───────────────────────────────────────────────────────────

function MobileExamCard({
  exam,
  onClick,
}: {
  exam: Exam;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3 hover:border-[#3525CD]/30 hover:shadow-md active:scale-[0.98] transition-all duration-200"
    >
      {/* Left: date badge */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#EEF0FF] flex flex-col items-center justify-center">
        <span className="text-[11px] font-semibold text-[#3525CD] leading-none uppercase">
          {dayjs(exam.date, "DD MMM YYYY").format("MMM")}
        </span>
        <span className="text-[18px] font-bold text-[#3525CD] leading-tight">
          {dayjs(exam.date, "DD MMM YYYY").format("DD")}
        </span>
      </div>

      {/* Middle: subject + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#0B1C30] truncate">
          {exam.subject}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock size={10} />
            {exam.time}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin size={10} />
            {exam.venue}
          </span>
        </div>
      </div>

      {/* Right: chevron */}
      <ChevronRight size={16} className="flex-shrink-0 text-gray-300" />
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ExamTable({ exams }: { exams: Exam[] }) {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const isMobile = useIsMobile();

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
      {/* ── TABLE (desktop) / CARDS (mobile) ── */}
      {isMobile ? (
        <div className="flex flex-col gap-3 mb-6">
          {exams.map((exam, i) => (
            <MobileExamCard
              key={i}
              exam={exam}
              onClick={() => setSelectedExam(exam)}
            />
          ))}
        </div>
      ) : (
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
      )}

      {/* ── MODAL: bottom sheet on mobile, centered on desktop ── */}
      {selectedExam && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center"
          onClick={() => setSelectedExam(null)}
        >
          <div
            className={`
              bg-white w-full shadow-2xl relative
              ${isMobile
                ? "rounded-t-3xl p-5 max-h-[90dvh] overflow-y-auto"
                : "rounded-2xl p-5 max-w-3xl mx-4"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle — mobile only */}
            {isMobile && (
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            )}

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[#0B1C30]">
                  Exam Calendar
                </h3>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                  {selectedExam.subject} —{" "}
                  {dayjs(selectedExam.date, "DD MMM YYYY").format("DD MMMM YYYY")}
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
                {dayjs(selectedExam.date, "DD MMM YYYY").format("dddd, DD MMM YYYY")}
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
            <div className={isMobile ? "h-[320px]" : "h-[420px]"}>
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