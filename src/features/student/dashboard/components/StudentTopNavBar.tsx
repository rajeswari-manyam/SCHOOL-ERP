import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  ClipboardList,
  User,
 
} from "lucide-react";
import typography from "@/styles/typography";

const navLinks = [
  { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { label: "Attendance", path: "/student/attendance", icon: CalendarCheck },
  { label: "Homework", path: "/student/homework", icon: BookOpen },
  { label: "Exams", path: "/student/exams", icon: ClipboardList },
  { label: "Profile", path: "/student/profile", icon: User },
];

const StudentTopNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  const user = {
    name: "Ravi Kumar",
    initials: "RK",
    className: "Class 10A",
  };

  return (
    <>
      {/* ── HEADER ── */}
      <header className="w-full bg-white border-b border-[#E8EBF2] sticky top-0 z-50">
        <div className="max-w-[1650px] mx-auto px-4 md:px-6 h-[60px] flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-md hover:bg-[#F4F6FA]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/student/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3525CD] flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">S</span>
              </div>
              <span className={`${typography.fontSize.lg} font-bold text-[#0B1C30]`}>
                ScholarSlate
              </span>
            </Link>
          </div>

          {/* CENTER NAV */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-4 ${typography.body.base}
                  ${isActive
                      ? "text-[#3525CD]"
                      : "text-[#6B7280] hover:text-[#0B1C30]"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3525CD]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* NOTIFICATION */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F4F6FA]"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-72 bg-white border rounded-xl shadow-lg">
                  <p className="px-4 py-2 text-sm font-semibold">Notifications</p>
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F4F6FA]"
              >
                <div className="w-7 h-7 rounded-full bg-[#3525CD] flex items-center justify-center">
                  <span className="text-white text-xs">{user.initials}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.className}</p>
                </div>
                <ChevronDown size={12} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white border rounded-xl shadow-lg">
                  <Link
                    to="/student/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/student/settings"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Settings
                  </Link>
                  <div className="border-t my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE LOGOUT */}
            <button
              onClick={handleLogout}
              className="sm:hidden w-9 h-9 flex items-center justify-center"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-[280px] bg-white h-full shadow-xl flex flex-col">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 h-[60px] border-b">
              <span className="font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* NAV */}
            <nav className="flex-1 px-3 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                      ${isActive
                        ? "bg-[#EEF2FF] text-[#3525CD]"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* LOGOUT */}
            <div className="p-3 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-500"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </>
  );
};

export default StudentTopNavBar;