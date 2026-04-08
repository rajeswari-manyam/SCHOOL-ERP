import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateLeaveRequestInput } from "../types/leave.types";

const schema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  reason: z.string().min(1),
});

type LeaveFormProps = {
  defaultValues?: Partial<CreateLeaveRequestInput>;
  onSubmit: (values: CreateLeaveRequestInput) => void;
  loading?: boolean;
};

export const LeaveForm = ({ defaultValues = {}, onSubmit, loading }: LeaveFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateLeaveRequestInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Start Date</label>
        <input type="date" {...register("startDate")} className="input" />
        {errors.startDate && <span className="text-red-600">{errors.startDate.message}</span>}
      </div>
      <div>
        <label>End Date</label>
        <input type="date" {...register("endDate")} className="input" />
        {errors.endDate && <span className="text-red-600">{errors.endDate.message}</span>}
      </div>
      <div>
        <label>Reason</label>
        <textarea {...register("reason")} className="input" rows={2} />
        {errors.reason && <span className="text-red-600">{errors.reason.message as string}</span>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>Submit</button>
    </form>
  );
};
