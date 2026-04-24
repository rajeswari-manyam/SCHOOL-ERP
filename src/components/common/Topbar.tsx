
import { FaSearch, FaBell } from "react-icons/fa";
const Topbar = () => {
  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 py-3">
        <div className="flex flex-1 min-w-0 items-center gap-4">
          <span className="text-xl font-semibold text-slate-700 whitespace-nowrap">Dashboard</span>
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-[#f4f7fd] px-3 py-2 sm:px-4 sm:py-2.5">
            <FaSearch className="text-[#b0b8c1]" />
            <input
              type="text"
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent outline-none text-slate-700 placeholder-[#b0b8c1]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="hidden md:flex items-center gap-2 rounded-xl bg-[#f4f7fd] px-4 py-2 font-semibold text-[#6c7380]">
            <span className="w-3 h-3 rounded-full bg-[#3fe0b0] inline-block" />
            WhatsApp Connected
          </span>

          <button className="relative rounded-xl bg-[#f4f7fd] p-2 text-[#6c7380] transition hover:bg-[#e9eef8]">
            <FaBell className="text-xl" />
          </button>

          <div className="hidden md:block h-6 border-l border-[#e5e7eb]" />

          <button className="hidden md:flex items-center gap-1 rounded-xl bg-[#f4f7fd] px-4 py-2 font-semibold text-[#2d3748]">
            2024-25 <span className="text-[#6c7380]">&#9660;</span>
          </button>
        </div>
      </div>
    </header>
  );
};
export default Topbar;