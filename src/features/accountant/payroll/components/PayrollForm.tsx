import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreatePayrollInput } from "../types/payroll.types";

const schema = z.object({
  staffId: z.string().min(1),
  month: z.string().min(1),
  baseSalary: z.number().min(0),
  allowances: z.number().min(0),
  deductions: z.number().min(0),
});

type PayrollFormProps = {
  defaultValues?: Partial<CreatePayrollInput>;
  onSubmit: (values: CreatePayrollInput) => void;
  loading?: boolean;
};

export const PayrollForm = ({
  defaultValues = {},
  onSubmit,
  loading,
}: PayrollFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePayrollInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Staff ID</label>
        <input {...register("staffId")} className="input" />
        {errors.staffId && (
          <span className="text-red-600">{errors.staffId.message}</span>
        )}
      </div>
      <div>
        <label>Month</label>
        <input type="month" {...register("month")} className="input" />
        {errors.month && (
          <span className="text-red-600">{errors.month.message}</span>
        )}
      </div>
      <div>
        <label>Base Salary</label>
        <input
          type="number"
          step="0.01"
          {...register("baseSalary", { valueAsNumber: true })}
          className="input"
        />
        {errors.baseSalary && (
          <span className="text-red-600">{errors.baseSalary.message}</span>
        )}
      </div>
      <div>
        <label>Allowances</label>
        <input
          type="number"
          step="0.01"
          {...register("allowances", { valueAsNumber: true })}
          className="input"
        />
        {errors.allowances && (
          <span className="text-red-600">{errors.allowances.message}</span>
        )}
      </div>
      <div>
        <label>Deductions</label>
        <input
          type="number"
          step="0.01"
          {...register("deductions", { valueAsNumber: true })}
          className="input"
        />
        {errors.deductions && (
          <span className="text-red-600">{errors.deductions.message}</span>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Submit
      </button>
    </form>
  );
};
