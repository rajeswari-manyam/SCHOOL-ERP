import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import typography from "@/styles/typography";

const feeSchema = z.object({
  student: z.string().min(1, "Student is required"),
amount: z.number().min(1, "Amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
});

type FeeFormSchema = z.infer<typeof feeSchema>;

type FeeFormProps = {
  defaultValues?: Partial<FeeFormSchema>;
  onSubmit: (data: FeeFormSchema) => void;
  loading?: boolean;
};

export const FeeForm = ({
  defaultValues = {},
  onSubmit,
  loading,
}: FeeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeeFormSchema>({
    resolver: zodResolver(feeSchema),
    defaultValues,
  });

  const inputClass = (hasError: boolean) =>
    `w-full px-3 h-10 ${typography.body.xs} rounded-lg border outline-none transition-all
     bg-[#EFF4FF] placeholder:text-gray-400 text-gray-800
     ${
       hasError
         ? "border-red-400 focus:ring-2 focus:ring-red-200"
         : "border-transparent focus:ring-2 focus:ring-indigo-300"
     }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Student */}
      <div>
        <label className={`${typography.body.xs} font-semibold text-gray-900 mb-1 block`}>
          Student
        </label>
        <input
          placeholder="Enter student name"
          {...register("student")}
          className={inputClass(!!errors.student)}
        />
        {errors.student && (
          <p className="text-red-500 text-xs mt-1">
            ⚠ {errors.student.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className={`${typography.body.xs} font-semibold text-gray-900 mb-1 block`}>
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="Enter amount"
          {...register("amount")}
          className={inputClass(!!errors.amount)}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">
            ⚠ {errors.amount.message}
          </p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label className={`${typography.body.xs} font-semibold text-gray-900 mb-1 block`}>
          Due Date
        </label>
        <input
          type="date"
          {...register("dueDate")}
          className={inputClass(!!errors.dueDate)}
        />
        {errors.dueDate && (
          <p className="text-red-500 text-xs mt-1">
            ⚠ {errors.dueDate.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
      >
        {loading ? "Saving..." : "Submit"}
      </Button>
    </form>
  );
};