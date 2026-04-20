import { format, parseISO, isToday, isTomorrow, differenceInDays } from "date-fns";
import { Edit3, Trash2, Link as LinkIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeworkItem } from "../types/homework.types";

// ── Due date badge ────────────────────────────────────────────────────────
const DueBadge = ({ dateStr, isPast }: { dateStr: string; isPast: boolean }) => {
  if (isPast) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-[11px] font-bold">
      Closed
    </span>
  );
  const d = parseISO(dateStr);
  if (isToday(d))    return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold border border-red-200">Due Today</span>;
  if (isTomorrow(d)) return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold border border-amber-200">Due Tomorrow</span>;
  const diff = differenceInDays(d, new Date());
  if (diff <= 3)     return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[11px] font-bold border border-orange-200">Due in {diff}d</span>;
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold border border-indigo-200">Due {format(d, "d MMM")}</span>;
};

// ── WA notification badge ─────────────────────────────────────────────────
const WABadge = ({ status, notifiedAt }: { status: HomeworkItem["waNotifyStatus"]; notifiedAt?: string }) => {
  if (status === "SENT") return (
    <span title={notifiedAt ? `Sent ${notifiedAt}` : "WA notification sent"}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold border border-[#bbf7d0]">
      <span className="text-[#25d366]">💬</span> WA Sent
    </span>
  );
  if (status === "SENDING") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
      <span>💬</span> Sending…
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold">
      <span>💬</span> Not Sent
    </span>
  );
};

// ── Subject colour map ────────────────────────────────────────────────────
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-indigo-50 text-indigo-700 border-indigo-200",
  English:     "bg-blue-50 text-blue-700 border-blue-200",
  Science:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  Geography:   "bg-amber-50 text-amber-700 border-amber-200",
  History:     "bg-orange-50 text-orange-700 border-orange-200",
  Hindi:       "bg-rose-50 text-rose-700 border-rose-200",
};
const subjectPill = (s: string) =>
  `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${SUBJECT_COLORS[s] ?? "bg-purple-50 text-purple-700 border-purple-200"}`;

// ── Progress bar ──────────────────────────────────────────────────────────
const SubmissionBar = ({ submitted, total }: { submitted: number; total: number }) => {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
  const bar  = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  const txt  = pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-500";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Submissions</span>
        <span className={`text-xs font-extrabold ${txt}`}>{submitted}/{total} <span className="font-normal text-gray-400">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ── Main Card ─────────────────────────────────────────────────────────────
interface Props {
  hw: HomeworkItem;
  onEdit: () => void;
  onDelete: () => void;
  onSendReminder: () => void;
  reminderSent?: boolean;
}

const HomeworkCard = ({ hw, onEdit, onDelete, onSendReminder, reminderSent }: Props) => {
  const isHwPast = hw.status === "PAST";
  const pendingCount = hw.totalCount - hw.submittedCount;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={subjectPill(hw.subject)}>{hw.subject}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-gray-50 text-gray-600 border-gray-200">
              {hw.className}
            </span>
            <WABadge status={hw.waNotifyStatus} notifiedAt={hw.waNotifiedAt} />
          </div>
          <h3 className="text-sm font-extrabold text-gray-900 leading-snug">{hw.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <DueBadge dateStr={hw.dueDate} isPast={isHwPast} />
          {/* Menu */}
          {!isHwPast && (
            <div className="flex items-center gap-1 ml-1">
              <Button
                type="button"
                onClick={onEdit}
                title="Edit"
                variant="ghost"
                size="sm"
                className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Edit3 size={13} className="text-current" />
              </Button>
              <Button
                type="button"
                onClick={onDelete}
                title="Delete"
                variant="ghost"
                size="sm"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 size={13} className="text-current" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{hw.description}</p>

      {/* Attachment */}
      {hw.attachmentName && (
        <a
          href={hw.attachmentUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors w-fit"
        >
          <LinkIcon size={13} className="text-current" />
          {hw.attachmentName}
        </a>
      )}

      {/* Submission bar */}
      <SubmissionBar submitted={hw.submittedCount} total={hw.totalCount} />

      {/* Footer actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 h-9 rounded-xl text-xs font-semibold"
        >
          View Submissions
        </Button>
        {!isHwPast && pendingCount > 0 && (
          <Button
            type="button"
            onClick={onSendReminder}
            disabled={reminderSent}
            variant={reminderSent ? "outline" : "default"}
            size="sm"
            className={`flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-bold transition-all ${
              reminderSent
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                : "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
            }`}
          >
            <MessageCircle size={11} className="text-current" strokeWidth={2.5} />
            {reminderSent ? "Reminded!" : `Remind (${pendingCount})`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeworkCard;
