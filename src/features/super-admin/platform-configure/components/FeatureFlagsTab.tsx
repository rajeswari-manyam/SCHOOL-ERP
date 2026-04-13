import { useFeatureFlags, useConfigMutations } from "../hooks/useConfig";

const FeatureFlagsTab = () => {
  const { data: flags, isLoading } = useFeatureFlags();
  const { toggleFlag } = useConfigMutations();

  if (isLoading) return <div className="text-sm text-gray-400 animate-pulse">Loading flags…</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="font-extrabold text-gray-900">Feature Flags</h3>
        <p className="text-sm text-gray-400 mt-0.5">Toggle platform features globally or per school</p>
      </div>
      <div className="divide-y divide-gray-50">
        {(flags ?? []).map((flag) => (
          <div key={flag.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors">
            <div>
              <p className="text-sm font-semibold text-gray-900">{flag.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{flag.description}</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mt-1 block">{flag.scope}</span>
            </div>
            <button
              onClick={() => toggleFlag.mutate({ id: flag.id, enabled: !flag.enabled })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${flag.enabled ? "bg-indigo-600" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${flag.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
        {!flags?.length && (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No feature flags configured</p>
        )}
      </div>
    </div>
  );
};

export default FeatureFlagsTab;
