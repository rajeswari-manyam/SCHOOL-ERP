
import { FaSearch, FaBell } from "react-icons/fa";
const Topbar = () => {
  // const theme = useUIStore((s) => s.theme);
  return (
    // <header
    //   className={cn(
    //     "w-full h-16 flex items-center px-6 bg-white border-b shadow-sm",
    //     theme === "dark" && "bg-gray-900 text-white",
    //   )}
    // >
     <header className="w-full h-16 flex items-center px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 shadow-sm">
       <div className="mx-auto flex w-full max-w-7xl items-center gap-6">
         <div className="flex items-center gap-6 flex-1">
          <span className="text-xl font-semibold text-slate-700">Dashboard</span>
          <div className="flex items-center bg-[#f4f7fd] rounded-2xl px-4 py-2 min-w-[220px] max-w-sm w-full">
            <FaSearch className="text-[#b0b8c1] mr-3" />
            <input
              type="text"
              placeholder="Search students, staff or records..."
              className="bg-transparent outline-none w-full text-slate-700 placeholder-[#b0b8c1]"
            />
          </div>
         </div>
        {/* Right: WhatsApp, Bell, Year */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 bg-[#f4f7fd] rounded-xl px-4 py-2 font-semibold text-[#6c7380]">
            <span className="w-3 h-3 rounded-full bg-[#3fe0b0] inline-block"></span>
            WhatsApp Connected
          </span>
          <button className="relative">
            <FaBell className="text-[#6c7380] text-xl" />
          </button>
          <div className="h-6 border-l border-[#e5e7eb]"></div>
          <button className="text-[#2d3748] font-semibold text-lg flex items-center gap-1">
            2024-25 <span className="text-[#6c7380]">&#9660;</span>
          </button>
        </div>
       </div>
    </header>
  );
};

export default Topbar;