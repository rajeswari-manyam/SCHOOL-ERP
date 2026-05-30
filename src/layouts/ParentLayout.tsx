import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ParentTopNavBar from "../features/parent/dashboard/components/ParentTopNavBar";
import WhatsAppFAB from "../components/ui/whatsappfab";
import { X } from "lucide-react";
import { getParentById, getstudentsById } from "@/services/parent.api";
import { useAuthStore } from "@/store/authStore";

const ParentLayout = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState<any>(null);
  const [showChildModal, setShowChildModal] = useState(false);
  const authUser = useAuthStore((s) => s.user);

  useEffect(() => {
  const fetchChildren = async () => {
  try {
  const parentId = localStorage.getItem("parentId") || authUser?.id;

if (!parentId) {
  console.error("No parentId found");
  return;
}

    const parent = await getParentById(parentId);

    console.log("Parent API:", parent);

    const studentsData = await Promise.all(
      parent.students.map(async (studentId: string) => {
        const student = await getstudentsById(studentId);

        console.log("Student API:", student);

        return {
          id: student.id,
          studentId: student.id,
          parentId,
          parentName: parent.parent_name,
          name: `${student.first_name} ${student.last_name}`.trim(),
          class: student.class,
          section: student.section,
          school: student.school_code ?? "",
          avatar: `https://i.pravatar.cc/150?u=${student.id}`,
        };
      })
    );

    const students = studentsData.filter(Boolean);
    setChildren(students);

    if (students.length > 0) {
      setActiveChild(students[0]);
    }
  } catch (err) {
    console.error("fetchChildren:", err);
  }
};
  fetchChildren();
}, [authUser]);

  if (!activeChild) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <ParentTopNavBar
        activeChild={activeChild}
        onSwitchChild={() => setShowChildModal(true)}
      />

      <main className={showChildModal ? "blur-sm pointer-events-none select-none" : ""}>
        <Outlet context={{ activeChild }} key={activeChild.studentId} />
      </main>

      {showChildModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowChildModal(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <div
              className="pointer-events-auto w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EBF2]">
                <div>
                  <p className="text-[15px] font-semibold text-[#0B1C30]">Select Child</p>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                    Switch between your children's profiles
                  </p>
                </div>
                <button
                  onClick={() => setShowChildModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F4F6FA]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-2.5">
                {children.map((child) => {
                  const isActive = activeChild.studentId === child.studentId;
                  const name = child?.name || "Student";
                  const initials = name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <button
                      key={child.studentId}
                      onClick={() => { setActiveChild(child); setShowChildModal(false); }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border ${
                        isActive ? "border-[#3525CD] bg-[#EEF2FF]" : "border-[#E8EBF2]"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? "bg-[#3525CD] text-white" : "bg-[#E8EBF2]"
                      }`}>
                        {initials}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{child.name}</p>
                        <p className="text-[12px] text-[#9CA3AF]">
                          Class {child.class} {child.section} · {child.school}
                        </p>
                      </div>
                      {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#3525CD]" />}
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