import { useRef } from "react";
import { Camera, Images, Send, CheckCircle, Upload, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useComplaintsStore } from "../hooks/useComplaintsStore";
import { useParentChildren } from "../hooks/useParentChildren";

// Fixed category options (moved inline since data/complaimts.data.ts was removed)
const COMPLAINT_CATEGORIES = [
  "Academic",
  "Fee",
  "Transport",
  "Staff",
  "Facility",
  "Other",
] as const;

interface Props {
  complainant_id: string;
  complainant_type: string;
  regarding_type: string;
  school_code: string;
  /** JWT token – needed to call the children API */
  token: string;
  onSubmitSuccess?: () => void;
}

export function RaiseComplaintCard({
  complainant_id,
  complainant_type,
  regarding_type,
  school_code,
  token,
  onSubmitSuccess,
}: Props) {
  const current         = useComplaintsStore((s) => s.current);
  const isSubmitting    = useComplaintsStore((s) => s.isSubmitting);
  const error           = useComplaintsStore((s) => s.error);
  const setSubject      = useComplaintsStore((s) => s.setSubject);
  const setCategory     = useComplaintsStore((s) => s.setCategory);
  const setPriority     = useComplaintsStore((s) => s.setPriority);
  const setDescription  = useComplaintsStore((s) => s.setDescription);
  const toggleAttachee  = useComplaintsStore((s) => s.toggleAttachee);
  const setPhoto        = useComplaintsStore((s) => s.setPhoto);
  const submitComplaint = useComplaintsStore((s) => s.submitComplaint);

  // ── Fetch children from API (replaces mock COMPLAINT_ATTACHEES) ────
  const {
    children,
    isLoading: childrenLoading,
    error: childrenError,
  } = useParentChildren(complainant_id, school_code, token);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    current.subject.trim().length > 0 &&
    current.description.trim().length > 0 &&
    current.attachees.length > 0 &&   // must select at least one child
    !isSubmitting;

  const handleSubmit = async () => {
    const result = await submitComplaint({
      complainant_id,
      complainant_type,
      regarding_type,
      school_code,
    });
    if (result) onSubmitSuccess?.();
  };

  return (
    <div className="flex flex-col gap-4">

      {/* API ERROR */}
      {error && (
        <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-[12px] text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* SUBJECT */}
      <div>
        <Label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">
          Subject
        </Label>
        <Input
          type="text"
          value={current.subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief description of your concern"
          className="
            w-full px-3 py-2.5 rounded-xl
            border border-[#E8EBF2]
            text-[13px] text-[#0B1C30] placeholder:text-gray-300
            focus:outline-none focus:border-[#3525CD]
            transition
          "
        />
      </div>

      {/* CATEGORY */}
      <div>
        <Label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Category
        </Label>
        <div className="flex flex-wrap gap-2">
          {COMPLAINT_CATEGORIES.map((cat) => {
            const isActive = current.category === cat;
            return (
              <Button
                key={cat}
                onClick={() => setCategory(cat as any)}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all
                  ${isActive
                    ? "bg-[#3525CD] text-white border-[#3525CD]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {cat}
              </Button>
            );
          })}
        </div>
      </div>

      {/* PRIORITY */}
      <div>
        <Label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Priority
        </Label>
        <div className="flex gap-2">
          {(["low", "medium", "high"] as const).map((p) => {
            const isActive = current.priority === p;
            const COLOR = {
              low:    isActive ? "bg-gray-600 text-white border-gray-600" : "border-gray-300 text-gray-600 hover:bg-gray-50",
              medium: isActive ? "bg-amber-500 text-white border-amber-500" : "border-amber-300 text-amber-600 hover:bg-amber-50",
              high:   isActive ? "bg-red-500 text-white border-red-500" : "border-red-300 text-red-500 hover:bg-red-50",
            }[p];
            return (
              <Button
                key={p}
                onClick={() => setPriority(p)}
                variant="outline"
                size="sm"
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border capitalize transition-all ${COLOR}`}
              >
                {p}
              </Button>
            );
          })}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
            Description
          </Label>
          <span className="text-[11px] text-gray-400">
            {current.description.length}/500
          </span>
        </div>
        <Textarea
          value={current.description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Describe your concern in detail..."
          className="
            w-full px-3 py-2.5 rounded-xl
            border border-[#E8EBF2]
            text-[13px] text-[#0B1C30] placeholder:text-gray-300
            focus:outline-none focus:border-[#3525CD]
            resize-none transition
          "
        />
      </div>

      {/* REGARDING — dynamic from API */}
      <div>
        <Label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Regarding
        </Label>

        {childrenLoading ? (
          <div className="flex items-center gap-2 text-[12px] text-gray-400">
            <Loader2 size={13} className="animate-spin" />
            Loading children…
          </div>
        ) : childrenError ? (
          <p className="text-[12px] text-red-500">{childrenError}</p>
        ) : children.length === 0 ? (
          <p className="text-[12px] text-gray-400">No children found.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {children.map((child) => {
              const isSelected = current.attachees.includes(child.id);
              return (
                <Button
                  key={child.id}
                  onClick={() => toggleAttachee(child.id)}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all
                    ${isSelected
                      ? "bg-[#3525CD] text-white border-[#3525CD]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {/* coloured dot */}
                  <span
                    className="w-2 h-2 rounded-full mr-1.5 inline-block"
                    style={{ backgroundColor: isSelected ? "#fff" : child.avatarColor }}
                  />
                  {child.name}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* PHOTO UPLOAD */}
      <div>
        <Label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Attachment (optional)
        </Label>
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8EBF2] text-[12px] font-semibold text-[#0B1C30] hover:bg-[#F4F6FB]"
          >
            <Camera size={14} />
            Take Photo
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8EBF2] text-[12px] font-semibold text-[#0B1C30] hover:bg-[#F4F6FB]"
          >
            <Upload size={14} />
            Upload File
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8EBF2] text-[12px] font-semibold text-[#0B1C30] hover:bg-[#F4F6FB]"
          >
            <Images size={14} />
            Gallery
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
        {current.photoFile && (
          <p className="flex items-center gap-1 text-[11px] text-[#006C49] mt-1.5">
            <CheckCircle size={12} />
            {current.photoFile.name}
          </p>
        )}
      </div>

      {/* SUBMIT */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="
          w-full py-3 rounded-xl
          bg-[#3525CD] text-white text-[13px] font-semibold
          hover:bg-[#2a1eb0]
          disabled:opacity-40 disabled:cursor-not-allowed
          active:scale-[0.98]
          transition-all duration-200
          flex items-center justify-center gap-2
        "
      >
        {isSubmitting ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send size={14} />
            Submit Complaint
          </>
        )}
      </Button>

      {/* WHATSAPP NOTE */}
      <p className="text-[11px] text-gray-400 text-center -mt-1">
        A WhatsApp confirmation will be sent to +91 98765 43210
      </p>

    </div>
  );
}
