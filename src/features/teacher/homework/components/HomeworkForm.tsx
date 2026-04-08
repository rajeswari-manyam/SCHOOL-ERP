import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type{ CreateHomeworkInput } from "../types/homework.types";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.string().min(1),
  className: z.string().min(1),
});

type HomeworkFormProps = {
  defaultValues?: Partial<CreateHomeworkInput>;
  onSubmit: (values: CreateHomeworkInput) => void;
  loading?: boolean;
};

export const HomeworkForm = ({ defaultValues = {}, onSubmit, loading }: HomeworkFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateHomeworkInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Title</label>
        <input {...register("title")} className="input" />
        {errors.title && <span className="text-red-600">{errors.title.message}</span>}
      </div>
      <div>
        <label>Description</label>
        <textarea {...register("description")} className="input" rows={2} />
        {errors.description && <span className="text-red-600">{errors.description.message as string}</span>}
      </div>
      <div>
        <label>Due Date</label>
        <input type="date" {...register("dueDate")} className="input" />
        {errors.dueDate && <span className="text-red-600">{errors.dueDate.message}</span>}
      </div>
      <div>
        <label>Class</label>
        <input {...register("className")} className="input" />
        {errors.className && <span className="text-red-600">{errors.className.message}</span>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
    </form>
  );
};
