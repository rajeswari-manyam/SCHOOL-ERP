import { useRef } from "react";

import { Button } from "@/components/ui/button";

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
        <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">
          Subject
        </label>
        <input
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
        <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {COMPLAINT_CATEGORIES.map((cat) => {
            const isActive = current.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat as any)}
                className={`
                  px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all
                  ${isActive
                    ? "bg-[#3525CD] text-white border-[#3525CD]"
                    : "bg-white text-[#6B7280] border-[#E8EBF2] hover:border-[#3525CD] hover:text-[#3525CD]"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">
            Description
          </label>
          <span className="text-[11px] text-gray-400">
            {current.description.length}/500
          </span>
        </div>
        <textarea
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
        <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Regarding
        </label>
        <div className="flex flex-wrap gap-2">
          {COMPLAINT_ATTACHEES.map((child) => {
            const isSelected = current.attachees.includes(child.id);
            return (
              <button
                key={child.id}
                onClick={() => toggleAttachee(child.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-semibold transition-all
                  ${isSelected
                    ? "border-[#3525CD] bg-[#EEF2FF] text-[#3525CD]"
                    : "border-[#E8EBF2] text-[#6B7280] hover:border-[#3525CD] hover:text-[#3525CD]"
                  }
                `}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                  style={{ background: child.avatarColor }}
                >
                  {child.initials}
                </div>
                {child.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* PHOTO UPLOAD */}
      <div>
        <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
          Attachment (optional)
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="
              flex items-center gap-2 px-4 py-2 rounded-xl
              border border-[#E8EBF2] text-[12px] font-semibold text-[#0B1C30]
              hover:bg-[#F4F6FB] transition
            "
          >
            <CameraIcon />
            Take Photo
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="
              flex items-center gap-2 px-4 py-2 rounded-xl
              border border-[#E8EBF2] text-[12px] font-semibold text-[#0B1C30]
              hover:bg-[#F4F6FB] transition
            "
          >
            <GalleryIcon />
            Choose from Gallery
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
        {current.photoFile && (
          <p className="text-[11px] text-[#006C49] mt-1.5">
            ✓ {current.photoFile.name}
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
        "
      >
        Submit Complaint
      </Button>

      {/* WHATSAPP NOTE */}
      <p className="text-[11px] text-gray-400 text-center -mt-1">
        A WhatsApp confirmation will be sent to +91 98765 43210
      </p>

    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  );
}