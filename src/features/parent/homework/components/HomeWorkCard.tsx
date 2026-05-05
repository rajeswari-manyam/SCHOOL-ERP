import type { ReactElement } from "react";
import type { Homework } from "../types/homework.types";
import { Card, CardContent } from "@/components/ui/card";
import typography, { combineTypography } from "@/styles/typography";
import {
  Pencil,
  Calculator,
  FlaskConical,
  Clock,
  Paperclip,
  MessageCircle,
} from "lucide-react";

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

const SUBJECT_ICONS: Record<Subject, ReactElement> = {
  ENGLISH:     <Pencil size={18} strokeWidth={1.5} />,
  MATHEMATICS: <Calculator size={18} strokeWidth={1.5} />,
  SCIENCE:     <FlaskConical size={18} strokeWidth={1.5} />,
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface HomeworkCardProps {
  hw: Homework;
  /**
   * "week" → detailed card used in "This Week" tab
   * "all"  → compact list row used in "All Homework" tab
   */
  variant?: "week" | "all";
}

// ── "This Week" detailed card ─────────────────────────────────────────────────
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
            <Clock size={11} strokeWidth={1.5} />
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
    <Paperclip size={11} strokeWidth={1.5} />
    {hw.attachment.name}
  </a>
)}
            {hw.whatsappNotified && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <MessageCircle size={10} strokeWidth={1.5} />
                Notified via WhatsApp on {hw.whatsappNotified}
              </span>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

// ── "All Homework" compact list row ──────────────────────────────────────────
function AllCard({ hw }: { hw: Homework }) {
  const subject = hw.subject?.toUpperCase() as Subject;
  const status  = hw.status?.toUpperCase() as Status;

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
          <Clock size={11} strokeWidth={1.5} />
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