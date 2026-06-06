import { useAuthStore } from "@/store/authStore";
import { useStudent, useDownload, useClassId, useClassTeacher } from "../hooks/useProfile";
import ProfileCard from "../components/ProfileCard";
import AcademicInfoCard from "../components/AcademicInfoCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import QuickDownloads from "../components/QuickDownloads";
import type { Student } from "../types/profile.types";

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-4 animate-pulse" aria-label="Loading profile…">
      <div className="h-6 w-28 sm:w-32 rounded-lg bg-slate-200" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <div className="h-60 sm:h-64 rounded-2xl bg-slate-200" />
          <div className="h-36 sm:h-40 rounded-2xl bg-slate-200" />
        </div>
        <div className="space-y-4">
          <div className="h-64 sm:h-72 rounded-2xl bg-slate-200" />
          <div className="h-44 sm:h-48 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

// ─── Inner ───────────────────────────────────────────────────────────────────

interface InnerProps {
  student:        Student;
  downloading:    string | null;
  downloaded:     string | null;
  handleDownload: (id: string, title: string) => void;
}

function ProfileInner({ student, downloading, downloaded, handleDownload }: InnerProps) {

  const class_name  = student.rawClass;
  const section     = student.section;
  const school_code = student.schoolCode;

  const { classRecord, classLoading } = useClassId({
    class_name,
    section,
    school_code,
    academic_year: "2025-2026",
  });

  // Fetch real class teacher from /tenant/getallstaff
  const { teacher, teacherLoading } = useClassTeacher({ class_name, section });

  // Build the teacher object for ProfileCard
  const resolvedTeacher = !teacherLoading && teacher
    ? {
        id:             teacher.id,
        name:           teacher.name || "Not assigned",
        title:          "",
        avatarInitials: teacher.name
          ? teacher.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
          : "--",
      }
    : student.classTeacher;

  // Merge resolved teacher into student object for ProfileCard
  const studentWithTeacher: Student = {
    ...student,
    classTeacher: resolvedTeacher,
  };

  return (
    <main className="p-4 sm:p-6 pb-10">

      {/* Header */}
      <h1 className="mb-4 sm:mb-5 text-[20px] sm:text-[22px] font-semibold tracking-tight text-slate-900">
        My Profile
      </h1>

      {/* Class ID badge */}
      {!classLoading && classRecord && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-indigo-400">
            Class ID
          </span>
          <span className="font-mono text-[12px] font-semibold text-indigo-700 select-all">
            {classRecord.id}
          </span>
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[260px_1fr]">

        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]">
            <ProfileCard student={studentWithTeacher} />
          </div>
          <div className="rounded-2xl transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]">
            <AcademicInfoCard
              academic={student.academic}
              classId={classRecord?.id}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]">
            <PersonalInfoCard personal={student.personal} />
          </div>
          <div className="rounded-2xl transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]">
            <QuickDownloads
              downloads={student.quickDownloads}
              downloadingId={downloading}
              downloadedId={downloaded}
              onDownload={handleDownload}
            />
          </div>
        </div>

      </div>
    </main>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const user      = useAuthStore((state) => state.user);
  const studentId = user?.id ?? "";

  const { student, loading, error } = useStudent(studentId);
  const { downloading, downloaded, handleDownload } = useDownload();

  if (loading) return <Skeleton />;

  if (!student) {
    return (
      <div className="flex items-center justify-center p-10 sm:p-12 text-sm text-slate-500">
        {error ?? "Could not load student profile."}
      </div>
    );
  }

  return (
    <ProfileInner
      student={student}
      downloading={downloading}
      downloaded={downloaded}
      handleDownload={handleDownload}
    />
  );
}