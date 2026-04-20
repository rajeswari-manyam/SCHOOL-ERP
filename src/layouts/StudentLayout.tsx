import { NavLink, Outlet } from "react-router-dom";
import { memo } from "react";

const navItems = [
  { label: "Dashboard", to: "/student/dashboard" },
  { label: "Attendance", to: "/student/attendance" },
  { label: "Homework", to: "/student/homework" },
  { label: "Exams", to: "/student/exams" },
  { label: "Timetable", to: "/student/timetable" },
  { label: "Profile", to: "/student/profile" },
];

const StudentLayout = memo(() => (
  <div className="min-h-screen flex flex-col bg-[#F4F6FA]">
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <span className="text-xl font-semibold text-indigo-600">SchoolERP</span>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive
                      ? "text-slate-900 border-b-2 border-indigo-600 pb-2"
                      : "text-slate-500 hover:text-slate-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 absolute right-2 top-2 shadow" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
              <path d="M9 18a2 2 0 104 0H9z" />
            </svg>
          </button>
          <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              RK
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Ravi Kumar</p>
              <p className="text-xs text-slate-500">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
));

export default StudentLayout;
