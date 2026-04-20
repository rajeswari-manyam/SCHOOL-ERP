// Profile types for student profile management

export type StudentStatus = "ACTIVE" | "INACTIVE" | "TRANSFERRED";
export type DocumentCategory = "ACADEMIC" | "IDENTITY" | "FINANCIAL" | "MEDICAL" | "OTHER";

export interface StudentProfile {
  id: string;
  name: string;
  admissionNo: string;
  rollNo: string;
  class: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  status: StudentStatus;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  avatar?: string;
}

export interface AcademicInfo {
  class: string;
  section: string;
  rollNumber: string;
  admissionNumber: string;
  academicYear: string;
  board: string;
  classRoom: string;
  stream?: string;
  subjects: string[];
}

export interface PersonalInfo {
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  age: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  fullAddress: string;
}

export interface QuickDownload {
  id: string;
  title: string;
  size: string;
  type: "report_card" | "certificate" | "timetable" | "id_card";
  downloadUrl: string;
  lastUpdated: string;
}

export interface ProfileData {
  student: StudentProfile;
  academic: AcademicInfo;
  personal: PersonalInfo;
  downloads: QuickDownload[];
}
