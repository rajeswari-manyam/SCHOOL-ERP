export type FeeStatus = "PAID" | "PENDING" | "OVERDUE";
export type StudentStatus = "ACTIVE" | "TRANSFERRED" | "INACTIVE";
export type Gender = "Male" | "Female" | "Other";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  parentPhone: string;
  status: StudentStatus;
  feeStatus: FeeStatus;
  photo?: string;
  dob: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  rollNumber?: number;
  residentialAddress?: string;
  academicYear?: string;
  admittedOn?: string;
  // Parent/Contact
  fatherName?: string;
  fatherPhone?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherPhone?: string;
  emergencyContact?: string;
  whatsappNumber?: string;
}

export interface StudentAttendanceDay {
  date: string;
  status: "present" | "absent" | "holiday" | null;
}

export interface FeePayment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "PAID" | "PENDING";
  mode?: "UPI" | "Cash" | "Card";
  receiptNo?: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: "pdf" | "image";
  size: string;
  verified: boolean;
}

export interface AddStudentFormData {
  // Step 1 - Personal
  firstName: string;
  lastName: string;
  dob: string;
  admissionNo: string;
  gender: Gender | "";
  class: string;
  section: string;
  bloodGroup: BloodGroup | "";
  rollNumber: string;
  photo?: File | null;
  residentialAddress: string;
  // Step 2 - Parent
  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherName: string;
  motherPhone: string;
  emergencyContact: string;
  whatsappNumber: string;
  sameAsFather: boolean;
}