import { Suspense, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ParentTopNavBar from "../features/parent/dashboard/components/ParentTopNavBar";
import { RouteErrorBoundary } from "../components/common/RouteErrorBoundary";
import WhatsAppFAB from "../components/ui/whatsappfab";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";
import { useParentChildren } from "./hooks/useParentChildren";
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

const ParentLayout = () => {
  const students = useAuthStore((s) => s.students);
  const user = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);
  const location = useLocation();

  const { children, activeChild, setActiveChild, loading, error, refetch } = useParentChildren();

  const [showChildModal, setShowChildModal] = useState(false);

  // Always refresh the parent's own profile once per page load (for their
  // avatar photo) — there's no reliable persisted signal for "already fresh".
  useEffect(() => {
    const userId = user?.id ?? localStorage.getItem("userId");
    if (!userId) return;
    getUserById(userId)
      .then(profile => { if (profile?.status) setUserProfile(profile); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to top on every page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // ── Always render the shell so <Outlet> stays mounted ──────────────────────
  // Early returns that remove <Outlet> from the tree cause React Router v7
  // to lose the route context and stale-render the previous page.
  return (
    <div className="min-h-screen bg-[#F4F6FA] overflow-x-hidden">
      {/* Nav shell renders immediately after login — activeChild is null
          for the brief moment before the linked-children fetch resolves,
          and ParentTopNavBar already handles that (shows placeholders)
          instead of the whole screen going blank behind a spinner. */}
      <ParentTopNavBar
        activeChild={activeChild}
        onSwitchChild={() => setShowChildModal(true)}
        hasMultipleChildren={children.length > 1}
      />

      <main
        className={
          showChildModal ? "blur-sm pointer-events-none select-none" : ""
        }
      >
        {/* Loading screen — Outlet still mounts below (zero-height, invisible).
            The nav bar above is already visible, so this only needs to fill
            the content area, not the whole viewport. */}
        {loading && (
          <div className="py-24 flex items-center justify-center">
            <p className="text-sm text-gray-400">Loading…</p>
          </div>
        )}

        {!loading && students.length === 0 && (
          <div className="py-24 flex items-center justify-center text-gray-500 text-sm">
            No student is linked to this parent.
          </div>
        )}

        {!loading && students.length > 0 && !activeChild && (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-500 text-sm">
            <p>{error ?? "No student profiles found."}</p>
            {error && (
              <button
                onClick={refetch}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#3525CD] text-white hover:bg-[#2a1da3] transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Always keep Outlet in the tree — hidden while loading.
            key={location.pathname} forces a clean remount on every route
            change — works around a React Router v7 quirk where the outlet
            can otherwise keep rendering the previous page after the URL
            has already changed. */}
        <div className={loading || students.length === 0 || !activeChild ? "hidden" : ""}>
          <RouteErrorBoundary>
            <Suspense fallback={<PageContentLoader />}>
              <Outlet key={location.pathname} context={{ activeChild }} />
            </Suspense>
          </RouteErrorBoundary>
        </div>
      </main>

      {/* Switch-child modal */}
      {showChildModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowChildModal(false)}
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setShowChildModal(false)}
          >
            <div
              className="w-full max-w-sm bg-white rounded-xl shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold">Select Child</h2>
                <button onClick={() => setShowChildModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {children.map((child) => {
                  const isActive = activeChild?.studentId === child.studentId;
                  return (
                    <button
                      key={child.studentId}
                      onClick={() => {
                        setActiveChild(child);
                        setShowChildModal(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg border ${
                        isActive
                          ? "bg-indigo-100 border-indigo-500"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm text-gray-500">
                        Class {child.classDetail?.className || "-"}{" "}
                        {child.sectionDetail?.sectionName || "-"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <WhatsAppFAB />
    </div>
  );
};

export default ParentLayout;