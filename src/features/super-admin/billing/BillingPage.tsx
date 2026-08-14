import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus, Pencil, Trash2 } from 'lucide-react';
import { KPICards } from './components/KPICards';
import { MRRChart } from './components/MRRChart';
import { RevenuePlanChart } from './components/RevenuePlanChart';
import { TopInstitutionsTable } from './components/TopInstitutionsTable';
import { InstitutionsTable } from './components/InstitutionsTable';
import { SchoolsByStatusTable } from './components/SchoolsByStatusTable';

import {
  useRevenueOverview,
  useAllSubscriptions,
  useBillingMutations,
} from './hooks/useBilling';
import type { TabKey, Subscription } from './types/billing.types';
import { Button } from '@/components/ui/button';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'revenue',       label: 'Revenue Overview' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'plan-config',   label: 'Plan Config' },
];

export const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('revenue');
  const [showAllInstitutions, setShowAllInstitutions] = useState(false);

  const revenueOverview = useRevenueOverview(tab === 'revenue');
  const { data: subscriptionsData, isLoading: subsLoading } = useAllSubscriptions(tab === 'plan-config');
  const { deleteSubscription } = useBillingMutations();

  const subscriptions: Subscription[] = subscriptionsData
    ? Array.isArray(subscriptionsData.data)
      ? subscriptionsData.data
      : subscriptionsData.data
        ? [subscriptionsData.data as Subscription]
        : []
    : [];

  const openCreateDialog = () => navigate('/superadmin/billing/plan/add');
  const openEditDialog = (sub: Subscription) => navigate('/superadmin/billing/plan/edit', { state: { subscription: sub } });

  return (
    <div className="flex flex-col gap-6 min-h-full">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Billing & Plans
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {tab === 'plan-config' && (
              <Button
                onClick={openCreateDialog}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
              >
                <Plus size={14} />
                Add Plan
              </Button>
            )}
            <Button
              onClick={() => navigate('/superadmin/billing/record-payment')}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700"
            >
              <CreditCard size={14} />
              Record Payment
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards
          data={revenueOverview.data?.kpiCards}
          mrrGrowth={revenueOverview.data?.mrrGrowth}
          isLoading={revenueOverview.isLoading}
        />

        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-gray-200 dark:border-white/10 overflow-x-auto flex-nowrap scrollbar-none">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setShowAllInstitutions(false); }}
              className={`relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                tab === key
                  ? 'text-black dark:text-white'
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    All Institutions
                  </h2>
                  <button
                    onClick={() => setShowAllInstitutions(false)}
                    className="w-full sm:w-auto text-[13px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-left"
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
                  <MRRChart data={revenueOverview.data?.mrrGrowth} isLoading={revenueOverview.isLoading} />
                  <RevenuePlanChart data={revenueOverview.data?.revenueByPlan} isLoading={revenueOverview.isLoading} />
                </div>

                {/* Top institutions */}
                <TopInstitutionsTable
                  data={revenueOverview.data?.topSchools}
                  isLoading={revenueOverview.isLoading}
                  onViewAll={() => setShowAllInstitutions(true)}
                />
              </>
            )}
          </div>
        )}

        {tab === 'subscriptions' && (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-base font-semibold text-gray-900 dark:text-white">
              Subscriptions
            </h2>
            <SchoolsByStatusTable />
          </div>
        )}

        {tab === 'plan-config' && (
          <div className="space-y-4">
            {subsLoading ? (
              <div className="text-center py-12 text-gray-400">Loading subscriptions…</div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No subscription plans found. Click "Add Plan" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{sub.name}</h3>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          {sub.type} · {sub.billingCycle === 'MONTHLY' ? 'Monthly' : 'Annual'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditDialog(sub)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this subscription?')) {
                              deleteSubscription.mutate(sub.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Annual Price</span>
                        <span className="font-semibold text-gray-900">₹{sub.annualPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Monthly Price</span>
                        <span className="font-semibold text-gray-900">₹{sub.monthlyPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Student Limit</span>
                        <span className="font-semibold text-gray-900">{sub.studentLimit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Pilot Fee</span>
                        <span className="font-semibold text-gray-900">₹{sub.pilotFee.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-bold text-gray-500 mb-2">FEATURE FLAGS</p>
                      <div className="space-y-1.5">
                        {Object.entries(sub.featureFlags).map(([key, enabled]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className={`text-sm ${enabled ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                            </span>
                            <span className={`text-xs font-bold ${enabled ? 'text-green-600' : 'text-red-400'}`}>
                              {enabled ? 'ON' : 'OFF'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
};