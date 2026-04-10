import { cn } from "../../utils/cn";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn("w-full h-2 bg-gray-200 rounded-full", className)}>
      <div
        className="h-2 bg-primary rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}