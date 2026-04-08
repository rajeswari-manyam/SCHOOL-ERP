import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffCreateInput } from "../types/staff.types";
import { z } from "zod";

const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  role: z.string().min(1),
  department: z.string().min(1),
});

type StaffFormProps = {
  defaultValues?: Partial<StaffCreateInput>;
  onSubmit: (values: StaffCreateInput) => void;
  loading?: boolean;
};

export const StaffForm = ({
  defaultValues = {},
  onSubmit,
  loading,
}: StaffFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffCreateInput>({
    resolver: zodResolver(staffSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Name</label>
        <input {...register("name")} className="input" />
        {errors.name && (
          <span className="text-red-600">{errors.name.message}</span>
        )}
      </div>
      <div>
        <label>Email</label>
        <input {...register("email")} className="input" />
        {errors.email && (
          <span className="text-red-600">{errors.email.message}</span>
        )}
      </div>
      <div>
        <label>Phone</label>
        <input {...register("phone")} className="input" />
        {errors.phone && (
          <span className="text-red-600">{errors.phone.message}</span>
        )}
      </div>
      <div>
        <label>Role</label>
        <input {...register("role")} className="input" />
        {errors.role && (
          <span className="text-red-600">{errors.role.message}</span>
        )}
      </div>
      <div>
        <label>Department</label>
        <input {...register("department")} className="input" />
        {errors.department && (
          <span className="text-red-600">{errors.department.message}</span>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Submit
      </button>
    </form>
  );
};
