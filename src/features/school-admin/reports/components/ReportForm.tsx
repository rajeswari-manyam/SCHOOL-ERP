import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportCreateInput } from "../types/reports.types";
import { z } from "zod";

const reportSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  data: z.any(),
});

type ReportFormProps = {
  defaultValues?: Partial<ReportCreateInput>;
  onSubmit: (values: ReportCreateInput) => void;
  loading?: boolean;
};

export const ReportForm = ({
  defaultValues = {},
  onSubmit,
  loading,
}: ReportFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportCreateInput>({
    resolver: zodResolver(reportSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Title</label>
        <input {...register("title")} className="input" />
        {errors.title && (
          <span className="text-red-600">{errors.title.message}</span>
        )}
      </div>
      <div>
        <label>Type</label>
        <input {...register("type")} className="input" />
        {errors.type && (
          <span className="text-red-600">{errors.type.message}</span>
        )}
      </div>
      <div>
        <label>Data (JSON)</label>
        <textarea {...register("data")} className="input" rows={4} />
        {errors.data && (
          <span className="text-red-600">{errors.data.message as string}</span>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Submit
      </button>
    </form>
  );
};
