import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
      <input
        {...form.register("studentName")}
        placeholder="Student Name"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("dob")}
        type="date"
        placeholder="DOB"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("class")}
        placeholder="Class"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("parentName")}
        placeholder="Parent Name"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("phone")}
        placeholder="Phone"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("email")}
        placeholder="Email"
        className="border rounded px-2 py-1 w-full"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
};
