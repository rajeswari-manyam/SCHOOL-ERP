import { Info } from "lucide-react";
import { formatDOB, PERSONAL_INFO_FIELDS } from "../utils/Profile.utils";
import type { PersonalInfo } from "../types/profile.types";

interface ItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: ItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-medium uppercase tracking-[0.07em] text-slate-400">
        {label}
      </p>
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] sm:text-[13px] font-medium text-slate-800 leading-snug break-words">
        {value || "-"}
      </p>
    </div>
  );
}

interface PersonalInfoCardProps {
  personal: PersonalInfo;
}

export default function PersonalInfoCard({ personal }: PersonalInfoCardProps) {
  const values: Record<string, string> = {
    dateOfBirth: formatDOB(personal.dateOfBirth),
    gender:      personal.gender,
    bloodGroup:  personal.bloodGroup,
    age:         `${personal.age} years`,
    fullAddress: personal.fullAddress,
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h3 className="text-[13px] font-semibold text-slate-900 tracking-wide">
          Personal Information
        </h3>
        <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400">
          <Info size={12} aria-hidden />
          Contact school admin to update personal information
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {PERSONAL_INFO_FIELDS.map(({ key, label, span }) => (
          <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
            <InfoItem label={label} value={values[key]} />
          </div>
        ))}
      </div>
    </div>
  );
}