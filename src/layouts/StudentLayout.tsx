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

const StudentLayout = memo(() => {
  const student = {
    name: "Ravi Kumar",
    class: "10A",
  };

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col">

      {/* ── Top Navbar ── */}
      <header className="bg-white border-b border-[#E8EBF2] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-indigo-600">
              SchoolERP
            </span>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive
                        ? "text-[#3525CD] border-b-2 border-[#3525CD] pb-1"
                        : "text-[#6B7280] hover:text-[#0B1C30]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Notification */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#F4F6FA] hover:bg-[#E8EBF2]">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              🔔
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 bg-[#F4F6FA] px-3 py-2 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[#3525CD] text-white flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0B1C30]">
                  {student.name}
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Class {student.class}
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
});

export default StudentLayout;