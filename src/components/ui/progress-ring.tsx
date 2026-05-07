
import { Loader } from "lucide-react";
import { cn } from "../../utils/cn";

interface ProgressRingProps {
  className?: string;
}

export const ProgressRing = ({
  className = "",
}: ProgressRingProps) => {
  return (
    <Loader className={cn("h-10 w-10 animate-spin", className)} />
  );
};
