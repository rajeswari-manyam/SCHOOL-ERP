import { useState } from "react";
import { Outlet } from "react-router-dom";
import ParentTopNavBar from "../features/parent/dashboard/components/ParentTopNavBar";
import WhatsAppFAB from "../components/ui/whatsappfab";
import { X } from "lucide-react";

const children = [
  {
    id: 1,
    name: "Ravi Kumar",
    class: "10A",
    school: "Hanamkonda Public School",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Priya Sharma",
    class: "7B",
    school: "Hanamkonda Public School",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
];

const ParentLayout = () => {
  const [activeChild, setActiveChild] = useState(children[0]);
  const [showChildModal, setShowChildModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <ParentTopNavBar
        activeChild={activeChild}
        onSwitchChild={() => setShowChildModal(true)}
      />

      {/* Page content — blurred when modal is open */}
      <main className={showChildModal ? "blur-sm pointer-events-none select-none" : ""}>
     <Outlet context={{ activeChild }} key={activeChild.id} />
      </main>

      {/* ── Switch Child Modal ── */}
      {showChildModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowChildModal(false)}
          />

          {/* Modal card — centred */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <div
              className="pointer-events-auto w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EBF2]">
                <div>
                  <p className="text-[15px] font-semibold text-[#0B1C30]">Select Child</p>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                    Switch between your children's profiles
                  </p>
                </div>
                <button
                  onClick={() => setShowChildModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F4F6FA] text-[#9CA3AF] hover:text-[#0B1C30] transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Child list */}
              <div className="p-4 flex flex-col gap-2.5">
                {children.map((child) => {
                  const isActive = activeChild.id === child.id;
                  const initials = child.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <button
                      key={child.id}
                      onClick={() => {
                        setActiveChild(child);
                        setShowChildModal(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition
                        ${isActive
                          ? "border-[#3525CD] bg-[#EEF2FF]"
                          : "border-[#E8EBF2] hover:bg-[#F4F6FA] hover:border-[#C7CDEA]"
                        }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[13px] font-semibold
                          ${isActive ? "bg-[#3525CD] text-white" : "bg-[#E8EBF2] text-[#6B7280]"}`}
                      >
                        {initials}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-semibold truncate ${isActive ? "text-[#3525CD]" : "text-[#0B1C30]"}`}>
                          {child.name}
                        </p>
                        <p className="text-[12px] text-[#9CA3AF] truncate">
                          Class {child.class} · {child.school}
                        </p>
                      </div>

                      {/* Active dot */}
                      {isActive && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3525CD] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── WhatsApp FAB — visible on all parent pages ── */}
      <WhatsAppFAB />
    </div>
  );
};

export default ParentLayout;