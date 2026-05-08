import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Bell,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  ClipboardList,
  User,
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { label: "Attendance", path: "/student/attendance", icon: CalendarCheck },
  { label: "Homework", path: "/student/homework", icon: BookOpen },
  { label: "Exams", path: "/student/exams", icon: ClipboardList },
  { label: "Timetable", path: "/student/timetable", icon: CalendarCheck },
  { label: "Profile", path: "/student/profile", icon: User },
];

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { 
    x: 0, 
    transition: { type: "tween" as const, duration: 0.25 } 
  },
  exit: { 
    x: "-100%", 
    transition: { type: "tween" as const, duration: 0.2 } 
  },
};
const StudentTopNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = { name: "Ravi Kumar", initials: "RK", className: "Class 10A" };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const handleNotification = () => {
    toast.info("You have 3 new notifications", {
      description: "Check announcements for the latest updates.",
    });
  };

  return (
    <>
      {/* ───── HEADER ───── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E8EBF2]">
        <div className="max-w-[1650px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="md:hidden p-2 rounded-md hover:bg-[#F4F6FA] transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <Link to="/student/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3525CD] flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">S</span>
              </div>
              <span className="font-bold text-[#0B1C30]">ScholarSlate</span>
            </Link>
          </div>

          {/* CENTER NAV */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === l.path
                    ? "text-[#3525CD]"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNotification}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F4F6FA] transition-colors"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <Link
              to="/student/profile"
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#F4F6FA] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#3525CD] flex items-center justify-center text-white text-xs">
                {user.initials}
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ───── MOBILE DRAWER ───── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="relative w-[270px] h-full bg-white shadow-xl flex flex-col"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold">Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* NAV */}
              <div className="flex-1 p-3 space-y-1">
                {navLinks.map((l) => {
                  const Icon = l.icon;
                  const active = location.pathname === l.path;
                  return (
                    <Link
                      key={l.path}
                      to={l.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        active ? "bg-[#EEF2FF] text-[#3525CD]" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={16} />
                      {l.label}
                    </Link>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="p-3 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-red-500 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentTopNavBar;
