import type { StudentProfile } from "../types/profile.types";
import { STATUS_STYLES } from "../utils/Profile.utils";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  student: StudentProfile;
}

const ProfileCard = ({ student }: ProfileCardProps) => {
  const status = STATUS_STYLES[student.status] ?? STATUS_STYLES.ACTIVE;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-2xl font-bold text-white">
        {student.avatar ? (
          <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
        ) : (
          student.name?.slice(0, 2).toUpperCase()
        )}
      </div>

      <h2 className="mt-4 text-xl font-semibold text-slate-950">{student.name}</h2>
      <p className="text-sm text-slate-500">Admission No: {student.admissionNo}</p>
      <p className="mt-2 text-sm text-indigo-600">
        {student.class} | Roll No: {student.rollNo}
      </p>

      <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${status.badge}`}>
        {status.label}
      </span>

      <Button className="mt-6 w-full rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100">
        Download ID Card
      </Button>
    </div>
  );
};

export default ProfileCard;
