
import { cn } from "../../utils/cn";

interface ProgressRingProps {
  value: number; // percent 0-100
  size?: number; // px
  strokeWidth?: number;
  trackColor?: string;
  indicatorColor?: string;
  className?: string;
}

export const ProgressRing = ({
  value,
  size = 40,
  strokeWidth = 4,
  trackColor = "#e5e7eb",
  indicatorColor = "#10b981",
  className = "",
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className={cn("block", className)}
      style={{ display: "block" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={indicatorColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.4s" }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};
