import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  studentId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(["present", "absent", "late"]),
  remarks: z.string().optional(),
});

type AttendanceFormValues = z.infer<typeof schema>;

type AttendanceFormProps = {
  defaultValues?: Partial<AttendanceFormValues>;
  onSubmit: (values: AttendanceFormValues) => void;
  loading?: boolean;
};

export const AttendanceForm = ({ defaultValues = {}, onSubmit, loading }: AttendanceFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AttendanceFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        label="Student ID"
        error={errors.studentId?.message}
      >
        <Input {...register("studentId")} placeholder="Enter student ID" />
      </FormField>

      <FormField
        label="Date"
        error={errors.date?.message}
      >
        <Input type="date" {...register("date")} />
      </FormField>

      <FormField
        label="Status"
        error={errors.status?.message}
      >
        <Select
          {...register("status")}
          options={[
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Late", value: "late" },
          ]}
          placeholder="Select status"
        />
      </FormField>

      <FormField
        label="Remarks"
        error={errors.remarks?.message as string | undefined}
      >
        <Textarea {...register("remarks")} rows={4} placeholder="Optional remarks" />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          Submit
        </Button>
      </div>
    </Form>
  );
};
