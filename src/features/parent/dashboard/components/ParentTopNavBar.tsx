import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Bell,
    LogOut,
    ChevronDown,
    Menu,
    X,
    RefreshCw,
    LayoutDashboard,
    CalendarCheck,
    Wallet,
    BookOpen,
    ClipboardList,
    User,
} from "lucide-react";
import typography from "@/styles/typography";

const navLinks = [
    { label: "Dashboard", path: "/parent/dashboard", icon: LayoutDashboard },
    { label: "Attendance", path: "/parent/attendance", icon: CalendarCheck },
    { label: "Fees", path: "/parent/fees", icon: Wallet },
    { label: "Homework", path: "/parent/homework", icon: BookOpen },
    { label: "Exams", path: "/parent/exams", icon: ClipboardList },
    { label: "Profile", path: "/parent/profile", icon: User },
];

interface ParentTopNavBarProps {
    activeChild: {
        id: number
        name: string
        class: string
        school: string
        avatar: string
    }
    onSwitchChild: () => void
}

const ParentTopNavBar = ({ activeChild, onSwitchChild }: ParentTopNavBarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        navigate("/login");
    };

    const user = {
        name: activeChild.name,
        initials: activeChild.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
        className: `Class ${activeChild.class}`,
    };

    return (
        <>
            <header className="w-full bg-white border-b border-[#E8EBF2] sticky top-0 z-50">
                <div className="max-w-[1650px] mx-auto px-4 md:px-6 h-[60px] flex items-center justify-between gap-4">

                    {/* LEFT: hamburger + logo */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            className="md:hidden text-[#0B1C30] p-1.5 rounded-md hover:bg-[#F4F6FA] transition"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <Link to="/parent/dashboard" className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#3525CD] flex items-center justify-center shrink-0">
                                <span className="text-white text-[11px] font-bold">S</span>
                            </div>
                            <span className={`${typography.fontSize.lg} font-bold text-[#0B1C30] tracking-tight`}>
                                ScholarSlate
                            </span>
                        </Link>
                    </div>

                    {/* CENTER: desktop nav */}
                    <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
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
                                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3525CD] rounded-t-sm" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* RIGHT: switch child + bell + user */}
                    <div className="flex items-center gap-1 md:gap-2 shrink-0">

                        {/* Switch Child — lg+ only — now connected */}
                        <button
                            onClick={onSwitchChild}
                            className="hidden lg:flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-[#3525CD] px-2.5 py-1.5 rounded-md hover:bg-[#F4F6FA] transition"
                        >
                            <RefreshCw size={12} />
                            Switch Child
                        </button>

                        {/* Notification bell */}
                        <div className="relative">
                            <button
                                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F4F6FA] transition relative"
                            >
                                <Bell size={16} className="text-[#6B7280]" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 top-11 w-72 bg-white border border-[#E8EBF2] rounded-xl shadow-lg py-2 z-50">
                                    <p className={`${typography.body.small} font-medium text-[#0B1C30] px-4 py-2`}>
                                        Notifications
                                    </p>
                                    {[
                                        { title: "Fee reminder", desc: "Tuition fee due on 9 Apr", time: "2h ago", dot: "bg-red-500" },
                                        { title: "Attendance alert", desc: "Anjali was absent today", time: "4h ago", dot: "bg-amber-400" },
                                        { title: "New homework", desc: "Maths: Quadratic Equations", time: "1d ago", dot: "bg-indigo-500" },
                                    ].map((n) => (
                                        <div key={n.title} className="flex items-start gap-3 px-4 py-3 hover:bg-[#F4F6FA] cursor-pointer">
                                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                                            <div>
                                                <p className={`${typography.body.small} font-medium text-[#0B1C30]`}>{n.title}</p>
                                                <p className={`${typography.body.xs} text-[#6B7280]`}>{n.desc}</p>
                                                <p className={`${typography.body.xs} text-[#9CA3AF] mt-0.5`}>{n.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User profile dropdown */}
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F4F6FA] transition cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#3525CD] flex items-center justify-center shrink-0">
                                    <span className="text-white text-[11px] font-semibold">{user.initials}</span>
                                </div>
                                <div className="leading-tight text-left">
                                    <p className={`${typography.body.small} font-semibold text-[#0B1C30] whitespace-nowrap`}>{user.name}</p>
                                    <p className={`${typography.body.xs} text-[#9CA3AF]`}>{user.className}</p>
                                </div>
                                <ChevronDown
                                    size={12}
                                    className={`text-[#9CA3AF] transition-transform ${profileOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-11 w-48 bg-white border border-[#E8EBF2] rounded-xl shadow-lg py-1.5 z-50">
                                    <Link
                                        to="/parent/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="block px-4 py-2 text-[13px] text-[#0B1C30] hover:bg-[#F4F6FA]"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/parent/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="block px-4 py-2 text-[13px] text-[#0B1C30] hover:bg-[#F4F6FA]"
                                    >
                                        Settings
                                    </Link>
                                    <div className="border-t border-[#E8EBF2] my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50"
                                    >
                                        <LogOut size={13} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Logout icon — xs only */}
                        <button
                            onClick={handleLogout}
                            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#F4F6FA] text-[#6B7280] hover:text-red-500 transition"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE DRAWER */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 flex">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative w-[280px] h-full bg-white shadow-xl flex flex-col z-50">
                        <div className="flex items-center justify-between px-4 h-[60px] border-b border-[#E8EBF2] shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#3525CD] flex items-center justify-center">
                                    <span className="text-white text-[11px] font-bold">S</span>
                                </div>
                                <span className={`${typography.fontSize.lg} font-bold text-[#0B1C30] tracking-tight`}>
                                    ScholarSlate
                                </span>
                            </div>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-1.5 rounded-md hover:bg-[#F4F6FA] text-[#6B7280]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="px-4 py-4 border-b border-[#E8EBF2] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#3525CD] flex items-center justify-center shrink-0">
                                    <span className="text-white text-[13px] font-semibold">{user.initials}</span>
                                </div>
                                <div>
                                    <p className="text-[14px] font-semibold text-[#0B1C30]">{user.name}</p>
                                    <p className="text-[11px] text-[#9CA3AF]">{user.className}</p>
                                </div>
                            </div>
                            {/* Switch Child — mobile drawer — also connected */}
                            <button
                                onClick={() => { setMobileOpen(false); onSwitchChild(); }}
                                className="mt-3 w-full flex items-center justify-center gap-2 text-[12px] text-[#3525CD] border border-[#D0D8FF] py-2 rounded-lg hover:bg-[#EEF0FF] transition"
                            >
                                <RefreshCw size={12} />
                                Switch Child
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition
                                            ${isActive
                                                ? "bg-[#EEF2FF] text-[#3525CD]"
                                                : "text-[#6B7280] hover:bg-[#F4F6FA] hover:text-[#0B1C30]"
                                            }`}
                                    >
                                        <Icon size={16} className={isActive ? "text-[#3525CD]" : "text-[#9CA3AF]"} />
                                        {link.label}
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3525CD]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="px-3 py-4 border-t border-[#E8EBF2] shrink-0">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition"
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
                    className="fixed inset-0 z-40"
                    onClick={() => { setNotifOpen(false); setProfileOpen(false); }}
                />
            )}
        </>
    );
};

export default ParentTopNavBar;