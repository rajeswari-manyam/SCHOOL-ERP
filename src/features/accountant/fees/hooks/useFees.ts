import { useMemo, useState, useCallback } from "react";
import { mockFees, mockTransactions, initialSlabs, initialStudents } from "../data/fee.data";
import type { TransportSlab, TransportStudent } from "../types/fees.types";


export const useTransportFees = () => {
  const [slabs, setSlabs] = useState<TransportSlab[]>(initialSlabs);
  const [students, setStudents] = useState<TransportStudent[]>(initialStudents);

  const [search, setSearch] = useState("");
  const [slabFilter, setSlabFilter] = useState<string | null>(null);

 
  const [pendingSlabs, setPendingSlabs] = useState<Record<string, string>>({});


  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchSearch =
        search.trim() === "" ||
        st.name.toLowerCase().includes(search.toLowerCase()) ||
        st.cls.toLowerCase().includes(search.toLowerCase());

      const matchSlab =
        slabFilter == null ||
        (pendingSlabs[st.id] ?? st.slabId) === slabFilter;

      return matchSearch && matchSlab;
    });
  }, [students, search, slabFilter, pendingSlabs]);

  const totalStudents = students.length;

  const totalRevenue = useMemo(() => {
    return students.reduce((sum, st) => {
      const slabId = pendingSlabs[st.id] ?? st.slabId;
      const slab = slabs.find((s) => s.id === slabId);
      return sum + (slab?.monthly ?? 0);
    }, 0);
  }, [students, slabs, pendingSlabs]);

  const handleSaveSlab = useCallback(
    (
      existingSlab: TransportSlab | null,
      data: Omit<TransportSlab, "id" | "students">
    ) => {
      if (existingSlab) {
       
        setSlabs((prev) =>
          prev.map((s) =>
            s.id === existingSlab.id ? { ...s, ...data } : s
          )
        );
      } else {
       
        const newId = String(Math.max(0, ...slabs.map((s) => Number(s.id))) + 1);
        setSlabs((prev) => [...prev, { id: newId, students: 0, ...data }]);
      }
    },
    [slabs]
  );

  const handleDeleteSlab = useCallback((id: string) => {
    setSlabs((prev) => prev.filter((s) => s.id !== id));
  }, []);

 
  const handleSaveStudentSlab = useCallback(
    (studentId: string) => {
      const key = studentId;
      const newSlabId = pendingSlabs[key];
      if (newSlabId == null) return;

   
      setStudents((prev) =>
        prev.map((st) =>
          st.id === key ? { ...st, slabId: newSlabId } : st
        )
      );

    
      setSlabs((prev) => {
        const oldSlabId = students.find((st) => st.id === key)?.slabId;
        return prev.map((s) => {
          if (s.id === oldSlabId) return { ...s, students: Math.max(0, s.students - 1) };
          if (s.id === newSlabId) return { ...s, students: s.students + 1 };
          return s;
        });
      });

  
      setPendingSlabs((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [pendingSlabs, students]
  );

  return {
    slabs,
    students,
    search,
    setSearch,
    slabFilter,
    setSlabFilter,
    pendingSlabs,
    setPendingSlabs,
    totalStudents,
    totalRevenue,
    filteredStudents,
    handleSaveSlab,
    handleDeleteSlab,
    handleSaveStudentSlab,
  };
};


export const useFeeData = () => {
  const fees = useMemo(() => mockFees, []);
  const transactions = useMemo(() => mockTransactions, []);

  return {
    fees,
    transactions,
  };
};