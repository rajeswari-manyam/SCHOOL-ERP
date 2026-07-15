import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getClassById } from "@/services/class.api";
import type { UpdateClassPayload } from "@/services/class.api";

interface Props {
  classId: string;
  className: string;
  onClose: () => void;
  onSubmit: (id: string, payload: UpdateClassPayload) => Promise<void>;
}

export const EditClassModal = ({ classId, className: initialClassName, onClose, onSubmit }: Props) => {
  const [className, setClassName] = useState(initialClassName);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getClassById(classId);
        if (ignore) return;
        if (res?.status && res.data) {
          setClassName(res.data.class_name ?? initialClassName);
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Failed to load class data");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    void load();
    return () => { ignore = true; };
  }, [classId, initialClassName]);

  const handleSubmit = async () => {
    if (!className.trim()) { setError("Class name is required"); return; }
    setError(null);
    setSaving(true);
    try {
      await onSubmit(classId, { class_name: className.trim() });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update class");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Edit Class</h2>
            <p className="text-xs text-gray-400 mt-0.5">Class {initialClassName}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4 space-y-4 flex-1 overflow-y-auto max-h-[60vh]">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">{error}</div>
            )}

            <div className="space-y-1">
              <Label required>Class Name</Label>
              <Input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
          <Button type="button" onClick={onClose} variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving || loading}
            className="w-full sm:w-auto bg-indigo-600 text-white"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
