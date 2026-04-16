import type { AcademicInfo } from "../types/profile.types";

interface AcademicInfoCardProps {
  academic: AcademicInfo;
}

const AcademicInfoCard = ({ academic }: AcademicInfoCardProps) => {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-slate-950">Academic Information</h3>

      <div className="space-y-3 text-sm text-slate-700">
        <div className="flex justify-between">
          <span>Academic Year</span>
          <span className="font-semibold text-slate-900">{academic.academicYear}</span>
        </div>
        <div className="flex justify-between">
          <span>Board</span>
          <span className="font-semibold text-slate-900">{academic.board}</span>
        </div>
        <div className="flex justify-between">
          <span>Section</span>
          <span className="font-semibold text-slate-900">{academic.section}</span>
        </div>
        <div className="flex justify-between">
          <span>Class Room</span>
          <span className="font-semibold text-slate-900">{academic.room}</span>
        </div>
      </div>
    </div>
  );
};

export default AcademicInfoCard;
