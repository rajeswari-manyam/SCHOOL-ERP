import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  SchoolSettings,
  UpdateSchoolSettingsInput,
} from "../types/settings.types";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
  academicYear: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

type SchoolSettingsFormProps = {
  defaultValues?: Partial<SchoolSettings>;
  onSubmit: (values: UpdateSchoolSettingsInput) => void;
  loading?: boolean;
};

export const SchoolSettingsForm = ({
  defaultValues = {},
  onSubmit,
  loading,
}: SchoolSettingsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSchoolSettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>School Name</label>
        <input {...register("name")} className="input" />
        {errors.name && (
          <span className="text-red-600">{errors.name.message}</span>
        )}
      </div>
      <div>
        <label>Address</label>
        <input {...register("address")} className="input" />
        {errors.address && (
          <span className="text-red-600">{errors.address.message}</span>
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
        <label>Email</label>
        <input {...register("email")} className="input" />
        {errors.email && (
          <span className="text-red-600">{errors.email.message}</span>
        )}
      </div>
      <div>
        <label>Academic Year</label>
        <input {...register("academicYear")} className="input" />
        {errors.academicYear && (
          <span className="text-red-600">{errors.academicYear.message}</span>
        )}
      </div>
      <div>
        <label>Logo URL</label>
        <input {...register("logoUrl")} className="input" />
        {errors.logoUrl && (
          <span className="text-red-600">{errors.logoUrl.message}</span>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Save
      </button>
    </form>
  );
};
