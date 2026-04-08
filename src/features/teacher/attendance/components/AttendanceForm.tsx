import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type{ MarkAttendanceInput } from "../types/attendance.types";

const schema = z.object({
  studentId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(["present", "absent", "late"]),
  remarks: z.string().optional(),
});

type AttendanceFormProps = {
  defaultValues?: Partial<MarkAttendanceInput>;
  onSubmit: (values: MarkAttendanceInput) => void;
  loading?: boolean;
};

export const AttendanceForm = ({ defaultValues = {}, onSubmit, loading }: AttendanceFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<MarkAttendanceInput>({
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
        <label>Date</label>
        <input type="date" {...register("date")} className="input" />
        {errors.date && <span className="text-red-600">{errors.date.message}</span>}
      </div>
      <div>
        <label>Status</label>
        <select {...register("status")} className="input">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>
        {errors.status && <span className="text-red-600">{errors.status.message}</span>}
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
