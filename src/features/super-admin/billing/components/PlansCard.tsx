

export type Plan = {
  name: string;
  annualPrice: string;
  monthlyPrice: string;
  studentLimit: string;
  pilotFee: string;
  mostPopular?: boolean;
  features: { name: string; enabled: boolean }[];
};

interface PlansCardProps {
  plan: Plan;
  onFeatureToggle: (featureIdx: number) => void;
  onFieldChange: (field: string, value: string) => void;
}

export function PlansCard({ plan, onFeatureToggle, onFieldChange }: PlansCardProps) {
  if (!plan) {
    console.error('PlansCard: plan prop is required');
    return null;
  }
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1 min-w-[300px] max-w-[350px] relative"
      aria-label={`Plan card for ${plan.name}`}
    >
      {plan.mostPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-xl shadow" aria-label="Most popular plan">MOST POPULAR</div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <button className="ml-2 text-gray-400 hover:text-indigo-600" aria-label="Edit plan">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1-3 3l-9 9a2.121 2.121 0 0 0 0 3l.5.5a2.121 2.121 0 0 0 3 0l9-9a2.121 2.121 0 0 1 3-3Z"/></svg>
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor={`annual-price-${plan.name}`}>ANNUAL PRICE (₹)</label>
          <input
            id={`annual-price-${plan.name}`}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={plan.annualPrice}
            onChange={e => onFieldChange('annualPrice', e.target.value)}
            inputMode="numeric"
            aria-label="Annual price"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor={`monthly-price-${plan.name}`}>MONTHLY PRICE (₹)</label>
          <input
            id={`monthly-price-${plan.name}`}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={plan.monthlyPrice}
            onChange={e => onFieldChange('monthlyPrice', e.target.value)}
            inputMode="numeric"
            aria-label="Monthly price"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor={`student-limit-${plan.name}`}>STUDENT LIMIT</label>
            <input
              id={`student-limit-${plan.name}`}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={plan.studentLimit}
              onChange={e => onFieldChange('studentLimit', e.target.value)}
              aria-label="Student limit"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor={`pilot-fee-${plan.name}`}>PILOT FEE (₹)</label>
            <input
              id={`pilot-fee-${plan.name}`}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={plan.pilotFee}
              onChange={e => onFieldChange('pilotFee', e.target.value)}
              inputMode="numeric"
              aria-label="Pilot fee"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">FEATURE FLAGS</div>
        <div className="space-y-2">
          {plan.features.map((feature, idx) => (
            <div key={feature.name} className="flex items-center justify-between">
              <span className={feature.enabled ? "text-gray-900 font-semibold" : "text-gray-400"}>{feature.name}</span>
              <button
                className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors duration-200 ${feature.enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                onClick={() => onFeatureToggle(idx)}
                type="button"
                aria-pressed={feature.enabled}
                aria-label={`Toggle ${feature.name}`}
              >
                <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${feature.enabled ? 'translate-x-4' : ''}`}></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
