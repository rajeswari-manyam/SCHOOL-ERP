import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const admissionFormSchema = z.object({
  studentName: z.string().min(1),
  dob: z.string(),
  class: z.string().min(1),
  parentName: z.string().min(1),
  phone: z.string(),
  email: z.string().email(),
});

type FormValues = z.infer<typeof admissionFormSchema>;

interface AdmissionFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
}

export const AdmissionForm = ({
  defaultValues,
  onSubmit,
  loading,
}: AdmissionFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...form.register("studentName")}
        placeholder="Student Name"
      />
      <Input
        {...form.register("dob")}
        type="date"
        placeholder="DOB"
      />
      <Input
        {...form.register("class")}
        placeholder="Class"
      />
      <Input
        {...form.register("parentName")}
        placeholder="Parent Name"
      />
      <Input
        {...form.register("phone")}
        placeholder="Phone"
      />
      <Input
        {...form.register("email")}
        placeholder="Email"
      />
      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : "Submit"}
      </Button>
    </form>
  );
};
