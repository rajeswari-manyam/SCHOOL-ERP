import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RepFormValues } from "../types/marketing.types";
import { useMarketingMutations } from "../hooks/useMarketing";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  territory: z.string().min(2, "Territory required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
  perClosingRate: z.coerce.number().min(0),
  monthTarget: z.coerce.number().min(1),
});

type FormValues = z.infer<typeof schema>;

const inputClass = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
const labelClass = "block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5";

interface AddRepModalProps { open: boolean; onClose: () => void; }

const AddRepModal = ({ open, onClose }: AddRepModalProps) => {
  const { createRep } = useMarketingMutations();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { perClosingRate: 2000, monthTarget: 4 },
  });

  if (!open) return null;

  const onSubmit = (v: FormValues) =>
    createRep.mutate(v as RepFormValues, { onSuccess: () => { reset(); onClose(); } });

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Add Rep</h2>
              <p className="text-sm text-gray-400 mt-0.5">Add a new field representative</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Full Name *</label>
                <input {...register("name")} placeholder="Suresh K" className={inputClass} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
              <div><label className={labelClass}>Territory *</label>
                <input {...register("territory")} placeholder="Hanamkonda" className={inputClass} />
                {errors.territory && <p className="text-xs text-red-500 mt-1">{errors.territory.message}</p>}</div>
              <div><label className={labelClass}>Phone *</label>
                <input {...register("phone")} placeholder="9876543210" className={inputClass} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}</div>
              <div><label className={labelClass}>Email *</label>
                <input {...register("email")} type="email" placeholder="rep@example.com" className={inputClass} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}</div>
              <div><label className={labelClass}>Per Closing Rate (₹)</label>
                <input {...register("perClosingRate")} type="number" className={inputClass} /></div>
              <div><label className={labelClass}>Month Target</label>
                <input {...register("monthTarget")} type="number" className={inputClass} /></div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Cancel</button>
              <button type="submit" disabled={createRep.isPending}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm">
                {createRep.isPending ? "Adding…" : "Add Rep"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRepModal;
