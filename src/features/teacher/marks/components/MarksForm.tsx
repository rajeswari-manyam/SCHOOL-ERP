import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type{ CreateMarkEntryInput } from "../types/marks.types";

const schema = z.object({
  studentId: z.string().min(1),
  subject: z.string().min(1),
  exam: z.string().min(1),
  marks: z.number().min(0),
  maxMarks: z.number().min(1),
  remarks: z.string().optional(),
});

type MarksFormProps = {
  defaultValues?: Partial<CreateMarkEntryInput>;
  onSubmit: (values: CreateMarkEntryInput) => void;
  loading?: boolean;
};

export const MarksForm = ({ defaultValues = {}, onSubmit, loading }: MarksFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMarkEntryInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Student ID</label>
        <input {...register("studentId")} className="input" />
        {errors.studentId && <span className="text-red-600">{errors.studentId.message}</span>}
      </div>
      <div>
        <label>Subject</label>
        <input {...register("subject")} className="input" />
        {errors.subject && <span className="text-red-600">{errors.subject.message}</span>}
      </div>
      <div>
        <label>Exam</label>
        <input {...register("exam")} className="input" />
        {errors.exam && <span className="text-red-600">{errors.exam.message}</span>}
      </div>
      <div>
        <label>Marks</label>
        <input type="number" step="0.01" {...register("marks", { valueAsNumber: true })} className="input" />
        {errors.marks && <span className="text-red-600">{errors.marks.message}</span>}
      </div>
      <div>
        <label>Max Marks</label>
        <input type="number" step="0.01" {...register("maxMarks", { valueAsNumber: true })} className="input" />
        {errors.maxMarks && <span className="text-red-600">{errors.maxMarks.message}</span>}
      </div>
      <div>
        <label>Remarks</label>
        <textarea {...register("remarks")} className="input" rows={2} />
        {errors.remarks && <span className="text-red-600">{errors.remarks.message as string}</span>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
    </form>
  );
};
