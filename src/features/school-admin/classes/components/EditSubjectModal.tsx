import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateSubjectPayload } from "@/services/school-classes.api";

interface Props {
  subjectId: string;
  subjectName: string;
  onClose: () => void;
  onSubmit: (id: string, payload: UpdateSubjectPayload) => Promise<void>;
}

export const EditSubjectModal = ({ subjectId, subjectName, onClose, onSubmit }: Props) => {
  const [name, setName] = useState(subjectName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Subject name is required"); return; }
    setError(null);
    setSaving(true);
    try {
      await onSubmit(subjectId, { subject_name: name.trim() });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update subject");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Subject</h2>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1 rounded-lg">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">{error}</div>}
          <div className="space-y-1">
            <Label>Subject Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mathematics" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={saving} className="bg-indigo-600 text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
