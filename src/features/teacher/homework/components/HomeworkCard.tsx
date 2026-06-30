import { useState } from "react";
import type { HomeworkItem } from "../types/homework.types";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, MessageCircle, Paperclip, Eye } from "lucide-react";
import WABadge from "./WABadge";
import DueBadge from "./DueBadge";
import SubjectPill from "./SubjectPill";
import SubmissionDrawer from "./SubmissionDrawer";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionsByHomeworkId } from "@/services/homework.api";

// ── Progress bar ──────────────────────────────────────────────────────────────
const SubmissionBar = ({
  submitted,
  total,
  loading,
}: {
  submitted: number;
  total: number;
  loading?: boolean;
}) => {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
  const bar = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  const txt = pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-500" : "text-red-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-[4px]">
        <span className="text-[10px] font-bold uppercase tracking-[.06em] text-slate-400">
          Submissions
        </span>
        {loading ? (
          <span className="text-[10px] text-slate-300">Loading…</span>
        ) : (
          <span className={`text-[10px] font-bold ${txt}`}>
            {submitted}/{total}{" "}
            <span className="font-normal text-slate-400">({pct}%)</span>
          </span>
        )}
      </div>
      <div className="h-[4px] bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${loading ? "bg-slate-200 animate-pulse" : bar}`}
          style={{ width: loading ? "100%" : `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  hw: HomeworkItem;
  onEdit: () => void;
  onDelete: () => void;
  onSendReminder: () => void;
  reminderSent?: boolean;
}

// ── Card ──────────────────────────────────────────────────────────────────────
const HomeworkCard = ({ hw, onEdit, onDelete, onSendReminder, reminderSent }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isHwPast = hw.status === "PAST";
  const isPhysical = hw.submission_type === "physical";

  // ── Fetch live submission counts (skip for physical) ─────────────────────
  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ["submissions", hw.id],
    queryFn: () => getSubmissionsByHomeworkId(hw.id),
    staleTime: 1000 * 60 * 2,
    enabled: !!hw.id && !isPhysical,
  });

  const students       = subData?.data ?? [];
  const totalCount     = students.length;
  const submittedCount = students.filter((s) => s.status === "submitted").length;
  const pendingCount   = totalCount - submittedCount;

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-2.5 transition-all duration-200 hover:shadow-md"
        style={{ opacity: isHwPast ? 0.82 : 1 }}
      >
        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-[5px]">
            <SubjectPill subject={hw.subject} />
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
              {hw.className}{hw.section ? ` – ${hw.section}` : ""}
            </span>
            <WABadge status={hw.waNotifyStatus} notifiedAt={hw.waNotifiedAt} />
          </div>

          {/* Edit / Delete */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {!isHwPast && (
              <>
                <Button
                  type="button"
                  onClick={onEdit}
                  variant="ghost"
                  size="sm"
                  className="p-[5px] h-auto rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <Edit3 size={12} />
                </Button>
                <Button
                  type="button"
                  onClick={onDelete}
                  variant="ghost"
                  size="sm"
                  className="p-[5px] h-auto rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ── Title + due badge ── */}
        <div>
          <h3 className="text-xs font-medium text-gray-900 leading-snug mb-1">
            {hw.title}
          </h3>
          <DueBadge dateStr={hw.dueDate} isPast={isHwPast} />
        </div>

        {/* ── Description ── */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {hw.description}
        </p>

        {/* ── Attachment ── */}
        {hw.attachmentName && (
          <a
            href={hw.attachmentUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[4px] text-[10px] font-bold text-indigo-600 bg-indigo-50 px-[8px] py-[3px] rounded-lg hover:bg-indigo-100 transition-colors w-fit"
          >
            <Paperclip size={10} />
            {hw.attachmentName}
          </a>
        )}

        {/* ── Submission bar (hidden for physical) ── */}
        {!isPhysical && (
          <SubmissionBar
            submitted={submittedCount}
            total={totalCount}
            loading={subLoading}
          />
        )}

        {/* ── Footer actions ── */}
        <div className="flex items-center gap-2 pt-0.5">
          {!isPhysical && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="flex-1 h-7 rounded-lg text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 gap-1"
            >
              <Eye size={12} />
              View Submissions
            </Button>
          )}

          {!isHwPast && pendingCount > 0 && !subLoading && !isPhysical && (
            <Button
              type="button"
              onClick={onSendReminder}
              disabled={reminderSent}
              size="sm"
              className={`flex items-center gap-1 h-7 px-3 rounded-xl text-[11px] font-bold transition-all ${
                reminderSent
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default hover:bg-emerald-50"
                  : "bg-amber-400 hover:bg-amber-500 text-white border-none shadow-sm"
              }`}
            >
              <MessageCircle size={11} strokeWidth={2.5} />
              {reminderSent ? "Reminded!" : `Remind (${pendingCount})`}
            </Button>
          )}
        </div>
      </div>

      {/* ── Submission drawer ── */}
      {!isPhysical && (
        <SubmissionDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          hw={hw}
        />
      )}
    </>
  );
};

export default HomeworkCard;
