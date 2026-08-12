import { useState } from "react";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import type { Student } from "../types/profile.types";
import { STATUS_STYLES } from "../utils/Profile.utils";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";

interface ProfileCardProps {
  student: Student;
}

export default function ProfileCard({ student }: ProfileCardProps) {
  const [dlState, setDlState] = useState<"idle" | "loading" | "done">("idle");
  const [showPhoto, setShowPhoto] = useState(false);
  const status = STATUS_STYLES[student.status] ?? STATUS_STYLES.ACTIVE;

  function handleIdDownload() {
    if (dlState !== "idle") return;
    setDlState("loading");
    setTimeout(() => {
      setDlState("done");
      setTimeout(() => setDlState("idle"), 2500);
    }, 1400);
  }

  return (
    <div
      className="
        rounded-2xl border border-slate-200 bg-white
        shadow-sm
        transition-all duration-200
        hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]
      "
    >
      {/* Avatar + identity */}
      <div className="flex flex-col items-center px-4 sm:px-6 pt-6 sm:pt-7 pb-4 sm:pb-5 text-center">
        {student.photo ? (
          <button type="button" onClick={() => setShowPhoto(true)}>
            <img
              src={student.photo}
              alt={student.name}
              className="h-[64px] w-[64px] sm:h-[68px] sm:w-[68px] rounded-full object-cover ring-1 ring-black/5 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </button>
        ) : (
          <div
            className="flex h-[64px] w-[64px] sm:h-[68px] sm:w-[68px]
            items-center justify-center rounded-full text-[20px] sm:text-[22px]
            font-semibold text-white"
            style={{ backgroundColor: student.avatarColor }}
            aria-label={`Avatar for ${student.name}`}
          >
            {student.avatarInitials}
          </div>
        )}

        <h2 className="mt-3 text-[15px] sm:text-[17px] font-semibold text-slate-900 leading-tight break-words">
          {student.name}
        </h2>

        <p className="mt-1 text-[11px] sm:text-xs text-slate-400">
          Admission No: {student.admissionNo}
        </p>

        <p className="mt-2 text-[12px] sm:text-[13px] font-medium text-indigo-600 text-center">
          {student.className} | Roll No: {student.rollNo}
        </p>

        <span
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${status.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mx-4 sm:mx-5" />

      {/* Class teacher */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4">
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] sm:text-[11px] font-semibold text-indigo-700">
          {student.classTeacher.avatarInitials}
        </div>

        <div className="min-w-0">
          <p className="text-[9px] sm:text-[10px] text-slate-400 leading-none mb-0.5">
            Class Teacher
          </p>
          <p className="text-[12px] sm:text-[13px] font-medium text-slate-700 break-words">
         {student.classTeacher.name}
          </p>
        </div>
      </div>

      {/* Download button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleIdDownload}
          disabled={dlState === "loading"}
          className={`
            flex w-full items-center justify-center gap-2
            rounded-xl px-4 py-2.5 text-[12px] sm:text-[13px] font-semibold
            border transition-all duration-200 active:scale-[0.98]
            disabled:cursor-wait
            ${
              dlState === "done"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300"
            }
          `}
        >
          {dlState === "loading" && (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          )}
          {dlState === "done" && <CheckCircle size={14} aria-hidden />}
          {dlState === "idle" && <Download size={14} aria-hidden />}

          <span>
            {dlState === "loading"
              ? "Preparing…"
              : dlState === "done"
              ? "Downloaded!"
              : "Download ID Card"}
          </span>
        </button>
      </div>

      {showPhoto && student.photo && (
        <ImagePreviewModal
          src={student.photo}
          alt={student.name}
          title={student.name}
          subtitle={`${student.className} · Roll No: ${student.rollNo}`}
          onClose={() => setShowPhoto(false)}
        />
      )}
    </div>
  );
}