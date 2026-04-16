// Profile types for student profile management

export interface StudentProfile {
  id: string;
  name: string;
  admissionNo: string;
  rollNo: string;
  class: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
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
  room: string;
  stream?: string;
  subjects: string[];
}

export interface PersonalInfo {
  dob: string;
  gender: string;
  blood: string;
  age: string;
  father: string;
  fatherPhone: string;
  mother: string;
  motherPhone: string;
  address: string;
}

export interface QuickDownload {
  id: string;
  title: string;
  size: string;
  type: 'report_card' | 'certificate' | 'timetable' | 'id_card';
  downloadUrl: string;
  lastUpdated: string;
}

export interface ProfileData {
  student: StudentProfile;
  academic: AcademicInfo;
  personal: PersonalInfo;
  downloads: QuickDownload[];
}