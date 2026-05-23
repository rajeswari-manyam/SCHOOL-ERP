import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, X, AlertCircle, MessageSquareWarning } from "lucide-react";
import { useComplaintsStore } from "../hooks/useComplaintsStore";
import { RaiseComplaintCard } from "../components/RaiseComplaintBox";
import { ComplaintSubmittedCard } from "../components/ComplaintsSubmittedBox";

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
  };
};

export default function ComplaintsPage() {
  const { submitted } = useComplaintsStore();
  const { activeChild } = useOutletContext<ParentLayoutContext>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successComplaint, setSuccessComplaint] = useState<typeof submitted[0] | null>(null);

  const handleSubmitSuccess = () => {
    const store = useComplaintsStore.getState();
    const latest = store.submitted[0];
    setSuccessComplaint(latest);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">

      {/* ── RAISE COMPLAINT MODAL ── */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsFormOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#F3F4F6]">
              <p className="text-[15px] font-bold text-[#0B1C30]">Raise a Complaint</p>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E8EBF2] text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-6">
              <RaiseComplaintCard onSubmitSuccess={handleSubmitSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {successComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <ComplaintSubmittedCard
              complaint={successComplaint}
              onClose={() => setSuccessComplaint(null)}
            />
          </div>
        </div>
      )}

      {/* ── PAGE ── */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-8">

        {/* HEADER ROW */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[12px] text-gray-400 mb-1">
              {activeChild.name} ›
              <span className="text-gray-600 font-medium"> Complaints</span>
            </p>
            <h1 className="text-[22px] font-bold text-[#0B1C30]">Complaints</h1>
            <p className="text-[13px] text-gray-400 mt-1">
              Track and manage complaints for {activeChild.name}.
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="
              flex items-center gap-2 px-4 py-2.5
              bg-[#3525CD] text-white
              text-[13px] font-semibold rounded-xl
              hover:bg-[#2a1eb0] active:scale-95
              transition-all duration-200 shrink-0 mt-1
            "
          >
            <Plus size={14} strokeWidth={2.5} />
            Raise Complaint
          </button>
        </div>

        {/* SUBMITTED LIST */}
        {submitted.length > 0 ? (
          <div className="flex flex-col gap-4">
            {submitted.map((complaint) => (
              <SubmittedListCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8EBF2] px-6 py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} color="#3525CD" strokeWidth={1.5} />
            </div>
            <p className="text-[14px] font-semibold text-[#0B1C30] mb-1">No complaints yet</p>
            <p className="text-[12px] text-gray-400">Click "Raise Complaint" to submit a new concern.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SubmittedListCard({ complaint }: { complaint: any }) {
  const submittedDate = complaint.submittedAt
    ? new Date(complaint.submittedAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "";

  const STATUS_STYLE: Record<string, string> = {
    submitted: "bg-[#EEF2FF] text-[#3525CD]",
    pending:   "bg-[#FEF9C3] text-[#854d0e]",
    resolved:  "bg-[#DCFCE7] text-[#166534]",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8EBF2] p-5 flex items-start justify-between gap-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 mt-0.5">
          <MessageSquareWarning size={16} color="#3525CD" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#0B1C30] mb-0.5">{complaint.subject}</p>
          <p className="text-[11px] text-gray-400 mb-2">{complaint.category} · {submittedDate}</p>
          {complaint.referenceNo && (
            <span className="text-[11px] font-semibold text-[#3525CD] bg-[#EEF2FF] px-2 py-0.5 rounded-md">
              {complaint.referenceNo}
            </span>
          )}
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shrink-0 ${STATUS_STYLE[complaint.status] ?? STATUS_STYLE.pending}`}>
        {complaint.status}
      </span>
    </div>
  );
}