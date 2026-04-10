import { StatCard } from "@/components/ui/statcard";
import { AttendanceWidget } from "../components/AttendanceWidge";
import { AssignmentsList } from "../components/AssignmentsList";
import { FeeStatusCard } from "../components/FeeStatusCard";
import { UpcomingExamsTable } from "../components/UpCommingExampleTimeTable";
import { useDashboard } from "../hooks/usedashboard";
import typography from "@/styles/typography";

const DashboardPage = () => {
  const { stats } = useDashboard();

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">

      {/* 🔹 Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`${typography.heading.h5} text-[#0B1C30]`}>
            Welcome, Suresh Kumar
          </h1>
          <p className={`${typography.body.xs} text-gray-400`}>
            Ravi Kumar · Class 10A · Hanamkonda Public School
          </p>
        </div>

        <button
          className={`${typography.form.helper} text-[#3525CD] border border-[#3525CD] px-3 py-1.5 rounded-md w-fit`}
        >
          ⇄ Switch Child
        </button>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 hover:cursor-pointer">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>

      {/* 🔹 Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 hover:shadow-lg hover:scale-[1.02]">

        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AttendanceWidget />
          <AssignmentsList />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <FeeStatusCard />

          {/* Announcement */}
          <div className="bg-white border border-[#E8EBF2] rounded-xl p-4">
            <span className={`${typography.body.xs} bg-[#EEF0FF] text-[#3525CD] font-semibold px-2 py-1 rounded inline-block mb-2`}>
              ⭐ Latest Announcement
            </span>

            <p className={`${typography.form.label} text-[#0B1C30] mb-1`}>
              School Sports Day 2025
            </p>

            <p className={`${typography.form.helper} text-gray-500 leading-relaxed`}>
              The Annual School Sports Day is scheduled for the last Saturday of April.
              Students interested in track and field events are requested to submit
              their names by April 14.
            </p>

            <span className={`${typography.form.helper} text-[#3525CD] mt-2 block cursor-pointer`}>
              View All Announcements →
            </span>
          </div>
        </div>
      </div>

      {/* 🔹 Upcoming Exams */}
      <div className="w-full overflow-x-auto">
        <UpcomingExamsTable />
      </div>
    </div>
  );
};

export default DashboardPage;