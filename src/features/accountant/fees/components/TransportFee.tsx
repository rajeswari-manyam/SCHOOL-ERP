import { useState, useEffect } from "react";
import type { TransportSlab, TransportFeesProps } from "../types/fees.types";
import { useTransportFees } from "../hooks/useFees";
import { TransportSlabsTable } from "./TransportSlabTab";
import { SlabModal } from "./SlabModal";
import { StudentSlabAssignment } from "./StudentSlabAssignment";
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2 } from "lucide-react";
import { distanceLabel } from "../utils/fee.utils";
import { formatINR } from "../../../../utils/formatters";

export function TransportFees({
  triggerAddSlab,
  onAddSlabHandled,
  triggerEditSlabs,
  onEditSlabsHandled,
}: TransportFeesProps) {
  const {
    slabs,
    search,
    setSearch,
    pendingSlabs,
    setPendingSlabs,
    filteredStudents,
    handleSaveSlab,
    handleDeleteSlab,
    handleSaveStudentSlab,
  } = useTransportFees();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState<TransportSlab | null>(null);
  const [isAdd, setIsAdd] = useState(false);
  const [expandedSlab, setExpandedSlab] = useState<string | null>(null);

  useEffect(() => {
    if (triggerAddSlab) {
      setEditingSlab(null);
      setIsAdd(true);
      setModalOpen(true);
      onAddSlabHandled();
    }
  }, [triggerAddSlab, onAddSlabHandled]);

  useEffect(() => {
    if (triggerEditSlabs) {
      if (slabs.length > 0) {
        setEditingSlab(slabs[0]);
        setIsAdd(false);
        setModalOpen(true);
      }
      onEditSlabsHandled();
    }
  }, [triggerEditSlabs, slabs, onEditSlabsHandled]);

  const openEdit = (slab: TransportSlab) => {
    setEditingSlab(slab);
    setIsAdd(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSlab(null);
  };

  const handleSave = (data: Omit<TransportSlab, "id" | "students">) => {
    handleSaveSlab(editingSlab, data);
    closeModal();
  };

  const handleSlabChange = (studentId: string, slabId: string) => {
    setPendingSlabs((prev) => ({
      ...prev,
      [studentId]: slabId,
    }));
  };

  const toggleSlabExpand = (slabId: string) => {
    setExpandedSlab((prev) => (prev === slabId ? null : slabId));
  };

  return (
    <div className="w-full">
      {/* Modal */}
      {modalOpen && (
        <SlabModal
          slab={editingSlab}
          isAdd={isAdd}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {/* ── Slabs Section ── */}
      <div className="px-4 sm:px-5 pt-4 pb-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
        
         {/* Mobile Add Button */}
          <button
            onClick={() => {
              setEditingSlab(null);
              setIsAdd(true);
              setModalOpen(true);
            }}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3525CD] text-white text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* Desktop: Original Table */}
      <div className="hidden md:block">
        <TransportSlabsTable
          slabs={slabs}
          onEdit={openEdit}
          onDelete={handleDeleteSlab}
        />
      </div>

      {/* Mobile: Slab Cards */}
      <div className="md:hidden px-3 pb-4 space-y-2">
        {slabs.map((slab) => {
          const isExpanded = expandedSlab === slab.id;
          return (
            <div
              key={slab.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Card Header */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50"
                onClick={() => toggleSlabExpand(slab.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#3525CD] flex items-center justify-center text-xs font-bold">
                    {slab.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{slab.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {distanceLabel(slab)} • {slab.students} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">
                    {formatINR(slab.monthly)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <div className="pt-3 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Distance Range</span>
                      <span className="font-medium text-gray-700">
                        {distanceLabel(slab)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Monthly Fee</span>
                      <span className="font-medium text-gray-700">
                        {formatINR(slab.monthly)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Assigned Students</span>
                      <span className="font-medium text-gray-700">
                        {slab.students}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Monthly Revenue</span>
                      <span className="font-medium text-indigo-700">
                        {formatINR(slab.monthly * slab.students)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => openEdit(slab)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-50 text-[#3525CD] text-xs font-medium active:bg-indigo-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSlab(slab.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium active:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {slabs.length === 0 && (
          <div className="text-center py-8 text-xs text-gray-400 bg-white rounded-xl border border-gray-200">
            No slabs configured yet.
          </div>
        )}
      </div>

      {/* ── Student Assignment Section ── */}
      <StudentSlabAssignment
        students={filteredStudents}
        slabs={slabs}
        search={search}
        onSearchChange={setSearch}
        pendingSlabs={pendingSlabs}
        onSlabChange={handleSlabChange}
        onSaveStudentSlab={handleSaveStudentSlab}
      />
    </div>
  );
}