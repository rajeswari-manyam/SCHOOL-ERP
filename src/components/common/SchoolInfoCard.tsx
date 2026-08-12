import { useState } from "react";
import { School, User } from "lucide-react";
import { ImagePreviewModal } from "./ImagePreviewModal";

interface Props {
  schoolName?: string;
  schoolImage?: string | null;
  schoolLogo?: string | null;
  principalName?: string;
}

/**
 * The school's own branding (photo/logo/name) plus principal name — kept as
 * its own section, separate from the logged-in person's own photo/details,
 * on School Admin/Accountant/Teacher profile pages.
 */
export const SchoolInfoCard = ({ schoolName, schoolImage, schoolLogo, principalName }: Props) => {
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(null);

  if (!schoolName && !schoolImage && !schoolLogo && !principalName) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-4 text-sm">School</h3>
      <div className="flex items-center gap-4">
        {schoolImage ? (
          <button
            type="button"
            onClick={() => setPreview({ src: schoolImage, title: schoolName ?? "School" })}
            className="shrink-0"
          >
            <img
              src={schoolImage}
              alt={schoolName ?? "School"}
              className="w-16 h-16 rounded-xl object-cover border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </button>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <School className="w-6 h-6 text-indigo-400" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{schoolName || "—"}</p>
          {principalName && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
              <User className="w-3 h-3 shrink-0" /> Principal: {principalName}
            </p>
          )}
        </div>

        {schoolLogo && (
          <button
            type="button"
            onClick={() => setPreview({ src: schoolLogo, title: `${schoolName ?? "School"} Logo` })}
            className="shrink-0"
            title="School logo"
          >
            <img
              src={schoolLogo}
              alt="School logo"
              className="w-11 h-11 rounded-lg object-contain border border-gray-100 bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </button>
        )}
      </div>

      {preview && (
        <ImagePreviewModal src={preview.src} title={preview.title} onClose={() => setPreview(null)} />
      )}
    </div>
  );
};
