import { useRef } from "react";
import { Camera, Images, Send, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useComplaintsStore } from "../hooks/useComplaintsStore";
import { COMPLAINT_ATTACHEES, COMPLAINT_CATEGORIES } from "../data/complaimts.data";

export function RaiseComplaintCard({
  onSubmitSuccess,
}: {
  onSubmitSuccess?: () => void;
}) {
  const {
    current,
    setSubject,
    setCategory,
    setDescription,
    toggleAttachee,
    setPhoto,
    submitComplaint,
  } = useComplaintsStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    current.subject.trim().length > 0 &&
    current.description.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">

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

      {/* ATTACHEES */}
      <div>
        <Label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Regarding
        </Label>
        <div className="flex flex-wrap gap-2">
          {COMPLAINT_ATTACHEES.map((child) => {
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
                {child.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* PHOTO UPLOAD */}
      <div>
        <Label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Attachment (optional)
        </Label>
        <div className="flex gap-3">
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
            <UploadIcon />
            Upload File
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8EBF2] text-[12px] font-semibold text-[#0B1C30] hover:bg-[#F4F6FB]"
          >
            <Images size={14} />
            Choose from Gallery
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
        onClick={() => {
          submitComplaint();
          onSubmitSuccess?.();
        }}
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
        <Send size={14} />
        Submit Complaint
      </Button>

      {/* WHATSAPP NOTE */}
      <p className="text-[11px] text-gray-400 text-center -mt-1">
        A WhatsApp confirmation will be sent to +91 98765 43210
      </p>

    </div>
  );
}