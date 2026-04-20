import { ACADEMIC_INFO_FIELDS } from "../utils/Profile.utils";
import type { AcademicInfo } from "../types/profile.types";

interface AcademicInfoCardProps {
  academic: AcademicInfo;
}

const AcademicInfoCard = ({ academic }: AcademicInfoCardProps) => {
  const values: Record<string, string> = {
    academicYear: academic.academicYear,
    board: academic.board,
    section: academic.section,
    classRoom: academic.classRoom,
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-slate-950">Academic Information</h3>

      <div className="space-y-3 text-sm text-slate-700">
        {ACADEMIC_INFO_FIELDS.map(({ key, label }) => (
          <div className="flex justify-between" key={key}>
            <span>{label}</span>
            <span className="font-semibold text-slate-900">{values[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicInfoCard;
