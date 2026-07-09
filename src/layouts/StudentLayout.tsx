import { memo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import StudentTopNavBar from "../features/student/dashboard/components/StudentTopNavBar";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";

const StudentLayout = memo(() => {
  const user = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);

  // Always refresh the full profile once per page load — there's no
  // reliable persisted signal for "the avatar is already fresh".
  useEffect(() => {
    const userId = user?.id ?? localStorage.getItem("userId");
    if (!userId) return;
    getUserById(userId)
      .then(profile => { if (profile?.status) setUserProfile(profile); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          pt-1 sm:pt-2 pb-4 sm:pb-6 lg:pb-8
        "
      >
        <Outlet />
      </main>

    </div>
  );
});

export default StudentLayout;