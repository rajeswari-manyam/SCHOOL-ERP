interface PersonalInfo {
  dob: string;
  gender: string;
  blood: string;
  age: string;
  father: string;
  fatherPhone: string;
  mother: string;
  motherPhone: string;
  address: string;
}

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
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-950">Personal Information</h3>
        <p className="text-xs text-slate-400">Contact school admin to update personal information</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Item label="Date of Birth" value={personal.dob} />
        <Item label="Gender" value={personal.gender} />
        <Item label="Blood Group" value={personal.blood} />
        <Item label="Age" value={personal.age} />
        <Item label="Father's Name" value={personal.father} />
        <Item label="Father's Phone" value={personal.fatherPhone} />
        <Item label="Mother's Name" value={personal.mother} />
        <Item label="Mother's Phone" value={personal.motherPhone} />
      </div>

      <div className="mt-4">
        <Item label="Full Address" value={personal.address} />
      </div>
    </div>
  );
};

export default PersonalInfoCard;
