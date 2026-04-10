
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
     <header className="w-full h-16 flex items-center px-8 bg- border-b shadow-sm">

       <div className="flex items-center gap-8 flex-1">
        <span className="text-xl font-medium text-[#6c7380]">Dashboard</span>
        <div className="flex items-center bg-[#f4f7fd] rounded-xl px-4 py-2 w-[340px]">
          <FaSearch className="text-[#b0b8c1] mr-2" />
          <input
            type="text"
            placeholder="Search students, staff or records..."
            className="bg-transparent outline-none w-full text-[#6c7380] placeholder-[#b0b8c1]"
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
    </header>
  );
};

export default Topbar;