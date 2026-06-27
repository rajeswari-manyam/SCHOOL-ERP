import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL_MONTHS  = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface Props {
  monthIndex: number; // 0-based
  year: number;
  onChange: (monthIndex: number, year: number) => void;
}

const MonthPickerDropdown = ({ monthIndex, year, onChange }: Props) => {
  const [open, setOpen]           = useState(false);
  const [pickerYear, setPickerYear] = useState(year);
  const ref = useRef<HTMLDivElement>(null);

  // sync picker year when parent year changes
  useEffect(() => { if (!open) setPickerYear(year); }, [year, open]);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectMonth = (m: number) => {
    onChange(m, pickerYear);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setPickerYear(year); setOpen((o) => !o); }}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-sm"
      >
        <Calendar size={15} className="text-indigo-500 shrink-0" />
        <span className="whitespace-nowrap">{FULL_MONTHS[monthIndex]} {year}</span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 w-60">

          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setPickerYear((y) => y - 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-bold text-gray-900">{pickerYear}</span>
            <button
              onClick={() => setPickerYear((y) => y + 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {SHORT_MONTHS.map((m, i) => {
              const isSelected = i === monthIndex && pickerYear === year;
              return (
                <button
                  key={m}
                  onClick={() => selectMonth(i)}
                  className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPickerDropdown;
