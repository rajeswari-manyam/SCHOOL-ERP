import { LeaveRequestsTab } from "../components/LeaveRequistTable";

const LeavesPage = () => {
  return (
    <div className="space-y-0">
      {/* ── Top bar ── */}
      <div className="px-3 sm:px-4 py-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-1">
          <span>School</span>
          <span className="text-indigo-500">›</span>
          <span className="text-indigo-600">Leaves</span>
        </div>
        <h1 className="text-base font-semibold text-gray-900 leading-none">Leaves</h1>
      </div>

      {/* ── Main content ── */}
      <div className="px-3 sm:px-4 py-3">
        <div className="w-full overflow-x-auto">
          <LeaveRequestsTab />
        </div>
      </div>
    </div>
  );
};

export default LeavesPage;
