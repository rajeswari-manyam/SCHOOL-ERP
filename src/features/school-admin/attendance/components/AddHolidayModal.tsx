import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

type HolidayType = "National Holiday" | "Public Holiday" | "School Event" | "School Day";

const addHolidaySchema = z.object({
  name: z.string().min(1, "Holiday name is required").min(2, "Holiday name must be at least 2 characters"),
  date: z.string().min(1, "Date is required").regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in MM/DD/YYYY format"),
  type: z.enum(["National Holiday", "Public Holiday", "School Event", "School Day"], {
    required_error: "Please select a holiday type",
  }),
  repeatAnnually: z.boolean(),
  notes: z.string().default(""),
  notifyWhatsApp: z.boolean(),
});

type AddHolidayFormData = z.infer<typeof addHolidaySchema>;

export interface AddHolidayFormState {
  name: string;
  date: string;
  type: HolidayType;
  repeatAnnually: boolean;
  notes: string;
  notifyWhatsApp: boolean;
}

interface AddHolidayModalProps {
  onClose?: () => void;
  onSave?: (data: AddHolidayFormState) => void;
}

export default function AddHolidayModal({ onClose, onSave }: AddHolidayModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddHolidayFormData>({
    resolver: zodResolver(addHolidaySchema),
    defaultValues: {
      name: "",
      date: "",
      type: "National Holiday",
      repeatAnnually: true,
      notes: "",
      notifyWhatsApp: true,
    },
  });

  const repeatAnnually = watch("repeatAnnually");
  const notifyWhatsApp = watch("notifyWhatsApp");

  const handleFormSubmit = (data: AddHolidayFormData) => {
    onSave?.({
      ...data,
      notes: data.notes ?? "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Add Holiday</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Holiday Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Independence Day"
              {...register("name")}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              {...register("date")}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Holiday Type</label>
              <div className="relative">
                <select
                  {...register("type")}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                >
                  <option value="National Holiday">National Holiday</option>
                  <option value="Public Holiday">Public Holiday</option>
                  <option value="School Event">School Event</option>
                  <option value="School Day">School Day</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
              </div>
              {errors.type && (
                <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Repeat Annually?</label>
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setValue("repeatAnnually", !repeatAnnually)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    repeatAnnually ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      repeatAnnually ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-bold text-slate-700">{repeatAnnually ? "On" : "Off"}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Notes</label>
            <textarea
              placeholder="Optional: any additional notes for staff"
              {...register("notes")}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setValue("notifyWhatsApp", !notifyWhatsApp)}
              className={`inline-flex h-6 w-6 items-center justify-center rounded-md border-2 transition ${
                notifyWhatsApp ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"
              }`}
            >
              {notifyWhatsApp && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6L5 9L10 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
              Notify all teachers via WhatsApp
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.99L0 24l6.18-1.57A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition"
          >
            Save Holiday
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
