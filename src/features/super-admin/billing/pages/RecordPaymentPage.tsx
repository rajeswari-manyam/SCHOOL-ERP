// super-admin/billing/pages/RecordPaymentPage.tsx
// Full-page version of the former RecordPaymentModal popup — same data/logic,
// just rendered as a routed page instead of a fixed overlay.
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, ChevronDown, CreditCard } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBillingMutations } from '../hooks/useBilling';
import { useAllSchools } from '@/features/super-admin/schools/hooks/useSchools';
import type { SubscriptionPaymentMode } from '../types/billing.types';

const PAYMENT_MODES: { label: string; value: SubscriptionPaymentMode }[] = [
  { label: 'Razorpay', value: 'RAZORPAY' },
  { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'UPI', value: 'UPI' },
];

const schema = z.object({
  schoolId: z.string().min(1, 'Select a school'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, 'Amount must be a positive number'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMode: z.enum(['RAZORPAY', 'BANK_TRANSFER', 'CASH', 'CHEQUE', 'UPI']),
  razorpayPaymentId: z.string().optional(),
  description: z.string().optional(),
  renewed: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface RecordPaymentLocationState {
  schoolId?: string;
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600';

const labelClass =
  'mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400';

const RecordPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedSchoolId = (location.state as RecordPaymentLocationState | null)?.schoolId;
  const goBackToBilling = () => navigate('/superadmin/billing');

  const { recordSubscriptionPayment } = useBillingMutations();
  const { data: schools } = useAllSchools();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      schoolId: preselectedSchoolId ?? '',
      amount: '',
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: 'RAZORPAY',
      razorpayPaymentId: '',
      description: '',
      renewed: false,
    },
  });

  useEffect(() => {
    if (preselectedSchoolId) setValue('schoolId', preselectedSchoolId);
  }, [preselectedSchoolId, setValue]);

  const schoolId = useWatch({ control, name: 'schoolId' });
  const paymentMode = useWatch({ control, name: 'paymentMode' });
  const showRazorpayId = paymentMode === 'RAZORPAY';

  const onSubmit = (values: FormValues) => {
    recordSubscriptionPayment.mutate(
      {
        schoolId: values.schoolId,
        amount: Number(values.amount),
        paymentDate: values.paymentDate,
        paymentMode: values.paymentMode,
        razorpayPaymentId: values.razorpayPaymentId || undefined,
        description: values.description,
        renewed: values.renewed,
      },
      {
        onSuccess: () => {
          toast.success('Payment recorded successfully');
          goBackToBilling();
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Failed to record payment');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBackToBilling} className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          Billing &amp; Plans
        </button>
        <span>›</span>
        <span className="text-gray-700 dark:text-gray-200 font-semibold">Record Payment</span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CreditCard size={16} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-[17px] font-bold text-gray-900 dark:text-white leading-snug">
                Record Payment
              </h1>
              <p className="text-xs sm:text-[13px] text-gray-400">Log a payment received from a school</p>
            </div>
          </div>
          <button
            onClick={goBackToBilling}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* ── Form body ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <div className="space-y-4 sm:space-y-5 px-5 sm:px-6 py-5">

            {/* School selector */}
            <div>
              <label className={labelClass}>
                School <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('schoolId')}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="" disabled>Select school...</option>
                  {(schools ?? []).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
              {errors.schoolId && (
                <p className="mt-1 text-xs text-red-500">{errors.schoolId.message}</p>
              )}
            </div>

            {/* Amount + Date */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    {...register('amount')}
                    placeholder="15,000"
                    min="1"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-7 pr-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('paymentDate')}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                {errors.paymentDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.paymentDate.message}</p>
                )}
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <label className={`${labelClass} mb-2`}>
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1 sm:gap-0 dark:border-white/10 dark:bg-white/5">
                <input type="hidden" {...register('paymentMode')} />
                {PAYMENT_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setValue('paymentMode', mode.value, { shouldValidate: true })}
                    className={`sm:flex-1 rounded-lg py-2 px-1 text-[11px] sm:text-[12px] font-semibold transition-all ${
                      paymentMode === mode.value
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              {errors.paymentMode && (
                <p className="mt-1 text-xs text-red-500">{errors.paymentMode.message}</p>
              )}
            </div>

            {/* Razorpay Payment ID */}
            {showRazorpayId && (
              <div>
                <label className={labelClass}>Razorpay Payment ID</label>
                <input
                  type="text"
                  {...register('razorpayPaymentId')}
                  placeholder="pay_XXXXXXXXXXXXX"
                  className={inputClass}
                />
                {errors.razorpayPaymentId && (
                  <p className="mt-1 text-xs text-red-500">{errors.razorpayPaymentId.message}</p>
                )}
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Leave blank if payment was cash or bank transfer
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="e.g. Annual renewal payment for Growth plan"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Mark as renewed */}
            <label className="flex cursor-pointer items-start sm:items-center gap-3">
              <input
                type="checkbox"
                {...register('renewed')}
                className="h-4 w-4 mt-0.5 sm:mt-0 rounded border-gray-300 accent-indigo-600 flex-shrink-0"
              />
              <span className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
                Mark subscription as renewed after recording payment
              </span>
            </label>
          </div>

          {/* ── Footer ── */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between border-t border-gray-100 dark:border-white/10 px-5 sm:px-6 py-4 flex-shrink-0 gap-2 sm:gap-0">
            <button
              type="button"
              onClick={goBackToBilling}
              className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={recordSubscriptionPayment.isPending || !schoolId}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-[13px] font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {recordSubscriptionPayment.isPending ? 'Saving…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPaymentPage;
