import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown } from "lucide-react";
import { useApplyLeave, useUploadMaterial } from "../hooks/useTeacherDashboard";
import { Modal } from "../../../../components/ui/modal";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";

// ── Apply Leave Modal ──────────────────────────────────────
const leaveSchema = z.object({
  fromDate: z.string().min(1),
  toDate:   z.string().min(1),
  type:     z.enum(["SICK", "CASUAL", "EARNED", "OTHER"]),
  reason:   z.string().min(5, "Please provide a reason"),
});
type LeaveValues = z.infer<typeof leaveSchema>;

const inputClass = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";
const labelClass = "block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5";

interface ModalProps { open: boolean; onClose: () => void; }

export const ApplyLeaveModal = ({ open, onClose }: ModalProps) => {
  const { mutate, isPending } = useApplyLeave();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveValues>({ resolver: zodResolver(leaveSchema), defaultValues: { type: "CASUAL" } });

  if (!open) return null;
  const onSubmit = (v: LeaveValues) => mutate(v, { onSuccess: () => { reset(); onClose(); } });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Apply Leave"
      size="sm"
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>From Date *</label>
            <Input type="date" {...register("fromDate")}/>
          </div>
          <div>
            <label className={labelClass}>To Date *</label>
            <Input type="date" {...register("toDate")}/>
          </div>
        </div>
        <div>
          <label className={labelClass}>Leave Type *</label>
          <div className="relative">
            <select {...register("type")} className={`${inputClass} appearance-none pr-8 cursor-pointer`}>
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="EARNED">Earned Leave</option>
              <option value="OTHER">Other</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Reason *</label>
          <Textarea {...register("reason")} rows={3} placeholder="Brief reason for leave" />
          {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button type="button" onClick={onClose} variant="ghost" size="sm">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} size="sm">
            {isPending ? "Submitting…" : "Apply Leave"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ── Upload Material Modal ──────────────────────────────────
export const UploadMaterialModal = ({ open, onClose }: ModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadMaterial();

  if (!open) return null;

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("class", "Class 8-A");
    mutate(fd, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upload Material"
      size="sm"
      footer={null}
    >
      <div className="space-y-4">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition cursor-pointer"
        />
        <p className="text-xs text-gray-400">Supported: PDF, DOC, PPT, JPG, PNG</p>
        <div className="flex items-center justify-between pt-1">
          <Button type="button" onClick={onClose} variant="ghost" size="sm">
            Cancel
          </Button>
          <Button type="button" onClick={handleUpload} disabled={isPending} size="sm">
            {isPending ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
