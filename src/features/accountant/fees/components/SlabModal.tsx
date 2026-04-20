import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { TransportSlab } from "../types/fees.types";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Props = {
  slab: TransportSlab | null;
  isAdd: boolean;
  onClose: () => void;
  onSave: (data: Omit<TransportSlab, "id" | "students">) => void;
};

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export function SlabModal({ slab, isAdd, onClose, onSave }: Props) {
  const [name, setName] = useState(slab?.name ?? "");
  const [from, setFrom] = useState<string>(slab ? String(slab.from) : "");
  const [to, setTo] = useState<string>(
    slab?.to != null ? String(slab.to) : ""
  );
  const [monthly, setMonthly] = useState<string>(
    slab ? String(slab.monthly) : ""
  );

  const annual = monthly ? Number(monthly) * 12 : "";

  const handleSave = () => {
    if (!name.trim() || !monthly) {
      alert("Please fill in Slab Name and Monthly Fee.");
      return;
    }
    onSave({
      name: name.trim(),
      from: Number(from) || 0,
      to: to !== "" ? Number(to) : null,
      monthly: Number(monthly),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 w-[420px] p-6 relative shadow-lg">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ✕
        </button>

        {/* Header */}
        <h3 className="text-sm font-semibold text-gray-900">
          {isAdd ? "Add Transport Slab" : "Edit Transport Slab"}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {isAdd ? "New slab configuration" : `${slab?.name} Configuration`}
        </p>

        {/* Slab Name */}
        <div className="mt-4">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">
            Slab Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Slab 1"
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#3525CD] text-gray-900 placeholder:text-gray-300"
          />
        </div>

        {/* From / To */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">
              From
            </label>
            <div className="relative">
              <input
                type="number"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="0"
                className="w-full h-9 border border-gray-200 rounded-lg px-3 pr-10 text-sm focus:outline-none focus:border-[#3525CD] text-gray-900"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                km
              </span>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">
              To
            </label>
            <div className="relative">
              <input
                type="number"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="blank = unlimited"
                className="w-full h-9 border border-gray-200 rounded-lg px-3 pr-10 text-sm focus:outline-none focus:border-[#3525CD] text-gray-900 placeholder:text-gray-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                km
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Fee */}
        <div className="mt-3">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">
            Monthly Fee (Rs.) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            placeholder="e.g. 1200"
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-[#3525CD] text-gray-900"
          />
        </div>

        {/* Annual Fee (read-only) */}
        <div className="mt-3">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">
            Annual Fee (Rs.)
          </label>
          <input
            readOnly
            value={annual}
            placeholder="Auto-calculated"
            className="w-full h-9 border border-gray-100 rounded-lg px-3 text-sm bg-gray-50 text-gray-500 cursor-default"
          />
        </div>

        {/* Students note */}
        {!isAdd && slab && slab.students > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            {slab.students} students currently on this slab
          </p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs h-8 bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
            onClick={handleSave}
          >
            Save Slab
          </Button>
        </div>
      </div>
    </div>
  );
}