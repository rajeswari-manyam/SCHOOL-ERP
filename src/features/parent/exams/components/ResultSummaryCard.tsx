import type { ResultSummary } from "../types/exam.types";
import { Card, CardContent } from "@/components/ui/card";

export function ResultSummaryCard({
  summary,
}: {
  summary: ResultSummary;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

      {/* ================= LEFT CARD ================= */}
      <Card className="rounded-2xl border-0 shadow-sm hover:shadow-xl hover:-translate-y-1  hover:border-[#3525CD] hover:border-1 transition-all duration-300">
        <CardContent className="p-6 flex flex-col items-center">
          <p className="text-[12px] text-gray-1000 text-center">
            Ravi Kumar | Class 10A
          </p>

          <p className="text-[12px] text-gray-400 mt-1 mb-4">
            {summary.examName}
          </p>

          <div className="text-[44px] font-extrabold text-[#3525CD] leading-none">
            {summary.totalObtained}
            <span className="text-[22px] font-normal text-gray-400">
              {" "}/ {summary.totalMarks}
            </span>
          </div>

          <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-widest">
            Total Marks
          </p>

          <p className="text-[22px] font-bold text-[#0B1C30] mt-1">
            {summary.percentage.toFixed(1)}%
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#3525CD]">
              {summary.grade}
            </span>

            <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-[#DCFCE7] text-[#166534]">
              PASS
            </span>

            <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-[#FEF3C7] text-[#92400E]">
              Rank {summary.rank}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT CARD ================= */}
      <Card className="rounded-2xl border-0 bg-[#3525CD] text-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-7 flex flex-col justify-between h-full">
          
          {/* TOP SECTION */}
          <div>
            <h3 className="text-[18px] font-bold mb-3">
              Performance Analytics
            </h3>

            <p className="text-[13px] text-white/70 leading-relaxed">
              {summary.analyticsNote}
            </p>
          </div>

          {/* BOTTOM SECTION */}
          <div className="mt-6">
            <div className="flex gap-3 flex-wrap mb-2">
              {summary.strongestSubjects.map((s) => (
                <div
                  key={s}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[12px] font-bold text-white hover:bg-white/30 transition"
                >
                  {s[0]}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-white/50">
              Strongest Subjects
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}