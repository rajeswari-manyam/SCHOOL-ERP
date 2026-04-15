import { useNavigate } from "react-router-dom";
import { useComplaintsStore } from "../hooks/useComplaintsStore";
import type { Complaint } from "../types/complaints.types";

interface Props {
  complaint: Complaint;
  onClose: () => void;
}

export function ComplaintSubmittedCard({ complaint, onClose }: Props) {
  const navigate = useNavigate();
  const resetForm = useComplaintsStore((s) => s.resetForm);

  const submittedDate = complaint.submittedAt
    ? new Date(complaint.submittedAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "";

  return (
    <div className="p-8 flex flex-col items-center text-center gap-5">

      {/* TOP ROW — title + badge */}
      <div className="w-full flex items-center justify-between">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Complaint Desk
        </p>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#EDFCF2] text-[#006C49] uppercase tracking-wide">
          Instant Confirmation
        </span>
      </div>

      {/* SUCCESS ICON */}
      <div className="w-20 h-20 rounded-full bg-[#1D9E75] flex items-center justify-center mt-2">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l5 5L20 7"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* TITLE */}
      <div>
        <p className="text-[22px] font-bold text-[#1D9E75]">
          Complaint Submitted!
        </p>
        <p className="text-[13px] text-gray-400 mt-1">
          Expected response within 48 hours
        </p>
      </div>
<p className="text-[12px] text-gray-400">
  Submitted on {submittedDate}
</p>
      {/* REFERENCE */}
      <div className="bg-[#EEF2FF] rounded-xl px-6 py-3">
        <p className="text-[14px] font-bold text-[#3525CD]">
          Reference: {complaint.referenceNo}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 w-full mt-2">
        <button
          onClick={onClose}
          className="
            flex-1 py-3 rounded-xl
            border border-[#E8EBF2]
            text-[13px] font-semibold text-[#0B1C30]
            hover:bg-[#F4F6FB] transition
          "
        >
          View Track History
        </button>
        <button
          onClick={() => {
            resetForm();
            onClose();
            navigate("/parent/dashboard");
          }}
          className="
            flex-1 py-3 rounded-xl
            bg-[#3525CD] text-white text-[13px] font-semibold
            hover:bg-[#2a1eb0] active:scale-[0.98] transition
          "
        >
          Return to Dashboard
        </button>
      </div>

    </div>
  );
}