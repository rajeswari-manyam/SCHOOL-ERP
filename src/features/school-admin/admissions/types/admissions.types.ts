export interface AdmissionApplication {
  id: string;
  studentName: string;
  dob: string;
  class: string;
  parentName: string;
  phone: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  remarks?: string;
}

export interface AdmissionFormInput {
  studentName: string;
  dob: string;
  class: string;
  parentName: string;
  phone: string;
  email: string;
}
