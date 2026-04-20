import { formatDOB, PERSONAL_INFO_FIELDS } from "../utils/Profile.utils";
import type { PersonalInfo } from "../types/profile.types";

const Item = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <div className="mt-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{value}</div>
  </div>
);

interface PersonalInfoCardProps {
  personal: PersonalInfo;
}

const PersonalInfoCard = ({ personal }: PersonalInfoCardProps) => {
  const values: Record<string, string> = {
    dateOfBirth: formatDOB(personal.dateOfBirth),
    gender: personal.gender,
    bloodGroup: personal.bloodGroup,
    age: personal.age,
    fatherName: personal.fatherName,
    fatherPhone: personal.fatherPhone,
    motherName: personal.motherName,
    motherPhone: personal.motherPhone,
    fullAddress: personal.fullAddress,
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-950">Personal Information</h3>
        <p className="text-xs text-slate-400">Contact school admin to update personal information</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {PERSONAL_INFO_FIELDS.map(({ key, label, span }) => (
          <div key={key} className={span > 1 ? "sm:col-span-2" : ""}>
            <Item label={label} value={values[key]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfoCard;
