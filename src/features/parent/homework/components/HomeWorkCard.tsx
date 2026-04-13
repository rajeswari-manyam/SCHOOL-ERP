// components/HomeWorkCard.tsx
import type { ReactElement } from "react";
import type { Homework } from "../types/types";
import { Card, CardContent } from "@/components/ui/card";
import typography, { combineTypography } from "@/styles/typography";

// ── Colour maps ───────────────────────────────────────────────────────────────
const SUBJECT_BADGE: Record<Subject, string> = {
  ENGLISH:     "bg-[#EEF2FF] text-[#3525CD]",
  MATHEMATICS: "bg-[#FEF3C7] text-[#92400E]",
  SCIENCE:     "bg-[#D1FAE5] text-[#065F46]",
};

const SUBJECT_ICON_BG: Record<Subject, string> = {
  ENGLISH:     "bg-[#EEF2FF] text-[#3525CD]",
  MATHEMATICS: "bg-[#FEF9C3] text-[#92400E]",
  SCIENCE:     "bg-[#D1FAE5] text-[#065F46]",
};

const STATUS_BADGE: Record<Status, string> = {
  "PENDING":     "bg-[#FEF9C3] text-[#854d0e]",
  "SUBMITTED":   "bg-[#DCFCE7] text-[#166534]",
  "NOT TRACKED": "bg-[#F1F5F9] text-[#475569]",
};
type Subject = "ENGLISH" | "MATHEMATICS" | "SCIENCE";
type Status = "PENDING" | "SUBMITTED" | "NOT TRACKED";

// ── Subject icons (for "all" variant) ────────────────────────────────────────
const EnglishIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M13.5 2.5l4 4-9 9H4.5v-4l9-9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M11.5 4.5l4 4" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const MathIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 8h14M3 13h14M8 3v14M13 3v14" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const ScienceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 5c-1.5-1-3.5-1.5-6-1v11c2.5-.5 4.5 0 6 1 1.5-1 3.5-1.5 6-1V4c-2.5-.5-4.5 0-6 1z"
      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
    />
    <path d="M10 5v11" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const SUBJECT_ICONS: Record<Subject, ReactElement>= {
  ENGLISH:     <EnglishIcon />,
  MATHEMATICS: <MathIcon />,
  SCIENCE:     <ScienceIcon />,
};

// ── Shared micro-icons ────────────────────────────────────────────────────────
const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const FileIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <rect x="1.5" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4 5h4M4 7.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ── Props ─────────────────────────────────────────────────────────────────────
interface HomeworkCardProps {
  hw: Homework;
  /**
   * "week" → detailed card used in "This Week" tab (Image 1)
   * "all"  → compact list row used in "All Homework" tab (Image 2)
   */
  variant?: "week" | "all";
}

// ── "This Week" detailed card — Image 1 ──────────────────────────────────────
function WeekCard({ hw }: { hw: Homework }) {
  const subject = hw.subject?.toUpperCase() as Subject;
  const subjectClass = SUBJECT_BADGE[subject] ?? SUBJECT_BADGE.ENGLISH;

  return (
    <Card className="bg-white shadow-none border border-transparent hover:border-[#3525CD] hover:border-2 rounded-2xl
      transition-all duration-200 hover:shadow-md cursor-pointer group">
      <CardContent className="px-5 py-4">

        {/* Row 1 — subject badge + due date */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide ${subjectClass}`}>
          {subject}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-amber-500">
            <ClockIcon />
            Due: {hw.due}{hw.dueLabel ? ` (${hw.dueLabel})` : ""}
          </span>
        </div>

        {/* Row 2 — title */}
        <p className={combineTypography(
          typography.body.small,
          "font-semibold text-[#0B1C30] group-hover:text-[#3525CD] mb-1.5"
        )}>
          {hw.title}
        </p>

        {/* Row 3 — description */}
        <p className={combineTypography(typography.body.xs, "text-gray-500 leading-relaxed mb-3")}>
          {hw.description}
        </p>

        {/* Row 4 — teacher + attachment + WhatsApp tag */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="w-5 h-5 rounded-full bg-[#E8EBF2] flex items-center
              justify-center text-[9px] font-semibold text-gray-500">
              {hw.teacherInitials}
            </span>
            {hw.teacher}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {hw.attachment?.name && (
              <a
                href={hw.attachment.url ?? "#"}
                className="flex items-center gap-1 text-[11px] text-[#3525CD] hover:underline"
              >
                <FileIcon /> {hw.attachment.name}
              </a>
            )}
            {hw.whatsappNotified && (
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Notified via WhatsApp on {hw.whatsappNotified}
              </span>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

// ── "All Homework" compact list row — Image 2 ─────────────────────────────────
function AllCard({ hw }: { hw: Homework }) {
  const subject = hw.subject?.toUpperCase() as Subject;
  const status = hw.status?.toUpperCase() as Status;

  const iconBg    = SUBJECT_ICON_BG[subject] ?? SUBJECT_ICON_BG.ENGLISH;
  const icon      = SUBJECT_ICONS[subject]   ?? SUBJECT_ICONS.ENGLISH;
  const statusCls = STATUS_BADGE[status]     ?? STATUS_BADGE["NOT TRACKED"];

  return (
    <div className="flex items-center gap-4 px-4 py-3.5
      border-b border-[#F1F5F9] last:border-b-0
      hover:bg-[#F8FAFF] transition-colors cursor-pointer group">

      {/* Subject icon pill */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>

      {/* Title + due */}
      <div className="flex-1 min-w-0">
       <p
  className={combineTypography(
    typography.body.small,
    "font-semibold text-[#0B1C30] group-hover:text-[#3525CD] truncate"
  )}
  title={hw.title}
>
  {hw.title}
</p>
        <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
          <ClockIcon />
          Due: {hw.due}
        </span>
      </div>

      {/* Status pill */}
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide flex-shrink-0 ${statusCls}`}>
        {hw.status}
      </span>
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
export function HomeworkCard({ hw, variant = "week" }: HomeworkCardProps) {
  return variant === "all" ? <AllCard hw={hw} /> : <WeekCard hw={hw} />;
}