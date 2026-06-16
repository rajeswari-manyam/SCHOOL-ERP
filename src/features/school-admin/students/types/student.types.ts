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
  classId?: string;
  sectionId?: string;
  academicYearId?: string;
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
  email?: string;
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

export interface UpdateStudentPayload {
  first_name?: string;
  last_name?: string;
  gender?: Lowercase<Gender>;
  date_of_birth?: string;
  blood_group?: BloodGroup;
  address?: string;
  class?: string;
  section?: string;
  roll_number?: string;
  admission_number?: string;
  status?: StudentStatus;
  father_name?: string;
  father_phone?: string;
  mother_name?: string;
  mother_phone?: string;
  emergency_contact?: string;
  email?: string;
}

export interface CreateStudentPayload {
  first_name: string;
  last_name: string;
  gender: Lowercase<Gender>;
  date_of_birth: string;
  blood_group?: BloodGroup;
  address?: string;
  photo?: string;
  class_id?: string;
  sectionId?: string;
  academicYearId?: string;
  roll_number?: string;
  admission_number?: string;
  admission_date?: string;
  school_code: string;
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
  class_id: string;
  section: string;
  sectionId: string;
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
  relation: string;
  email: string;
}
