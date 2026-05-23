import { useNavigate, useOutletContext } from "react-router-dom";

import { StatCard } from "../../../../components/ui/statcard";
import { AttendanceWidget } from "../components/AttendanceWidge";
import { HomeworkCard } from "../components/HomeWorkCard";
import { FeeStatusCard } from "../components/FeeStatusCard";
import { AnnouncementCard } from "../components/AnnouncamentsCard";
import { UpcomingExamsTable } from "../components/UpCommingExampleTimeTable";


import { paidStats, unpaidStats } from "../data/dashboard.data";
import { feeSummary } from "../data/dashboard.data";

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
  };
};

const DashboardPage = () => {
  const { activeChild } = useOutletContext<ParentLayoutContext>();
  const navigate = useNavigate();

  const isPaid = activeChild.id === 2;


  const stats = isPaid ? paidStats : unpaidStats;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

   
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

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className="cursor-pointer hover:scale-[1.02] transition"
          >
            <StatCard {...item} />
          </div>
        ))}
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 flex flex-col gap-4">
          <AttendanceWidget />
          <HomeworkCard variant={isPaid ? "simple" : "card"} />
        </div>

      
        <div className="flex flex-col gap-4">

       
          <FeeStatusCard
            isPaid={isPaid}
            fees={feeSummary.fees}
            lastPayment={feeSummary.lastPayment}
            nextDue={feeSummary.nextDue}
          />

        
          <AnnouncementCard
            variant={isPaid ? "announcements" : "latest"}
            title={
              isPaid
                ? "Summer Vacation Schedule"
                : "School Sports Day 2025"
            }
            description={
              isPaid
                ? "The school will remain closed for summer break from May 15th to June 20th."
                : "Annual Sports Day scheduled for last Saturday of April."
            }
            tag={isPaid ? "Administrative" : "Latest Announcement"}
            postedAt={isPaid ? "Posted 2 hours ago" : undefined}
          />

        </div>
      </div>

     
      <div className="w-full overflow-x-auto">
        <UpcomingExamsTable />
      </div>

    </div>
  );
};

export default DashboardPage;