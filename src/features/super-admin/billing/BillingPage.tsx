import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { KPICards } from './components/KPICards';
import { MRRChart } from './components/MRRChart';
import { RevenuePlanChart } from './components/RevenuePlanChart';
import { TopInstitutionsTable } from './components/TopInstitutionsTable';
import { InstitutionsTable } from './components/InstitutionsTable';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import {
  useBillingOverview,
  useMRRHistory,
  useRevenueByPlan,
  useTopInstitutions,
} from './hooks/useBilling';
import type { TabKey } from './types/billing.types';
import { Button } from '@/components/ui/button';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'revenue',       label: 'Revenue Overview' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'invoices',      label: 'Invoices' },
  { key: 'plan-config',   label: 'Plan Config' },
];

export const BillingPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('revenue');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAllInstitutions, setShowAllInstitutions] = useState(false);

  const overview      = useBillingOverview();
  const mrrHistory    = useMRRHistory(6);
  const revenueByPlan = useRevenueByPlan();
  const topInstitutions = useTopInstitutions(5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-6">

        

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Billing & Plans
          </h1>
          <div className="flex items-center gap-3">
            <Button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
              Edit Plans
            </Button>
            <Button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700"
            >
              <CreditCard size={14} />
              Record Payment
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <KPICards data={overview.data} isLoading={overview.isLoading} />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-200 dark:border-white/10">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setShowAllInstitutions(false); }}
              className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors ${
                tab === key
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {label}
              {tab === key && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          ))}
        </div>

        {/* Revenue Overview tab */}
        {tab === 'revenue' && (
          <div className="space-y-5">
            {showAllInstitutions ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    All Institutions
                  </h2>
                  <button
                    onClick={() => setShowAllInstitutions(false)}
                    className="text-[13px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    ← Back to overview
                  </button>
                </div>
                <InstitutionsTable />
              </>
            ) : (
              <>
                {/* Charts row */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
                  <MRRChart data={mrrHistory.data?.data} isLoading={mrrHistory.isLoading} />
                  <RevenuePlanChart data={revenueByPlan.data} isLoading={revenueByPlan.isLoading} />
                </div>

                {/* Top institutions */}
                <TopInstitutionsTable
                  data={topInstitutions.data?.data}
                  isLoading={topInstitutions.isLoading}
                  onViewAll={() => setShowAllInstitutions(true)}
                />
              </>
            )}
          </div>
        )}

        {tab === 'subscriptions' && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Subscriptions
            </h2>
            <InstitutionsTable />
          </div>
        )}

        {tab === 'invoices' && (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
            <p className="text-sm text-gray-400">Invoice management — connect your billing provider</p>
          </div>
        )}

        {tab === 'plan-config' && (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
            <p className="text-sm text-gray-400">Plan configuration settings</p>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
};