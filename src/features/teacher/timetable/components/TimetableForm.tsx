import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CreateTimetableEntryInput } from "../types/timetable.types";

const schema = z.object({
  day: z.string().min(1),
  period: z.string().min(1),
  subject: z.string().min(1),
  className: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

type TimetableFormProps = {
  defaultValues?: Partial<CreateTimetableEntryInput>;
  onSubmit: (values: CreateTimetableEntryInput) => void;
  loading?: boolean;
};

export const TimetableForm = ({ defaultValues = {}, onSubmit, loading }: TimetableFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTimetableEntryInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Day</label>
        <input {...register("day")} className="input" />
        {errors.day && <span className="text-red-600">{errors.day.message}</span>}
      </div>
      <div>
        <label>Period</label>
        <input {...register("period")} className="input" />
        {errors.period && <span className="text-red-600">{errors.period.message}</span>}
      </div>
      <div>
        <label>Subject</label>
        <input {...register("subject")} className="input" />
        {errors.subject && <span className="text-red-600">{errors.subject.message}</span>}
      </div>
      <div>
        <label>Class</label>
        <input {...register("className")} className="input" />
        {errors.className && <span className="text-red-600">{errors.className.message}</span>}
      </div>
      <div>
        <label>Start Time</label>
        <input type="time" {...register("startTime")} className="input" />
        {errors.startTime && <span className="text-red-600">{errors.startTime.message}</span>}
      </div>
      <div>
        <label>End Time</label>
        <input type="time" {...register("endTime")} className="input" />
        {errors.endTime && <span className="text-red-600">{errors.endTime.message}</span>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
    </form>
  );
};
