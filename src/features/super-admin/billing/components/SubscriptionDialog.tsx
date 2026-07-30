import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBillingMutations } from '../hooks/useBilling';
import type { Subscription } from '../types/billing.types';

const featureLabels: Record<string, string> = {
  attendance: 'Attendance',
  feeManagement: 'Fee Management',
  reports: 'Reports',
  broadcast: 'Broadcast',
  admission: 'Admission',
  parentApp: 'Parent App',
  onlinePayment: 'Online Payment',
};

const schema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  type: z.string().min(1, 'Plan type is required'),
  billingCycle: z.enum(['MONTHLY', 'ANNUAL']),
  annualPrice: z.string().min(1, 'Annual price is required'),
  monthlyPrice: z.string().min(1, 'Monthly price is required'),
  studentLimit: z.string().min(1, 'Student limit is required'),
  pilotFee: z.string().min(1, 'Pilot fee is required'),
  attendance: z.boolean(),
  feeManagement: z.boolean(),
  reports: z.boolean(),
  broadcast: z.boolean(),
  admission: z.boolean(),
  parentApp: z.boolean(),
  onlinePayment: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface SubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
}

const planTypes = ['starter', 'growth', 'pro', 'enterprise'];

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white';

const labelClass =
  'mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400';

export const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({
  open,
  onClose,
  subscription,
}) => {
  const { createSubscription, updateSubscription } = useBillingMutations();
  const isEdit = Boolean(subscription);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: '',
      billingCycle: 'MONTHLY',
      annualPrice: '',
      monthlyPrice: '',
      studentLimit: '',
      pilotFee: '',
      attendance: true,
      feeManagement: true,
      reports: true,
      broadcast: false,
      admission: false,
      parentApp: false,
      onlinePayment: false,
    },
  });

  useEffect(() => {
    if (subscription) {
      reset({
        name: subscription.name,
        type: subscription.type,
        billingCycle: subscription.billingCycle,
        annualPrice: String(subscription.annualPrice),
        monthlyPrice: String(subscription.monthlyPrice),
        studentLimit: String(subscription.studentLimit),
        pilotFee: String(subscription.pilotFee),
        attendance: subscription.featureFlags.attendance,
        feeManagement: subscription.featureFlags.feeManagement,
        reports: subscription.featureFlags.reports,
        broadcast: subscription.featureFlags.broadcast,
        admission: subscription.featureFlags.admission,
        parentApp: subscription.featureFlags.parentApp,
        onlinePayment: subscription.featureFlags.onlinePayment,
      });
    } else {
      reset({
        name: '',
        type: '',
        billingCycle: 'MONTHLY',
        annualPrice: '',
        monthlyPrice: '',
        studentLimit: '',
        pilotFee: '',
        attendance: true,
        feeManagement: true,
        reports: true,
        broadcast: false,
        admission: false,
        parentApp: false,
        onlinePayment: false,
      });
    }
  }, [subscription, reset, open]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      type: values.type,
      billingCycle: values.billingCycle,
      annualPrice: Number(values.annualPrice),
      monthlyPrice: Number(values.monthlyPrice),
      studentLimit: Number(values.studentLimit),
      pilotFee: Number(values.pilotFee),
      featureFlags: {
        attendance: values.attendance,
        feeManagement: values.feeManagement,
        reports: values.reports,
        broadcast: values.broadcast,
        admission: values.admission,
        parentApp: values.parentApp,
        onlinePayment: values.onlinePayment,
      },
    };

    if (isEdit && subscription) {
      updateSubscription.mutate(
        { id: subscription.id, payload },
        { onSuccess: onClose }
      );
    } else {
      createSubscription.mutate(payload, { onSuccess: onClose });
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="
          w-full sm:max-w-lg
          bg-white dark:bg-gray-900
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl
          max-h-[92vh] sm:max-h-[90vh]
          flex flex-col
          overflow-hidden
        "
      >
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
          <div className="min-w-0 pr-3">
            <h2 className="text-base sm:text-[17px] font-bold text-gray-900 dark:text-white leading-snug">
              {isEdit ? 'Edit Subscription' : 'Create Subscription'}
            </h2>
            <p className="mt-0.5 text-xs sm:text-[13px] text-gray-400">
              {isEdit ? 'Update the subscription plan details' : 'Add a new subscription plan'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-5 px-4 sm:px-6 pb-4">
            <div>
              <label className={labelClass}>Plan Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('name')}
                placeholder="Premium Plan"
                className={inputClass}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>Plan Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    {...register('type')}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <option value="" disabled>Select plan type...</option>
                    {planTypes.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Billing Cycle <span className="text-red-500">*</span></label>
                <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-white/10 dark:bg-white/5">
                  {(['MONTHLY', 'ANNUAL'] as const).map((cycle) => (
                    <button
                      key={cycle}
                      type="button"
                      onClick={() => setValue('billingCycle', cycle, { shouldValidate: true })}
                      className={`flex-1 rounded-lg py-2.5 text-[12px] font-semibold transition-all ${
                        watch('billingCycle') === cycle
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {cycle === 'MONTHLY' ? 'Monthly' : 'Annual'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>Annual Price (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...register('annualPrice')}
                  placeholder="12000"
                  className={inputClass}
                />
                {errors.annualPrice && <p className="mt-1 text-xs text-red-500">{errors.annualPrice.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Monthly Price (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...register('monthlyPrice')}
                  placeholder="1200"
                  className={inputClass}
                />
                {errors.monthlyPrice && <p className="mt-1 text-xs text-red-500">{errors.monthlyPrice.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>Student Limit <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...register('studentLimit')}
                  placeholder="500"
                  className={inputClass}
                />
                {errors.studentLimit && <p className="mt-1 text-xs text-red-500">{errors.studentLimit.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Pilot Fee (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...register('pilotFee')}
                  placeholder="2000"
                  className={inputClass}
                />
                {errors.pilotFee && <p className="mt-1 text-xs text-red-500">{errors.pilotFee.message}</p>}
              </div>
            </div>

            <div>
              <label className={`${labelClass} mb-2`}>Feature Flags</label>
              <div className="space-y-3">
                {Object.entries(featureLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    <button
                      type="button"
                      onClick={() => setValue(key as keyof FormValues, !watch(key as keyof FormValues), { shouldValidate: true })}
                      className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors duration-200 ${watch(key as keyof FormValues) ? 'bg-indigo-600' : 'bg-gray-200'}`}
                      aria-pressed={Boolean(watch(key as keyof FormValues))}
                    >
                      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${watch(key as keyof FormValues) ? 'translate-x-4' : ''}`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between border-t border-gray-100 dark:border-white/10 px-4 sm:px-6 py-4 flex-shrink-0 gap-2 sm:gap-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createSubscription.isPending || updateSubscription.isPending}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-[13px] font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {(createSubscription.isPending || updateSubscription.isPending) ? 'Saving…' : (isEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
