import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DashboardStatVariant = "default" | "success" | "warning" | "info";

type BadgeVariant = "green" | "red" | "blue" | "amber" | "purple";

export interface DashboardStatCardProps {
  label: string;
  value?: ReactNode;
  sub?: ReactNode;
  badge?: { text: string; variant: BadgeVariant };
  suffixLabel?: string;
  icon?: ReactNode;
  variant?: DashboardStatVariant;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

// ─── Variant config ───────────────────────────────────────────────────────────

const variantMap: Record<
  DashboardStatVariant,
  { valueColor: string; iconBg: string; iconColor: string }
> = {
  success: { valueColor: "#00714D", iconBg: "#E6F4EF", iconColor: "#00714D" },
  warning: { valueColor: "#854F0B", iconBg: "#FEF3E2", iconColor: "#854F0B" },
  info: { valueColor: "#3525CD", iconBg: "#EEF2FF", iconColor: "#3525CD" },
  default: { valueColor: "#0B1530", iconBg: "#F3F4F6", iconColor: "#6B7280" },
};

// ─── DashboardStatCard ────────────────────────────────────────────────────────

export const DashboardStatCard = ({
  label,
  value,
  sub,
  badge,
  suffixLabel,
  icon,
  variant = "default",
  active = false,
  className,
  onClick,
}: DashboardStatCardProps) => {
  const { valueColor, iconBg, iconColor } = variantMap[variant];

  const wrappedIcon = icon ? (
    <span
      className="w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0"
      style={{ background: iconBg, color: iconColor }}
    >
      {icon}
    </span>
  ) : undefined;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col gap-1",
        "px-3 py-3",
        "bg-white rounded-xl",
        "cursor-pointer transition-all duration-150",

        // inactive state (desktop hover only)
        !active && [
          "border border-[#E2E5EF]",
          "md:hover:border-[#3525CD]",
          "md:hover:shadow-[0_0_0_3px_rgba(53,37,205,0.08)]",
        ],

        // active state
        active && [
          "border border-transparent",
          "shadow-[0_0_0_3px_rgba(53,37,205,0.12)]",
        ],

        className
      )}
    >
      {/* Label + Icon */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A91A8] leading-none">
          {label}
        </p>
        {wrappedIcon}
      </div>

      {/* Value */}
      {value && (
        <div className="flex items-baseline gap-1 flex-wrap">
          <p
            className="text-[16px] font-semibold leading-tight"
            style={{ color: valueColor }}
          >
            {value}
          </p>

          {suffixLabel && (
            <span className="text-[10px] text-gray-400">
              {suffixLabel}
            </span>
          )}
        </div>
      )}

      {/* Badge */}
      {badge && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5",
            "text-[10px] font-medium",
            "px-2 py-1 rounded-full w-fit max-w-full",

            badge.variant === "green" && "bg-[#E6F4EF] text-[#00714D]",
            badge.variant === "red" && "bg-[#FDECEC] text-[#BA1A1A]",
            badge.variant === "blue" && "bg-[#EEF2FF] text-[#3525CD]",
            badge.variant === "amber" && "bg-[#FAEEDA] text-[#854F0B]",
            badge.variant === "purple" && "bg-[#F3E8FF] text-[#5B21B6]"
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              badge.variant === "green" && "bg-[#00714D]",
              badge.variant === "red" && "bg-[#BA1A1A]",
              badge.variant === "blue" && "bg-[#3525CD]",
              badge.variant === "amber" && "bg-[#BA7517]",
              badge.variant === "purple" && "bg-[#5B21B6]"
            )}
          />
          <span className="truncate">{badge.text}</span>
        </span>
      )}

      {/* Sub text */}
      {sub && (
        <p className="text-[10px] text-[#8A91A8] leading-snug">
          {sub}
        </p>
      )}
    </div>
  );
};

// ─── DashboardStatGrid ────────────────────────────────────────────────────────

export interface DashboardStatGridProps {
  children: ReactNode;
  className?: string;
}

export const DashboardStatGrid = ({
  children,
  className,
}: DashboardStatGridProps) => (
  <div
    className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
      "gap-3 sm:gap-4",
      className
    )}
  >
    {children}
  </div>
);