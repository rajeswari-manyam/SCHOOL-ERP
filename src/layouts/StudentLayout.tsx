import { memo } from "react";
import { Outlet } from "react-router-dom";
import StudentTopNavBar from "../features/student/dashboard/components/StudentTopNavBar";

const StudentLayout = memo(() => {
  return (
    <div className="min-h-screen bg-[#EFF4FF] flex flex-col">

      {/* ───── TOP NAVBAR ───── */}
      <StudentTopNavBar />

      {/* ───── PAGE CONTENT ───── */}
      <main
        className="
          flex-1
          w-full
          max-w-[1650px]
          mx-auto
          px-3 sm:px-4 md:px-6 lg:px-8
          py-3 sm:py-4 md:py-6 lg:py-8
        "
      >
        <Outlet />
      </main>

    </div>
  );
});

export default StudentLayout;