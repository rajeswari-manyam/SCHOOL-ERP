import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimetableCreateInput } from "../types/timetable.types";
import { z } from "zod";

const timetableSchema = z.object({
  class: z.string().min(1),
  section: z.string().min(1),
  subject: z.string().min(1),
  teacher: z.string().min(1),
  day: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

type TimetableFormProps = {
  defaultValues?: Partial<TimetableCreateInput>;
  onSubmit: (values: TimetableCreateInput) => void;
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
  } = useForm<TimetableCreateInput>({
    resolver: zodResolver(timetableSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Class</label>
        <input {...register("class")} className="input" />
        {errors.class && (
          <span className="text-red-600">{errors.class.message}</span>
        )}
      </div>
      <div>
        <label>Section</label>
        <input {...register("section")} className="input" />
        {errors.section && (
          <span className="text-red-600">{errors.section.message}</span>
        )}
      </div>
      <div>
        <label>Subject</label>
        <input {...register("subject")} className="input" />
        {errors.subject && (
          <span className="text-red-600">{errors.subject.message}</span>
        )}
      </div>
      <div>
        <label>Teacher</label>
        <input {...register("teacher")} className="input" />
        {errors.teacher && (
          <span className="text-red-600">{errors.teacher.message}</span>
        )}
      </div>
      <div>
        <label>Day</label>
        <input {...register("day")} className="input" />
        {errors.day && (
          <span className="text-red-600">{errors.day.message}</span>
        )}
      </div>
      <div>
        <label>Start Time</label>
        <input {...register("startTime")} className="input" type="time" />
        {errors.startTime && (
          <span className="text-red-600">{errors.startTime.message}</span>
        )}
      </div>
      <div>
        <label>End Time</label>
        <input {...register("endTime")} className="input" type="time" />
        {errors.endTime && (
          <span className="text-red-600">{errors.endTime.message}</span>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Submit
      </button>
    </form>
  );
};
