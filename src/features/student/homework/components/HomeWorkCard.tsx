import { Paperclip, FileText } from "lucide-react";
import type { Homework } from "../types/homework.types";

interface Props {
  item: Homework;
  onSubmit: (hw: Homework) => void;
}

const subjectBadge: Record<string, string> = {
  English:     "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Mathematics: "bg-green-50 text-green-700 border border-green-200",
  Science:     "bg-orange-50 text-orange-700 border border-orange-200",
  SST:         "bg-purple-50 text-purple-700 border border-purple-200",
  Hindi:       "bg-pink-50 text-pink-700 border border-pink-200",
};

const dueBadge: Record<string, string> = {
  urgent: "bg-rose-50 text-rose-600 border border-rose-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  normal: "bg-green-50 text-green-700 border border-green-200",
};

const attachmentIcon = (name: string) =>
  name.endsWith(".pdf") ? Paperclip : FileText;

export const HomeworkCard = ({ item, onSubmit }: Props) => {
  const subjectCls = subjectBadge[item.subject] ?? "bg-gray-50 text-gray-600 border border-gray-200";
  const dueCls = dueBadge[item.dueUrgency] ?? dueBadge.normal;
  const AttachIcon = item.attachment ? attachmentIcon(item.attachment) : Paperclip;

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] px-5 py-[18px] flex flex-col gap-3">

      {/* Top row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${subjectCls}`}>
            {item.subject}
          </span>
          <span className={`flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full ${dueCls}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {item.dueDate}
          </span>
        </div>
        <span className="text-[11.5px] text-gray-400">
          Assigned by{" "}
          <span className="text-gray-600 font-medium">{item.assignedBy}</span>
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="text-[13.5px] font-semibold text-gray-900 leading-snug">
          {item.title}
        </h3>
        <p className="text-[11.5px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Attachment */}
      {item.attachment && (
        <a className="flex items-center gap-1.5 text-indigo-600 text-[11.5px] cursor-pointer hover:underline w-fit">
          <AttachIcon size={12} />
          {item.attachment}
        </a>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end pt-2.5 border-t border-gray-100">
        {item.submitted ? (
          <span className="text-[11.5px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3.5 py-1.5 rounded-lg">
            ✓ Submitted
          </span>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => onSubmit(item)}
              className="text-[12px] font-semibold px-[18px] py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Submit
            </button>
            <span className="text-[9.5px] font-bold text-red-500 uppercase tracking-widest">
              Not yet submitted
            </span>
          </div>
        )}
      </div>
    </div>
  );
};