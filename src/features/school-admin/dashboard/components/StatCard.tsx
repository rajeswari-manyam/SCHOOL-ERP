interface Props {
  title: string;
  value: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
}

export const StatCard = ({ title, value, subtitle, badge, badgeColor }: Props) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
      <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-3">{title}</p>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-semibold text-slate-900">{value}</span>
        {badge && (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 mt-3">{subtitle}</p>
    </div>
  );
};
