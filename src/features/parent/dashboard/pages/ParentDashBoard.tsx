import { useOutletContext } from "react-router-dom";
import { StatCard } from "../../../../components/ui/statcard";
import { AttendanceWidget } from "../components/AttendanceWidge";
import { HomeworkCard } from "../components/HomeWorkCard";
import { FeeStatusCard } from "../components/FeeStatusCard";
import { AnnouncementCard } from "../components/AnnouncamentsCard";
import { UpcomingExamsTable } from "../components/UpCommingExampleTimeTable";

type ParentLayoutContext = {
  activeChild: {
    id: number
    name: string
    class: string
    school: string
    avatar: string
  }
}

const DashboardPage = () => {
  const { activeChild } = useOutletContext<ParentLayoutContext>();

  const isPaid = activeChild.id === 2;

  const stats = isPaid
    ? [
        {
          label: "Today's Attendance",
          badge: { text: "Present", variant: "green" as const },
          sub: "7 April 2025",
        },
        {
          label: "Fee Status",
          badge: { text: "All Paid", variant: "green" as const },
          sub: "April fees paid",
        },
        {
          label: "Homework Due",
          value: "2 assignments",
          badge: { text: "Due today", variant: "amber" as const },
        },
        {
          label: "Next Exam",
        value: <span className="text-[#3525CD]">9 days</span>,
          badge: { text: "Mathematics", variant: "blue" as const },
          sub: "Unit Test",
        },
      ]
    : [
        {
          label: "Today's Attendance",
          badge: { text: "Present", variant: "green" as const },
          sub: "7 April 2025",
        },
        {
      
          label: "Fee Status",
          value: <span className="text-[#BA1A1A]">Rs.8,500 Pending</span>,
          badge: { text: "Pending", variant: "red" as const },
          sub: <span className="text-[#BA1A1A]">Tuition-Due 9 Apr</span>, // ✅ updated
        },
        {
          label: "Homework Due",
          value: "2 assignments",
          badge: { text: "Pending submission", variant: "amber" as const },
        },
        {
          label: "Next Exam",
          value: "9 days",
          badge: { text: "Mathematics", variant: "blue" as const },
          sub: "Unit Test",
        },
      ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

      {/* ── Welcome Banner — shown for BOTH children ── */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-white leading-tight">
            Welcome, Suresh Kumar
          </h1>
          <p className="text-white/75 text-[13px] mt-1">
            {activeChild.name} · Class {activeChild.class} · {activeChild.school}
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left: Attendance + Homework */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AttendanceWidget />
          <HomeworkCard variant={isPaid ? "simple" : "card"} />
        </div>

        {/* Right: Fee Status + Announcement */}
        <div className="flex flex-col gap-4">
          <FeeStatusCard isPaid={isPaid} />
          <AnnouncementCard
            variant={isPaid ? "announcements" : "latest"}
            title={isPaid ? "Summer Vacation Schedule" : "School Sports Day 2025"}
            description={
              isPaid
                ? "The school will remain closed for summer break from May 15th to June 20th. Assignments are available in the Academic section."
                : "The Annual School Sports Day is scheduled for the last Saturday of April. Students interested in track and field events are requested to submit their names by April 14."
            }
            tag={isPaid ? "Administrative" : "Latest Announcement"}
            postedAt={isPaid ? "Posted 2 hours ago" : undefined}
          />
        </div>
      </div>

      {/* ── Upcoming Exams ── */}
      <div className="w-full overflow-x-auto">
        <UpcomingExamsTable />
      </div>

    </div>
  );
};

export default DashboardPage;