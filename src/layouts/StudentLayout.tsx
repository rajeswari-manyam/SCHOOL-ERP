import { memo, Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import StudentTopNavBar from "../features/student/dashboard/components/StudentTopNavBar";
import { RouteErrorBoundary } from "../components/common/RouteErrorBoundary";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";

// Shown in the content area while a route's code chunk downloads — the
// nav bar stays mounted so navigation doesn't flash a blank page.
const PageContentLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

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
        <RouteErrorBoundary>
          <Suspense fallback={<PageContentLoader />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </main>

    </div>
  );
});

export default StudentLayout;