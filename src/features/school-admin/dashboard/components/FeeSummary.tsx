interface FeeSummaryProps {
  totalFees: string;
  dueAmount: string;
}

export const FeeSummary = ({ totalFees, dueAmount }: FeeSummaryProps) => {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fee summary</p>
          <h2 className="text-xl font-semibold text-slate-900">Today&apos;s collection</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Updated now</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Total collected</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{totalFees}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Pending due</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{dueAmount}</p>
        </div>
      </div>
    </div>
  );
};
