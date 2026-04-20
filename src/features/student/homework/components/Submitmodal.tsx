import React, { useState, useRef } from "react";
import type { Assignment, SubmitPayload } from "../types/Homework.types";
import { SUBJECT_LABELS } from "../utils/Homework.utils";

interface Props {
  assignment: Assignment;
  isSubmitting: boolean;
  onSubmit: (payload: SubmitPayload) => void;
  onClose: () => void;
}

type SubmitMode = "UPLOAD" | "TEXT";

const SubmitModal: React.FC<Props> = ({ assignment, isSubmitting, onSubmit, onClose }) => {
  const [mode, setMode] = useState<SubmitMode>("UPLOAD");
  const [file, setFile] = useState<File | null>(null);
  const [textResponse, setTextResponse] = useState("");
  const [notes, setNotes] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    onSubmit({
      assignmentId: assignment.id,
      file: mode === "UPLOAD" ? (file ?? undefined) : undefined,
      textResponse: mode === "TEXT" ? textResponse : undefined,
      notesToTeacher: notes || undefined,
    });
  };

  const canSubmit =
    !isSubmitting &&
    (mode === "UPLOAD" ? !!file : textResponse.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Submit Homework</h2>
            <p className="text-sm text-gray-500 mt-0.5">{assignment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none mt-0.5"
          >
            ×
          </button>
        </div>

        {/* Meta info */}
        <div className="mx-6 bg-gray-50 rounded-xl p-4 text-sm space-y-1">
          <div className="flex gap-2 text-gray-600">
            <span className="font-medium">Subject:</span>
            <span className="text-indigo-600 font-semibold">
              {SUBJECT_LABELS[assignment.subject]}
            </span>
            <span>•</span>
            <span>Class: 10A</span>
          </div>
          <div className="flex gap-2 text-gray-600">
            <span className="font-medium">Due:</span>
            <span className="text-orange-500 font-medium">
              {new Date(assignment.dueDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span>Assigned by: {assignment.assignedBy}</span>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-3 mx-6 mt-4">
          <button
            onClick={() => setMode("UPLOAD")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
              mode === "UPLOAD"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            📎 Upload File
          </button>
          <button
            onClick={() => setMode("TEXT")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
              mode === "TEXT"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            📝 Text Response
          </button>
        </div>

        {/* Content area */}
        <div className="mx-6 mt-4">
          {mode === "UPLOAD" ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-indigo-500 bg-indigo-50"
                  : file
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
              <div className="text-3xl mb-2">{file ? "✅" : "⬆️"}</div>
              {file ? (
                <>
                  <p className="text-sm font-semibold text-green-700">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to change file</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    Drag your completed assignment here
                  </p>
                  <p className="text-xs text-gray-400 mt-1">or</p>
                  <p className="text-xs font-semibold text-indigo-600 mt-1">Browse File</p>
                  <p className="text-xs text-gray-400 mt-2">PDF, DOC, JPG, PNG | Max 10MB</p>
                </>
              )}
            </div>
          ) : (
            <textarea
              value={textResponse}
              onChange={(e) => setTextResponse(e.target.value)}
              placeholder="Type your answer here…"
              rows={5}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          )}
        </div>

        {/* Notes */}
        <div className="mx-6 mt-3">
          <label className="text-xs font-medium text-gray-600">
            Notes to Teacher (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes or comments for the teacher"
            rows={2}
            className="w-full mt-1 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mx-6 mt-4 mb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting…" : "Submit Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;