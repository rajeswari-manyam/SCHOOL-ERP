import { useState, useEffect } from "react";
import type { TransportSlab } from "../types/fees.types";
import { useTransportFees } from "../hooks/useFees";
import { TransportSlabsTable } from "./TransportSlabTab";
import { SlabModal } from "./SlabModal";
import { StudentSlabAssignment } from "./StudentSlabAssignment";

interface TransportFeesProps {
  triggerAddSlab: boolean;        // ✅ set true by parent "+ Add Slab" button
  onAddSlabHandled: () => void;   // ✅ reset trigger after modal opens
  triggerEditSlabs: boolean;      // ✅ set true by parent "Edit Slabs" button
  onEditSlabsHandled: () => void; // ✅ reset trigger after modal opens
}

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

  // ✅ React to "+ Add Slab" button click from parent header
  useEffect(() => {
    if (triggerAddSlab) {
      setEditingSlab(null);
      setIsAdd(true);
      setModalOpen(true);
      onAddSlabHandled(); // reset so it can fire again next click
    }
  }, [triggerAddSlab]);

  // ✅ React to "Edit Slabs" button click from parent header
  useEffect(() => {
    if (triggerEditSlabs) {
      // Edit Slabs opens the first slab for editing (or you can open a bulk edit modal)
      if (slabs.length > 0) {
        setEditingSlab(slabs[0]);
        setIsAdd(false);
        setModalOpen(true);
      }
      onEditSlabsHandled(); // reset so it can fire again next click
    }
  }, [triggerEditSlabs]);

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

      {/* Slabs Table */}
      <TransportSlabsTable
        slabs={slabs}
        onEdit={openEdit}
        onDelete={handleDeleteSlab}
      />

      {/* Student Assignment Table */}
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