import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentFormInput } from "../types/student.types";
import { z } from "zod";

const studentFormSchema = z.object({
  name: z.string().min(1),
  class: z.string().min(1),
  section: z.string().min(1),
  rollNo: z.string().min(1),
  dob: z.string(),
  gender: z.string(),
  parentName: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

type FormValues = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
}

export const StudentForm = ({
  defaultValues,
  onSubmit,
  loading,
}: StudentFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...form.register("name")}
        placeholder="Name"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("class")}
        placeholder="Class"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("section")}
        placeholder="Section"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("rollNo")}
        placeholder="Roll No"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("dob")}
        type="date"
        placeholder="DOB"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("gender")}
        placeholder="Gender"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("parentName")}
        placeholder="Parent Name"
        className="border rounded px-2 py-1 w-full"
      />
      <input
        {...form.register("address")}
        placeholder="Address"
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
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};
