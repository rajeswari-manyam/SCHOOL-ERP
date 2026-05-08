import { ACADEMIC_INFO_FIELDS } from "../utils/Profile.utils";
import type { AcademicInfo } from "../types/profile.types";

interface AcademicInfoCardProps {
  academic: AcademicInfo;
}

export default function AcademicInfoCard({ academic }: AcademicInfoCardProps) {
  const values: Record<string, string> = {
    academicYear: academic.academicYear,
    board: academic.board,
    section: academic.section,
    classroom: academic.classroom,
  };

  return (
    <div className="
      rounded-2xl border border-slate-200 bg-white
      p-4 sm:p-5
      shadow-sm
      transition-all duration-200
      hover:border-indigo-300 hover:shadow-md hover:-translate-y-[1px]
    ">
      <h3 className="mb-3 text-xs sm:text-[13px] font-semibold text-slate-900 tracking-wide">
        Academic Information
      </h3>

      <div className="divide-y divide-slate-100">
        {ACADEMIC_INFO_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className="
              flex items-start sm:items-center justify-between
              gap-3 py-2 sm:py-[9px]
              first:pt-0 last:pb-0
            "
          >
            <span className="text-[11px] sm:text-xs text-slate-500">
              {label}
            </span>

            <span
              className="
                text-[11px] sm:text-xs font-semibold text-slate-900
                text-right break-words max-w-[55%]
              "
            >
              {values[key] || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}