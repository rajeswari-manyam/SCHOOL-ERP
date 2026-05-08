import { motion, easeOut } from "framer-motion";
import { useStudent, useDownload } from "../hooks/useProfile";
import ProfileCard from "../components/ProfileCard";
import AcademicInfoCard from "../components/AcademicInfoCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import QuickDownloads from "../components/QuickDownloads";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};
// ─── Page ─────────────────────────────────────────────────────────────────────
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
      <motion.h1
        className="mb-4 sm:mb-5 text-[20px] sm:text-[22px] font-semibold tracking-tight text-slate-900"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        My Profile
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[260px_1fr]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <motion.div
            variants={itemVariants}
            className="rounded-2xl transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]"
          >
            <ProfileCard student={student} />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="rounded-2xl transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]"
          >
            <AcademicInfoCard academic={student.academic} />
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <motion.div
            variants={itemVariants}
            className="rounded-2xl transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]"
          >
            <PersonalInfoCard personal={student.personal} />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="rounded-2xl transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-[2px]"
          >
            <QuickDownloads
              downloads={student.quickDownloads}
              downloadingId={downloading}
              downloadedId={downloaded}
              onDownload={handleDownload}
            />
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
