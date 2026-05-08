import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  percentage: number;
  minRequired?: number;
}

export const AttendancePolicy: React.FC<Props> = ({
  percentage,
  minRequired = 75,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const aboveMin = (percentage - minRequired).toFixed(1);
  const safeDaysLeft = Math.floor(((percentage - minRequired) / 100) * 24);
  const isSafe = percentage >= minRequired;

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100 transition-all duration-200 hover:border-[#4F46E5]"
    >
      {/* HEADER */}
      <p className="text-[10px] sm:text-[10.5px] font-bold text-indigo-700 uppercase tracking-widest mb-1">
        Attendance Policy
      </p>
      <p className="text-sm text-gray-500 mb-4 sm:mb-5">
        Minimum {minRequired}% attendance required to appear in final examinations.
      </p>

      {/* PROGRESS BAR */}
      <div className="relative mt-5 sm:mt-6 mb-2">
        {/* MIN label */}
        <span
          className="absolute -top-4 sm:-top-5 text-[9px] sm:text-[9.5px] font-bold text-red-500 tracking-wide whitespace-nowrap"
          style={{ left: `${minRequired}%`, transform: "translateX(-50%)" }}
        >
          MIN REQUIRED
        </span>

        {/* TRACK */}
        <div className="w-full h-2 sm:h-2.5 bg-gray-100 rounded-full relative overflow-hidden">
          {/* FILL — Framer Motion replaces IntersectionObserver */}
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-700 to-violet-500 rounded-full"
            initial={{ width: "0%" }}
            animate={isInView ? { width: `${percentage}%` } : { width: "0%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          {/* MARKER */}
          <div
            className="absolute top-[-4px] bottom-[-4px] w-0.5 bg-red-500 rounded"
            style={{ left: `${minRequired}%` }}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mt-4 sm:mt-5">
        <p className="text-sm text-gray-500">
          Your attendance:{" "}
          <span className="font-bold text-indigo-700">{percentage}%</span>
        </p>

        <div className="text-left sm:text-right">
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-2 ${
              isSafe ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSafe ? "bg-green-500" : "bg-red-500"
              }`}
            />
            Status: {isSafe ? "SAFE" : "AT RISK"}
          </div>
          <p className="text-[11px] sm:text-[11.5px] text-gray-400 leading-relaxed">
            You are {aboveMin}% above the minimum requirement.
            <br />
            You can miss up to {safeDaysLeft} more days without falling below {minRequired}%.
          </p>
        </div>
      </div>
    </div>
  );
};
