import { useState } from "react";
import { Users } from "lucide-react";
import type { ParentInfo } from "../types/profile.types";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";

interface Props {
  parents: ParentInfo[];
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.07em] text-slate-400">{label}</p>
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] sm:text-[13px] font-medium text-slate-800 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

export default function ParentInfoCard({ parents }: Props) {
  const [previewParent, setPreviewParent] = useState<ParentInfo | null>(null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]">
      <div className="mb-4 flex items-center gap-2">
        <Users size={14} className="text-indigo-500" />
        <h3 className="text-[13px] font-semibold text-slate-900 tracking-wide">Parent / Guardian</h3>
      </div>

      <div className="flex flex-col gap-5">
        {parents.map((p, idx) => (
          <div key={p.id ?? idx}>
            {/* Parent header */}
            <div className="flex items-center gap-3 mb-3">
              {p.image ? (
                <button
                  type="button"
                  title="View photo"
                  onClick={() => setPreviewParent(p)}
                  className="h-9 w-9 flex-shrink-0 rounded-full overflow-hidden border border-slate-100 ring-1 ring-black/5 hover:ring-2 hover:ring-indigo-400 transition"
                >
                  <img src={p.image} alt={p.parent_name} className="h-full w-full object-cover" />
                </button>
              ) : (
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[13px] font-semibold text-indigo-700">
                  {p.parent_name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <p className="text-[13px] font-semibold text-slate-900 leading-tight">{p.parent_name}</p>
                <p className="text-[11px] text-slate-400 capitalize">{p.relation}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem label="Phone" value={p.phone} />
              <InfoItem label="Email" value={p.email} />
              <InfoItem label="Occupation" value={p.occupation} />
            </div>

            {idx < parents.length - 1 && (
              <div className="mt-5 h-px bg-slate-100" />
            )}
          </div>
        ))}
      </div>

      {previewParent?.image && (
        <ImagePreviewModal
          src={previewParent.image}
          alt={previewParent.parent_name}
          title={previewParent.parent_name}
          subtitle={previewParent.relation}
          onClose={() => setPreviewParent(null)}
        />
      )}
    </div>
  );
}
