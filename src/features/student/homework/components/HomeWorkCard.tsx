import { Paperclip, FileText, Download } from "lucide-react";
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
// Fallback for subjects not in the map (e.g. Telugu, Computer, EVS)
const DEFAULT_BADGE = "bg-gray-50 text-gray-600 border border-gray-200";

const dueBadge: Record<string, string> = {
  urgent: "bg-rose-50 text-rose-600 border border-rose-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  normal: "bg-green-50 text-green-700 border border-green-200",
};

const attachmentIcon = (name: string) =>
  name.endsWith(".pdf") ? Paperclip : FileText;

export const HomeworkCard = ({ item, onSubmit }: Props) => {
  const subjectCls = subjectBadge[item.subject] ?? DEFAULT_BADGE;

  const dueCls = dueBadge[item.dueUrgency] ?? dueBadge.normal;
  const attachmentUrls = item.attachments?.length ? item.attachments : item.attachment ? [item.attachment] : [];

  return (
<div
  className="bg-white rounded-2xl border border-gray-100
             px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3 sm:gap-4
             shadow-sm
             hover:border-indigo-400 hover:shadow-lg
             hover:-translate-y-[2px]
             transition-all duration-200 ease-in-out"
>

      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        
        {/* badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${subjectCls}`}>
            {item.subject}
          </span>

          <span className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${dueCls}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {item.dueDate}
          </span>
        </div>

        {/* assigned by */}
        <span className="text-[11px] sm:text-[12px] text-gray-400">
          Assigned by{" "}
          <span className="text-gray-600 font-medium">{item.assignedBy}</span>
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 leading-snug">
          {item.title}
        </h3>
        <p className="text-[11.5px] sm:text-[12.5px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Attachments */}
      {attachmentUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachmentUrls.map((url, i) => {
            const name = url.split("/").pop() ?? url;
            const AttachIcon = attachmentIcon(name);
            return (
              <a
                key={`${url}-${i}`}
                href={url}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center gap-1.5 text-indigo-600 text-[11.5px] sm:text-[12px] cursor-pointer hover:underline w-fit"
              >
                <AttachIcon size={12} />
                {name}
                <Download size={12} />
              </a>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-2 border-t border-gray-100">

        {item.submitted ? (
          <span className="text-[11px] font-semibold text-green-700 bg-green-50 
                           border border-green-200 px-3 py-1.5 rounded-lg w-fit sm:w-auto">
            ✓ Submitted
          </span>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">

            <button
              onClick={() => onSubmit(item)}
              className="w-full sm:w-auto text-[12px] font-semibold px-4 sm:px-[18px] py-2 sm:py-1.5 
                         bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Submit
            </button>

            <span className="text-[9.5px] sm:text-[10px] font-bold text-red-500 uppercase tracking-widest text-center sm:text-right">
              Not yet submitted
            </span>
          </div>
        )}
      </div>
    </div>
  );
};