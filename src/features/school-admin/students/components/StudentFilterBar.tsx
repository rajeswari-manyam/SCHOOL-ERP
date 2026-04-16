interface StudentFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  classFilter: string;
  setClassFilter: (v: string) => void;
  sectionFilter: string;
  setSectionFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
}

const CLASSES = ["All", "6", "7", "8", "9", "10"];
const SECTIONS = ["All", "A", "B", "C"];
const STATUSES = ["All", "Active", "Transferred"];

const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
  >
    {options.map(o => <option key={o} value={o}>{o === "All" ? `All ${o}` : o}</option>)}
  </select>
);

const StudentFilterBar = ({ search, setSearch, classFilter, setClassFilter, sectionFilter, setSectionFilter, statusFilter, setStatusFilter }: StudentFilterBarProps) => (
  <div className="flex flex-wrap gap-3 items-center">
    <div className="relative flex-1 min-w-[200px]">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or admission no."
        className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 font-medium">Class</span>
      <Select value={classFilter} onChange={setClassFilter} options={CLASSES} />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 font-medium">Section</span>
      <Select value={sectionFilter} onChange={setSectionFilter} options={SECTIONS} />
    </div>
    <Select value={statusFilter} onChange={setStatusFilter} options={STATUSES} />
    <button className="text-xs text-indigo-600 font-semibold flex items-center gap-1 px-3 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
      Advanced Filters
    </button>
  </div>
);

export default StudentFilterBar;