import React from "react";
import type { Assignment } from "../types/Homework.types";
import {
  SUBJECT_STYLES,
  SUBJECT_LABELS,
  STATUS_STYLES,
  getDueBadgeLabel,
  getDueBadgeStyle,
  formatSubmittedAt,
} from "../utils/Homework.utils";

interface Props {
  assignment: Assignment;
  onSubmit: (assignment: Assignment) => void;
}

const AssignmentCard: React.FC<Props> = ({ assignment, onSubmit }) => {
  const subjectStyle = SUBJECT_STYLES[assignment.subject];
  const statusStyle = STATUS_STYLES[assignment.status];
  const dueBadge = getDueBadgeLabel(assignment.dueDate);
  const dueBadgeStyle = getDueBadgeStyle(dueBadge);
  const isSubmitted = assignment.status === "SUBMITTED" || assignment.status === "GRADED";

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 border-l-4 ${subjectStyle.border} flex flex-col gap-3`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wide ${subjectStyle.badge}`}>
            {SUBJECT_LABELS[assignment.subject]}
          </span>
          {!isSubmitted && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-md uppercase ${dueBadgeStyle}`}>
              {dueBadge}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">Assigned by: {assignment.assignedBy}</span>
      </div>

      {/* Title & description */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">{assignment.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {assignment.description}
        </p>
      </div>

      {/* Attachments */}
      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {assignment.attachments.map((file) => (
            <a
              key={file.name}
              href={file.url}
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>📎</span>
              <span>{file.name}</span>
            </a>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between mt-1">
        {isSubmitted ? (
          <div className="flex items-center gap-1.5">
            <span className="text-green-500 text-sm">✅</span>
            <span className="text-sm font-medium text-green-600">Submitted</span>
            {assignment.submittedAt && (
              <span className="text-xs text-gray-400 ml-1">
                · Submitted on {formatSubmittedAt(assignment.submittedAt)}
              </span>
            )}
            {assignment.grade && (
              <span className="ml-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {assignment.grade}
              </span>
            )}
          </div>
        ) : (
          <span className={`text-xs font-medium ${statusStyle.color}`}>
            {statusStyle.text}
          </span>
        )}

        {!isSubmitted && (
          <button
            onClick={() => onSubmit(assignment)}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;