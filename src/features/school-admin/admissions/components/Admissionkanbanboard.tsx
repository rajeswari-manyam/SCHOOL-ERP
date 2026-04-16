import type { Admission, AdmissionStage } from "../types/admissions.types";
import { SourceBadge } from "./Admissionbadges";

// ─── WA icon ─────────────────────────────────────────────────────────────────
const WAIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Single enquiry card ──────────────────────────────────────────────────────
const EnquiryCard = ({
  admission,
  isSelected,
  onClick,
}: {
  admission: Admission;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border transition-all ${
      isSelected
        ? "border-indigo-400 bg-indigo-50 shadow-md"
        : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <p className="text-sm font-bold text-gray-900 leading-tight">{admission.studentName}</p>
      {(admission.whatsappSent || admission.welcomeWhatsappSent) && (
        <span className="flex-shrink-0">
          <WAIcon />
        </span>
      )}
    </div>
    <p className="text-xs text-gray-500 mt-1">
      Class {admission.classApplied}
      {admission.interviewDate && ` • ${admission.interviewDate}`}
      {admission.interviewTime && ` ${admission.interviewTime}`}
    </p>
    {admission.source && (
      <div className="mt-2">
        <SourceBadge source={admission.source} />
      </div>
    )}
    {admission.parentPhone && (
      <p className="text-[11px] text-gray-400 mt-1">{admission.parentPhone}</p>
    )}
    {admission.documents && (
      <div className="mt-2 space-y-0.5">
        {admission.documents.map(doc => (
          <div key={doc.id} className="flex items-center gap-1 text-[11px]">
            {doc.verified
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            <span className={doc.verified ? "text-gray-600" : "text-amber-600 font-semibold"}>
              {doc.name}{!doc.verified ? " Pending" : ""}
            </span>
          </div>
        ))}
      </div>
    )}
    {admission.admissionNo && (
      <p className="text-[10px] text-indigo-600 font-bold mt-1">{admission.admissionNo}</p>
    )}
    {admission.declineReason && (
      <p className="text-[11px] text-red-500 mt-1 line-clamp-2">{admission.declineReason}</p>
    )}
    {admission.interviewNote && (
      <p className="text-[11px] text-gray-400 mt-1 italic line-clamp-2">{admission.interviewNote}</p>
    )}
  </button>
);

// ─── Column header ────────────────────────────────────────────────────────────
const STAGE_CONFIG: Record<AdmissionStage, { label: string; color: string; dot: string }> = {
  ENQUIRY:       { label: "Enquiry",      color: "text-gray-700",   dot: "bg-indigo-400"  },
  INTERVIEW:     { label: "Interview",    color: "text-amber-700",  dot: "bg-amber-400"   },
  DOCS_VERIFIED: { label: "Docs Verified",color: "text-violet-700", dot: "bg-violet-400"  },
  CONFIRMED:     { label: "Confirmed",    color: "text-emerald-700",dot: "bg-emerald-500" },
  DECLINED:      { label: "Declined",     color: "text-red-600",    dot: "bg-red-400"     },
};

// ─── Main Kanban Board ────────────────────────────────────────────────────────
interface Props {
  byStage: Record<AdmissionStage, Admission[]>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const STAGES: AdmissionStage[] = ["ENQUIRY", "INTERVIEW", "DOCS_VERIFIED", "CONFIRMED", "DECLINED"];

const AdmissionKanbanBoard = ({ byStage, selectedId, onSelect }: Props) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map(stage => {
        const cfg = STAGE_CONFIG[stage];
        const items = byStage[stage];
        return (
          <div key={stage} className="flex-shrink-0 w-64">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>
                {cfg.label}
              </span>
              <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            {/* Cards */}
            <div className="space-y-3">
              {items.map(a => (
                <EnquiryCard
                  key={a.id}
                  admission={a}
                  isSelected={a.id === selectedId}
                  onClick={() => onSelect(a.id === selectedId ? null : a.id)}
                />
              ))}
              {items.length === 0 && (
                <div className="h-20 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center">
                  <p className="text-xs text-gray-300">No records</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdmissionKanbanBoard;