import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const timetableSchema = z.object({
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  subject: z.string().min(1, "Subject is required"),
  teacher: z.string().min(1, "Teacher is required"),
  day: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export type TimetableFormValues = z.infer<typeof timetableSchema>;

type TimetableFormProps = {
  defaultValues?: Partial<TimetableFormValues>;
  onSubmit: (values: TimetableFormValues) => void;
  loading?: boolean;
};

export const TimetableForm = ({
  defaultValues = {},
  onSubmit,
  loading,
}: TimetableFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableSchema),
    defaultValues: defaultValues as TimetableFormValues,
  });

  const inputClasses = (error?: string) => `
    w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none
    ${error 
      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
      : "border-gray-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
    }
  `;

  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5 ml-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Class</label>
          <input {...register("class")} className={inputClasses(errors.class?.message)} placeholder="e.g. 10" />
          {errors.class && <p className="mt-1.5 text-xs font-medium text-red-600 ml-1">{errors.class.message}</p>}
        </div>

        <div>
          <label className={labelClasses}>Section</label>
          <input {...register("section")} className={inputClasses(errors.section?.message)} placeholder="e.g. A" />
          {errors.section && <p className="mt-1.5 text-xs font-medium text-red-600 ml-1">{errors.section.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Subject</label>
        <input {...register("subject")} className={inputClasses(errors.subject?.message)} placeholder="Enter subject name" />
        {errors.subject && <p className="mt-1.5 text-xs font-medium text-red-600 ml-1">{errors.subject.message}</p>}
      </div>

      <div>
        <label className={labelClasses}>Teacher</label>
        <input {...register("teacher")} className={inputClasses(errors.teacher?.message)} placeholder="Enter teacher name" />
        {errors.teacher && <p className="mt-1.5 text-xs font-medium text-red-600 ml-1">{errors.teacher.message}</p>}
      </div>

      <div>
        <label className={labelClasses}>Day</label>
        <select {...register("day")} className={inputClasses(errors.day?.message)}>
          <option value="">Select a day</option>
          <option value="MON">Monday</option>
          <option value="TUE">Tuesday</option>
          <option value="WED">Wednesday</option>
          <option value="THU">Thursday</option>
          <option value="FRI">Friday</option>
          <option value="SAT">Saturday</option>
        </select>
        {errors.day && <p className="mt-1.5 text-xs font-medium text-red-600 ml-1">{errors.day.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Start Time</label>
          <input type="time" {...register("startTime")} className={inputClasses(errors.startTime?.message)} />
          {errors.startTime && <p className="mt-1.5 text-xs font-medium text-red-600 ml-1">{errors.startTime.message}</p>}
        </div>

        <div>
          <label className={labelClasses}>End Time</label>
          <input type="time" {...register("endTime")} className={inputClasses(errors.endTime?.message)} />
          {errors.endTime && <p className="mt-1.5 text-xs font-medium text-red-600 ml-1">{errors.endTime.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : "Submit Entry"}
      </button>
    </form>
  );
};