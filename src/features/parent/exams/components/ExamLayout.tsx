import { NavLink, Outlet, useOutletContext } from "react-router-dom";

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
  };
};

const menu = [
  { label: "Upcoming Exams", path: "upcoming" },
  { label: "Results", path: "results" },
  { label: "Report Card", path: "reportcard" },
];

export default function ExamsLayout() {
  const { activeChild } = useOutletContext<ParentLayoutContext>();

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-8 px-4 sm:px-6 lg:px-10 pb-16 bg-[#F4F6FB] min-h-screen">

      {/* HEADER (same as your code) */}
      <p className="text-[12px] text-gray-400 mb-4">
        {activeChild.name} ›
        <span className="text-gray-600 font-medium"> Exams & Results</span>
      </p>

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#0B1C30]">
          Exams & Results — {activeChild.name}
        </h1>
        <p className="text-[13px] text-gray-400 mt-1">
          Class {activeChild.class} | Academic Year 2024-25
        </p>
      </div>

      <div className="flex gap-6">

        {/* ✅ SIDEBAR */}
        <div className="w-64 bg-white rounded-2xl p-4 shadow-sm h-fit">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 mb-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-[#EEF2FF] text-[#3525CD]"
                    : "text-gray-500 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* ✅ PAGE CONTENT */}
        <div className="flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
}