import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  SchoolSettings,
  UpdateSchoolSettingsInput,
} from "../types/settings.types";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="School Name" error={errors.name?.message as string | undefined}>
        <Input {...register("name")} placeholder="Enter school name" />
      </FormField>

      <FormField label="Address" error={errors.address?.message as string | undefined}>
        <Input {...register("address")} placeholder="Enter school address" />
      </FormField>

      <FormField label="Phone" error={errors.phone?.message as string | undefined}>
        <Input {...register("phone")} placeholder="Enter phone number" />
      </FormField>

      <FormField label="Email" error={errors.email?.message as string | undefined}>
        <Input {...register("email")} placeholder="Enter contact email" />
      </FormField>

      <FormField label="Academic Year" error={errors.academicYear?.message as string | undefined}>
        <Input {...register("academicYear")} placeholder="Enter academic year" />
      </FormField>

      <FormField label="Logo URL" error={errors.logoUrl?.message as string | undefined}>
        <Input {...register("logoUrl")} placeholder="Enter logo URL (optional)" />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          Save
        </Button>
      </div>
    </Form>
  );
};
