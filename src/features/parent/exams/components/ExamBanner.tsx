import { Card, CardContent } from "@/components/ui/card";
import typography, { combineTypography } from "@/styles/typography";
import { Button } from "@/components/ui/button";
interface ExamBannerProps {
  name: string;
  date: string;
  time: string;
  venue: string;
  daysLeft: number;
  hoursLeft: number;
}

export function ExamBanner({
  name,
  date,
  time,
  venue,
  daysLeft,
  hoursLeft,
}: ExamBannerProps) {
  return (
    <Card
      className="
        bg-[#3525CD]
        text-white
        border-none
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      <CardContent className="p-4 sm:p-5">
        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* LEFT INFO */}
          <div>
            <p className="text-white/60 text-[11px] sm:text-xs">
              Next Exam in {daysLeft} days
            </p>

            <h2
              className={combineTypography(
                typography.heading.h6,
                "text-white mt-1"
              )}
            >
              {name}
            </h2>

            <p className="text-white/70 text-[12px] sm:text-sm mt-1">
              {date} · {time} · {venue}
            </p>
          </div>

          {/* RIGHT COUNTERS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">

            <div className="flex gap-3">
              {/* DAYS */}
              <div className="bg-white/15 rounded-xl px-4 py-2 text-center min-w-[70px] hover:bg-white/25 transition">
                <div className="text-[18px] font-bold">
                  {String(daysLeft).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-white/70">Days</div>
              </div>

              {/* HOURS */}
              <div className="bg-white/15 rounded-xl px-4 py-2 text-center min-w-[70px] hover:bg-white/25 transition">
                <div className="text-[18px] font-bold">
                  {String(hoursLeft).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-white/70">Hours</div>
              </div>
            </div>

            {/* BUTTON */}
            <Button
              className="
                bg-white
                text-[#3525CD]
                text-[12px]
                font-semibold
                px-4 py-2.5
                rounded-xl
                hover:bg-blue-50
                active:scale-95
                transition
                w-full sm:w-auto
              "
            >
              + Add to Google Calendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}