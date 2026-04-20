import { useState, useEffect, useMemo } from "react";
import { studentsApi, MOCK_ATTENDANCE, MOCK_FEE_PAYMENTS, MOCK_DOCUMENTS } from "../api/students.api";
import type { Student, AddStudentFormData } from "../types/student.types";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Active");

  useEffect(() => {
    studentsApi.getAll().then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch = !search || 
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(search.toLowerCase());
      const matchClass = classFilter === "All" || s.class === classFilter;
      const matchSection = sectionFilter === "All" || s.section === sectionFilter;
      const matchStatus = statusFilter === "All" ||
        (statusFilter === "Active" && s.status === "ACTIVE") ||
        (statusFilter === "Transferred" && s.status === "TRANSFERRED");
      return matchSearch && matchClass && matchSection && matchStatus;
    });
  }, [students, search, classFilter, sectionFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = students.filter(s => s.status === "ACTIVE").length;
    const transferred = students.filter(s => s.status === "TRANSFERRED").length;
    const thisMonth = students.filter(s => s.admittedOn?.includes("2025")).length;
    const pending = students.filter(s => s.feeStatus === "PENDING" || s.feeStatus === "OVERDUE").length;
    return { totalActive: active, transferredOut: transferred, newThisMonth: thisMonth, pendingTC: pending };
  }, [students]);

  const addStudent = async (data: AddStudentFormData) => {
    const newS = await studentsApi.create({
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      gender: data.gender as Student["gender"],
      class: data.class,
      section: data.section,
      bloodGroup: data.bloodGroup as Student["bloodGroup"],
      rollNumber: data.rollNumber ? Number(data.rollNumber) : undefined,
      residentialAddress: data.residentialAddress,
      fatherName: data.fatherName,
      fatherPhone: data.fatherPhone,
      fatherOccupation: data.fatherOccupation,
      motherName: data.motherName,
      motherPhone: data.motherPhone,
      emergencyContact: data.emergencyContact,
      whatsappNumber: data.sameAsFather ? data.fatherPhone : data.whatsappNumber,
      parentPhone: data.fatherPhone,
      admittedOn: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      academicYear: "2024-25",
    });
    setStudents(prev => [...prev, newS]);
    return newS;
  };

  return {
    students, filtered, loading, stats,
    search, setSearch,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    addStudent,
  };
};

export const useStudentProfile = (id: string) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsApi.getById(id).then(s => {
      setStudent(s ?? null);
      setLoading(false);
    });
  }, [id]);

  return {
    student, loading,
    attendance: MOCK_ATTENDANCE,
    feePayments: MOCK_FEE_PAYMENTS,
    documents: MOCK_DOCUMENTS,
  };
};