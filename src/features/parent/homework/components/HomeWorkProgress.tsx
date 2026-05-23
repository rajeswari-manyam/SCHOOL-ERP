import { Card, CardContent } from "@/components/ui/card";
import typography, { combineTypography } from "@/styles/typography";

export function HomeworkProgress() {
  const completion = 72;

  return (
    <Card className="border-none shadow-none bg-[#3525CD] text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110">
      <CardContent className="p-5 flex flex-col gap-4">

        {/* Header */}
        <div>
          <p
            className={combineTypography(
              typography.body.small,
              "font-semibold text-white/70 mb-1"
            )}
          >
            Homework Progress
          </p>

          <div className="flex items-baseline gap-2">
            <span
              className={combineTypography(
                typography.fontSize["4xl"],
                "font-bold leading-none"
              )}
            >
              {completion}%
            </span>

            <span
              className={combineTypography(
                typography.body.small,
                "text-white/60"
              )}
            >
              Completion Rate
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl px-3 py-2.5">
            <p className="text-[11px] text-white/60 mb-0.5">Upcoming</p>
            <p className="text-[24px] font-bold leading-none">04</p>
          </div>

          <div className="bg-white/10 rounded-xl px-3 py-2.5">
            <p className="text-[11px] text-white/60 mb-0.5">Overdue</p>
            <p className="text-[24px] font-bold leading-none">00</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}