import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarkAttendanceInput } from "../types/attendance.types";
import { useMarkAttendance } from "../hooks/useAttendance";
import { z } from "zod";

const markAttendanceSchema = z.object({
  date: z.string(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["present", "absent", "leave"]),
      remarks: z.string().optional(),
    }),
  ),
});

type FormValues = z.infer<typeof markAttendanceSchema>;

interface MarkAttendanceFormProps {
  defaultRecords: Array<{ studentId: string; studentName: string }>;
  date: string;
  onSuccess?: () => void;
}

export const MarkAttendanceForm = ({
  defaultRecords,
  date,
  onSuccess,
}: MarkAttendanceFormProps) => {
  const { mutate, isLoading } = useMarkAttendance();
  const form = useForm<FormValues>({
    resolver: zodResolver(markAttendanceSchema),
    defaultValues: {
      date,
      records: defaultRecords.map((s) => ({
        studentId: s.studentId,
        status: "present",
        remarks: "",
      })),
    },
  });
  const { fields } = useFieldArray({ control: form.control, name: "records" });

  const onSubmit = (values: FormValues) => {
    mutate(values, { onSuccess });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field, idx) => (
        <div key={field.id} className="flex items-center gap-2">
          <span className="w-40">{defaultRecords[idx].studentName}</span>
          <select
            {...form.register(`records.${idx}.status`)}
            className="border rounded px-2 py-1"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
          <input
            {...form.register(`records.${idx}.remarks`)}
            placeholder="Remarks"
            className="border rounded px-2 py-1 flex-1"
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Mark Attendance"}
      </button>
    </form>
  );
};
