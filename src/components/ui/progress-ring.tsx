

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  indicatorColor?: string;
  className?: string;
}

const ProgressRing = ({
  value,
  size = 40,
  strokeWidth = 4,
  trackColor = "#E5E7EB",
  indicatorColor = "#10B981",
  className = "",
}: ProgressRingProps) => {
  // Safe value
  const safeValue = Math.min(100, Math.max(0, value));

  // Radius
  const radius = (size - strokeWidth) / 2;

  // Circle length
  const circumference = 2 * Math.PI * radius;

  // Progress offset
  const strokeDashoffset =
    circumference - (safeValue / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />

      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={indicatorColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          transition: "stroke-dashoffset 0.35s ease",
        }}
      />
    </svg>
  );
};

export default ProgressRing;