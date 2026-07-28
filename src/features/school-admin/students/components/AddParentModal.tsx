import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { parentsApi, getParentById, getAllParents } from "@/services/parent.api";
import { studentsApi } from "@/services/student.api";
import type { Student } from "../types/student.types";

interface Props {
  student: Student;
  students: Student[];
  onClose: () => void;
  onSaved: () => void;
}

const Field = ({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const EMPTY_FORM = {
  fatherName: "", fatherPhone: "", fatherOccupation: "", fatherEmail: "",
  motherName: "", motherPhone: "", motherOccupation: "", motherEmail: "",
};

export const AddParentModal = ({ student, students, onClose, onSaved }: Props) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [address, setAddress] = useState(student.residentialAddress ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState("");

  const [fatherPhoto, setFatherPhoto] = useState<File | null>(null);
  const [fatherPhotoPreview, setFatherPhotoPreview] = useState<string | null>(null);
  const fatherPhotoInputRef = useRef<HTMLInputElement>(null);
  const [motherPhoto, setMotherPhoto] = useState<File | null>(null);
  const [motherPhotoPreview, setMotherPhotoPreview] = useState<string | null>(null);
  const motherPhotoInputRef = useRef<HTMLInputElement>(null);

  const [allParents, setAllParents] = useState<{ id: string; father_name: string; mother_name: string; father_phone: string; mother_phone: string }[]>([]);
  const [parentsLoading, setParentsLoading] = useState(false);

  useEffect(() => {
    setParentsLoading(true);
    getAllParents()
      .then((parents) => setAllParents(parents))
      .catch(() => {})
      .finally(() => setParentsLoading(false));
  }, []);

  const handleSelectExistingParent = async (parentId: string) => {
    setSelectedParentId(parentId);
    if (!parentId) return;
    try {
      const parent = await getParentById(parentId);
      setForm({
        fatherName: parent.father_name ?? "",
        fatherPhone: parent.father_phone ?? "",
        fatherOccupation: parent.father_occupation ?? "",
        fatherEmail: parent.father_email ?? "",
        motherName: parent.mother_name ?? "",
        motherPhone: parent.mother_phone ?? "",
        motherOccupation: parent.mother_occupation ?? "",
        motherEmail: parent.mother_email ?? "",
      });
      setAddress(parent.address ?? "");
    } catch {
      toast.error("Failed to load parent details");
    }
  };

  const set = (field: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFatherPhotoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null;
    setFatherPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFatherPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFatherPhotoPreview(null);
    }
  };

  const handleRemoveFatherPhoto = () => {
    setFatherPhoto(null);
    setFatherPhotoPreview(null);
    if (fatherPhotoInputRef.current) fatherPhotoInputRef.current.value = "";
  };

  const handleMotherPhotoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0] ?? null;
    setMotherPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setMotherPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setMotherPhotoPreview(null);
    }
  };

  const handleRemoveMotherPhoto = () => {
    setMotherPhoto(null);
    setMotherPhotoPreview(null);
    if (motherPhotoInputRef.current) motherPhotoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedParentId && (!form.fatherName.trim() || !form.fatherPhone.trim())) {
      setError("Father's name and phone are required.");
      return;
    }

    setLoading(true);
    try {
      if (selectedParentId) {
        // Linking to an already-enrolled sibling's parent replaces that
        // parent's whole students list rather than appending, so merge in
        // the current student id instead of sending just [student.id].
        const existingParent = await getParentById(selectedParentId);
        const existingIds = (existingParent.students ?? []).map((s: any) =>
          typeof s === "string" ? s : s.id
        );
        const mergedIds = Array.from(new Set([...existingIds, student.id]));
        await studentsApi.updateParent(selectedParentId, { students: mergedIds });
      } else {
        await parentsApi.createParent({
          father_name: form.fatherName.trim(),
          father_occupation: form.fatherOccupation || "Not specified",
          father_email: form.fatherEmail,
          father_phone: form.fatherPhone.trim(),
          ...(form.motherName.trim() ? {
            mother_name: form.motherName.trim(),
            mother_occupation: form.motherOccupation || "Not specified",
            mother_email: form.motherEmail,
            mother_phone: form.motherPhone.trim(),
          } : {}),
          students: [student.id],
          address: address.trim(),
          ...(fatherPhoto ? { father_image: fatherPhoto } : {}),
          ...(motherPhoto ? { mother_image: motherPhoto } : {}),
        });
      }
      toast.success("Parent added successfully");
      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add parent";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">Add Parent</h2>
            <p className="text-xs text-gray-400 mt-0.5">{student.firstName} {student.lastName} · {student.admissionNo}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {error && (
            <div className="sm:col-span-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {allParents.length > 0 && (
            <div className="sm:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Link Existing Parent?</p>
              <Field label="Select Existing Parent">
                <Select
                  options={[
                    { label: parentsLoading ? "Loading parents..." : "None — add a new parent", value: "" },
                    ...allParents.map((p) => ({
                      label: `${p.father_name || "N/A"}${p.father_phone ? ` — +91 ${p.father_phone}` : ""}${p.mother_name ? ` / ${p.mother_name}` : ""}`,
                      value: p.id,
                    })),
                  ]}
                  value={selectedParentId}
                  onValueChange={handleSelectExistingParent}
                  placeholder="None — add a new parent"
                />
              </Field>
              {selectedParentId && (
                <p className="text-[11px] text-indigo-600 mt-1.5">
                  This student will be linked to the selected parent record shown below.
                </p>
              )}
            </div>
          )}

          <Field label="Father's Name" required>
            <Input value={form.fatherName} onChange={(e) => set("fatherName")(e.target.value)} placeholder="Enter father's name" disabled={!!selectedParentId} />
          </Field>

          <Field label="Father's Phone" required>
            <Input value={form.fatherPhone} onChange={(e) => set("fatherPhone")(e.target.value)} placeholder="Enter father's phone number" disabled={!!selectedParentId} />
          </Field>

          <Field label="Father's Occupation">
            <Input value={form.fatherOccupation} onChange={(e) => set("fatherOccupation")(e.target.value)} placeholder="Enter father's occupation" disabled={!!selectedParentId} />
          </Field>

          <Field label="Father's Email">
            <Input type="email" value={form.fatherEmail} onChange={(e) => set("fatherEmail")(e.target.value)} placeholder="Enter father's email" disabled={!!selectedParentId} />
          </Field>

          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {fatherPhotoPreview
                ? <img src={fatherPhotoPreview} alt="Father" className="w-full h-full object-cover" />
                : <Camera className="w-4 h-4 text-gray-300" />
              }
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Father's Photo</label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fatherPhotoInputRef.current?.click()} className="text-xs">
                  {fatherPhotoPreview ? "Change" : "Upload Photo"}
                </Button>
                {fatherPhoto && (
                  <button type="button" onClick={handleRemoveFatherPhoto}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input ref={fatherPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFatherPhotoChange} />
            </div>
          </div>

          <Field label="Mother's Name">
            <Input value={form.motherName} onChange={(e) => set("motherName")(e.target.value)} placeholder="Enter mother's name" disabled={!!selectedParentId} />
          </Field>

          <Field label="Mother's Phone">
            <Input value={form.motherPhone} onChange={(e) => set("motherPhone")(e.target.value)} placeholder="Enter mother's phone number" disabled={!!selectedParentId} />
          </Field>

          <Field label="Mother's Occupation">
            <Input value={form.motherOccupation} onChange={(e) => set("motherOccupation")(e.target.value)} placeholder="Enter mother's occupation" disabled={!!selectedParentId} />
          </Field>

          <Field label="Mother's Email">
            <Input type="email" value={form.motherEmail} onChange={(e) => set("motherEmail")(e.target.value)} placeholder="Enter mother's email" disabled={!!selectedParentId} />
          </Field>

          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {motherPhotoPreview
                ? <img src={motherPhotoPreview} alt="Mother" className="w-full h-full object-cover" />
                : <Camera className="w-4 h-4 text-gray-300" />
              }
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Mother's Photo</label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => motherPhotoInputRef.current?.click()} className="text-xs">
                  {motherPhotoPreview ? "Change" : "Upload Photo"}
                </Button>
                {motherPhoto && (
                  <button type="button" onClick={handleRemoveMotherPhoto}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input ref={motherPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleMotherPhotoChange} />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Field label="Address">
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Enter complete address..." />
            </Field>
          </div>

          <div className="col-span-full flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-0 py-4 border-t border-gray-100 shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto" disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">
              {loading ? "Saving..." : selectedParentId ? "Link Parent" : "Add Parent"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};