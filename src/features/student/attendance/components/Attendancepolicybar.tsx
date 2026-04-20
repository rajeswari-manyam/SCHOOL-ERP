import type { AttendancePolicy } from "../types/Attendance.types";
import { POLICY_STATUS_STYLES } from "../utils/Attendance.utils";

interface AttendancePolicyBarProps {
  policy: AttendancePolicy;
  currentPercentage: number;
}

const AttendancePolicyBar = ({
  policy,
  currentPercentage,
}: AttendancePolicyBarProps) => {
  const style = POLICY_STATUS_STYLES[policy.status];

  // Position of the minimum-required marker relative to the bar (0–100 range mapped to 0–100%)
  const markerPosition = policy.minimumPercentage; // e.g. 75 → 75% from left

  return (
    <div className="bg-white rounded-xl border p-5 space-y-3">
      {/* Title */}
      <div>
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
          Attendance Policy
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Minimum {policy.minimumPercentage}% attendance required to appear in final examinations.
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative">
        {/* Min required label */}
        <div
          className="absolute -top-4 text-[10px] text-red-500 font-semibold"
          style={{ left: `${markerPosition}%`, transform: "translateX(-50%)" }}
        >
          MIN. REQUIRED
        </div>

        {/* Track */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-visible mt-5">
          {/* Fill */}
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${Math.min(currentPercentage, 100)}%` }}
          />
          {/* Min marker (dashed vertical line) */}
          <div
            className="absolute top-0 h-full border-l-2 border-dashed border-red-500"
            style={{ left: `${markerPosition}%` }}
          />
        </div>

        {/* Your attendance label */}
        <p className="text-xs text-gray-500 mt-1.5">
          Your attendance: <span className="font-semibold text-gray-900">{currentPercentage}%</span>
        </p>
      </div>

      {/* Status box */}
      <div
        className={`flex flex-col gap-0.5 border rounded-lg px-4 py-3 ${style.badge}`}
      >
        <p className="text-xs font-bold">Status: {style.label}</p>
        <p className="text-xs">
          You are {policy.safetyMargin}% above the minimum requirement.
        </p>
        <p className="text-xs opacity-75">
          You can miss up to {policy.canMissMoreDays} more days without falling below {policy.minimumPercentage}%.
        </p>
      </div>
    </div>
  );
};

export default AttendancePolicyBar;