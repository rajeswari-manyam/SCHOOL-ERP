import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useBillingMutations } from '../hooks/useBilling';
import type { Institution } from '../types/billing.types';

type PaymentMode = 'Razorpay' | 'Bank Transfer' | 'Cash' | 'Cheque';

const PAYMENT_MODES: PaymentMode[] = ['Razorpay', 'Bank Transfer', 'Cash', 'Cheque'];

interface RecordPaymentModalProps {
  open: boolean;
  onClose: () => void;
  preselectedInstitution?: Institution;
  institutions?: Pick<Institution, 'id' | 'name'>[];
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  open,
  onClose,
  preselectedInstitution,
  institutions = [],
}) => {
  const { recordPayment } = useBillingMutations();

  const [form, setForm] = useState({
    institutionId: preselectedInstitution?.id ?? '',
    amount: preselectedInstitution?.outstandingAmount?.toString() ?? '',
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMode: 'Razorpay' as PaymentMode,
    orderId: '',
    description: '',
    markRenewed: false,
  });

  useEffect(() => {
    if (preselectedInstitution) {
      setForm((f) => ({
        ...f,
        institutionId: preselectedInstitution.id,
        amount: preselectedInstitution.outstandingAmount?.toString() ?? f.amount,
      }));
    }
  }, [preselectedInstitution?.id]);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordPayment.mutate(
      {
        institutionId: form.institutionId,
        amount: Number(form.amount),
        paymentDate: form.paymentDate,
        notes: form.description,
      },
      { onSuccess: onClose }
    );
  };

  const showOrderId = form.paymentMode === 'Razorpay';

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">
              Record Payment
            </h2>
            <p className="mt-0.5 text-[13px] text-gray-400">
              Log a payment received from a school
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 pb-4">

            {/* School selector */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                School <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.institutionId}
                  onChange={(e) => set('institutionId', e.target.value)}
                  required
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="" disabled>Select school...</option>
                  {preselectedInstitution && (
                    <option value={preselectedInstitution.id}>
                      {preselectedInstitution.name}
                    </option>
                  )}
                  {institutions
                    .filter((i) => i.id !== preselectedInstitution?.id)
                    .map((i) => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Amount + Date row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => set('amount', e.target.value)}
                    placeholder="15,000"
                    required
                    min="1"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-7 pr-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => set('paymentDate', e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            {/* Payment Mode toggle */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-white/10 dark:bg-white/5">
                {PAYMENT_MODES.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => set('paymentMode', mode)}
                    className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-all ${
                      form.paymentMode === mode
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Razorpay Order ID — shown only when Razorpay selected */}
            {showOrderId && (
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Razorpay Order ID
                </label>
                <input
                  type="text"
                  value={form.orderId}
                  onChange={(e) => set('orderId', e.target.value)}
                  placeholder="order_XXXXXXXXXXXXX"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600"
                />
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Leave blank if payment was cash or bank transfer
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
                placeholder="e.g. Annual renewal payment for Growth plan"
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600"
              />
            </div>

            {/* Mark as renewed */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.markRenewed}
                onChange={(e) => set('markRenewed', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
              />
              <span className="text-[13px] text-gray-600 dark:text-gray-300">
                Mark subscription as renewed after recording payment
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={recordPayment.isPending || !form.institutionId}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-[13px] font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {recordPayment.isPending ? 'Saving…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};