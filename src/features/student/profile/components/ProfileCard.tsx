import type { StudentProfile } from "../types/profile.types";

interface ProfileCardProps {
  student: StudentProfile;
}

const ProfileCard = ({ student }: ProfileCardProps) => {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
        {student.name?.slice(0, 2).toUpperCase()}
      </div>

      <h2 className="mt-4 text-xl font-semibold text-slate-950">{student.name}</h2>
      <p className="text-sm text-slate-500">Admission No: {student.id}</p>
      <p className="mt-2 text-sm text-indigo-600">
        {student.class} | Roll No: {student.rollNo}
      </p>

      <span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
        Active
      </span>

      <button className="mt-6 w-full rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100">
        Download ID Card
      </button>
    </div>
  );
};

export default ProfileCard;
