import { useState, useEffect } from "react";
import type { TransportSlab,TransportFeesProps}from "../types/fees.types";
import { useTransportFees } from "../hooks/useFees";
import { TransportSlabsTable } from "./TransportSlabTab";
import { SlabModal } from "./SlabModal";
import { StudentSlabAssignment } from "./StudentSlabAssignment";


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

 
  useEffect(() => {
    if (triggerAddSlab) {
      setEditingSlab(null);
      setIsAdd(true);
      setModalOpen(true);
      onAddSlabHandled(); 
    }
  }, [triggerAddSlab]);


  useEffect(() => {
    if (triggerEditSlabs) {
   
      if (slabs.length > 0) {
        setEditingSlab(slabs[0]);
        setIsAdd(false);
        setModalOpen(true);
      }
      onEditSlabsHandled(); 
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