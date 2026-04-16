import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CreatePayrollInput } from "../types/payroll.types";

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
  const { register, handleSubmit, formState: { errors } } =
    useForm<CreatePayrollInput>({
      resolver: zodResolver(schema),
      defaultValues,
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Staff ID</label>
        <input {...register("staffId")} />
        {errors.staffId && <p>{errors.staffId.message}</p>}
      </div>

      <div>
        <label>Month</label>
        <input type="month" {...register("month")} />
      </div>

      <div>
        <label>Base Salary</label>
        <input type="number" {...register("baseSalary", { valueAsNumber: true })} />
      </div>

      <div>
        <label>Allowances</label>
        <input type="number" {...register("allowances", { valueAsNumber: true })} />
      </div>

      <div>
        <label>Deductions</label>
        <input type="number" {...register("deductions", { valueAsNumber: true })} />
      </div>

      <button disabled={loading} type="submit">
        Submit
      </button>
    </form>
  );
};