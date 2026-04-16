import type { Student, FeePayment, StudentDocument, StudentAttendanceDay } from "../types/student.types";

export const MOCK_STUDENTS: Student[] = [
  { id: "1", admissionNo: "ADM001", firstName: "Ravi", lastName: "Kumar", class: "10", section: "A", parentPhone: "+91 98765 43210", status: "ACTIVE", feeStatus: "PAID", dob: "12 March 2009", gender: "Male", bloodGroup: "B+", rollNumber: 1, fatherName: "Kumar Reddy", fatherPhone: "+91 98765 43210", fatherOccupation: "Software Engineer", motherName: "Sunitha Reddy", motherPhone: "+91 00000 00000", emergencyContact: "+91 76543 21098", whatsappNumber: "+91 98765 43210", residentialAddress: "Plot 12, Hanamkonda Urban, Warangal — 506001", academicYear: "2024-25", admittedOn: "15 June 2022" },
  { id: "2", admissionNo: "ADM002", firstName: "Priya", lastName: "Sharma", class: "9", section: "B", parentPhone: "+91 87654 32109", status: "ACTIVE", feeStatus: "PENDING", dob: "5 July 2010", gender: "Female", rollNumber: 2, fatherName: "Arun Sharma", fatherPhone: "+91 87654 32109", motherName: "Meena Sharma", motherPhone: "+91 87654 00000", emergencyContact: "+91 76543 10987", whatsappNumber: "+91 87654 32109", residentialAddress: "12-3-456, Hanamkonda, Warangal", academicYear: "2024-25", admittedOn: "10 June 2022" },
  { id: "3", admissionNo: "ADM003", firstName: "Kiran", lastName: "Reddy", class: "8", section: "A", parentPhone: "+91 76543 21098", status: "ACTIVE", feeStatus: "OVERDUE", dob: "20 January 2011", gender: "Male", rollNumber: 3, fatherName: "Suresh Reddy", fatherPhone: "+91 76543 21098", motherName: "Kavitha Reddy", motherPhone: "+91 76543 00000", emergencyContact: "+91 65432 10987", whatsappNumber: "+91 76543 21098", residentialAddress: "5-6-789, Kazipet, Warangal", academicYear: "2024-25", admittedOn: "8 June 2021" },
  { id: "4", admissionNo: "ADM004", firstName: "Suresh", lastName: "Nair", class: "7", section: "B", parentPhone: "+91 65432 10987", status: "ACTIVE", feeStatus: "PAID", dob: "14 April 2012", gender: "Male", rollNumber: 4, fatherName: "Nair Krishnan", fatherPhone: "+91 65432 10987", motherName: "Lakshmi Nair", motherPhone: "+91 65432 00000", emergencyContact: "+91 54321 09876", whatsappNumber: "+91 65432 10987", residentialAddress: "3-4-567, Warangal Urban", academicYear: "2024-25", admittedOn: "12 June 2022" },
  { id: "5", admissionNo: "ADM005", firstName: "Anitha", lastName: "Devi", class: "6", section: "A", parentPhone: "+91 54321 09876", status: "ACTIVE", feeStatus: "PAID", dob: "25 September 2012", gender: "Female", rollNumber: 5, fatherName: "Ramu Devi", fatherPhone: "+91 54321 09876", motherName: "Pushpa Devi", motherPhone: "+91 54321 00000", emergencyContact: "+91 43210 98765", whatsappNumber: "+91 54321 09876", residentialAddress: "7-8-901, Subedari, Warangal", academicYear: "2024-25", admittedOn: "15 June 2023" },
  { id: "6", admissionNo: "ADM006", firstName: "Venkat", lastName: "Rao", class: "10", section: "B", parentPhone: "+91 43210 98765", status: "ACTIVE", feeStatus: "PAID", dob: "3 February 2009", gender: "Male", rollNumber: 6, fatherName: "Rao Krishna", fatherPhone: "+91 43210 98765", motherName: "Sarada Rao", motherPhone: "+91 43210 00000", emergencyContact: "+91 32109 87654", whatsappNumber: "+91 43210 98765", residentialAddress: "9-1-234, Hanmakonda, Warangal", academicYear: "2024-25", admittedOn: "10 June 2021" },
  { id: "7", admissionNo: "ADM007", firstName: "Deepa", lastName: "Kumari", class: "9", section: "A", parentPhone: "+91 32109 87654", status: "ACTIVE", feeStatus: "PENDING", dob: "18 November 2010", gender: "Female", rollNumber: 7, fatherName: "Kumar Das", fatherPhone: "+91 32109 87654", motherName: "Roja Kumari", motherPhone: "+91 32109 00000", emergencyContact: "+91 21098 76543", whatsappNumber: "+91 32109 87654", residentialAddress: "2-3-456, Warangal Rural", academicYear: "2024-25", admittedOn: "14 June 2022" },
  { id: "8", admissionNo: "ADM008", firstName: "Ramesh", lastName: "T", class: "8", section: "B", parentPhone: "+91 21098 76543", status: "TRANSFERRED", feeStatus: "PAID", dob: "7 August 2011", gender: "Male", rollNumber: 8, fatherName: "Tirupal Reddy", fatherPhone: "+91 21098 76543", motherName: "Geetha T", motherPhone: "+91 21098 00000", emergencyContact: "+91 10987 65432", whatsappNumber: "+91 21098 76543", residentialAddress: "4-5-678, Dharmasagar, Warangal", academicYear: "2024-25", admittedOn: "11 June 2020" },
];

