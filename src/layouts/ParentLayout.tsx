import { useState } from "react";
import { Outlet } from "react-router-dom";
import ParentTopNavBar from "../features/parent/dashboard/components/ParentTopNavBar";
import WhatsAppFAB from "../components/ui/whatsappfab";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useParentChildren } from "./hooks/useParentChildren";

const ParentLayout = () => {
  const authUser = useAuthStore((s) => s.user);

  const parentId =
    localStorage.getItem("parentId") || authUser?.id;

  // ✅ FIX: Ensure parentId exists
  if (!parentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No parent ID found
      </div>
    );
  }

  const {
    children,
    activeChild,
    setActiveChild,
    loading,
  } = useParentChildren(parentId);

  const [showChildModal, setShowChildModal] = useState(false);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  // ✅ No child found
  if (!activeChild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No student profiles found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      {/* Top Navbar */}
      <ParentTopNavBar
        activeChild={activeChild}
        onSwitchChild={() => setShowChildModal(true)}
      />

      {/* Main Content */}
      <main
        className={
          showChildModal
            ? "blur-sm pointer-events-none select-none"
            : ""
        }
      >
        <Outlet
          context={{ activeChild }}
          key={activeChild.studentId}
        />
      </main>

      {/* Child Switch Modal */}
      {showChildModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowChildModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold">Select Child</h2>
                <button
                  onClick={() => setShowChildModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* List */}
              <div className="p-4 space-y-2">
                {children.map((child) => {
                  const isActive =
                    activeChild.studentId ===
                    child.studentId;

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
                      <p className="font-medium">
                        {child.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Class {child.class} {child.section}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* WhatsApp Button */}
      <WhatsAppFAB />
    </div>
  );
};

export default ParentLayout;