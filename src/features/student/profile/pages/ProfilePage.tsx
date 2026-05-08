import { useStudent, useDownload } from "../hooks/useProfile";
import ProfileCard from "../components/ProfileCard";
import AcademicInfoCard from "../components/AcademicInfoCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import QuickDownloads from "../components/QuickDownloads";

// ─── Skeleton ───────────────────────────────────────────────

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

// ─── Page ───────────────────────────────────────────────

export default function ProfilePage() {
  const { student, loading, error } = useStudent();
  const { downloading, downloaded, handleDownload } = useDownload();

  if (loading) return <Skeleton />;

  if (error || !student) {
    return (
      <div className="flex items-center justify-center p-10 sm:p-12 text-sm text-slate-500">
        {error ?? "Could not load student profile."}
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 pb-10">
      {/* Header */}
      <h1 className="mb-4 sm:mb-5 text-[20px] sm:text-[22px] font-semibold tracking-tight text-slate-900">
        My Profile
      </h1>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[260px_1fr]">

        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <div
            className="
              rounded-2xl transition-all duration-200
              hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]
            "
          >
            <ProfileCard student={student} />
          </div>

          <div
            className="
              rounded-2xl transition-all duration-200
              hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]
            "
          >
            <AcademicInfoCard academic={student.academic} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">

          <div
            className="
              rounded-2xl transition-all duration-200
              hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]
            "
          >
            <PersonalInfoCard personal={student.personal} />
          </div>

          <div
            className="
              rounded-2xl transition-all duration-200
              hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]
            "
          >
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