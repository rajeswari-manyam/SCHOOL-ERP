import { FaSearch, FaBell } from "react-icons/fa";

type TopbarProps = {
  onMenuClick?: () => void;
};

const Topbar = ({ onMenuClick }: TopbarProps) => {
  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between py-3">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 flex-1 min-w-0">

          {/* Hamburger (Mobile Only) */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            ☰
          </button>

          <span className="text-lg sm:text-xl font-semibold text-slate-700 whitespace-nowrap">
            Dashboard
          </span>

          {/* Search */}
          <div className="hidden sm:flex flex-1 items-center gap-3 rounded-2xl bg-[#f4f7fd] px-4 py-2.5">
            <FaSearch className="text-[#b0b8c1]" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-[#b0b8c1]"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* WhatsApp Status (hide on mobile) */}
          <span className="hidden md:flex items-center gap-2 rounded-xl bg-[#f4f7fd] px-4 py-2 font-semibold text-[#6c7380]">
            <span className="w-3 h-3 rounded-full bg-[#3fe0b0]" />
            WhatsApp Connected
          </span>

          {/* Bell */}
          <button className="relative rounded-xl bg-[#f4f7fd] p-2 text-[#6c7380] hover:bg-[#e9eef8]">
            <FaBell className="text-lg sm:text-xl" />
          </button>

          {/* Year */}
          <button className="hidden md:flex items-center gap-1 rounded-xl bg-[#f4f7fd] px-4 py-2 font-semibold text-[#2d3748]">
            2024-25 <span className="text-[#6c7380]">&#9660;</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;