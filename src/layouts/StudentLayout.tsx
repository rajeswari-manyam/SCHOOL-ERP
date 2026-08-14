import { memo, Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import StudentTopNavBar from "../features/student/dashboard/components/StudentTopNavBar";
import { RouteErrorBoundary } from "../components/common/RouteErrorBoundary";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";
import { SkeletonStatGrid, SkeletonChartCard, SkeletonTableCard } from "@/components/common/skeletons";

// Shown in the content area while a route's code chunk downloads — the
// nav bar stays mounted so navigation doesn't flash a blank page. Can't know
// which specific page is about to render, so it approximates the common
// shape (stat row + two content blocks) rather than a blank/spinner screen.
const PageContentLoader = () => (
  <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading page">
    <SkeletonStatGrid count={4} cols={4} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <SkeletonTableCard rows={4} />
      </div>
      <SkeletonChartCard height="h-56" />
    </div>
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