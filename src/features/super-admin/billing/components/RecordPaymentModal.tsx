import React, { useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBillingMutations, useOrganizationSchools } from '../hooks/useBilling';
import type { Institution, OrganizationSchool } from '../types/billing.types';

const PAYMENT_MODES = ['Razorpay', 'Bank Transfer', 'Cash', 'Cheque', 'UPI'] as const;

const schema = z.object({
  schoolName: z.string().optional(),
  institutionId: z.string().min(1, 'Select a school'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, 'Amount must be a positive number'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMode: z.enum(PAYMENT_MODES),
  orderId: z.string().optional(),
  description: z.string().optional(),
  markRenewed: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface RecordPaymentModalProps {
  open: boolean;
  onClose: () => void;
  preselectedInstitution?: Institution;
  institutions?: Pick<Institution, 'id' | 'name'>[];
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600';

const labelClass =
  'mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400';

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  open,
  onClose,
  preselectedInstitution,
  institutions: propInstitutions,
}) => {
  const { recordPayment, recordOrganizationBilling } = useBillingMutations();

  const { data: orgSchools } = useOrganizationSchools();

  const institutions: Pick<Institution, 'id' | 'name'>[] = (
    propInstitutions?.length
      ? propInstitutions
      : (orgSchools ?? []).map((s: OrganizationSchool) => ({
          id: s.school_code,
          name: s.school_name,
        }))
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      schoolName: '',
      institutionId: preselectedInstitution?.id ?? '',
      amount: preselectedInstitution?.outstandingAmount?.toString() ?? '',
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: 'Razorpay',
      orderId: '',
      description: '',
      markRenewed: false,
    },
  });

  useEffect(() => {
    reset({
      schoolName: '',
      institutionId: preselectedInstitution?.id ?? '',
      amount: preselectedInstitution?.outstandingAmount?.toString() ?? '',
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: 'Razorpay',
      orderId: '',
      description: '',
      markRenewed: false,
    });
  }, [preselectedInstitution, reset, open]);

  const institutionId = useWatch({ control, name: 'institutionId' });
  const paymentMode = useWatch({ control, name: 'paymentMode' });
  const showOrderId = paymentMode === 'Razorpay';
  const isUpi = paymentMode === 'UPI';

  const onSubmit = (values: FormValues) => {
    if (isUpi) {
      recordOrganizationBilling.mutate(
        {
          School: values.schoolName || values.institutionId,
          Amount: Number(values.amount),
          PaymentDate: values.paymentDate,
          PaymentMode: values.paymentMode,
          Description: values.description ?? '',
        },
        { onSuccess: onClose }
      );
    } else {
      recordPayment.mutate(
        {
          institutionId: values.institutionId,
          amount: Number(values.amount),
          paymentDate: values.paymentDate,
          notes: values.description,
        },
        { onSuccess: onClose }
      );
    }
  };

  if (!open) return null;

  return (
    /* ── Backdrop — bottom-sheet on mobile, centered on sm+ ── */
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
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
          <div className="min-w-0 pr-3">
            <h2 className="text-base sm:text-[17px] font-bold text-gray-900 dark:text-white leading-snug">
              Record Payment
            </h2>
            <p className="mt-0.5 text-xs sm:text-[13px] text-gray-400">
              Log a payment received from a school
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable form body ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-5 px-4 sm:px-6 pb-4">

            {/* School selector */}
            <div>
              <label className={labelClass}>
                School <span className="text-red-500">*</span>
              </label>
              {isUpi ? (
                <input
                  type="text"
                  {...register('schoolName')}
                  placeholder="Enter school name..."
                  className={inputClass}
                />
              ) : (
                <div className="relative">
                  <select
                    {...register('institutionId')}
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
              )}
              {errors.institutionId && (
                <p className="mt-1 text-xs text-red-500">{errors.institutionId.message}</p>
              )}
            </div>

            {/* Amount + Date — always 2-col (both are compact) */}
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

            {/* Payment Mode — wraps to 2×2 on very narrow, single row on sm+ */}
            <div>
              <label className={`${labelClass} mb-2`}>
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1 sm:gap-0 dark:border-white/10 dark:bg-white/5">
                <input type="hidden" {...register('paymentMode')} />
                {PAYMENT_MODES.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setValue('paymentMode', mode, { shouldValidate: true })}
                    className={`sm:flex-1 rounded-lg py-2 px-1 text-[11px] sm:text-[12px] font-semibold transition-all ${
                      paymentMode === mode
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              {errors.paymentMode && (
                <p className="mt-1 text-xs text-red-500">{errors.paymentMode.message}</p>
              )}
            </div>

            {/* Razorpay Order ID */}
            {showOrderId && (
              <div>
                <label className={labelClass}>Razorpay Order ID</label>
                <input
                  type="text"
                  {...register('orderId')}
                  placeholder="order_XXXXXXXXXXXXX"
                  className={inputClass}
                />
                {errors.orderId && (
                  <p className="mt-1 text-xs text-red-500">{errors.orderId.message}</p>
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
                {...register('markRenewed')}
                className="h-4 w-4 mt-0.5 sm:mt-0 rounded border-gray-300 accent-indigo-600 flex-shrink-0"
              />
              <span className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
                Mark subscription as renewed after recording payment
              </span>
            </label>
          </div>

          {/* ── Footer ── */}
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
              disabled={(isUpi ? recordOrganizationBilling.isPending : recordPayment.isPending) || (!isUpi && !institutionId)}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-[13px] font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {(isUpi ? recordOrganizationBilling.isPending : recordPayment.isPending) ? 'Saving…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};