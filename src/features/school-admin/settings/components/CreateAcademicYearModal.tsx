import { useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateAcademicYearPayload } from "../types/settings.types";

interface Props {
  onClose: () => void;
  onSubmit: (data: CreateAcademicYearPayload) => Promise<void>;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</label>
    {children}
  </div>
);

const getDefaultYearName = () => {
  const y = new Date().getFullYear();
  return `${y}-${y + 1}`;
};

const toDateInput = (date: Date) => date.toISOString().split("T")[0];

export const CreateAcademicYearModal = ({ onClose, onSubmit }: Props) => {
  const [yearName, setYearName] = useState(getDefaultYearName());
  const now = new Date();
  const [startDate, setStartDate] = useState(`${now.getFullYear()}-06-01`);
  const [endDate, setEndDate] = useState(`${now.getFullYear() + 1}-03-31`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!yearName.trim() || !startDate || !endDate) return;
    if (new Date(endDate) <= new Date(startDate)) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ yearName: yearName.trim(), startDate, endDate });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create academic year");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Create Academic Year</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add a new academic session</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-4 sm:px-6 py-4 space-y-4">
          <Field label="Year Name *">
            <Input
              placeholder="e.g. 2025-2026"
              value={yearName}
              onChange={(e) => setYearName(e.target.value)}
            />
          </Field>
          <Field label="Start Date *">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
          <Field label="End Date *">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Field>
          {endDate && startDate && new Date(endDate) <= new Date(startDate) && (
            <p className="text-xs text-red-500">End date must be after start date</p>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
          <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              !yearName.trim() ||
              !startDate ||
              !endDate ||
              new Date(endDate) <= new Date(startDate)
            }
            className="w-full sm:w-auto bg-indigo-600 text-white"
          >
            {loading ? "Creating..." : "Create Year"}
          </Button>
        </div>
        {error && (
          <div className="px-4 sm:px-6 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                Failed to create academic year
              </p>
              <p className="text-[11px] text-red-600 font-mono whitespace-pre-wrap break-all leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
