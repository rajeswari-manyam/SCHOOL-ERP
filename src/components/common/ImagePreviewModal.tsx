import { X } from "lucide-react";

interface Props {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export const ImagePreviewModal = ({ src, alt, title, subtitle, onClose }: Props) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onClose}
        className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
        <img src={src} alt={alt ?? ""} className="w-full max-h-[70vh] object-contain bg-gray-50" />
        {(title || subtitle) && (
          <div className="px-4 py-3 border-t border-gray-100">
            {title && <p className="text-sm font-semibold text-gray-900">{title}</p>}
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>
    </div>
  </div>
);