export const MOCK_ATTENDANCE: StudentAttendanceDay[] = [
  { date: "2025-03-31", status: null },
  { date: "2025-04-01", status: "present" },
  { date: "2025-04-02", status: "present" },
  { date: "2025-04-03", status: "present" },
  { date: "2025-04-04", status: "present" },
  { date: "2025-04-05", status: "absent" },
  { date: "2025-04-06", status: null },
  { date: "2025-04-07", status: "present" },
  { date: "2025-04-08", status: "present" },
  { date: "2025-04-09", status: "present" },
  { date: "2025-04-10", status: "present" },
  { date: "2025-04-11", status: "present" },
  { date: "2025-04-12", status: null },
  { date: "2025-04-13", status: null },
  { date: "2025-04-14", status: "present" },
];

export const MOCK_FEE_PAYMENTS: FeePayment[] = [
  { id: "1", date: "6 APR 2025", description: "Tuition Fee — April 2025", amount: 8500, status: "PENDING" },
  { id: "2", date: "5 MAR 2025", description: "Tuition Fee — Mar 2025", amount: 8500, status: "PAID", mode: "UPI", receiptNo: "RCP-0847" },
  { id: "3", date: "3 FEB 2025", description: "Tuition Fee — Feb 2025", amount: 8500, status: "PAID", mode: "Cash", receiptNo: "RCP-0721" },
  { id: "4", date: "5 JAN 2025", description: "Tuition Fee — Jan 2025", amount: 8500, status: "PAID", mode: "UPI", receiptNo: "RCP-0612" },
  { id: "5", date: "3 JAN 2025", description: "Exam Fee — Q3", amount: 2000, status: "PAID", mode: "Cash", receiptNo: "RCP-0601" },
  { id: "6", date: "5 DEC 2024", description: "Tuition Fee — Dec 2024", amount: 8500, status: "PAID", mode: "UPI", receiptNo: "RCP-0524" },
  { id: "7", date: "5 NOV 2024", description: "Tuition Fee — Nov 2024", amount: 8500, status: "PAID", mode: "Cash", receiptNo: "RCP-0445" },
];

export const MOCK_DOCUMENTS: StudentDocument[] = [
  { id: "1", name: "Birth Certificate", type: "pdf", size: "2.3 MB", verified: true },
  { id: "2", name: "Previous TC", type: "pdf", size: "850 KB", verified: true },
  { id: "3", name: "Aadhar Card", type: "pdf", size: "2.4 MB", verified: true },
  { id: "4", name: "Caste Certificate", type: "pdf", size: "11 MB", verified: true },
  { id: "5", name: "Passport Photo", type: "image", size: "450 KB", verified: true },
];

// Simulated API
export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    await new Promise(r => setTimeout(r, 300));
    return MOCK_STUDENTS;
  },
  getById: async (id: string): Promise<Student | undefined> => {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_STUDENTS.find(s => s.id === id);
  },
  create: async (data: Partial<Student>): Promise<Student> => {
    await new Promise(r => setTimeout(r, 500));
    const newStudent: Student = {
      id: String(MOCK_STUDENTS.length + 1),
      admissionNo: `ADM${String(MOCK_STUDENTS.length + 1).padStart(3, "0")}`,
      status: "ACTIVE",
      feeStatus: "PENDING",
      gender: "Male",
      dob: "",
      class: "",
      section: "",
      parentPhone: "",
      firstName: "",
      lastName: "",
      ...data,
    };
    MOCK_STUDENTS.push(newStudent);
    return newStudent;
  },
};