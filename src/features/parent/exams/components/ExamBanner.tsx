import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, X } from "lucide-react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enIN } from "date-fns/locale";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";

import typography, { combineTypography } from "@/styles/typography";
import type { ExamBannerProps } from "../types/exam.types";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { "en-IN": enIN },
});

export function ExamBanner({
  name,
  date,
  time,
  venue,
  daysLeft,
  hoursLeft,
}: ExamBannerProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const examDate = dayjs(date, "DD MMMM YYYY").toDate();

  const calendarEvents = [
    {
      title: name,
      start: examDate,
      end: examDate,
      allDay: true,
    },
  ];

  return (
    <>
      {/* ── BANNER CARD ── */}
      <Card className="bg-[#3525CD] text-white border-none shadow-md hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* LEFT */}
            <div>
              <p className="text-white/60 text-[11px] sm:text-xs">
                Next Exam in {daysLeft} days
              </p>

              <h2 className={combineTypography(typography.heading.h6, "text-white mt-1")}>
                {name}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-white/80 text-[12px] sm:text-sm">
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  {dayjs(examDate).format("DD MMMM YYYY")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {venue}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex gap-3">
                <div className="bg-white/15 rounded-xl px-4 py-2 text-center min-w-[70px] hover:bg-white/25 transition">
                  <div className="text-[18px] font-bold">
                    {String(daysLeft).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-white/70">Days</div>
                </div>

                <div className="bg-white/15 rounded-xl px-4 py-2 text-center min-w-[70px] hover:bg-white/25 transition">
                  <div className="text-[18px] font-bold">
                    {String(hoursLeft).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-white/70">Hours</div>
                </div>
              </div>

              <Button
                onClick={() => setShowCalendar(true)}
                className="bg-white text-[#3525CD] text-[12px] font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50 active:scale-95 transition w-full sm:w-auto flex items-center gap-2"
              >
                <CalendarDays size={16} />
                Add to Calendar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── CALENDAR MODAL ── */}
      {showCalendar && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowCalendar(false)}
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
                  {name} — {dayjs(examDate).format("DD MMMM YYYY")}
                </p>
              </div>

              <button
                onClick={() => setShowCalendar(false)}
                className="text-[#9CA3AF] hover:text-[#0B1C30] transition p-1 rounded-lg hover:bg-[#F4F6FA]"
              >
                <X size={18} />
              </button>
            </div>

            {/* PILLS */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1.5 text-[12px] text-[#3525CD] bg-[#EEF0FF] border border-[#D0D8FF] px-3 py-1 rounded-full">
                <CalendarDays size={12} />
                {dayjs(examDate).format("dddd, DD MMM YYYY")}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-[#374151] bg-[#F4F6FA] border border-[#E8EBF2] px-3 py-1 rounded-full">
                <Clock size={12} />
                {time}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-[#374151] bg-[#F4F6FA] border border-[#E8EBF2] px-3 py-1 rounded-full">
                <MapPin size={12} />
                {venue}
              </span>
            </div>

            {/* CALENDAR — h-[420px] replaces style={{ height: 420 }} */}
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

            {/* MODAL FOOTER */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setShowCalendar(false)}
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